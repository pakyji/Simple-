const fs = require('fs');
const path = require('path');

module.exports = {
    name: "checkcommands",
    category: "SYSTEM",
    description: "Verify integrity, syntax, and existence of all command files",
    execute: async (sock, msg, sender) => {
        let targetChat = msg.key?.remoteJid || sender;

        const commandsDir = path.join(__dirname, '../commands');

        try {
            if (!fs.existsSync(commandsDir)) {
                await sock.sendMessage(targetChat, { 
                    text: "Error: commands/ directory does not exist." 
                }, { quoted: msg });
                return;
            }

            let files = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));
            let validCount = 0;
            let errorFiles = [];

            for (let file of files) {
                try {
                    let filePath = path.join(commandsDir, file);
                    delete require.cache[require.resolve(filePath)];
                    let cmd = require(filePath);

                    if (!cmd.name || typeof cmd.execute !== 'function') {
                        errorFiles.push(`${file} (missing name or execute function)`);
                    } else {
                        validCount++;
                    }
                } catch (err) {
                    errorFiles.push(`${file} (${err.message})`);
                }
            }

            let responseText = `---\n` +
                               `*COMMAND SUITE AUDIT*\n` +
                               `Total Files Scanned: ${files.length}\n` +
                               `Valid Commands: ${validCount}\n` +
                               `Errors Found: ${errorFiles.length}\n` +
                               (errorFiles.length > 0 ? `Issues:\n- ${errorFiles.join("\n- ")}\n` : `Status: All systems operational\n`) +
                               `---`;

            await sock.sendMessage(targetChat, { text: responseText }, { quoted: msg });
        } catch (error) {
            console.error("Error executing checkcommands:", error);
            await sock.sendMessage(targetChat, { 
                text: "Failed to complete command suite audit." 
            }, { quoted: msg });
        }
    }
};
