module.exports = {
    name: "kickall",
    category: "GROUP",
    description: "Remove all non-admin members from the group",
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
            
            // Filtra solo i membri che non sono admin e che non sono il bot stesso
            let botId = sock.user.id.split(":")[0] + "@s.whatsapp.net";
            let membersToRemove = participants
                .filter(p => !p.admin && p.id !== botId)
                .map(p => p.id);

            if (membersToRemove.length === 0) {
                await sock.sendMessage(targetChat, { 
                    text: "No eligible members to remove." 
                }, { quoted: msg });
                return;
            }

            await sock.groupParticipantsUpdate(targetChat, membersToRemove, "remove");

            let responseText = `---\n` +
                               `*MASS KICK EXECUTED*\n` +
                               `Removed: ${membersToRemove.length} members\n` +
                               `---`;

            await sock.sendMessage(targetChat, { text: responseText }, { quoted: msg });
        } catch (error) {
            console.error("Error executing kickall command:", error);
            await sock.sendMessage(targetChat, { 
                text: "Failed to perform mass removal. Make sure the bot has full admin privileges." 
            }, { quoted: msg });
        }
    }
};
