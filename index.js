const {
    default: makeWASocket,
    useMultiFileAuthState,
    makeCacheableSignalKeyStore,
    DisconnectReason,
    Browsers
} = require("@whiskeysockets/baileys");

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

const logger = pino({
    level: "info"
});

let reconnecting = false;

async function startBot() {
    try {
        console.log("");
        console.log("================================");
        console.log("STARTING WHATSAPP BOT");
        console.log("================================");

        const { state, saveCreds } =
            await useMultiFileAuthState("./auth_info_baileys");

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

            browser: Browsers.ubuntu("Chrome"),

            connectTimeoutMs: 60000,

            defaultQueryTimeoutMs: 60000,

            keepAliveIntervalMs: 30000,

            markOnlineOnConnect: false,

            syncFullHistory: false
        });

        sock.ev.on("creds.update", saveCreds);

        sock.ev.on("connection.update", async (update) => {
            const {
                connection,
                lastDisconnect
            } = update;

            if (connection === "connecting") {
                console.log("Connecting to WhatsApp...");
            }

            if (connection === "open") {
                reconnecting = false;

                console.log("");
                console.log("================================");
                console.log("WHATSAPP CONNECTED SUCCESSFULLY");
                console.log("================================");
                console.log("");
            }

            if (connection === "close") {
                const statusCode =
                    lastDisconnect?.error?.output?.statusCode;

                const errorMessage =
                    lastDisconnect?.error?.message ||
                    "Unknown connection error";

                console.log("");
                console.log("================================");
                console.log("WHATSAPP CONNECTION CLOSED");
                console.log(
                    `Disconnect status code: ${
                        statusCode || "unknown"
                    }`
                );
                console.log(
                    `Disconnect error: ${errorMessage}`
                );
                console.log("================================");

                if (
                    statusCode ===
                    DisconnectReason.loggedOut
                ) {
                    console.log(
                        "WhatsApp session was logged out."
                    );
                    console.log(
                        "Delete auth_info_baileys only if a fresh pairing is required."
                    );
                    return;
                }

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

        if (!state.creds.registered) {
            const rawNumber =
                process.env.WHATSAPP_NUMBER || "";

            const phoneNumber =
                rawNumber.replace(/\D/g, "");

            if (!phoneNumber) {
                console.log(
                    "ERROR: WHATSAPP_NUMBER is not configured."
                );
                return;
            }

            console.log(
                "Requesting WhatsApp pairing code..."
            );

            try {
                const code =
                    await sock.requestPairingCode(
                        phoneNumber
                    );

                console.log("");
                console.log("================================");
                console.log(`PAIRING CODE: ${code}`);
                console.log("================================");
                console.log(
                    "Enter this code in WhatsApp:"
                );
                console.log(
                    "Settings > Linked Devices > Link a Device > Link with phone number"
                );
                console.log("");
            } catch (error) {
                console.error(
                    "PAIRING CODE ERROR:"
                );
                console.error(error);
            }
        } else {
            console.log(
                "Existing WhatsApp credentials found."
            );
            console.log(
                "Pairing code is not required."
            );
        }

    } catch (error) {
        console.error(
            "BOT STARTUP ERROR:"
        );
        console.error(error);
    }
}

startBot();
