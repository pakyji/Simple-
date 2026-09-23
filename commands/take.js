const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");

module.exports = {
    name: "take",
    description: "Add custom watermark to a sticker",
    async execute(sock, msg, sender, args) {
        try {
            // Check if quoted message is a sticker or current message is a sticker
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const isQuotedSticker = quoted?.stickerMessage;
            const isDirectSticker = msg.message?.stickerMessage;

            if (!isQuotedSticker && !isDirectSticker) {
                await sock.sendMessage(sender, { 
                    text: "❌ Please reply to a sticker or send a sticker with `take PackName | AuthorName`!" 
                }, { quoted: msg });
                return;
            }

            // Target message to download
            const targetMsg = isQuotedSticker 
                ? { key: { remoteJid: sender, id: msg.message.extendedTextMessage.contextInfo.stanzaId }, message: quoted } 
                : msg;

            // Download media buffer
            const buffer = await downloadMediaMessage(
                targetMsg,
                'buffer',
                {},
                { logger: console, reuploadRequest: sock.updateMediaMessage }
            );

            // Parse pack name and author from args separated by '|'
            const fullText = args.join(" ");
            let packName = "The Syndicate";
            let authorName = "Bot Owner";

            if (fullText.includes("|")) {
                const parts = fullText.split("|");
                packName = parts[0].trim() || packName;
                authorName = parts[1].trim() || authorName;
            } else if (fullText) {
                packName = fullText.trim();
            }

            // Create sticker with custom metadata using wa-sticker-formatter
            const sticker = new Sticker(buffer, {
                pack: packName,
                author: authorName,
                type: StickerTypes.FULL,
                categories: ["👑", "🤖"],
                quality: 50
            });

            const stickerBuffer = await sticker.toBuffer();

            await sock.sendMessage(sender, { 
                sticker: stickerBuffer 
            }, { quoted: msg });

        } catch (error) {
            console.error("Take/WM error:", error);
            await sock.sendMessage(sender, { text: "❌ Failed to re-watermark the sticker." }, { quoted: msg });
        }
    }
};
