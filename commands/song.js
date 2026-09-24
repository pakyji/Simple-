const axios = require('axios');

module.exports = {
    name: "song",
    description: "Search and download audio by song name",
    async execute(sock, msg, sender, args) {
        if (!args.length) {
            return await sock.sendMessage(sender, { 
                text: "⚠️ Please provide a song name!\nExample: `,song Believer`" 
            }, { quoted: msg });
        }

        const query = args.join(" ");

        try {
            await sock.sendMessage(sender, { text: `🎵 Searching for *"${query}"*...` }, { quoted: msg });
            await sock.sendPresenceUpdate('composing', sender);

            // YouTube Search API
            const searchRes = await axios.get(`https://bk9.fun/search/youtube?q=${encodeURIComponent(query)}`);
            
            let ytUrl = "";
            let title = query;

            const results = searchRes.data?.BK9 || searchRes.data?.results || searchRes.data;
            if (Array.isArray(results) && results.length > 0) {
                ytUrl = results[0].url || results[0].link;
                title = results[0].title || query;
            } else if (results && results.url) {
                ytUrl = results.url;
                title = results.title || query;
            }

            if (!ytUrl) {
                return await sock.sendMessage(sender, { text: "❌ Song not found. Try searching with a different name." }, { quoted: msg });
            }

            await sock.sendMessage(sender, { text: `⏳ Downloading audio for *${title}*...` }, { quoted: msg });
            await sock.sendPresenceUpdate('composing', sender);

            // YouTube MP3 Download API
            const dlRes = await axios.get(`https://bk9.fun/download/ytmp3?url=${encodeURIComponent(ytUrl)}`);
            
            const dlData = dlRes.data?.BK9 || dlRes.data;
            const audioUrl = dlData?.dl_url || dlData?.url || dlData?.audio;

            if (!audioUrl) {
                return await sock.sendMessage(sender, { text: "❌ Could not retrieve the audio download link." }, { quoted: msg });
            }

            // Send Audio File
            await sock.sendMessage(sender, { 
                audio: { url: audioUrl }, 
                mimetype: 'audio/mp4',
                ptt: false,
                caption: `🎶 *Song:* ${title}\n\n_Powered by THE SYNDICATE_` 
            }, { quoted: msg });

        } catch (error) {
            console.error("❌ Error in song command:", error.message || error);
            await sock.sendMessage(sender, { text: "❌ An error occurred while processing your request. Please try again later." }, { quoted: msg });
        }
    }
};
