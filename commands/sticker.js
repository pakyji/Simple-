const { downloadMediaMessage } = require("@whiskeysockets/baileys");

module.exports = {
    name: "sticker",
    description: "Convert an image into a WhatsApp sticker",
    async execute(sock, msg, sender, args) {
        try {
            // Check if current message or quoted message contains an image
            const isImage = msg.message?.imageMessage;
            const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const isQuotedImage = quotedMsg?.imageMessage;

            if (!isImage && !isQuotedImage) {
                await sock.sendMessage(sender, { 
                    text: "❌ Please send an image with caption `sticker` or reply to an image with `sticker`!" 
                }, { quoted: msg });
                return;
            }

            await sock.sendMessage(sender, { text: "⏳ Converting image to sticker..." }, { quoted: msg });

            // Prepare the target message object for Baileys media downloader
            let messageToDownload = msg;
            if (isQuotedImage) {
                const contextInfo = msg.message.extendedTextMessage.contextInfo;
                messageToDownload = {
                    key: {
                        remoteJid: sender,
                        id: contextInfo.stanzaId,
                        participant: contextInfo.participant
                    },
                    message: quotedMsg
                };
            }

            const buffer = await downloadMediaMessage(
                messageToDownload,
                "buffer",
                {},
                { logger: console }
            );

            // Send the sticker back
            await sock.sendMessage(sender, { sticker: buffer }, { quoted: msg });

        } catch (error) {
            console.error("❌ Sticker error:", error);
            await sock.sendMessage(sender, { 
                text: "❌ Failed to create sticker. Make sure you replied to a valid image!" 
            }, { quoted: msg });
        }
    }
};
