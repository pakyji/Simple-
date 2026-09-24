const axios = require('axios');

module.exports = {
    name: "media",
    description: "Download YouTube videos using a link",
    async execute(sock, msg, sender, args) {
        if (!args.length) {
            return await sock.sendMessage(sender, { 
                text: "⚠️ Please provide a YouTube link!\nExample: `,media https://youtu.be/xxxxx`" 
            }, { quoted: msg });
        }

        const ytUrl = args[0];

        try {
            await sock.sendMessage(sender, { text: "⏳ Fetching your video, please wait..." }, { quoted: msg });
            await sock.sendPresenceUpdate('composing', sender);

            // Using a reliable public API for YouTube video download
            const response = await axios.get(`https://bk9.fun/download/ytmp4?url=${encodeURIComponent(ytUrl)}`);

            if (response.data && response.data.status && response.data.BK9) {
                const videoData = response.data.BK9;
                const downloadUrl = videoData.dl_url || videoData.url;
                const title = videoData.title || "YouTube Video";

                if (!downloadUrl) {
                    return await sock.sendMessage(sender, { text: "❌ Could not retrieve the download link." }, { quoted: msg });
                }

                // Send the video to chat
                await sock.sendMessage(sender, { 
                    video: { url: downloadUrl }, 
                    caption: `🎥 *Title:* ${title}\n\n_Downloaded via THE SYNDICATE_` 
                }, { quoted: msg });

            } else {
                await sock.sendMessage(sender, { text: "❌ Failed to fetch video details. Make sure the link is correct." }, { quoted: msg });
            }

        } catch (error) {
            console.error("❌ Error in media downloader command:", error);
            await sock.sendMessage(sender, { text: "❌ An error occurred while downloading the media." }, { quoted: msg });
        }
    }
};
