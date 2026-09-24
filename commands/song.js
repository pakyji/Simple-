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

            // Step 1: Search YouTube for the song URL
            const searchRes = await axios.get(`https://bk9.fun/search/youtube?q=${encodeURIComponent(query)}`);
            
            let ytUrl = "";
            let title = query;
            if (searchRes.data && searchRes.data.status && searchRes.data.BK9 && searchRes.data.BK9.length > 0) {
                ytUrl = searchRes.data.BK9[0].url;
                title = searchRes.data.BK9[0].title;
            }

            if (!ytUrl) {
                return await sock.sendMessage(sender, { text: "❌ Song not found. Try searching with a different name." }, { quoted: msg });
            }

            await sock.sendMessage(sender, { text: `⏳ Downloading audio for *${title}*...` }, { quoted: msg });

            // Step 2: Download the audio (MP3) from the video URL
            const dlRes = await axios.get(`https://bk9.fun/download/ytmp3?url=${encodeURIComponent(ytUrl)}`);

            if (dlRes.data && dlRes.data.status && dlRes.data.BK9) {
                const audioUrl = dlRes.data.BK9.dl_url || dlRes.data.BK9.url;

                if (!audioUrl) {
                    return await sock.sendMessage(sender, { text: "❌ Could not retrieve the audio download link." }, { quoted: msg });
                }

                // Step 3: Send audio file to chat
                await sock.sendMessage(sender, { 
                    audio: { url: audioUrl }, 
                    mimetype: 'audio/mp4',
                    ptt: false, // Set to true if you want it as a Voice Note (VN)
                    caption: `🎶 *Song:* ${title}\n\n_Downloaded via THE SYNDICATE_` 
                }, { quoted: msg });

            } else {
                await sock.sendMessage(sender, { text: "❌ Failed to download the song audio." }, { quoted: msg });
            }

        } catch (error) {
            console.error("❌ Error in song command:", error);
            await sock.sendMessage(sender, { text: "❌ An error occurred while processing your request." }, { quoted: msg });
        }
    }
};
