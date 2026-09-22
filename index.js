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
//
// Set this in Bot-Hosting environment variables:
//
// PHONE_NUMBER=393XXXXXXXXX
//
// Country code required.
// No +, spaces, brackets or dashes.
//

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

            // Canonical browser identity
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
                console.log("WHATSAPP CONNECTED");
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
                    console.log(
                        "Connection closed. Reconnecting in 3 seconds..."
                    );

                    setTimeout(() => {
                        startBot();
                    }, 3000);
                } else {
                    console.log(
                        "WhatsApp session was logged out."
                    );
                    console.log(
                        "Delete the auth session only if you intentionally want to pair again."
                    );
                }
            }
        });

        // ==========================
        // PAIRING CODE
        // ==========================

        if (!state.creds.registered) {
            if (!PHONE_NUMBER) {
                console.log("==============================");
                console.log(
                    "ERROR: PHONE_NUMBER is not configured."
                );
                console.log(
                    "Set PHONE_NUMBER in your Bot-Hosting environment variables."
                );
                console.log("==============================");
                return;
            }

            const number = PHONE_NUMBER.replace(/\D/g, "");

            if (!number) {
                console.log(
                    "ERROR: PHONE_NUMBER contains no valid digits."
                );
                return;
            }

            console.log(
                "Requesting WhatsApp pairing code..."
            );

            const code =
                await sock.requestPairingCode(number);

            console.log("==============================");
            console.log("WHATSAPP PAIRING CODE");
            console.log("==============================");
            console.log(code);
            console.log("==============================");
            console.log(
                "Enter this code in WhatsApp > Linked Devices."
            );
        }

    } catch (error) {
        console.error("==============================");
        console.error("BOT STARTUP ERROR:");
        console.error(error);
        console.error("==============================");
    }
}

// ==========================
// START
// ==========================

startBot();
