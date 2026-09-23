const yts = require("yt-search");
const axios = require("axios");

module.exports = {
    name: "ytmp4",
    description: "Download YouTube video as MP4 video",
    async execute(sock, msg, sender, args) {
        try {
            const query = args.join(" ");
            if (!query) {
                await sock.sendMessage(sender, { 
                    text: "❌ Please provide a YouTube video name or link! Example: `ytmp4 Faded Alan Walker`" 
                }, { quoted: msg });
                return;
            }

            await sock.sendMessage(sender, { text: "🔍 Searching YouTube and downloading video..." }, { quoted: msg });

            // Search for the video using yt-search
            const searchResult = await yts(query);
            const video = searchResult.videos[0];

            if (!video) {
                await sock.sendMessage(sender, { text: "❌ No YouTube video found for your search query." }, { quoted: msg });
                return;
            }

            // Using a reliable public API endpoint to get the video download stream
            const apiEndpoint = `https://api.siputzx.my.id/api/d/ytmp4?url=${encodeURIComponent(video.url)}`;
            const response = await axios.get(apiEndpoint);
            const data = response.data;

            if (!data.status || !data.data?.dl) {
                await sock.sendMessage(sender, { text: "❌ Failed to fetch video stream for this link. Try another video!" }, { quoted: msg });
                return;
            }

            const downloadUrl = data.data.dl;
            const title = video.title;
            const duration = video.timestamp;

            // Send video file
            await sock.sendMessage(sender, {
                video: { url: downloadUrl },
                mimetype: 'video/mp4',
                caption: `🎬 *Title:* ${title}\n⏱️ *Duration:* ${duration}\n💬 *Discord:* https://discord.gg/syndicateps`
            }, { quoted: msg });

        } catch (error) {
            console.error("YTMP4 error:", error);
            await sock.sendMessage(sender, { text: "❌ Failed to download YouTube video." }, { quoted: msg });
        }
    }
};
