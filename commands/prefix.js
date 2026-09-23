/**
 * Prefix Command Module
 * Allows users to change the bot's command prefix dynamically.
 */

const fs = require('fs');
const path = require('path');

module.exports = {
    name: "prefix",
    description: "Change the command prefix of the bot",
    
    async execute(sock, msg, sender, args) {
        try {
            const newPrefix = args[0];

            if (!newPrefix) {
                const helpText = `╭━━━〔 ⚙️ *PREFIX MANAGER* ⚙️ 〕━━━⣣\n` +
                                 `┃\n` +
                                 `┃  ❌ *No prefix provided!*\n` +
                                 `┃  💡 *Usage example:*\n` +
                                 `┃  \`.prefix !\` or \`.prefix #\`\n` +
                                 `┃\n` +
                                 `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;
                
                await sock.sendMessage(sender, { text: helpText }, { quoted: msg });
                return;
            }

            // Path to config file where prefix will be saved
            const configPath = path.join(__dirname, '../config.json');
            let config = {};
            
            if (fs.existsSync(configPath)) {
                config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            }

            // Update prefix
            config.prefix = newPrefix;
            fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

            const successText = `╭━━━〔 ✅ *PREFIX UPDATED* ✅ 〕━━━⣣\n` +
                                `┃\n` +
                                `┃  Successfully changed prefix to: *${newPrefix}*\n` +
                                `┃  💡 *Example:* \`${newPrefix}menu\`, \`${newPrefix}fancy\`\n` +
                                `┃\n` +
                                `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;

            await sock.sendMessage(sender, { text: successText }, { quoted: msg });

        } catch (error) {
            console.error("Prefix command error:", error);
            await sock.sendMessage(sender, { text: "❌ Failed to update prefix." }, { quoted: msg });
        }
    }
};
