const namesOfAllah = [
    { number: 1, ar: "الرحمن", en: "Ar-Rahman", meaning: "The Most Gracious" },
    { number: 2, ar: "الرحيم", en: "Ar-Rahim", meaning: "The Most Merciful" },
    { number: 3, ar: "الملك", en: "Al-Malik", meaning: "The King / The Absolute Ruler" },
    { number: 4, ar: "القدوس", en: "Al-Quddus", meaning: "The Pure / The Absolute Holy" },
    { number: 5, ar: "السلام", en: "As-Salam", meaning: "The Source of Peace" }
    // (Baqi names bhi add kiye ja sakte hain)
];

module.exports = {
    name: "99names",
    description: "Get one of the 99 Beautiful Names of Allah",
    async execute(sock, msg, sender, args) {
        const randomName = namesOfAllah[Math.floor(Math.random() * namesOfAllah.length)];
        const text = `╭━━━〔 ✨ *99 NAMES OF ALLAH* 〕━━━⣣\n` +
                     `┃\n` +
                     `┃  🔢 *Number:* ${randomName.number}\n` +
                     `┃  🌙 *Arabic:* ${randomName.ar}\n` +
                     `┃  🔤 *English:* ${randomName.en}\n` +
                     `┃  💡 *Meaning:* ${randomName.meaning}\n` +
                     `┃\n` +
                     `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;
        await sock.sendMessage(sender, { text: text }, { quoted: msg });
    }
};
