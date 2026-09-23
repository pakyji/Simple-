const fs = require("fs");
const path = require("path");

module.exports = {
    name: "Menu",
    description: "Shows this command list",
    execute: async (sock, msg, sender) => {
        let prefix = ",";
        
        const configPath = path.join(__dirname, "../config.json");
        if (fs.existsSync(configPath)) {
            try {
                const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                if (config.bot?.prefix) prefix = config.bot.prefix;
            } catch (e) {
                console.error("Error reading config.json:", e);
            }
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
                        
                        categories[cat].push({
                            name: command.name,
                            description: command.description || ""
                        });
                    }
                } catch (err) {
                    console.error(`Error loading command file ${file}:`, err);
                }
            }
        } catch (e) {
            console.error("Error reading commands folder:", e);
        }

        // Server link ko properly adjust kiya gaya hai taake issue na aaye
        let menuText = 
            `╔════════════════════════════╗\n` +
            `║     ✦ THE SYNDICATE ✦      ║\n` +
            `╠════════════════════════════╣\n` +
            `║ PREFIX  :: ${prefix.padEnd(16)}║\n` +
            `║ VERSION :: 2.5.0           ║\n` +
            `║ SERVER  :: https://        ║\n` +
            `║            discord.gg/     ║\n` +
            `║            syndicateps     ║\n` +
            `╚════════════════════════════╝\n\n`;

        // Sort categories alphabetically
        const sortedCategories = Object.keys(categories).sort();

        for (const cat of sortedCategories) {
            menuText += `┏━━━━━━━〔 ${cat} 〕━━━━━━━┓\n\n`;
            
            // Sort commands inside category
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
