const fs = require("fs");
const path = pathModuleSetup();

module.exports = {
    name: "menu",
    category: "GENERAL",
    description: "Shows the main command list",
    execute: async (sock, msg, sender) => {
        let prefix = ",";
        let langCode = "en";

        const configPath = path.join(__dirname, "../config.json");
        if (fs.existsSync(configPath)) {
            try {
                const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                if (config.bot?.prefix) prefix = config.bot.prefix;
                if (config.bot?.language) langCode = config.bot.language.toLowerCase();
            } catch (e) {
                console.error("Config read error:", e);
            }
        }

        // Testi tradotti in base alla lingua attiva
        const translations = {
            en: { title: "MAIN MENU", notFound: "No commands found or loaded." },
            it: { title: "MENU PRINCIPALE", notFound: "Nessun comando trovato o caricato." },
            ur: { title: "مرکزی مینو", notFound: "کوئی کمانڈ نہیں ملی۔" }
        };

        const t = translations[langCode] || translations["en"];

        const commandsDir = path.join(__dirname);
        const categories = {};

        try {
            if (fs.existsSync(commandsDir)) {
                const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));
                for (const file of commandFiles) {
                    try {
                        const filePath = path.join(commandsDir, file);
                        delete require.cache[require.resolve(filePath)];
                        const command = require(filePath);
                        if (command && command.name) {
                            const cat = (command.category || "GENERAL").toUpperCase();
                            if (!categories[cat]) categories[cat] = [];
                            categories[cat].push({ name: command.name, description: command.description || "" });
                        }
                    } catch (err) {
                        console.error(`Error loading command file ${file}:`, err);
                    }
                }
            }
        } catch (e) {
            console.error("Error reading commands folder:", e);
        }

        let menuText = 
            `╔════════════════════════════╗\n` +
            `║     ✦ THE SYNDICATE ✦      ║\n` +
            `╠════════════════════════════╣\n` +
            `║ ${t.title.padEnd(26)}║\n` +
            `║ LANG    :: ${langCode.toUpperCase().padEnd(16)}║\n` +
            `║ PREFIX  :: ${prefix.padEnd(16)}║\n` +
            `╚════════════════════════════╝\n\n`;

        const sortedCategories = Object.keys(categories).sort();
        if (sortedCategories.length === 0) {
            menuText += `┃ ${t.notFound}\n`;
        } else {
            for (const cat of sortedCategories) {
                menuText += `┏━━━━━━━〔 ${cat} 〕━━━━━━━┓\n\n`;
                categories[cat].sort((a, b) => a.name.localeCompare(b.name));
                for (const cmd of categories[cat]) {
                    const desc = cmd.description ? `\n┃   └─ ${cmd.description}` : "";
                    menuText += `┃◈ ${prefix}${cmd.name}${desc}\n┃\n`;
                }
                menuText += `┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n\n`;
            }
        }

        let targetChat = msg.key?.remoteJid || sender;
        if (targetChat) {
            await sock.sendMessage(targetChat, { text: menuText.trim() }, { quoted: msg });
        }
    }
};

function pathModuleSetup() {
    return require("path");
}
