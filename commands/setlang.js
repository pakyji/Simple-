const fs = require("fs");
const path = require("path");

module.exports = {
    name: "setlang",
    category: "TOOLS",
    description: "Change bot language (en/it/ur)",
    execute: async (sock, msg, sender, args) => {
        let prefix = ",";
        let owners = [];
        let currentLang = "en";
        const configPath = path.join(__dirname, "../config.json");

        if (fs.existsSync(configPath)) {
            try {
                const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                if (config.bot?.prefix) prefix = config.bot.prefix;
                if (config.bot?.language) currentLang = config.bot.language;
                let rawOwners = [];
                if (config.bot?.ownerNumber) rawOwners.push(String(config.bot.ownerNumber));
                if (Array.isArray(config.bot?.owners)) rawOwners = rawOwners.concat(config.bot.owners);
                owners = rawOwners.map(o => String(o).replace(/[^0-9]/g, ""));
            } catch (e) {
                console.error("Config read error:", e);
            }
        }

        let senderJid = msg.key?.participant || msg.key?.remoteJid || sender || "";
        const senderNumber = String(senderJid).replace(/[^0-9]/g, "");

        if (owners.length > 0 && !owners.includes(senderNumber)) {
            return await sock.sendMessage(sender, { 
                text: `*ACCESS DENIED / ACCESSO NEGATO:* You are not authorized!` 
            }, { quoted: msg });
        }

        const targetLang = args && args[0] ? args[0].toLowerCase() : "";

        if (!["en", "it", "ur"].includes(targetLang)) {
            return await sock.sendMessage(sender, { 
                text: `*✦ THE SYNDICATE ✦*\n\nUsage: ${prefix}setlang <en/it/ur>\nCurrent Language: ${currentLang}` 
            }, { quoted: msg });
        }

        try {
            const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            if (!configData.bot) configData.bot = {};
            configData.bot.language = targetLang;

            fs.writeFileSync(configPath, JSON.stringify(configData, null, 2), 'utf8');

            await sock.sendMessage(sender, { 
                text: `*SUCCESS / SUCCESSO:* Bot language successfully changed to: *${targetLang.toUpperCase()}*` 
            }, { quoted: msg });

        } catch (error) {
            console.error("Error updating language:", error);
            await sock.sendMessage(sender, { 
                text: `*ERROR:* Failed to update bot language.` 
            }, { quoted: msg });
        }
    }
};
