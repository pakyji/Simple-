const fs = require("fs");
const path = require("path");

module.exports = {
    name: "adduser",
    category: "TOOLS",
    description: "Add a new user number to the owner/whitelist (Owner Only)",
    execute: async (sock, msg, sender, args) => {
        let prefix = ",";
        let owners = [];
        const configPath = path.join(__dirname, "../config.json");

        if (fs.existsSync(configPath)) {
            try {
                const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                if (config.bot?.prefix) prefix = config.bot.prefix;
                if (config.bot?.owners) owners = config.bot.owners.map(o => String(o).replace(/[^0-9]/g, ""));
            } catch (e) {
                console.error("Error reading config.json:", e);
            }
        }

        // Pulizia corretta del numero del mittente per il confronto
        const senderNumber = sender.replace(/[^0-9]/g, "");
        
        if (owners.length > 0 && !owners.includes(senderNumber)) {
            return await sock.sendMessage(sender, { 
                text: `*ACCESS DENIED:* Only the bot owner can use this command!` 
            }, { quoted: msg });
        }

        // Controlla se è stata fatta una menzione oppure è stato scritto un numero neiargs
        let targetInput = "";
        const mentionedJids = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (mentionedJids && mentionedJids.length > 0) {
            targetInput = mentionedJids[0].replace(/[^0-9]/g, "");
        } else if (args && args[0]) {
            targetInput = args[0].replace(/[^0-9]/g, "");
        }

        if (!targetInput) {
            return await sock.sendMessage(sender, { 
                text: `*✦ THE SYNDICATE ✦*\n\nUsage: ${prefix}adduser <number_or_mention>\nExample: ${prefix}adduser 923001234567` 
            }, { quoted: msg });
        }

        if (owners.includes(targetInput)) {
            return await sock.sendMessage(sender, { 
                text: `*NOTICE:* Number *${targetInput}* is already in the whitelist!` 
            }, { quoted: msg });
        }

        try {
            owners.push(targetInput);

            const configData = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, 'utf8')) : { bot: {} };
            if (!configData.bot) configData.bot = {};
            configData.bot.owners = owners;

            fs.writeFileSync(configPath, JSON.stringify(configData, null, 2), 'utf8');

            await sock.sendMessage(sender, { 
                text: `*SUCCESS:* Number *${targetInput}* has been added to the whitelist successfully!` 
            }, { quoted: msg });

        } catch (error) {
            console.error("Error updating config.json:", error);
            await sock.sendMessage(sender, { 
                text: `*ERROR:* Failed to save the user number to config.` 
            }, { quoted: msg });
        }
    }
};
