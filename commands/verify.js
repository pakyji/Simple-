const { approveUser } = require("../utils/auth");

module.exports = {
    name: "verify",
    description: "Verifies and unlocks bot access after joining Discord",
    execute: async (sock, msg, sender) => {
        approveUser(sender);
        await sock.sendMessage(sender, { 
            text: "✅ Access granted! You are now verified and can use all bot commands." 
        }, { quoted: msg });
    }
};
