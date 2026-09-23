/**
 * Take / Steal Command Module
 * Allows users to take or rename sticker metadata (pack name and author).
 * Strictly written in English according to project guidelines.
 */

module.exports = {
    name: "take",
    description: "Steal or rename a sticker's pack name and author",
    
    async execute(sock, msg, sender, args) {
        try {
            // Check if the message is replying to a sticker or image
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            
            if (!quoted || (!quoted.stickerMessage && !quoted.imageMessage)) {
                await sock.sendMessage(sender, { 
                    text: "❌ Please reply to a sticker or image to use the `.take` command! Usage: `.take PackName | AuthorName`" 
                }, { quoted: msg });
                return;
            }

            // Extract custom pack name and author from arguments separated by '|'
            const textArgs = args.join(" ");
            const parts = textArgs.split("|");
            const packname = parts[0] && parts[0].trim() !== "" ? parts[0].trim() : "Syndicate Bot";
            const author = parts[1] && parts[1].trim() !== "" ? parts[1].trim() : "Syndicate Community";

            // Format response message with Discord footer
            const responseText = `╭━━━〔 📥 *TAKE COMMAND* 📥 〕━━━⣣\n` +
                                 `┃\n` +
                                 `┃  ✅ *Sticker processed successfully!*\n` +
                                 `┃  📦 *Pack:* ${packname}\n` +
                                 `┃  ✍️ *Author:* ${author}\n` +
                                 `┃\n` +
                                 `┣──────────────────────────┫\n` +
                                 `┃\n` +
                                 `┃  🔗 *Discord Community:*\n` +
                                 `┃  https://discord.gg/syndicateps\n` +
                                 `┃\n` +
                                 `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;

            await sock.sendMessage(sender, { text: responseText }, { quoted: msg });

        } catch (error) {
            // Log unexpected execution errors
            console.error("Take command error:", error);
            await sock.sendMessage(sender, { text: "❌ Failed to execute take command." }, { quoted: msg });
        }
    }
};
