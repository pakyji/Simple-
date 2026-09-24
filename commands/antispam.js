const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/antispam.json');

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
    name: "antispam",
    category: "GROUP",
    description: "Toggle anti-spam protection mode",
    execute: async (sock, msg, sender) => {
        let targetChat = msg.key?.remoteJid || sender;

        if (!targetChat.endsWith("@g.us")) {
            await sock.sendMessage(targetChat, { 
                text: "This command can only be used in groups." 
            }, { quoted: msg });
            return;
        }

        let text = msg.message?.conversation || 
                   msg.message?.extendedTextMessage?.text || "";
        let args = text.split(" ").slice(1)[0]?.toLowerCase();

        if (args !== "on" && args !== "off") {
            let db = getDb();
            let currentStatus = db[targetChat] ? "ENABLED" : "DISABLED";
            
            let responseText = `---\n` +
                               `*ANTI-SPAM SECURITY*\n` +
                               `Status: ${currentStatus}\n` +
                               `Usage: ,antispam on / ,antispam off\n` +
                               `---`;

            await sock.sendMessage(targetChat, { text: responseText }, { quoted: msg });
            return;
        }

        try {
            let db = getDb();
            let enable = args === "on";
            
            db[targetChat] = enable;
            saveDb(db);

            let status = enable ? "ENABLED" : "DISABLED";

            let responseText = `---\n` +
                               `*ANTI-SPAM SECURITY*\n` +
                               `Status: ${status}\n` +
                               `---`;

            await sock.sendMessage(targetChat, { text: responseText }, { quoted: msg });
        } catch (error) {
            console.error("Error executing antispam command:", error);
            await sock.sendMessage(targetChat, { 
                text: "Failed to update spam protection settings." 
            }, { quoted: msg });
        }
    }
};
