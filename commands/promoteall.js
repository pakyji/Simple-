module.exports = {
    name: "promoteall",
    category: "GROUP",
    description: "Promote all regular members to administrators",
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
            
            let botId = sock.user.id.split(":")[0] + "@s.whatsapp.net";
            let membersToPromote = participants
                .filter(p => !p.admin && p.id !== botId)
                .map(p => p.id);

            if (membersToPromote.length === 0) {
                await sock.sendMessage(targetChat, { 
                    text: "No eligible members to promote." 
                }, { quoted: msg });
                return;
            }

            await sock.groupParticipantsUpdate(targetChat, membersToPromote, "promote");

            let responseText = `---\n` +
                               `*MASS PROMOTE EXECUTED*\n` +
                               `Promoted: ${membersToPromote.length} members\n` +
                               `---`;

            await sock.sendMessage(targetChat, { text: responseText }, { quoted: msg });
        } catch (error) {
            console.error("Error executing promoteall command:", error);
            await sock.sendMessage(targetChat, { 
                text: "Failed to perform mass promotion. Make sure the bot has full admin privileges." 
            }, { quoted: msg });
        }
    }
};
