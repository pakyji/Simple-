const fs = require("fs");
const path = require("path");

module.exports = {
    name: "menu",
    description: "Displays the simple command menu",
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

        const menuText = 
            `Syndicate\n` +
            `User: ${userName}\n\n` +
            `- ${prefix}ai <query>\n` +
            `- ${prefix}gemini <prompt>\n` +
            `- ${prefix}menu\n` +
            `- ${prefix}ping\n` +
            `- ${prefix}broadcast <msg>\n\n` +
            `https://discord.gg/syndicateps`;

        await sock.sendMessage(sender, { text: menuText }, { quoted: msg });
    }
};
