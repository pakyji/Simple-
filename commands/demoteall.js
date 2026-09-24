module.exports = {
    name: "demoteall",
    category: "GROUP",
    description: "Demote all administrators to regular members",
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
            let ownerId = metadata.owner || "";

            let membersToDemote = participants
                .filter(p => p.admin && p.id !== botId && p.id !== ownerId)
                .map(p => p.id);

            if (membersToDemote.length === 0) {
                await sock.sendMessage(targetChat, { 
                    text: "No eligible administrators to demote." 
                }, { quoted: msg });
                return;
            }

            await sock.groupParticipantsUpdate(targetChat, membersToDemote, "demote");

            let responseText = `---\n` +
                               `*MASS DEMOTE EXECUTED*\n` +
                               `Demoted: ${membersToDemote.length} administrators\n` +
                               `---`;

            await sock.sendMessage(targetChat, { text: responseText }, { quoted: msg });
        } catch (error) {
            console.error("Error executing demoteall command:", error);
            await sock.sendMessage(targetChat, { 
                text: "Failed to perform mass demotion. Make sure the bot has full admin privileges." 
            }, { quoted: msg });
        }
    }
};
