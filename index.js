const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const fs = require("fs");
const path = require("path");
const pino = require("pino");
const { getGroupSettings } = require("./utils/settings");
const { translateText } = require("./translator"); // 👈 Yahan translator import kar liya hai
const { runStartupScan } = require("./utils/startup-scanner"); // 👈 Modularized startup scanner imported from utils/

// ==========================
// 1. CONFIG LOADER (Nested Structure Support)
// ==========================
const configPath = path.join(__dirname, 'config.json');
let config = {
    bot: { prefix: ",", ownerNumber: "393802347902", mode: "public" },
    features: { autoReadStatus: true, autoTyping: false, antiSpam: true }
};

if (fs.existsSync(configPath)) {
    try {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (e) {
        console.error("❌ Error reading config.json:", e);
    }
}

const TARGET_PHONE_NUMBER = config.bot?.ownerNumber || "393802347902";

// 2. Commands Loader
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
    const sessionFolder = config.media?.sessionName || "auth_info";
    const { state, saveCreds } = await useMultiFileAuthState(sessionFolder);

    const sock = makeWASocket({
        auth: state,
        logger: pino({ level: "silent" }),
        browser: [ "Chrome", "Safari", "12.0.0" ]
    });

    // 💡 Wrapper function jo automatically har message ko active language mein translate kar dega
    const originalSendMessage = sock.sendMessage.bind(sock);
    sock.sendMessage = async (jid, content, options) => {
        if (content && typeof content === 'object' && content.text) {
            content.text = translateText(content.text); // Automatically translate text content
        } else if (content && typeof content === 'string') {
            content = translateText(content);
        }
        return await originalSendMessage(jid, content, options);
    };

    if (!state.creds.registered) {
        console.log("\n📱 Generating Pairing Code for: " + TARGET_PHONE_NUMBER);
        setTimeout(async () => {
            try {
                let code = await sock.requestPairingCode(TARGET_PHONE_NUMBER.trim());
                code = code?.match(/.{1,4}/g)?.join("-") || code;
                console.log(`\n🔑 YOUR PAIRING CODE IS: ${code}\n`);
                console.log("Go to WhatsApp -> Linked Devices -> Link a Device -> Link with phone number instead, and enter this code.");
            } catch (error) {
                console.error("❌ Error requesting pairing code:", error);
            }
        }, 3000);
    } else {
        console.log("✅ Session found. Logging in directly...");
    }

    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === "close") {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log("Connection closed. Reconnecting...", shouldReconnect);
            if (shouldReconnect) startBot();
        } else if (connection === "open") {
            console.log("🚀 Bot is online and connected successfully!");
            
            // --- RUN STARTUP SCAN AUTOMATICALLY ON BOOT ---
            runStartupScan();
        }
    });

    sock.ev.on("creds.update", saveCreds);

    // ==========================
    // 3. AUTOMATIC STATUS VIEWER & MESSAGE HANDLER
    // ==========================
    sock.ev.on("messages.upsert", async ({ messages, type }) => {
        const msg = messages[0];
        if (!msg || !msg.key) return;

        // Auto Read Status if enabled in config
        if (msg.key.remoteJid === "status@broadcast") {
            if (config.features?.autoReadStatus !== false) {
                try {
                    await sock.readMessages([msg.key]);
                    console.log(`👀 Automatically viewed status from: ${msg.key.participant || "Unknown"}`);
                } catch (error) {
                    console.error("❌ Error viewing status:", error);
                }
            }
            return;
        }

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
        // 4. CONDITIONAL ANTI-LINK FEATURE
        // ==========================
        if (isGroup) {
            const settings = getGroupSettings(sender);
            const antiLinkActive = settings.antiLink !== undefined ? settings.antiLink : config.groups?.defaultAntiLink;
            
            if (antiLinkActive) {
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
        // 5. COMMAND DISPATCHER (Flexible Prefix with Mode Check)
        // ==========================
        const trimmedText = messageText.trim();
        const configuredPrefix = config.bot?.prefix || ",";
        const allowedPrefixes = [".", ",", configuredPrefix];
        let usedPrefix = null;

        for (const p of allowedPrefixes) {
            if (trimmedText.startsWith(p)) {
                usedPrefix = p;
                break;
            }
        }

        if (!usedPrefix) return;

        // Mode Check (Public / Private)
        const currentMode = config.bot?.mode || "public";
        const ownerJid = (config.bot?.ownerNumber || "393802347902") + "@s.whatsapp.net";
        const isOwner = sender === ownerJid || msg.key.fromMe;

        if (currentMode === "private" && !isOwner) {
            return; // Agar private mode hai aur sender owner nahi hai, toh command ignore kar do
        }

        const args = trimmedText.slice(usedPrefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        if (commands.has(commandName)) {
            try {
                console.log(`⚡ Executing command: ${commandName}`);
                
                // Optional Auto Typing simulation if enabled
                if (config.features?.autoTyping) {
                    await sock.sendPresenceUpdate('composing', sender);
                }

                await commands.get(commandName).execute(sock, msg, sender, args);
            } catch (error) {
                console.error(`❌ Error executing ${commandName}:`, error);
                await sock.sendMessage(sender, { text: "❌ An error occurred while executing this command." }, { quoted: msg });
            }
        }
    });
}

startBot();
