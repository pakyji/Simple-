const axios = require("axios");

module.exports = {
    name: "translate",
    description: "Translate text to any language",
    async execute(sock, msg, sender, args) {
        try {
            // Usage: .translate es | Hello world  OR reply to a message with .translate es
            let targetLang = args[0];
            let textToTranslate = "";

            const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const quotedText = quoted?.conversation || quoted?.extendedTextMessage?.text;

            if (targetLang && targetLang.length === 2 && args[1] === "|") {
                // Format: translate es | Hello
                targetLang = args[0];
                textToTranslate = args.slice(2).join(" ");
            } else if (targetLang && targetLang.length === 2 && !quotedText) {
                // Format: translate es Hello
                targetLang = args[0];
                textToTranslate = args.slice(1).join(" ");
            } else if (targetLang && targetLang.length === 2 && quotedText) {
                // Format: reply to message with "translate es"
                textToTranslate = quotedText;
            } else {
                // Default target language to English ('en') if not specified, or show usage
                await sock.sendMessage(sender, { 
                    text: "❌ Invalid format! Usage: `translate <lang_code> | <text>`\nExample: `translate es | Hello how are you` (or reply to a message with `translate es`)" 
                }, { quoted: msg });
                return;
            }

            if (!textToTranslate) {
                await sock.sendMessage(sender, { text: "❌ Please provide text to translate!" }, { quoted: msg });
                return;
            }

            // Using Google Translate free API endpoint
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(textToTranslate)}`;
            const response = await axios.get(url);
            
            const translatedText = response.data[0].map(item => item[0]).join("");

            const responseText = `╭━━━〔 🌐 *TRANSLATION* 🌐 〕━━━⣣\n` +
                                 `┃\n` +
                                 `┃  🔤 *Target Lang:* ${targetLang.toUpperCase()}\n` +
                                 `┃  📝 *Original:* ${textToTranslate}\n` +
                                 `┃  ✨ *Translated:* ${translatedText}\n` +
                                 `┃\n` +
                                 `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;

            await sock.sendMessage(sender, { text: responseText }, { quoted: msg });

        } catch (error) {
            console.error("Translate error:", error);
            await sock.sendMessage(sender, { text: "❌ Failed to translate text. Check language code (e.g., 'es', 'fr', 'ur', 'it')." }, { quoted: msg });
        }
    }
};
