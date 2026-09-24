module.exports = {
    name: "online",
    category: "TOOLS",
    description: "Check if the bot is active and online",
    execute: async (sock, msg, sender) => {
        let targetChat = msg.key?.remoteJid || sender;
        
        try {
            await sock.sendMessage(targetChat, { 
                text: "✨ **THE SYNDICATE** is currently online and fully operational!" 
            }, { quoted: msg });
        } catch (error) {
            console.error("Error executing online command:", error);
            await sock.sendMessage(targetChat, { text: "❌ An error occurred while checking bot status." }, { quoted: msg });
        }
    }
};
