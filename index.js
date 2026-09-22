const {
    default: makeWASocket,
    useMultiFileAuthState,
    makeCacheableSignalKeyStore,
    DisconnectReason
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const express = require("express");

// =========================
// WEB SERVER
// =========================

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Bot is running!");
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// =========================
// LOGGER
// =========================

const logger = pino({
    level: "info"
});

// =========================
// BOT STATE
// =========================

let reconnecting = false;

// =========================
// WHATSAPP BOT
// =========================

async function startBot() {
    try {
        console.log("");
        console.log("================================");
        console.log("STARTING WHATSAPP BOT");
        console.log("================================");

        const { state, saveCreds } =
            await useMultiFileAuthState("./auth_info_baileys");

        console.log(
            `Authentication registered: ${state.creds.registered}`
        );

        const sock = makeWASocket({
            logger,

            printQRInTerminal: false,

            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(
                    state.keys,
                    logger
                )
            },

            browser: [
                "Chrome",
                "Linux",
                "1.0.0"
            ],

            connectTimeoutMs: 60000,

            defaultQueryTimeoutMs: 60000,

            keepAliveIntervalMs: 30000,

            markOnlineOnConnect: false,

            syncFullHistory: false
        });

        // =========================
        // SAVE CREDENTIALS
        // =========================

        sock.ev.on("creds.update", saveCreds);

        // =========================
        // CONNECTION UPDATE
        // =========================

        sock.ev.on("connection.update", async (update) => {
            const {
                connection,
                lastDisconnect
            } = update;

            if (connection === "connecting") {
                console.log(
                    "Connecting to WhatsApp..."
                );
            }

            if (connection === "open") {
                reconnecting = false;

                console.log("");
                console.log(
                    "================================"
                );
                console.log(
                    "WHATSAPP CONNECTED SUCCESSFULLY"
                );
                console.log(
                    "================================"
                );
                console.log("");
            }

            if (connection === "close") {
                const statusCode =
                    lastDisconnect?.error?.output?.statusCode;

                const errorMessage =
                    lastDisconnect?.error?.message ||
                    "Unknown connection error";

                console.log("");
                console.log(
                    "================================"
                );
                console.log(
                    "WHATSAPP CONNECTION CLOSED"
                );
                console.log(
                    `Disconnect status code: ${
                        statusCode || "unknown"
                    }`
                );
                console.log(
                    `Disconnect error: ${errorMessage}`
                );
                console.log(
                    "================================"
                );

                // =========================
                // LOGGED OUT
                // =========================

                if (
                    statusCode ===
                    DisconnectReason.loggedOut
                ) {
                    console.log(
                        "WhatsApp session was logged out."
                    );

                    console.log(
                        "Delete auth_info_baileys only when a fresh pairing is required."
                    );

                    return;
                }

                // =========================
                // RECONNECT
                // =========================

                if (!reconnecting) {
                    reconnecting = true;

                    console.log(
                        "Reconnecting in 5 seconds..."
                    );

                    setTimeout(() => {
                        reconnecting = false;
                        startBot();
                    }, 5000);
                }
            }
        });

        // =========================
        // PAIRING CODE
        // =========================

        if (!state.creds.registered) {
            const rawNumber =
                process.env.WHATSAPP_NUMBER || "";

            const phoneNumber =
                rawNumber.replace(/\D/g, "");

            if (!phoneNumber) {
                console.log("");
                console.log(
                    "ERROR: WHATSAPP_NUMBER is not configured."
                );
                console.log(
                    "Set WHATSAPP_NUMBER to the full international phone number."
                );
                console.log("");
                return;
            }

            console.log("");
            console.log(
                "Requesting WhatsApp pairing code..."
            );

            try {
                const code =
                    await sock.requestPairingCode(
                        phoneNumber
                    );

                console.log("");
                console.log(
                    "================================"
                );
                console.log(
                    `PAIRING CODE: ${code}`
                );
                console.log(
                    "================================"
                );
                console.log(
                    "Enter this code in WhatsApp:"
                );
                console.log(
                    "Settings > Linked Devices > Link a Device > Link with phone number"
                );
                console.log("");
            } catch (error) {
                console.error("");
                console.error(
                    "PAIRING CODE ERROR:"
                );
                console.error(error);
                console.error("");
            }
        } else {
            console.log("");
            console.log(
                "Existing WhatsApp credentials found."
            );
            console.log(
                "Pairing code is not required."
            );
            console.log("");
        }

    } catch (error) {
        console.error("");
        console.error(
            "BOT STARTUP ERROR:"
        );
        console.error(error);
        console.error("");
    }
}

// =========================
// START
// =========================

startBot();
