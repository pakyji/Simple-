const fs = require('fs');
const path = require('path');

module.exports = {
    name: "reload",
    description: "Reloads all commands and shows detailed errors if any",
    async execute(sock, msg, sender, args) {
        const configPath = path.join(__dirname, '../config.json');
        let ownerNumber = "393802347902";
        if (fs.existsSync(configPath)) {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            if (config.bot?.ownerNumber) ownerNumber = config.bot.ownerNumber;
        }

        const ownerJid = ownerNumber + "@s.whatsapp.net";
        if (sender !== ownerJid && !msg.key.fromMe) {
            return await sock.sendMessage(sender, { text: "❌ Only the owner can use the reload command!" }, { quoted: msg });
        }

        try {
            const commandsDir = path.join(__dirname);
            const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith(".js"));

            let loadedCount = 0;
            let errors = [];

            // Clear old commands cache
            global.commands.clear();

            for (const file of commandFiles) {
                const filePath = path.join(commandsDir, file);
                try {
                    // Clear require cache to force re-reading from disk
                    delete require.cache[require.resolve(filePath)];

                    const command = require(filePath);
                    if (command.name) {
                        global.commands.set(command.name.toLowerCase(), command);
                        loadedCount++;
                    }
                } catch (err) {
                    console.error(`❌ Error loading ${file}:`, err.message);
                    errors.push(`*${file}*: ${err.message}`);
                }
            }

            let responseMessage = `✅ Reload completed!\n📂 Active commands: *${loadedCount}*`;
            
            if (errors.length > 0) {
                responseMessage += `\n\n⚠️ *Errors found in files:* \n` + errors.join('\n');
            }

            await sock.sendMessage(sender, { text: responseMessage }, { quoted: msg });

        } catch (error) {
            console.error("❌ Critical error in reload command:", error);
            await sock.sendMessage(sender, { text: `❌ Critical reload failed: ${error.message}` }, { quoted: msg });
        }
    }
};
