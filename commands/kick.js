module.exports = {
    name: "kick",
    category: "GROUP",
    description: "Remove a member from the group",
    execute: async (sock, msg, sender) => {
        let targetChat = msg.key?.remoteJid || sender;

        if (!targetChat.endsWith("@g.us")) {
            await sock.sendMessage(targetChat, { 
                text: "This command can only be used in groups." 
            }, { quoted: msg });
            return;
        }

        // Estrae l'utente da menzionare o da citare
        let text = msg.message?.conversation || 
                   msg.message?.extendedTextMessage?.text || "";
        let mentionedJid = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        let quotedParticipant = msg.message?.extendedTextMessage?.contextInfo?.participant;

        let userToKick = mentionedJid[0] || quotedParticipant;

        if (!userToKick) {
            await sock.sendMessage(targetChat, { 
                text: "Please mention or reply to the user you want to remove.\nExample: ,kick @user" 
            }, { quoted: msg });
            return;
        }

        try {
            await sock.groupParticipantsUpdate(targetChat, [userToKick], "remove");

            let responseText = `---\n` +
                               `*MEMBER REMOVED*\n` +
                               `User: @${userToKick.split("@")[0]}\n` +
                               `---`;

            await sock.sendMessage(targetChat, { 
                text: responseText, 
                mentions: [userToKick] 
            }, { quoted: msg });
        } catch (error) {
            console.error("Error executing kick command:", error);
            await sock.sendMessage(targetChat, { 
                text: "Failed to remove the member. Make sure the bot is an admin and the target is not." 
            }, { quoted: msg });
        }
    }
};
