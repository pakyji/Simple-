module.exports = {
    name: "hidetag",
    description: "Tag all group members invisibly with a message",
    async execute(sock, msg, sender, args) {
        try {
            if (!msg.key.remoteJid.endsWith("@g.us")) {
                await sock.sendMessage(sender, { text: "❌ This command can only be used in groups!" }, { quoted: msg });
                return;
            }
            const text = args.join(" ") || "Attention everyone!";
            const metadata = await sock.groupMetadata(msg.key.remoteJid);
            const participants = metadata.participants.map(p => p.id);

            await sock.sendMessage(msg.key.remoteJid, { 
                text: `╭━━━〔 📢 *ANNOUNCEMENT* 〕━━━⣣\n┃\n┃  💬 *Message:* ${text}\n┃\n╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`,
                mentions: participants 
            }, { quoted: msg });
        } catch (error) {
            await sock.sendMessage(sender, { text: "❌ Failed to execute hidetag." }, { quoted: msg });
        }
    }
};
