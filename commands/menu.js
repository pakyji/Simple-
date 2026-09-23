const fs = require("fs");
const path = require("path");

module.exports = {
    name: "Menu",
    description: "Displays the dynamic command menu",
    async execute(sock, msg, sender, args) {
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

        // Automatically read all command files and group them by category
        const commandsDir = path.join(__dirname);
        const categories = {};

        try {
            const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js') && file.toLowerCase() !== 'menu.js');
            
            for (const file of commandFiles) {
                try {
                    const command = require(path.join(commandsDir, file));
                    if (command.name) {
                        const category = command.category || "General";
                        if (!categories[category]) {
                            categories[category] = [];
                        }
                        categories[category].push(`* ${command.name} - ${command.description || "No description"}`);
                    }
                } catch (err) {
                    console.error(`Error loading command file ${file}:`, err);
                }
            }
        } catch (e) {
            console.error("Error reading commands folder:", e);
        }

        // Build categorized commands text
        let categorizedText = "";
        for (const [catName, cmds] of Object.entries(categories)) {
            categorizedText += `[ ${catName.toUpperCase()} ]\n`;
            categorizedText += cmds.join("\n") + "\n\n";
        }

        // Fallback if no commands found
        if (!categorizedText) {
            categorizedText = `[ AVAILABLE COMMANDS ]\n* Menu - Shows this command list\n* tagall - Mentions all members in the group\n\n`;
        }

        const menuText = 
            `COMMAND LIST\n\n` +
            `[ The Syndicate ]\n` +
            `- Prefix: ${prefix}\n` +
            `- Menu: \n` +
            `- Version: 2.5.0\n` +
            `- Server Link: https://discord.gg/syndicateps\n\n\n\n` +
            categorizedText +
            `Use the prefix followed by the command name.`;

        await sock.sendMessage(sender, { text: menuText }, { quoted: msg });
    }
};
