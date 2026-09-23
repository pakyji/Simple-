const fs = require("fs");
const path = require("path");

module.exports = {
    name: "adduser",
    category: "TOOLS",
    description: "Add a new user to owners/whitelist",
    execute: async (sock, msg, sender, args) => {
        let prefix = ",";
        let owners = [];
        const configPath = path.join(__dirname, "../config.json");

        if (fs.existsSync(configPath)) {
            try {
                const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                if (config.bot?.prefix) prefix = config.bot.prefix;
                let rawOwners = [];
                if (config.bot?.ownerNumber) rawOwners.push(String(config.bot.ownerNumber));
                if (Array.isArray(config.bot?.owners)) rawOwners = rawOwners.concat(config.bot.owners);
                owners = rawOwners.map(o => String(o).replace(/[^0-9]/g, ""));
            } catch (e) {
                console.error("Config read error:", e);
            }
        }

        let senderJid = msg.key?.participant || msg.key?.remoteJid || sender || "";
        const senderNumber = String(senderJid).replace(/[^0-9]/g, "");

        if (owners.length > 0 && !owners.includes(senderNumber)) {
            return await sock.sendMessage(sender, { 
                text: `*ACCESS DENIED / ACCESSO NEGATO:* You are not authorized!` 
            }, { quoted: msg });
        }

        let targetInput = "";
        const mentionedJids = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (mentionedJids && mentionedJids.length > 0) {
            targetInput = mentionedJids[0].replace(/[^0-9]/g, "");
        } else if (args && args[0]) {
            targetInput = args[0].replace(/[^0-9]/g, "");
        }

        if (!targetInput) {
            return await sock.sendMessage(sender, { 
                text: `*✦ THE SYNDICATE ✦*\n\nUsage: ${prefix}adduser <number_or_mention>` 
            }, { quoted: msg });
        }

        if (owners.includes(targetInput)) {
            return await sock.sendMessage(sender, { 
                text: `*NOTICE:* Number ${targetInput} is already whitelisted.` 
            }, { quoted: msg });
        }

        try {
            const configData = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            if (!configData.bot.owners) configData.bot.owners = [];
            
            if (!configData.bot.owners.map(o => String(o).replace(/[^0-9]/g, "")).includes(targetInput)) {
                configData.bot.owners.push(targetInput);
            }

            fs.writeFileSync(configPath, JSON.stringify(configData, null, 2), 'utf8');

            await sock.sendMessage(sender, { 
                text: `*SUCCESS:* Number ${targetInput} added successfully!` 
            }, { quoted: msg });

        } catch (error) {
            console.error("Error updating config.json:", error);
            await sock.sendMessage(sender, { 
                text: `*ERROR:* Failed to save user number.` 
            }, { quoted: msg });
        }
    }
};
