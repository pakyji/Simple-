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

        // Automatically read all command files from the directory
        const commandsDir = path.join(__dirname);
        let commandListText = "";

        try {
            const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js') && file.toLowerCase() !== 'menu.js');
            
            for (const file of commandFiles) {
                try {
                    const command = require(path.join(commandsDir, file));
                    if (command.name) {
                        commandListText += `* ${command.name}\n`;
                    }
                } catch (err) {
                    console.error(`Error loading command file ${file}:`, err);
                }
            }
        } catch (e) {
            console.error("Error reading commands folder:", e);
            commandListText = `* Menu\n* tagall\n`;
        }

        const menuText = 
            `COMMAND LIST\n\n` +
            `[ The Syndicate ]\n` +
            `- Prefix: ${prefix}\n` +
            `- Menu: \n` +
            `- Version: 2.5.0\n` +
            `- Server Link: https://discord.gg/syndicateps\n\n\n\n` +
            `[ AVAILABLE COMMANDS ]\n` +
            commandListText + `\n` +
            `Use the prefix followed by the command name.`;

        await sock.sendMessage(sender, { text: menuText }, { quoted: msg });
    }
};
