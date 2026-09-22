const config = require('../config');

module.exports = {
    name: ',setname',
    async execute(sock, mek, from) {
        // Extract the sender's identifier
        const sender = mek.key.participant || mek.key.remoteJid;
        
        // Check if the sender is the authorized owner
        if (sender !== config.ownerNumber) {
            await sock.sendMessage(from, { text: '❌ Only the real owner of The Syndicate can modify these settings!' }, { quoted: mek });
            return;
        }

        await sock.sendMessage(from, { text: `✅ Verification passed! The official name and branding remain fully protected under: *${config.botName}*` }, { quoted: mek });
    }
};
