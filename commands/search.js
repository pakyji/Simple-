module.exports = {
    name: "search",
    category: "TOOLS",
    description: "Performs a quick web search",
    execute: async (sock, msg, sender) => {
        let targetChat = msg.key?.remoteJid || sender;
        
        let text = msg.message?.conversation || 
                   msg.message?.extendedTextMessage?.text || "";
        let args = text.split(" ").slice(1).join(" ");

        if (!args) {
            await sock.sendMessage(targetChat, { 
                text: "Please provide a search query!\nExample: ,search nodejs" 
            }, { quoted: msg });
            return;
        }

        try {
            let query = encodeURIComponent(args);
            let searchUrl = `https://www.google.com/search?q=${query}`;

            await sock.sendMessage(targetChat, { text: searchUrl }, { quoted: msg });
        } catch (error) {
            console.error("Error executing search command:", error);
            await sock.sendMessage(targetChat, { text: "An error occurred while executing the search." }, { quoted: msg });
        }
    }
};
