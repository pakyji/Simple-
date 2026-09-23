const fs = require("fs");
const path = require("path");

module.exports = {
    name: "menu",
    description: "Displays the dynamic command menu",
    async execute(sock, msg, sender, args) {
        let prefix = ",";
        let userName = msg.pushName || "User";
        
        const configPath = path.join(__dirname, "../config.json");
        if (fs.existsSync(configPath)) {
            try {
                const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                if (config.bot?.prefix) prefix = config.bot.prefix;
            } catch (e) {
                console.error("Error reading config.json:", e);
            }
        }

        // Automatically read all command files from the commands directory
        const commandsDir = path.join(__dirname);
        let commandListText = "";

        try {
            const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js') && file !== 'menu.js');
            
            for (const file of commandFiles) {
                const command = require(path.join(commandsDir, file));
                if (command.name) {
                    commandListText += `- ${prefix}${command.name}\n`;
                }
            }
        } catch (e) {
            console.error("Error reading commands folder:", e);
            // Fallback if reading fails
            commandListText = `- ${prefix}ai\n- ${prefix}menu\n- ${prefix}ping\n`;
        }

        const menuText = 
            `Syndicate\n` +
            `User: ${userName}\n\n` +
            commandListText + `\n` +
            `https://discord.gg/syndicateps`;

        await sock.sendMessage(sender, { text: menuText }, { quoted: msg });
    }
};                                                          
