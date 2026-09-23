module.exports = {
    name: "ascii",
    description: "Convert text to ASCII uppercase style",
    async execute(sock, msg, sender, args) {
        const text = args.join(" ") || "WHATSAPP";
        const asciiArt = `╭━━━〔 🎨 *ASCII TEXT* 〕━━━⣣\n` +
                         `┃\n` +
                         `┃  🔤 \`${text.toUpperCase()}\`\n` +
                         `┃\n` +
                         `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;
        await sock.sendMessage(sender, { text: asciiArt }, { quoted: msg });
    }
};
