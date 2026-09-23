module.exports = {
    name: "roast",
    description: "Send a light, funny roast",
    async execute(sock, msg, sender, args) {
        const roasts = [
            "You are like a software update. Every time I see you, I think 'Not now'.",
            "I’d agree with you, but then we’d both be wrong.",
            "You bring everyone so much joy... when you leave the room.",
            "I'm not saying you're stupid, but you have bad luck thinking.",
            "Mirrors can't talk. And lucky for you, they can't laugh either.",
            "If laughter is the best medicine, your face must be curing the world."
        ];
        
        const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
        
        const text = `╭━━━〔 🔥 *ROAST* 〕━━━⣣\n` +
                     `┃\n` +
                     `┃  💬 "${randomRoast}"\n` +
                     `┃\n` +
                     `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;
                     
        await sock.sendMessage(sender, { text: text }, { quoted: msg });
    }
};
