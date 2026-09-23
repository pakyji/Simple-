const yts = require("yt-search");
const axios = require("axios");

module.exports = {
    name: "ytmp3",
    description: "Download YouTube video as MP3 audio",
    async execute(sock, msg, sender, args) {
        try {
            const query = args.join(" ");
            if (!query) {
                await sock.sendMessage(sender, { 
                    text: "❌ Please provide a YouTube video name or link! Example: `ytmp3 Faded Alan Walker`" 
                }, { quoted: msg });
                return;
            }

            await sock.sendMessage(sender, { text: "🔍 Searching YouTube and preparing audio..." }, { quoted: msg });

            // Search for the video using yt-search
            const searchResult = await yts(query);
            const video = searchResult.videos[0];

            if (!video) {
                await sock.sendMessage(sender, { text: "❌ No YouTube video found for your search query." }, { quoted: msg });
                return;
            }

            // Using a reliable public API endpoint to get the audio download stream
            const apiEndpoint = `https://api.siputzx.my.id/api/d/ytmp3?url=${encodeURIComponent(video.url)}`;
            const response = await axios.get(apiEndpoint);
            const data = response.data;

            if (!data.status || !data.data?.dl) {
                await sock.sendMessage(sender, { text: "❌ Failed to fetch audio stream for this video. Try another song!" }, { quoted: msg });
                return;
            }

            const downloadUrl = data.data.dl;
            const title = video.title;
            const duration = video.timestamp;

            // Send audio file
            await sock.sendMessage(sender, {
                audio: { url: downloadUrl },
                mimetype: 'audio/mpeg',
                fileName: `${title}.mp3`,
                caption: `🎵 *Title:* ${title}\n⏱️ *Duration:* ${duration}`
            }, { quoted: msg });

        } catch (error) {
            console.error("YTMP3 error:", error);
            await sock.sendMessage(sender, { text: "❌ Failed to download YouTube audio." }, { quoted: msg });
        }
    }
};
