module.exports = {
    name: "spotify",
    category: "TOOLS",
    description: "Search for a song or artist on Spotify",
    execute: async (sock, msg, sender) => {
        let targetChat = msg.key?.remoteJid || sender;
        
        let text = msg.message?.conversation || 
                   msg.message?.extendedTextMessage?.text || "";
        let args = text.split(" ").slice(1).join(" ");

        if (!args) {
            await sock.sendMessage(targetChat, { 
                text: "Please provide a song or artist name!\nExample: ,spotify fading" 
            }, { quoted: msg });
            return;
        }

        try {
            let query = encodeURIComponent(args);
            let spotifyUrl = `https://open.spotify.com/search/${query}`;

            await sock.sendMessage(targetChat, { text: spotifyUrl }, { quoted: msg });
        } catch (error) {
            console.error("Error executing spotify command:", error);
            await sock.sendMessage(targetChat, { text: "An error occurred while executing the search." }, { quoted: msg });
        }
    }
};
