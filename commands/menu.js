const fs = require("fs");
const path = require("path");

module.exports = {
    name: "menu",
    description: "Show this command list",
    async execute(sock, msg, sender, args) {
        const commandFiles = fs.readdirSync(__dirname).filter(file => file.endsWith(".js"));
        
        let menuText = `╭━━━〔 ⚡ *THE SYNDICATE* ⚡ 〕━━━⬣\n`;
        menuText += `┃\n`;
        menuText += `┃  👋 *Hello! Command Center:*\n`;
        menuText += `┃\n`;

        // Dynamic command loader loop
        for (const file of commandFiles) {
            const command = require(`./${file}`);
            if (command.name) {
                const desc = command.description ? `\n     ↳ ${command.description}` : "";
                menuText += `┃  📌 *${command.name}*${desc}\n`;
            }
        }

        menuText += `┃\n`;
        menuText += `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⬡\n\n`;
        
        // Permanent Community Footer
        menuText += `👑 *BOT OWNER & COMMUNITY*\n`;
        menuText += `🤖 *Bot Developer / Join Us*\n`;
        menuText += `💬 *Discord:* https://discord.gg/syndicateps`;

        await sock.sendMessage(sender, { text: menuText }, { quoted: msg });
    }
};
