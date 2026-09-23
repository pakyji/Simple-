/**
 * URL Command Module
 * Uploads replied/sent images to a temporary host and returns the direct public URL.
 * Strictly written in English according to project guidelines.
 */

const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const axios = require('axios');
const FormData = require('form-data');

module.exports = {
    name: "url",
    description: "Convert an image into a public URL (Send or reply to an image with .url)",
    
    async execute(sock, msg, sender, args) {
        try {
            // Check if message is an image or reply to an image
            const quotedMessage = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const isImage = msg.message?.imageMessage || quotedMessage?.imageMessage;

            if (!isImage) {
                const helpText = `╭━━━〔 🔗 *IMAGE URL GENERATOR* 🔗 〕━━━⣣\n` +
                                 `┃\n` +
                                 `┃  ❌ *No image found!*\n` +
                                 `┃  💡 *How to use:*\n` +
                                 `┃  • Send an image with caption \`.url\`\n` +
                                 `┃  • Or reply to any image with \`.url\`\n` +
                                 `┃\n` +
                                 `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;
                
                await sock.sendMessage(sender, { text: helpText }, { quoted: msg });
                return;
            }

            await sock.sendMessage(sender, { text: "⏳ *Uploading image to get public URL...*" }, { quoted: msg });

            // Download media buffer
            const buffer = await downloadMediaMessage(
                msg,
                'buffer',
                {},
                { 
                    logger: console, 
                    reuploadRequest: sock.updateMediaMessage 
                }
            );

            // Prepare form data to upload image to catbox.moe
            const formData = new FormData();
            formData.append('reqtype', 'fileupload');
            formData.append('fileToUpload', buffer, {
                filename: 'image.jpg',
                contentType: 'image/jpeg'
            });

            // Send upload request
            const response = await axios.post('https://catbox.moe/user/api.php', formData, {
                headers: {
                    ...formData.getHeaders()
                }
            });

            const imageUrl = response.data ? response.data.trim() : "";

            if (!imageUrl || !imageUrl.startsWith('http')) {
                throw new Error("Failed to retrieve valid URL from host.");
            }

            // Format final response
            const resultText = `╭━━━〔 🔗 *IMAGE URL* 🔗 〕━━━⣣\n` +
                               `┃\n` +
                               `┃  ✅ *Uploaded successfully!*\n` +
                               `┃\n` +
                               `┃  📥 *Direct URL:*\n` +
                               `┃  \`${imageUrl}\`\n` +
                               `┃\n` +
                               `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;

            await sock.sendMessage(sender, { text: resultText }, { quoted: msg });

        } catch (error) {
            console.error("URL command error:", error);
            await sock.sendMessage(sender, { text: "❌ Failed to upload image and generate URL." }, { quoted: msg });
        }
    }
};
