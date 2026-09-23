const fs = require("fs");
const path = require("path");

module.exports = {
    name: "setlang",
    category: "TOOLS",
    description: "Change bot language (en/it/ur)",
    execute: async (sock, msg, sender, args) => {
        let prefix = ",";
        let currentLang = "en";
        const configPath = path.join(__dirname, "../config.json");

        if (fs.existsSync(configPath)) {
            try {
                const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                if (config.bot?.prefix) prefix = config.bot.prefix;
                if (config.bot?.language) currentLang = config.bot.language;
            } catch (e) {
                console.error("Config read error:", e);
            }
        }

        // Determina la chat di destinazione corretta sia per chat privata che di gruppo
        const targetChat = msg.key?.remoteJid || sender;

        const targetLang = args && args[0] ? args[0].toLowerCase() : "";

        if (!["en", "it", "ur"].includes(targetLang)) {
            return await sock.sendMessage(targetChat, { 
                text: `*✦ THE SYNDICATE ✦*\n\nUsage: ${prefix}setlang <en/it/ur>\nCurrent Language: ${currentLang}` 
            }, { quoted: msg });
        }

        try {
            const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            if (!configData.bot) configData.bot = {};
            configData.bot.language = targetLang;

            fs.writeFileSync(configPath, JSON.stringify(configData, null, 2), 'utf8');

            await sock.sendMessage(targetChat, { 
                text: `*SUCCESS / SUCCESSO:* Bot language successfully changed to: *${targetLang.toUpperCase()}*` 
            }, { quoted: msg });

        } catch (error) {
            console.error("Error updating language:", error);
            await sock.sendMessage(targetChat, { 
                text: `*ERROR:* Failed to update bot language.` 
            }, { quoted: msg });
        }
    }
};
