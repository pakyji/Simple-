module.exports = {
    name: "unlock",
    category: "GROUP",
    description: "Unlock the group so everyone can send messages",
    execute: async (sock, msg, sender) => {
        let targetChat = msg.key?.remoteJid || sender;

        if (!targetChat.endsWith("@g.us")) {
            await sock.sendMessage(targetChat, { 
                text: "This command can only be used in groups." 
            }, { quoted: msg });
            return;
        }

        try {
            await sock.groupSettingUpdate(targetChat, "not_announcement");

            let responseText = `---\n` +
                               `*GROUP UNLOCKED*\n` +
                               `Status: All participants can send messages.\n` +
                               `---`;

            await sock.sendMessage(targetChat, { text: responseText }, { quoted: msg });
        } catch (error) {
            console.error("Error executing unlock command:", error);
            await sock.sendMessage(targetChat, { 
                text: "Failed to unlock the group. Make sure the bot has admin privileges." 
            }, { quoted: msg });
        }
    }
};
