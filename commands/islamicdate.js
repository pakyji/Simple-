module.exports = {
    name: "islamicdate",
    description: "Get current Hijri/Islamic date",
    async execute(sock, msg, sender, args) {
        try {
            const today = new Date();
            const response = await fetch(`https://api.aladhan.com/v1/gToH?date=${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`);
            const data = await response.json();
            const hijri = data.data.hijri;

            const text = `╭━━━〔 🌙 *ISLAMIC HIJRI DATE* 〕━━━⣣\n` +
                         `┃\n` +
                         `┃  📅 *Date:* ${hijri.day} ${hijri.month.en} ${hijri.year} AH\n` +
                         `┃  🕌 *Month:* ${hijri.month.ar} (${hijri.month.en})\n` +
                         `┃  🗓️ *Designation:* ${hijri.designation.expanded}\n` +
                         `┃\n` +
                         `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;
            await sock.sendMessage(sender, { text: text }, { quoted: msg });
        } catch (error) {
            await sock.sendMessage(sender, { text: "❌ Failed to fetch Islamic date." }, { quoted: msg });
        }
    }
};
