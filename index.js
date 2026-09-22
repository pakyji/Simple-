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

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Bot is running!");
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

const PHONE_NUMBER = process.env.PHONE_NUMBER;

async function startBot() {
    try {
        console.log("Starting WhatsApp connection...");

        const { state, saveCreds } =
            await useMultiFileAuthState("./auth_info_baileys");

        const logger = pino({
            level: "info"
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

        sock.ev.on("creds.update", saveCreds);

        sock.ev.on("connection.update", async (update) => {
            const { connection, lastDisconnect } = update;

            if (connection === "connecting") {
                console.log("Connecting to WhatsApp...");
            }

            if (
                connection === "open"
            ) {
                console.log("==============================");
                console.log("WHATSAPP CONNECTED");
                console.log("==============================");
            }

            if (connection === "close") {
                const statusCode =
                    new Boom(lastDisconnect?.error)
                        ?.output?.statusCode;

                console.log("==============================");
                console.log("WHATSAPP CONNECTION CLOSED");
                console.log("Status:", statusCode);
                console.log("==============================");

                if (statusCode !== DisconnectReason.loggedOut) {
                    console.log("Reconnecting...");
                    setTimeout(startBot, 3000);
                } else {
                    console.log(
                        "WhatsApp session was logged out."
                    );
                }
            }
        });

        if (!state.creds.registered) {
            if (!PHONE_NUMBER) {
                console.log(
                    "ERROR: PHONE_NUMBER environment variable is missing."
                );
                return;
            }

            const number = PHONE_NUMBER.replace(/\D/g, "");

            console.log(
                "Requesting WhatsApp pairing code..."
            );

            const code =
                await sock.requestPairingCode(number);

            console.log("==============================");
            console.log("WHATSAPP PAIRING CODE:");
            console.log(code);
            console.log("==============================");
        }
    } catch (error) {
        console.error("==============================");
        console.error("BOT STARTUP ERROR:");
        console.error(error);
        console.error("==============================");
    }
}

startBot();
