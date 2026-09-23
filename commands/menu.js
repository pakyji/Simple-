const fs = require("fs");
const path = require("path");

module.exports = {
    name: "menu",
    description: "Show this command list",
    async execute(sock, msg, sender, args) {
        const commandFiles = fs.readdirSync(__dirname).filter(file => file.endsWith(".js"));
        
        let menuText = `┌─── 〔 🤖 WHATSAPP BOT MENU 〕 ───\n│\n│  👋 Hello! Here are my commands:\n│\n`;

        // Loop through all command files dynamically
        for (const file of commandFiles) {
            const command = require(`./${file}`);
            if (command.name) {
                const desc = command.description ? `- ${command.description}` : "";
                menuText += `│  ◆ **${command.name}** ${desc}\n`;
            }
        }

        // PERMANENT FOOTER / DISCORD LINK (Always at the very bottom)
        menuText += `│
│  👑 〔 BOT OWNER & COMMUNITY 〕 ───
│  🤖 Bot Developer / join us
│  💬 Discord Server: https://discord.gg/syndicateps
│
└──────────────────────────────`;

        await sock.sendMessage(sender, { text: menuText }, { quoted: msg });
    }
};
