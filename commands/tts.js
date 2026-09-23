const googleTTS = require("google-tts-api");

module.exports = {
    name: "tts",
    description: "Convert text to speech voice note",
    async execute(sock, msg, sender, args) {
        try {
            const text = args.join(" ");
            if (!text) {
                await sock.sendMessage(sender, { 
                    text: "❌ Please provide text for speech! Example: `tts Hello from The Syndicate bot`" 
                }, { quoted: msg });
                return;
            }

            if (text.length > 200) {
                await sock.sendMessage(sender, { 
                    text: "❌ Text is too long! Please keep it under 200 characters." 
                }, { quoted: msg });
                return;
            }

            await sock.sendMessage(sender, { text: "🎙️ Generating voice note..." }, { quoted: msg });

            // Generate audio URL using google-tts-api (default language: English 'en')
            const audioUrl = googleTTS.getAudioUrl(text, {
                lang: 'en',
                slow: false,
                host: 'https://translate.google.com',
            });

            // Send as audio/voice note
            await sock.sendMessage(sender, {
                audio: { url: audioUrl },
                mimetype: 'audio/mp4',
                ptt: true // Sets it as a voice note (push-to-talk style)
            }, { quoted: msg });

        } catch (error) {
            console.error("TTS error:", error);
            await sock.sendMessage(sender, { text: "❌ Failed to generate Text-to-Speech audio." }, { quoted: msg });
        }
    }
};
