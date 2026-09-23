module.exports = {
    name: "dua",
    description: "Get a daily Islamic Dua",
    async execute(sock, msg, sender, args) {
        const duas = [
            "رَبِّ زِدْنِي عِلْمًا (Rabbi zidni ilma) - O my Lord, increase me in knowledge.",
            "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ - Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good and protect us from the punishment of the Fire.",
            "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً - Our Lord, let not our hearts deviate after You have guided us and grant us from Yourself mercy."
        ];
        const randomDua = duas[Math.floor(Math.random() * duas.length)];
        const text = `╭━━━〔 🤲 *DAILY DUA* 〕━━━⣣\n` +
                     `┃\n` +
                     `┃  💬 "${randomDua}"\n` +
                     `┃\n` +
                     `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;
        await sock.sendMessage(sender, { text: text }, { quoted: msg });
    }
};
