const {
    default: makeWASocket,
    useMultiFileAuthState,
    makeCacheableSignalKeyStore,
    DisconnectReason,
    Browsers
} = require("@whiskeysockets/baileys");

const { Boom } = require("@hapi/boom");
const pino = require("pino");
const express = require("express");

// ==========================
// WEB SERVER
// ==========================

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Bot is running!");
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// ==========================
// PHONE NUMBER
// ==========================

const PHONE_NUMBER = process.env.PHONE_NUMBER;

// ==========================
// WHATSAPP BOT
// ==========================

async function startBot() {
    try {
        console.log("Starting WhatsApp connection...");

        const { state, saveCreds } =
            await useMultiFileAuthState("./auth_info_baileys");

        const logger = pino({
            level: "silent" // Silent karke logs clean rakhe hain taaki unnecessary spam na ho
        });

        const sock = makeWASocket({
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(
                    state.keys,
                    logger
                )
            },

            browser: Browsers.ubuntu("Chrome"),
            printQRInTerminal: false,
            logger,
            connectTimeoutMs: 60000,
            markOnlineOnConnect: false
        });

        // ==========================
        // SAVE CREDENTIALS
        // ==========================

        sock.ev.on("creds.update", saveCreds);

        // ==========================
        // CONNECTION EVENTS
        // ==========================

        sock.ev.on("connection.update", async (update) => {
            const {
                connection,
                lastDisconnect
            } = update;

            if (connection === "connecting") {
                console.log("Connecting to WhatsApp...");
            }

            if (connection === "open") {
                console.log("==============================");
                console.log("WHATSAPP CONNECTED SUCCESSFULLY");
                console.log("==============================");
            }

            if (connection === "close") {
                const statusCode =
                    new Boom(lastDisconnect?.error)
                        .output?.statusCode;

                console.log("==============================");
                console.log("WHATSAPP CONNECTION CLOSED");
                console.log("Status:", statusCode);
                console.log("==============================");

                if (
                    statusCode !== DisconnectReason.loggedOut
                ) {
                    console.log("Reconnecting in 3 seconds...");
                    setTimeout(() => {
                        startBot();
                    }, 3000);
                } else {
                    console.log("WhatsApp session was logged out.");
                }
            }
        });

        // ==========================
        // ROBUST MESSAGE HANDLER (PING)
        // ==========================

        sock.ev.on("messages.upsert", async ({ messages, type }) => {
            if (type !== "notify") return;

            const msg = messages[0];
            if (!msg.message) return;

            // Debug ke liye console par print karega ki message aaya hai
            const sender = msg.key.remoteJid;
            console.log("Incoming message object from:", sender);

            // Har tarah ke message type se text nikalne ka secure tarika
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
                    if (innerType === "conversation") {
                        messageText = innerMsg.conversation;
                    } else if (innerType === "extendedTextMessage") {
                        messageText = innerMsg.extendedTextMessage?.text;
                    }
                }
            }

            if (!messageText) return;

            console.log(`Extracted Text: "${messageText}"`);

            // Ping command check (case-insensitive, chahe "ping" likho ya "PING")
            if (messageText.trim().toLowerCase() === "ping") {
                console.log("Ping detected! Sending Pong...");
                await sock.sendMessage(sender, { text: "Pong! 🤖" }, { quoted: msg });
            }
        });

        // ==========================
        // PAIRING CODE
        // ==========================

        if (!state.creds.registered) {
            if (!PHONE_NUMBER) {
                console.log("ERROR: PHONE_NUMBER is not configured.");
                return;
            }

            const number = PHONE_NUMBER.replace(/\D/g, "");

            if (!number) {
                console.log("ERROR: PHONE_NUMBER contains no valid digits.");
                return;
            }

            setTimeout(async () => {
                try {
                    console.log("Requesting WhatsApp pairing code...");
                    const code = await sock.requestPairingCode(number);
                    console.log("==============================");
                    console.log("WHATSAPP PAIRING CODE:", code);
                    console.log("==============================");
                } catch (err) {
                    console.error("Failed to request pairing code:", err);
                }
            }, 5000);
        }

    } catch (error) {
        console.error("BOT STARTUP ERROR:", error);
    }
}

startBot();
