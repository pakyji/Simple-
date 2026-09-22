const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const express = require('express');
const qrcode = require('qrcode');
const pino = require('pino');

const app = express();
const PORT = process.env.PORT || 8000;

let qrCodeData = '';
let connectionStatus = 'Connecting...';

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    
    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
        auth: state
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            qrCodeData = qr;
            connectionStatus = 'Scan QR Code';
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed, reconnecting...', shouldReconnect);
            if (shouldReconnect) {
                connectToWhatsApp();
            } else {
                connectionStatus = 'Logged out. Restart service.';
            }
        } else if (connection === 'open') {
            connectionStatus = 'Connected to WhatsApp successfully!';
            console.log('WhatsApp Connected!');
            qrCodeData = '';
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;
        
        const sender = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

        if (text === 'ping') {
            await sock.sendMessage(sender, { text: 'pong! Bot is active.' });
        }
    });
}

app.get('/', async (req, res) => {
    if (qrCodeData) {
        try {
            const urlImage = await qrcode.toDataURL(qrCodeData);
            res.send(`
                <html>
                    <body style="text-align:center; font-family:sans-serif; margin-top:50px;">
                        <h2>WhatsApp Bot QR Code</h2>
                        <p>Status: <b>${connectionStatus}</b></p>
                        <img src="${urlImage}" alt="QR Code" style="width:300px;height:300px;" />
                        <p>Scan this QR code with your WhatsApp app to link the bot.</p>
                    </body>
                </html>
            `);
        } catch (err) {
            res.send('Error generating QR code.');
        }
    } else {
        res.send(`
            <html>
                <body style="text-align:center; font-family:sans-serif; margin-top:50px;">
                    <h2>WhatsApp Bot</h2>
                    <p>Status: <b>${connectionStatus}</b></p>
                </body>
            </html>
        `);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectToWhatsApp();
});
