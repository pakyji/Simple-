module.exports = {
    name: "pickup",
    description: "Get a funny pickup line",
    async execute(sock, msg, sender, args) {
        const pickuplines = [
            "Are you a Wi-Fi signal? Because I'm feeling a strong connection.",
            "Are you a magician? Because whenever I look at you, everyone else disappears.",
            "Do you have a map? I keep getting lost in your eyes.",
            "Are you made of copper and tellurium? Because you are Cu-Te!",
            "Is your name Google? Because you have everything I’ve been searching for.",
            "Are you a parking ticket? Because you’ve got 'fine' written all over you."
        ];
        
        const randomLine = pickuplines[Math.floor(Math.random() * pickuplines.length)];
        
        const text = `╭━━━〔 💖 *PICKUP LINE* 〕━━━⣣\n` +
                     `┃\n` +
                     `┃  💬 "${randomLine}"\n` +
                     `┃\n` +
                     `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;
                     
        await sock.sendMessage(sender, { text: text }, { quoted: msg });
    }
};
