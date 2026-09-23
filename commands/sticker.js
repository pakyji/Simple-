const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const { writeFile } = require("fs/promises");
const path = require("path");

module.exports = {
    name: "sticker",
    description: "Convert an image into a WhatsApp sticker",
    async execute(sock, msg, sender, args) {
        try {
            // Check if the message is an image or replying to an image
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const mimeType = msg.message?.imageMessage?.mimetype || quoted?.imageMessage?.mimetype;

            if (!mimeType) {
                await sock.sendMessage(sender, { 
                    text: "❌ Please send an image with caption `.sticker` or reply to an image with `.sticker`!" 
                }, { quoted: msg });
                return;
            }

            await sock.sendMessage(sender, { text: "⏳ Converting image to sticker..." }, { quoted: msg });

            // Target message to download from (either current message or quoted message)
            const targetMessage = quoted ? {
                key: {
                    remoteJid: sender,
                    id: msg.message.extendedTextMessage.contextInfo.stanzaId,
                    participant: msg.message.extendedTextMessage.contextInfo.participant
                },
                message: quoted
            } : msg;

            const buffer = await downloadMediaMessage(
                targetMessage,
                "buffer",
                {},
                { logger: console }
            );

            // Send back as sticker
            await sock.sendMessage(sender, { 
                sticker: buffer 
            }, { quoted: msg });

        } catch (error) {
            console.error("❌ Error creating sticker:", error);
            await sock.sendMessage(sender, { 
                text: "❌ Failed to create sticker. Make sure you replied to a valid image!" 
            }, { quoted: msg });
        }
    }
};
