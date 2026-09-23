const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const sharp = require("sharp");

module.exports = {
    name: "sticker",
    description: "Convert any image into a WhatsApp sticker",
    async execute(sock, msg, sender, args) {
        try {
            const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const hasDirectImage = msg.message?.imageMessage;
            const hasQuotedImage = quotedMsg?.imageMessage;

            if (!hasDirectImage && !hasQuotedImage) {
                await sock.sendMessage(sender, { 
                    text: "❌ Please send or reply to a valid image with `sticker`!" 
                }, { quoted: msg });
                return;
            }

            await sock.sendMessage(sender, { text: "⏳ Converting image to sticker..." }, { quoted: msg });

            let targetMessage = msg;
            if (hasQuotedImage) {
                const contextInfo = msg.message.extendedTextMessage.contextInfo;
                targetMessage = {
                    key: {
                        remoteJid: sender,
                        id: contextInfo.stanzaId,
                        participant: contextInfo.participant
                    },
                    message: quotedMsg
                };
            }

            const buffer = await downloadMediaMessage(
                targetMessage,
                "buffer",
                {},
                { logger: console }
            );

            // Convert any image format to WebP sticker format using sharp
            const webpBuffer = await sharp(buffer)
                .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
                .webp({ quality: 80 })
                .toBuffer();

            // Send the converted sticker
            await sock.sendMessage(sender, { sticker: webpBuffer }, { quoted: msg });

        } catch (error) {
            console.error("❌ Sticker error:", error);
            await sock.sendMessage(sender, { 
                text: "❌ Failed to create sticker. Make sure 'sharp' is installed (`npm install sharp`) and you replied to a valid image!" 
            }, { quoted: msg });
        }
    }
};
