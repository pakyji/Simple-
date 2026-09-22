module.exports = {
    name: ',menu',
    async execute(sock, mek, from) {
        await sock.sendMessage(from, { text: '🤖 *The Syndicate Menu*\n\n,ping - Test bot speed' }, { quoted: mek });
    }
};
