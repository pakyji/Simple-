/**
 * Clear Command Module
 * Deletes a specific message when replied to with .clear
 */

module.exports = {
    name: "clear",
    description: "Delete a specific message by replying to it",
    
    async execute(sock, msg, sender, args) {
        try {
            // Check if user replied to a message to delete it
            const quotedMessage = msg.message?.extendedTextMessage?.contextInfo;
            
            if (quotedMessage && quotedMessage.stanzaId) {
                const messageKey = {
                    remoteJid: sender,
                    id: quotedMessage.stanzaId,
                    participant: quotedMessage.participant
                };

                await sock.sendMessage(sender, { delete: messageKey });
                await sock.sendMessage(sender, { text: "✅ *Message deleted successfully!*" }, { quoted: msg });
                return;
            }

            // Fallback instruction if no message is replied
            const helpText = `╭━━━〔 🧹 *CLEAR COMMAND* 🧹 〕━━━⣣\n` +
                             `┃\n` +
                             `┃  💡 *How to use:*\n` +
                             `┃  • Reply to any specific message with \`.clear\` to delete it.\n` +
                             `┃\n` +
                             `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;

            await sock.sendMessage(sender, { text: helpText }, { quoted: msg });

        } catch (error) {
            console.error("Clear command error:", error);
            await sock.sendMessage(sender, { text: "❌ Failed to delete the message. Make sure the bot has admin rights if deleting others' messages in groups." }, { quoted: msg });
        }
    }
};
