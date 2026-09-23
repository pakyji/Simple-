const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const fs = require("fs");
const path = require("path");
const pino = require("pino");
const readline = require("readline");
const { getGroupSettings } = require("./utils/settings");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (text) => new Promise((resolve) => rl.question(text, resolve));

// 1. Commands Loader
const commands = new Map();
const commandFiles = fs.readdirSync(path.join(__dirname, "commands")).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command.name) {
        commands.set(command.name.toLowerCase(), command);
        console.log(`✅ Loaded command: ${command.name}`);
    }
}

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth_info");

    const sock = makeWASocket({
        auth: state,
        logger: pino({ level: "silent" }),
        browser: [ "Chrome", "Safari", "12.0.0" ]
    });

    // Only request pairing code if NOT already registered/paired
    if (!state.creds.registered) {
        console.log("\n📱 No existing session found. Let's use Pairing Code!");
        const phoneNumber = await question("Enter your WhatsApp phone number with country code (e.g., 923XXXXXXXXX): ");
        
        try {
            let code = await sock.requestPairingCode(phoneNumber.trim());
            code = code?.match(/.{1,4}/g)?.join("-") || code;
            console.log(`\n🔑 YOUR PAIRING CODE IS: ${code}\n`);
            console.log("Go to WhatsApp -> Linked Devices -> Link a Device -> Link with phone number instead, and enter this code.");
        } catch (error) {
            console.error("❌ Error requesting pairing code:", error);
        }
    } else {
        console.log("✅ Existing session detected from auth_info. Logging in directly...");
    }

    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === "close") {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log("Connection closed. Reconnecting...", shouldReconnect);
            if (shouldReconnect) startBot();
        } else if (connection === "open") {
            console.log("🚀 Bot is online and connected successfully!");
        }
    });

    sock.ev.on("creds.update", saveCreds);

    // ==========================
    // 2. AUTOMATIC STATUS VIEWER & MESSAGE HANDLER
    // ==========================
    sock.ev.on("messages.upsert", async ({ messages, type }) => {
        const msg = messages[0];
        if (!msg || !msg.key) return;

        if (msg.key.remoteJid === "status@broadcast") {
            try {
                await sock.readMessages([msg.key]);
                console.log(`👀 Automatically viewed status from: ${msg.key.participant || "Unknown"}`);
            } catch (error) {
                console.error("❌ Error viewing status:", error);
            }
            return;
        }

        // Support both incoming messages and self-chat (fromMe / append)
        if (type !== "notify" && type !== "append") return;
        if (!msg.message) return;

        const sender = msg.key.remoteJid;
        const isGroup = sender.endsWith("@g.us");

        const mType = Object.keys(msg.message)[0];
        let messageText = "";

        if (mType === "conversation") {
            messageText = msg.message.conversation;
        } else if (mType === "extendedTextMessage") {
            messageText = msg.message.extendedTextMessage?.text;
        } else if (mType === "ephemeralMessage") {
            const innerMsg = msg.message.ephemeralMessage?.message;
            if (innerMsg) {
                const innerType = Object.keys(innerMsg)[0];
                if (innerType === "conversation") messageText = innerMsg.conversation;
                else if (innerType === "extendedTextMessage") messageText = innerMsg.extendedTextMessage?.text;
            }
        }

        if (!messageText) return;

        // ==========================
        // 3. CONDITIONAL ANTI-LINK FEATURE
        // ==========================
        if (isGroup) {
            const settings = getGroupSettings(sender);
            
            if (settings.antiLink) {
                const linkRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9][-a-zA-Z0-9]*\.[a-zA-Z]{2,}[^\s]*)/gi;
                
                if (linkRegex.test(messageText)) {
                    try {
                        await sock.sendMessage(sender, { delete: msg.key });
                        await sock.sendMessage(sender, { 
                            text: `⚠️ Links are not allowed in this group!` 
                        }, { quoted: msg });
                        
                        console.log(`🛡️ Anti-link triggered in group ${sender}. Link message deleted.`);
                        return;
                    } catch (error) {
                        console.error("❌ Anti-link action failed (Bot might not be admin):", error);
                    }
                }
            }
        }

        // ==========================
        // 4. COMMAND DISPATCHER
        // ==========================
        const args = messageText.trim().toLowerCase().split(" ");
        const commandName = args[0];

        if (commands.has(commandName)) {
            try {
                console.log(`⚡ Executing command: ${commandName}`);
                await commands.get(commandName).execute(sock, msg, sender, args);
            } catch (error) {
                console.error(`❌ Error executing ${commandName}:`, error);
                await sock.sendMessage(sender, { text: "❌ An error occurred while executing this command." }, { quoted: msg });
            }
        }
    });
}

startBot();
