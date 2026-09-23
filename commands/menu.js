const fs = require("fs");
const path = require("path");
const langs = require("../languages");

module.exports = {
    name: "menu",
    category: "GENERAL",
    description: "Shows the main command list",
    execute: async (sock, msg, sender) => {
        let prefix = ",";
        let langCode = "en";
        let owners = [];

        const configPath = path.join(__dirname, "../config.json");
        if (fs.existsSync(configPath)) {
            try {
                const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                if (config.bot?.prefix) prefix = config.bot.prefix;
                if (config.bot?.language) langCode = config.bot.language;
                let rawOwners = [];
                if (config.bot?.ownerNumber) rawOwners.push(String(config.bot.ownerNumber));
                if (Array.isArray(config.bot?.owners)) rawOwners = rawOwners.concat(config.bot.owners);
                owners = rawOwners.map(o => String(o).replace(/[^0-9]/g, ""));
            } catch (e) {
                console.error("Config read error:", e);
            }
        }

        const t = langs[langCode] || langs["en"];

        let senderJid = msg.key?.participant || msg.key?.remoteJid || sender || "";
        const senderNumber = String(senderJid).replace(/[^0-9]/g, "");

        if (owners.length > 0 && !owners.includes(senderNumber)) {
            return await sock.sendMessage(sender, { text: `*${t.accessDenied}*` }, { quoted: msg });
        }

        const commandsDir = path.join(__dirname);
        const categories = {};

        try {
            const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js') && file.toLowerCase() !== 'menu.js');
            for (const file of commandFiles) {
                try {
                    const command = require(path.join(commandsDir, file));
                    if (command.name) {
                        const cat = (command.category || "GENERAL").toUpperCase();
                        if (!categories[cat]) categories[cat] = [];
                        categories[cat].push({ name: command.name, description: command.description || "" });
                    }
                } catch (err) {
                    console.error(`Error loading command file ${file}:`, err);
                }
            }
        } catch (e) {
            console.error("Error reading commands folder:", e);
        }

        let menuText = 
            `╔════════════════════════════╗\n` +
            `║     ${t.menuTitle}      ║\n` +
            `╠════════════════════════════╣\n` +
            `║ LANG    :: ${langCode.toUpperCase().padEnd(16)}║\n` +
            `║ PREFIX  :: ${prefix.padEnd(16)}║\n` +
            `╚════════════════════════════╝\n\n`;

        const sortedCategories = Object.keys(categories).sort();
        for (const cat of sortedCategories) {
            menuText += `┏━━━━━━━〔 ${cat} 〕━━━━━━━┓\n\n`;
            categories[cat].sort((a, b) => a.name.localeCompare(b.name));
            for (const cmd of categories[cat]) {
                const desc = cmd.description ? `\n┃   └─ ${cmd.description}` : "";
                menuText += `┃◈ ${prefix}${cmd.name}${desc}\n┃\n`;
            }
            menuText += `┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n\n`;
        }

        await sock.sendMessage(sender, { text: menuText.trim() }, { quoted: msg });
    }
};
