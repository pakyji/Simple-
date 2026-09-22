const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } = require("@whiskeysockets/baileys");
const pino = require("pino");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bot is running!');
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info_baileys');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" })),
        },
        browser: ["Chrome", "Desktop", "1.0.0"]
    });

    if (!sock.authState.creds.registered) {
        // Number bina '+' ke rakha hai
        const phoneNumber = "393802347902";
        
        setTimeout(async () => {
            try {
                let code = await sock.requestPairingCode(phoneNumber.trim());
                console.log(`\n============================`);
                console.log(`IL TUO PAIRING CODE È: ${code}`);
                console.log(`============================\n`);
            } catch (err) {
                console.log("Errore nella richiesta del pairing code:", err);
            }
        }, 5000);
    }

    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "open") {
            console.log("Connessione a WhatsApp avvenuta con successo!");
        } else if (connection === "close") {
            console.log("Connessione chiusa, Riconnessione in corso...");
            startBot();
        }
    });

    sock.ev.on("creds.update", saveCreds);
}

startBot();
