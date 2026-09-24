const axios = require('axios');

module.exports = {
    name: "media",
    description: "Download media or videos from various platforms",
    async execute(sock, msg, sender, args) {
        if (!args.length) {
            return await sock.sendMessage(sender, { 
                text: "⚠️ Please provide a media link!\nExample: `,media <YouTube/TikTok/Instagram Link>`" 
            }, { quoted: msg });
        }

        const mediaUrl = args[0];

        try {
            await sock.sendMessage(sender, { text: `⏳ Processing your media request...` }, { quoted: msg });
            await sock.sendPresenceUpdate('composing', sender);

            // General Media Downloader API endpoint
            const res = await axios.get(`https://bk9.fun/download/dl?url=${encodeURIComponent(mediaUrl)}`);
            
            const data = res.data?.BK9 || res.data;
            const downloadUrl = data?.dl_url || data?.url || data?.video;

            if (!downloadUrl) {
                return await sock.sendMessage(sender, { text: "❌ Could not retrieve the media download link. Make sure the link is valid." }, { quoted: msg });
            }

            // Send Video/Media File
            await sock.sendMessage(sender, { 
                video: { url: downloadUrl }, 
                mimetype: 'video/mp4',
                caption: `📥 *Downloaded via THE SYNDICATE*` 
            }, { quoted: msg });

        } catch (error) {
            console.error("❌ Error in media command:", error.message || error);
            await sock.sendMessage(sender, { text: "❌ An error occurred while processing your media request." }, { quoted: msg });
        }
    }
};
