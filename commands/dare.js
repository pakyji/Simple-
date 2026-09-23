module.exports = {
    name: "dare",
    description: "Get a fun dare task",
    async execute(sock, msg, sender, args) {
        const dares = [
            "Send a voice note singing your favorite song.",
            "Change your WhatsApp status to 'I love coding bots' for 24 hours.",
            "Text your best friend 'I am secretly an alien'.",
            "Do 20 pushups right now and send proof!"
        ];
        const randomDare = dares[Math.floor(Math.random() * dares.length)];
        const text = `╭━━━〔 😈 *DARE* 〕━━━⣣\n` +
                     `┃\n` +
                     `┃  🔥 ${randomDare}\n` +
                     `┃\n` +
                     `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;
        await sock.sendMessage(sender, { text: text }, { quoted: msg });
    }
};
