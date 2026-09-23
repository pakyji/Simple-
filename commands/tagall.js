module.exports = {
    name: "tagall",
    description: "Mention all members in the group",
    async execute(sock, msg, sender, args) {
        try {
            // Check if the command is being used in a group chat
            if (!sender.endsWith("@g.us")) {
                await sock.sendMessage(sender, { 
                    text: "❌ This command can only be used inside groups!" 
                }, { quoted: msg });
                return;
            }

            // Fetch group metadata to get participants
            const groupMetadata = await sock.groupMetadata(sender);
            const participants = groupMetadata.participants;

            if (!participants || participants.length === 0) {
                await sock.sendMessage(sender, { text: "❌ Could not retrieve group members." }, { quoted: msg });
                return;
            }

            const customMessage = args.join(" ") || "Attention everyone!";
            let text = `╭━━━〔 📢 *TAG ALL* 📢 〕━━━⣣\n`;
            text += `┃\n`;
            text += `┃  💬 *Message:* ${customMessage}\n`;
            text += `┃  👥 *Total Members:* ${participants.length}\n`;
            text += `┃\n`;
            text += `┣──────────────────────────┫\n`;

            const mentions = [];
            for (const mem of participants) {
                text += `┃  • @${mem.id.split("@")[0]}\n`;
                mentions.push(mem.id);
            }

            text += `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;

            // Send message with mentions enabled
            await sock.sendMessage(sender, { 
                text: text, 
                mentions: mentions 
            }, { quoted: msg });

        } catch (error) {
            console.error("Tagall error:", error);
            await sock.sendMessage(sender, { text: "❌ Failed to tag group members. Make sure the bot is an admin if required!" }, { quoted: msg });
        }
    }
};
