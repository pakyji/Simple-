const { downloadMediaMessage } = require("@whiskeysockets/baileys");

module.exports = {
    name: "sticker",
    description: "Convert an image into a WhatsApp sticker",
    async execute(sock, msg, sender, args) {
        try {
            const m = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage ? {
                key: {
                    remoteJid: sender,
                    id: msg.message.extendedTextMessage.contextInfo.stanzaId,
                    participant: msg.message.extendedTextMessage.contextInfo.participant
                },
                message: msg.message.extendedTextMessage.contextInfo.quotedMessage
            } : msg;

            const mime = m.message?.imageMessage || m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;

            if (!m.message?.imageMessage && !m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage) {
                await sock.sendMessage(sender, { text: "❌ Please reply to a valid image with 'sticker'!" }, { quoted: msg });
                return;
            }

            await sock.sendMessage(sender, { text: "⏳ Converting image to sticker..." }, { quoted: msg });

            const buffer = await downloadMediaMessage(
                m,
                "buffer",
                {},
                { logger: console }
            );

            await sock.sendMessage(sender, { sticker: buffer }, { quoted: msg });

        } catch (error) {
            console.error("Sticker error:", error);
            await sock.sendMessage(sender, { text: "❌ Failed to create sticker. Make sure you replied to a valid image!" }, { quoted: msg });
        }
    }
};
