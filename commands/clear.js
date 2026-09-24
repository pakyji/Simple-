module.exports = {
    name: "clear",
    category: "TOOLS",
    description: "Clear or delete messages from the chat",
    execute: async (sock, msg, sender) => {
        let targetChat = msg.key?.remoteJid || sender;
        
        try {
            // Sends a confirmation message that the chat action was triggered
            await sock.sendMessage(targetChat, { text: "✨ Chat cleared successfully!" }, { quoted: msg });
            
            // If you reply to a specific message, it deletes that replied message
            if (msg.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
                const targetKey = {
                    remoteJid: targetChat,
                    id: msg.message.extendedTextMessage.contextInfo.stanzaId,
                    participant: msg.message.extendedTextMessage.contextInfo.participant
                };
                await sock.sendMessage(targetChat, { delete: targetKey });
            }
        } catch (error) {
            console.error("Error executing clear command:", error);
            await sock.sendMessage(targetChat, { text: "❌ An error occurred while running the command." }, { quoted: msg });
        }
    }
};
