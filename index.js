const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    DisconnectReason
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// =========================
// WEB SERVER
// =========================

app.get("/", (req, res) => {
    res.send("Bot is running!");
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// =========================
// WHATSAPP BOT
// =========================

async function startBot() {
    try {
        console.log("Starting WhatsApp connection...");

        const { state, saveCreds } =
            await useMultiFileAuthState("./auth_info_baileys");

        const { version } = await fetchLatestBaileysVersion();

        console.log(
            `Using WhatsApp Web version: ${version.join(".")}`
        );

        const logger = pino({
            level: "info"
        });

        const sock = makeWASocket({
            version,

            logger,

            printQRInTerminal: false,

            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(
                    state.keys,
                    logger
                )
            },

            // Use a normal WhatsApp Web browser identity.
            browser: ["Chrome", "Linux", "1.0.0"],

            connectTimeoutMs: 60000,

            markOnlineOnConnect: false
        });

        // =========================
        // SAVE AUTH CREDENTIALS
        // =========================

        sock.ev.on("creds.update", saveCreds);

        // =========================
        // CONNECTION EVENTS
        // =========================

        sock.ev.on("connection.update", async (update) => {
            const {
                connection,
                lastDisconnect,
                qr
            } = update;

            if (qr) {
                console.log(
                    "WhatsApp socket is ready for pairing code."
                );
            }

            if (connection === "connecting") {
                console.log("Connecting to WhatsApp...");
            }

            if (connection === "open") {
                console.log(
                    "================================"
                );
                console.log(
                    "WHATSAPP CONNECTED SUCCESSFULLY"
                );
                console.log(
                    "================================"
                );
            }

            if (connection === "close") {
                const statusCode =
                    lastDisconnect?.error?.output?.statusCode;

                console.log(
                    "================================"
                );
                console.log(
                    "WHATSAPP CONNECTION CLOSED"
                );
                console.log(
                    `Disconnect status code: ${statusCode || "unknown"}`
                );
                console.log(
                    `Disconnect error: ${
                        lastDisconnect?.error?.message ||
                        "unknown"
                    }`
                );
                console.log(
                    "================================"
                );

                if (
                    statusCode !== DisconnectReason.loggedOut
                ) {
                    console.log(
                        "Reconnecting to WhatsApp..."
                    );

                    setTimeout(() => {
                        startBot();
                    }, 5000);
                } else {
                    console.log(
                        "WhatsApp session was logged out."
                    );
                    console.log(
                        "Delete the auth_info_baileys folder only if a fresh pairing is required."
                    );
                }
            }
        });

        // =========================
        // PAIRING CODE
        // =========================

        if (!state.creds.registered) {
            const phoneNumber =
                process.env.WHATSAPP_NUMBER || "YOUR_NUMBER_HERE";

            if (
                !phoneNumber ||
                phoneNumber === "YOUR_NUMBER_HERE"
            ) {
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
                        phoneNumber.replace(/\D/g, "")
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
