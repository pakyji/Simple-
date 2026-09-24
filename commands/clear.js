module.exports = {
    name: "clear",
    category: "TOOLS",
    description: "Clears the chat history",
    async execute(sock, msg, sender) {
        try {
            // Tentativo di eliminare/ripulire la chat utilizzando chatModify di Baileys
            await sock.chatModify(
                { delete: true, lastMessages: [msg] },
                sender
            );
            
            await sock.sendMessage(sender, { text: "✨ Chat cleared successfully!" }, { quoted: msg });
        } catch (error) {
            console.error("❌ Error in clear command:", error.message || error);
            await sock.sendMessage(sender, { text: "❌ Impossibile pulire la chat a causa di restrizioni di Baileys." }, { quoted: msg });
        }
    }
};
