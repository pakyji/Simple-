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

module.exports = {
    name: "warnings",
    category: "GROUP",
    description: "Check user warning count",
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
        
        let targetUser = mentionedJid[0] || quotedParticipant || sender;

        try {
            let db = getDb();
            let groupWarnings = db[targetChat] || {};
            let count = groupWarnings[targetUser] || 0;

            let responseText = `---\n` +
                               `*WARNING STATUS*\n` +
                               `User: @${targetUser.split("@")[0]}\n` +
                               `Warnings: ${count}/3\n` +
                               `---`;

            await sock.sendMessage(targetChat, { 
                text: responseText, 
                mentions: [targetUser] 
            }, { quoted: msg });
        } catch (error) {
            console.error("Error executing warnings command:", error);
            await sock.sendMessage(targetChat, { 
                text: "Failed to retrieve warning count." 
            }, { quoted: msg });
        }
    }
};
