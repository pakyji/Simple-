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

        // Estrae il numero pulito del mittente dai dati del messaggio (remoteJid o sender)
        let senderJid = msg.key?.participant || msg.key?.remoteJid || sender;
        const senderNumber = String(senderJid).replace(/[^0-9]/g, "");

        // STAMPA DI DEBUG NELLA CONSOLE DEL SERVER PER CONTROLLARE
        console.log("--- DEBUG OWNER CHECK ---");
        printDebug(`Mittente grezzo (sender): ${sender}`);
        printDebug(`Mittente estratto (senderJid): ${senderJid}`);
        printDebug(`Numero pulito del mittente: ${senderNumber}`);
        printDebug(`Lista owner in config.json:`, owners);

        function printDebug(label, data = "") {
            console.log(label, data);
        }

        // Controllo accesso
        if (owners.length > 0 && !owners.includes(senderNumber)) {
            return await sock.sendMessage(sender, { 
                text: `*ACCESS DENIED:* Your number (${senderNumber}) is not recognized as owner!` 
            }, { quoted: msg });
        }

        // Gestione del numero da aggiungere (tramite menzione o argomento diretto)
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
