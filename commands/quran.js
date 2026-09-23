module.exports = {
    name: "quran",
    description: "Get a random Quranic Ayah translation",
    async execute(sock, msg, sender, args) {
        try {
            const randomAyah = Math.floor(Math.random() * 6236) + 1;
            const response = await fetch(`http://api.alquran.cloud/v1/ayah/${randomAyah}/en.asad`);
            const data = await response.json();
            const ayah = data.data;

            const text = `╭━━━〔 📖 *QURAN AYAH* 〕━━━⣣\n` +
                         `┃\n` +
                         `┃  📌 *Surah:* ${ayah.surah.englishName} (Ayah ${ayah.numberInSurah})\n` +
                         `┃  💬 "${ayah.text}"\n` +
                         `┃\n` +
                         `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;
            await sock.sendMessage(sender, { text: text }, { quoted: msg });
        } catch (error) {
            await sock.sendMessage(sender, { text: "❌ Failed to fetch Quran ayah." }, { quoted: msg });
        }
    }
};
