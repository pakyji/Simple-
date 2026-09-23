const fs = require("fs");
const path = formatPath(); // helper sicuro per i path

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
                // Prende sia l'owner principale che l'array owners e pulisce ogni numero tenendo solo le cifre
                let rawOwners = [];
                if (config.bot?.ownerNumber) rawOwners.push(String(config.bot.ownerNumber));
                if (Array.isArray(config.bot?.owners)) rawOwners = rawOwners.concat(config.bot.owners);
                
                owners = rawOwners.map(o => String(o).replace(/[^0-9]/g, ""));
            } catch (e) {
                console.error("Error reading config.json:", e);
            }
        }

        // Estrae il numero esatto del mittente gestendo sia chat private che gruppi
        let senderJid = msg.key?.participant || msg.key?.remoteJid || sender || "";
        const senderNumber = String(senderJid).replace(/[^0-9]/g, "");

        // Debug nel terminale per vedere cosa confronta
        console.log("DEBUG CHECK ---> Mittente pulito:", senderNumber);
        console.log("DEBUG CHECK ---> Owner autorizzati:", owners);

        // Controllo se il mittente è tra gli owner autorizzati
        if (owners.length > 0 && !owners.includes(senderNumber)) {
            return await sock.sendMessage(sender, { 
                text: `ACCESS DENIED: Your number (${senderNumber}) is not authorized.` 
            }, { quoted: msg });
        }

        // Gestione dell'input per aggiungere il nuovo utente
        let targetInput = "";
        const mentionedJids = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
        
        if (mentionedJids && mentionedJids.length > 0) {
            targetInput = mentionedJids[0].replace(/[^0-9]/g, "");
        } else if (args && args[0]) {
            targetInput = args[0].replace(/[^0-9]/g, "");
        }

        if (!targetInput) {
            return await sock.sendMessage(sender, { 
                text: `THE SYNDICATE INSTALLER\n\nUsage: ${prefix}adduser <number>\nExample: ${prefix}adduser 923001234567` 
            }, { quoted: msg });
        }

        if (owners.includes(targetInput)) {
            return await sock.sendMessage(sender, { 
                text: `NOTICE: Number ${targetInput} is already whitelisted.` 
            }, { quoted: msg });
        }

        try {
            // Aggiunge il numero all'array e aggiorna il file config.json
            const configData = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, 'utf8')) : { bot: {} };
            if (!configData.bot.owners) configData.bot.owners = [];
            
            if (!configData.bot.owners.map(o => String(o).replace(/[^0-9]/g, "")).includes(targetInput)) {
                configData.bot.owners.push(targetInput);
            }

            fs.writeFileSync(configPath, JSON.stringify(configData, null, 2), 'utf8');

            await sock.sendMessage(sender, { 
                text: `SUCCESS: Number ${targetInput} has been added successfully!` 
            }, { quoted: msg });

        } catch (error) {
            console.error("Error updating config.json:", error);
            await sock.sendMessage(sender, { 
                text: `ERROR: Failed to save the user number.` 
            }, { quoted: msg });
        }
    }
};

function formatPath() {
    return require("path");
}
