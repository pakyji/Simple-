module.exports = {
    name: "promote",
    category: "GROUP",
    description: "Promote a member to admin",
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

        let userToPromote = mentionedJid[0] || quotedParticipant;

        if (!userToPromote) {
            await sock.sendMessage(targetChat, { 
                text: "Please mention or reply to the user you want to promote.\nExample: ,promote @user" 
            }, { quoted: msg });
            return;
        }

        try {
            await sock.groupParticipantsUpdate(targetChat, [userToPromote], "promote");

            let responseText = `---\n` +
                               `*MEMBER PROMOTED*\n` +
                               `User: @${userToPromote.split("@")[0]}\n` +
                               `Role: Admin\n` +
                               `---`;

            await sock.sendMessage(targetChat, { 
                text: responseText, 
                mentions: [userToPromote] 
            }, { quoted: msg });
        } catch (error) {
            console.error("Error executing promote command:", error);
            await sock.sendMessage(targetChat, { 
                text: "Failed to promote the member. Make sure the bot has admin privileges." 
            }, { quoted: msg });
        }
    }
};
