module.exports = {
    name: "quote",
    description: "Get an inspirational quote",
    async execute(sock, msg, sender, args) {
        const quotes = [
            "The best way to get started is to quit talking and begin doing. - Walt Disney",
            "Don't let yesterday take up too much of today. - Will Rogers",
            "It's not whether you get knocked down, it's whether you get up. - Vince Lombardi"
        ];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        const text = `╭━━━〔 💡 *QUOTE* 〕━━━⣣\n` +
                     `┃\n` +
                     `┃  💬 "${randomQuote}"\n` +
                     `┃\n` +
                     `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;
        await sock.sendMessage(sender, { text: text }, { quoted: msg });
    }
};
