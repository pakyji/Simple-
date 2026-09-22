const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const fs = require("fs");
const path = require("path");
const pino = require("pino");

// 1. Commands Loader (Automatically reads all files in 'commands/' folder)
const commands = new Map();
const commandFiles = fs.readdirSync(path.join(__dirname, "commands")).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.set(command.name, command);
    console.log(`✅ Loaded command: ${command.name}`);
}

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth_info");

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: "silent" })
    });

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
    // 2. AUTOMATIC STATUS VIEWER
    // ==========================
    sock.ev.on("messages.upsert", async ({ messages, type }) => {
        const msg = messages[0];
        if (!msg || !msg.key) return;

        // Automatically view statuses posted on status@broadcast
        if (msg.key.remoteJid === "status@broadcast") {
            try {
                await sock.readMessages([msg.key]);
                console.log(`👀 Automatically viewed status from: ${msg.key.participant || "Unknown"}`);
            } catch (error) {
                console.error("❌ Error viewing status:", error);
            }
            return;
        }

        if (type !== "notify") return;
        if (!msg.message) return;

        const sender = msg.key.remoteJid;
        const isGroup = sender.endsWith("@g.us");

        // Extract message text safely across different WhatsApp message types
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
        // 3. GLOBAL ANTI-LINK FEATURE
        // ==========================
        if (isGroup) {
            const linkRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9][-a-zA-Z0-9]*\.[a-zA-Z]{2,}[^\s]*)/gi;
            
            if (linkRegex.test(messageText)) {
                // Optional: Check if bot is admin before trying to delete, or just warn the user
                try {
                    // Delete the message containing the link
                    await sock.sendMessage(sender, { delete: msg.key });
                    
                    // Send a warning message to the sender
                    await sock.sendMessage(sender, { 
                        text: `⚠️ Links are not allowed in this group!` 
                    }, { quoted: msg });
                    
                    console.log(`🛡️ Anti-link triggered in group ${sender}. Link message deleted.`);
                    return; // Stop further command processing for link messages
                } catch (error) {
                    console.error("❌ Anti-link action failed (Bot might not be admin):", error);
                }
            }
        }

        // ==========================
        // 4. COMMAND DISPATCHER & AUTH CHECK
        // ==========================
        const args = messageText.trim().toLowerCase().split(" ");
        const commandName = args[0];

        if (commands.has(commandName)) {
            const { isApproved } = require("./utils/auth");

            // Block unverified users except for the 'verify' command
            if (commandName !== "verify" && !isApproved(sender)) {
                await sock.sendMessage(sender, { 
                    text: "⚠️ Access Denied!\n\nYou must join our official Discord community before using this bot.\n\n🔗 Join here: https://discord.gg/syndicateps\n\nAfter joining, type `.verify` to unlock access." 
                }, { quoted: msg });
                return;
            }

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
