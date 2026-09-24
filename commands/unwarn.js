const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/warnings.json');

// Ensure database file exists
if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    fs.writeFileSync(dbPath, JSON.stringify({}));
}

function getDb() {
    try {
        return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    } catch (e) {
        return {};
    }
}

function saveDb(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

module.exports = {
    name: "unwarn",
    category: "GROUP",
    description: "Remove a warning from a group member",
    execute: async (sock, msg, sender) => {
        let targetChat = msg.key?.remoteJid || sender;

        if (!targetChat.endsWith("@g.us")) {
            await sock.sendMessage(targetChat, { 
                text: "This command can only be used in groups." 
            }, { quoted: msg });
            return;
        }

        let mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        let quotedParticipant = msg.message?.extendedTextMessage?.contextInfo?.participant;
        
        let targetUser = mentionedJid[0] || quotedParticipant;

        if (!targetUser) {
            await sock.sendMessage(targetChat, { 
                text: "Please tag or reply to the user whose warning you want to remove." 
            }, { quoted: msg });
            return;
        }

        try {
            let db = getDb();
            if (!db[targetChat]) {
                db[targetChat] = {};
            }

            let currentWarnings = db[targetChat][targetUser] || 0;

            if (currentWarnings <= 0) {
                await sock.sendMessage(targetChat, { 
                    text: "This user has no active warnings to remove." 
                }, { quoted: msg });
                return;
            }

            currentWarnings -= 1;
            db[targetChat][targetUser] = currentWarnings;
            saveDb(db);

            let responseText = `---\n` +
                               `*WARNING REMOVED*\n` +
                               `User: @${targetUser.split("@")[0]}\n` +
                               `Warnings: ${currentWarnings}/3\n` +
                               `---`;

            await sock.sendMessage(targetChat, { 
                text: responseText, 
                mentions: [targetUser] 
            }, { quoted: msg });
        } catch (error) {
            console.error("Error executing unwarn command:", error);
            await sock.sendMessage(targetChat, { 
                text: "Failed to remove warning." 
            }, { quoted: msg });
        }
    }
};
