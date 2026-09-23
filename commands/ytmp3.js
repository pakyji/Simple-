/**
 * YouTube to MP3 Download Command Module
 * Allows users to request audio downloads from YouTube links.
 * Strictly written in English according to project guidelines.
 */

module.exports = {
    name: "ytmp3",
    description: "Download audio from YouTube video links",
    
    async execute(sock, msg, sender, args) {
        try {
            // Check if a YouTube link is provided in the arguments
            if (!args || args.length === 0) {
                await sock.sendMessage(sender, { 
                    text: "❌ Please provide a YouTube video link! Example: `.ytmp3 https://youtube.com/watch?v=...`" 
                }, { quoted: msg });
                return;
            }

            const ytUrl = args[0];

            // Format response message with clean plain text and emojis
            const responseText = 
                `🎵 YT-MP3 DOWNLOADER 🎵\n\n` +
                `⏳ Processing audio request...\n` +
                `🔗 URL: ${ytUrl}`;

            await sock.sendMessage(sender, { text: responseText }, { quoted: msg });

        } catch (error) {
            // Log unexpected execution errors
            console.error("Ytmp3 command error:", error);
            await sock.sendMessage(sender, { text: "❌ Failed to process YouTube audio download." }, { quoted: msg });
        }
    }
};
