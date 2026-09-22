const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const path = require('path');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    
    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state
    });

    if (!sock.authState.creds.registered) {
        const phoneNumber = "393802347902"; 
        setTimeout(async () => {
            let code = await sock.requestPairingCode(phoneNumber);
            console.log(`\n================================`);
            console.log(` IL TUO CODICE DI PAIRING È: ${code} `);
            console.log(`================================\n`);
        }, 4000);
    }

    sock.ev.on('creds.update', saveCreds);
    
    sock.ev.on('connection.update', (update) => {
        const { connection } = update;
        if (connection === 'open') {
            console.log('The Syndicate bot connesso a WhatsApp con successo!');
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

    // Default built-in ,ping command
    commands.set(',ping', {
        name: ',ping',
        async execute(sock, mek, from) {
            const start = Date.now();
            await sock.sendMessage(from, { text: 'The Syndicate Pong! 🏓' }, { quoted: mek });
            const latency = Date.now() - start;
            await sock.sendMessage(from, { text: `The Syndicate Speed: ${latency}ms` }, { quoted: mek });
        }
    });

    // Message handler
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
