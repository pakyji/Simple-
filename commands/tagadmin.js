module.exports = {
    name: "tagadmins",
    category: "GROUP",
    description: "Mention all group administrators",
    execute: async (sock, msg, sender) => {
        let targetChat = msg.key?.remoteJid || sender;

        if (!targetChat.endsWith("@g.us")) {
            await sock.sendMessage(targetChat, { 
                text: "This command can only be used in groups." 
            }, { quoted: msg });
            return;
        }

        try {
            let metadata = await sock.groupMetadata(targetChat);
            let participants = metadata.participants;
            
            let admins = participants.filter(p => p.admin);
            let mentions = admins.map(admin => admin.id);

            let text = msg.message?.conversation || 
                       msg.message?.extendedTextMessage?.text || "";
            let customMessage = text.split(" ").slice(1).join(" ") || "Attention required from all administrators.";

            let responseText = `---\n` +
                               `*ADMIN ALERT*\n` +
                               `${customMessage}\n` +
                               `---`;

            await sock.sendMessage(targetChat, { 
                text: responseText, 
                mentions: mentions 
            }, { quoted: msg });
        } catch (error) {
            console.error("Error executing tagadmins command:", error);
            await sock.sendMessage(targetChat, { 
                text: "Failed to tag administrators." 
            }, { quoted: msg });
        }
    }
};
