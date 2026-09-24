const axios = require('axios');

module.exports = {
    name: "spotify",
    category: "TOOLS",
    description: "Search and play/download audio from Spotify",
    async execute(sock, msg, sender, args) {
        if (!args.length) {
            return await sock.sendMessage(sender, { 
                text: "⚠️ Please provide a song or artist name!\nExample: `,spotify Bohemia`" 
            }, { quoted: msg });
        }

        const query = args.join(" ");

        try {
            await sock.sendMessage(sender, { text: `🎵 Searching Spotify for *"${query}"*...` }, { quoted: msg });
            await sock.sendPresenceUpdate('composing', sender);

            // API endpoint to search and get download link
            const res = await axios.get(`https://bk9.fun/search/spotify?q=${encodeURIComponent(query)}`);
            console.log("Spotify API Response:", res.data);

            const data = res.data?.BK9 || res.data?.result || res.data;
            const audioUrl = data?.dl_url || data?.url || data?.audio;
            const title = data?.title || query;

            if (!audioUrl) {
                return await sock.sendMessage(sender, { text: "❌ Could not find or download the audio for this track. Try another song." }, { quoted: msg });
            }

            // Send audio file directly
            await sock.sendMessage(sender, { 
                audio: { url: audioUrl }, 
                mimetype: 'audio/mp4',
                ptt: false,
                caption: `🎶 *Playing:* ${title}\n\n_Powered by THE SYNDICATE_` 
            }, { quoted: msg });

        } catch (error) {
            console.error("❌ Error in spotify command:", error.message || error);
            await sock.sendMessage(sender, { text: "❌ An error occurred while processing your Spotify request." }, { quoted: msg });
        }
    }
};
