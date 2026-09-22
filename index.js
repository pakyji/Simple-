const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const http = require('http');
const qrcode = require('qrcode');

let qrCodeData = 'Initializing, please wait for QR code...';

async function startBot() {
    console.log('Starting The Syndicate Bot...');
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    
    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        browser: ["Ubuntu", "Chrome", "120.0.0.0"],
        auth: state
    });

    sock.ev.on('creds.update', saveCreds);
    
    sock.ev.on('connection.update', (update) => {
        const { connection, qr } = update;
        if (qr) {
            qrCodeData = qr;
            console.log('New QR Code generated! Open your bot web link to scan it.');
        }
        if (connection === 'open') {
            console.log('The Syndicate bot successfully connected to WhatsApp!');
            qrCodeData = 'Bot is successfully connected to WhatsApp!';
        }
    });

    // Commands loader map
    const commands = new Map();
    const commandFolder = path.join(__dirname, 'commands');

    if (!fs.existsSync(commandFolder)) {
        fs.mkdirSync(commandFolder);
    }

    const commandFiles = fs.readdirSync(commandFolder).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(path.join(commandFolder, file));
        commands.set(command.name, command);
    }

    commands.set(',ping', {
        name: ',ping',
        async execute(sock, mek, from) {
            const start = Date.now();
            await sock.sendMessage(from, { text: 'The Syndicate Pong! 🏓' }, { quoted: mek });
            const latency = Date.now() - start;
            await sock.sendMessage(from, { text: `The Syndicate Speed: ${latency}ms` }, { quoted: mek });
        }
    });

    sock.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            const mek = chatUpdate.messages[0];
            if (!mek.message) return;
            const messageType = Object.keys(mek.message)[0];
            const body = messageType === 'conversation' ? mek.message.conversation : 
                         messageType === 'extendedTextMessage' ? mek.message.extendedTextMessage.text : '';
            const from = mek.key.remoteJid;
            if (commands.has(body)) {
                const cmd = commands.get(body);
                await cmd.execute(sock, mek, from);
            }
        } catch (err) {
            console.log(err);
        }
    });
}

startBot();

// Web Server to display QR code on browser
const server = http.createServer(async (req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    if (qrCodeData.length > 50 && !qrCodeData.includes('connected')) {
        try {
            const urlImg = await qrcode.toDataURL(qrCodeData);
            res.end(`<html><body style="text-align:center;background:#111;color:#fff;padding-top:50px;">
                <h2>The Syndicate Bot - Scan QR Code</h2>
                <img src="${urlImg}" style="width:300px;height:300px;background:#fff;padding:10px;border-radius:10px;" />
                <p>Open WhatsApp on your phone -> Linked Devices -> Link a Device and scan this QR!</p>
            </body></html>`);
        } catch (e) {
            res.end(`<html><body style="background:#111;color:#fff;text-align:center;padding-top:50px;"><h2>Generating QR... Please refresh.</h2></body></html>`);
        }
    } else {
        res.end(`<html><body style="text-align:center;background:#111;color:#fff;padding-top:50px;">
            <h2>The Syndicate Bot</h2>
            <p>${qrCodeData}</p>
        </body></html>`);
    }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Web server is listening on port ${PORT}`);
});
