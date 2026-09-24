module.exports = {
    name: "demote",
    category: "GROUP",
    description: "Demote an admin to a regular member",
    execute: async (sock, msg, sender) => {
        let targetChat = msg.key?.remoteJid || sender;

        if (!targetChat.endsWith("@g.us")) {
            await sock.sendMessage(targetChat, { 
                text: "This command can only be used in groups." 
            }, { quoted: msg });
            return;
        }

        let mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        let quotedParticipant = msg.message?.extendedTextMessage?.contextInfo?.participant;

        let userToDemote = mentionedJid[0] || quotedParticipant;

        if (!userToDemote) {
            await sock.sendMessage(targetChat, { 
                text: "Please mention or reply to the admin you want to demote.\nExample: ,demote @user" 
            }, { quoted: msg });
            return;
        }

        try {
            await sock.groupParticipantsUpdate(targetChat, [userToDemote], "demote");

            let responseText = `---\n` +
                               `*MEMBER DEMOTED*\n` +
                               `User: @${userToDemote.split("@")[0]}\n` +
                               `Role: Member\n` +
                               `---`;

            await sock.sendMessage(targetChat, { 
                text: responseText, 
                mentions: [userToDemote] 
            }, { quoted: msg });
        } catch (error) {
            console.error("Error executing demote command:", error);
            await sock.sendMessage(targetChat, { 
                text: "Failed to demote the member. Make sure the bot has admin privileges." 
            }, { quoted: msg });
        }
    }
};
