const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const pino = require('pino');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    
    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false, // Disattiva il QR code
        auth: state
    });

    // Se non è già registrato, richiede il codice con il tuo numero
    if (!sock.authState.creds.registered) {
        const phoneNumber = "393802347902"; // Il tuo numero senza il segno '+'
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
            console.log('Bot connesso a WhatsApp con successo!');
        }
    });
}

startBot();
