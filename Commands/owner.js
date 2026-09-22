const config = require('../config');

module.exports = {
    name: ',owner',
    async execute(sock, mek, from) {
        await sock.sendMessage(from, { text: `👑 *Owner Information*\n\nThis bot is officially owned and protected by ${config.botName}.` }, { quoted: mek });
    }
};
