module.exports = {
    name: "lock",
    category: "GROUP",
    description: "Lock the group so only admins can send messages",
    execute: async (sock, msg, sender) => {
        let targetChat = msg.key?.remoteJid || sender;

        if (!targetChat.endsWith("@g.us")) {
            await sock.sendMessage(targetChat, { 
                text: "This command can only be used in groups." 
            }, { quoted: msg });
            return;
        }

        try {
            await sock.groupSettingUpdate(targetChat, "announcement");

            let responseText = `---\n` +
                               `*GROUP LOCKED*\n` +
                               `Status: Only admins can send messages.\n` +
                               `---`;

            await sock.sendMessage(targetChat, { text: responseText }, { quoted: msg });
        } catch (error) {
            console.error("Error executing lock command:", error);
            await sock.sendMessage(targetChat, { 
                text: "Failed to lock the group. Make sure the bot has admin privileges." 
            }, { quoted: msg });
        }
    }
};
