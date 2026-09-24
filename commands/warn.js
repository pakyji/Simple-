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
    name: "warn",
    category: "GROUP",
    description: "Issue a warning to a group member",
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
                text: "Please tag or reply to the user you want to warn." 
            }, { quoted: msg });
            return;
        }

        try {
            let db = getDb();
            if (!db[targetChat]) {
                db[targetChat] = {};
            }

            let currentWarnings = db[targetChat][targetUser] || 0;
            currentWarnings += 1;
            db[targetChat][targetUser] = currentWarnings;
            saveDb(db);

            let maxWarnings = 3;

            if (currentWarnings >= maxWarnings) {
                // Reset warnings and remove user
                db[targetChat][targetUser] = 0;
                saveDb(db);

                await sock.groupParticipantsUpdate(targetChat, [targetUser], "remove");

                let responseText = `---\n` +
                                   `*MEMBER REMOVED*\n` +
                                   `User: @${targetUser.split("@")[0]}\n` +
                                   `Reason: Reached maximum warning limit (${maxWarnings})\n` +
                                   `---`;

                await sock.sendMessage(targetChat, { 
                    text: responseText, 
                    mentions: [targetUser] 
                }, { quoted: msg });
            } else {
                let responseText = `---\n` +
                                   `*WARNING ISSUED*\n` +
                                   `User: @${targetUser.split("@")[0]}\n` +
                                   `Warnings: ${currentWarnings}/${maxWarnings}\n` +
                                   `---`;

                await sock.sendMessage(targetChat, { 
                    text: responseText, 
                    mentions: [targetUser] 
                }, { quoted: msg });
            }
        } catch (error) {
            console.error("Error executing warn command:", error);
            await sock.sendMessage(targetChat, { 
                text: "Failed to issue warning. Make sure the bot has admin privileges." 
            }, { quoted: msg });
        }
    }
};
