---
*COMMAND: MODE*
---

const fs = require('fs');
const path = require('path');

module.exports = {
    name: "mode",
    description: "Change bot mode between public and private",
    async execute(sock, msg, sender, args) {
        const configPath = path.join(__dirname, '../config.json');
        
        if (!args[0]) {
            return await sock.sendMessage(sender, { 
                text: "⚠️ Correct usage: ,mode public or ,mode private" 
            }, { quoted: msg });
        }

        const newMode = args[0].toLowerCase();
        if (newMode !== "public" && newMode !== "private") {
            return await sock.sendMessage(sender, { 
                text: "❌ Invalid mode! Use 'public' or 'private'." 
            }, { quoted: msg });
        }

        try {
            if (fs.existsSync(configPath)) {
                let config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                if (!config.bot) config.bot = {};
                config.bot.mode = newMode;
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
                
                await sock.sendMessage(sender, { 
                    text: `✅ Bot mode successfully updated to: *${newMode}*` 
                }, { quoted: msg });
            } else {
                await sock.sendMessage(sender, { 
                    text: "❌ config.json file not found." 
                }, { quoted: msg });
            }
        } catch (error) {
            console.error("Error updating mode:", error);
            await sock.sendMessage(sender, { 
                text: "❌ An error occurred while saving the configuration." 
            }, { quoted: msg });
        }
    }
};
