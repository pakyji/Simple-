const { downloadMediaMessage } = require("@whiskeysockets/baileys");

module.exports = {
    name: "sticker",
    description: "Converts an image into a WhatsApp sticker",
    execute: async (sock, msg, sender) => {
        try {
            // Check karein ki message mein image hai ya quoted message mein image hai
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const isImage = msg.message?.imageMessage || quoted?.imageMessage;

            if (!isImage) {
                await sock.sendMessage(sender, { text: "⚠️ Please send or reply to an image with the caption *sticker* to convert it!" }, { quoted: msg });
                return;
            }

            await sock.sendMessage(sender, { text: "⏳ Converting image to sticker..." }, { quoted: msg });

            // Image media ko download karein
            const buffer = await downloadMediaMessage(
                msg,
                "buffer",
                {},
                { logger: console }
            );

            // Sticker bhej dein
            await sock.sendMessage(sender, { sticker: buffer }, { quoted: msg });

        } catch (error) {
            console.error("Sticker command error:", error);
            await sock.sendMessage(sender, { text: "❌ Failed to create sticker. Make sure you replied to a valid image!" }, { quoted: msg });
        }
    }
};                                                                                                                        
