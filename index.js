const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, makeCacheableSignalKeyStore, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const pino = require("pino");
const express = require("express");
const readline = require("readline");

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('The Syndicate Bot is running!');
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info_baileys');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: "silent" }),
        printQRInTerminal: false, // QR code band kiya hai taaki pairing code use ho sake
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
        },
        browser: ["Chrome", "Desktop", "1.0.0"]
    });

    // Agar pehle se connected nahi hai, toh pairing code maangega
    if (!sock.authState.creds.registered) {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        const question = (text) => new Promise((resolve) => rl.question(text, resolve));
        
        console.log("Apna WhatsApp number daaliye (country code ke sath, jaise 91xxxxxxxxxx):");
        const phoneNumber = await question("Number: ");
        rl.close();

        setTimeout(async () => {
            let code = await sock.requestPairingCode(phoneNumber.trim());
            console.log(`\n============================`);
            console.log(`AAPKA PAIRING CODE YEH HAI: ${code}`);
            console.log(`============================\n`);
        }, 3000);
    }

    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "open") {
            console.log("Bot successfully WhatsApp se connect ho gaya hai!");
        } else if (connection === "close") {
            let reason = lastDisconnect?.error?.output?.statusCode;
            console.log("Connection closed, reconnecting...", reason);
            startBot();
        }
    });

    sock.ev.on("creds.update", saveCreds);
}

startBot();
