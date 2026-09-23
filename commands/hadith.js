module.exports = {
    name: "hadith",
    description: "Get a random Hadith",
    async execute(sock, msg, sender, args) {
        const hadiths = [
            "“Actions are judged by intentions, so each man will have what he intended.” - Sahih Bukhari",
            "“None of you truly believes until he loves for his brother what he loves for himself.” - Sahih Bukhari",
            "“The best among you are those who learn the Quran and teach it.” - Sahih Bukhari"
        ];
        const randomHadith = hadiths[Math.floor(Math.random() * hadiths.length)];
        const text = `╭━━━〔 📜 *HADITH OF THE DAY* 〕━━━⣣\n` +
                     `┃\n` +
                     `┃  💬 "${randomHadith}"\n` +
                     `┃\n` +
                     `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;
        await sock.sendMessage(sender, { text: text }, { quoted: msg });
    }
};
