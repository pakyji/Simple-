module.exports = {
    name: "leave",
    category: "GROUP",
    description: "Make the bot leave the group",
    execute: async (sock, msg, sender) => {
        let targetChat = msg.key?.remoteJid || sender;

        if (!targetChat.endsWith("@g.us")) {
            await sock.sendMessage(targetChat, { 
                text: "This command can only be used in groups." 
            }, { quoted: msg });
            return;
        }

        try {
            let responseText = `---\n` +
                               `*LEAVING GROUP*\n` +
                               `Goodbye.\n` +
                               `---`;

            await sock.sendMessage(targetChat, { text: responseText }, { quoted: msg });
            await sock.groupLeave(targetChat);
        } catch (error) {
            console.error("Error executing leave command:", error);
            await sock.sendMessage(targetChat, { 
                text: "Failed to leave the group." 
            }, { quoted: msg });
        }
    }
};
