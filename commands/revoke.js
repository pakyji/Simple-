module.exports = {
    name: "revoke",
    category: "GROUP",
    description: "Revoke and reset the group invite link",
    execute: async (sock, msg, sender) => {
        let targetChat = msg.key?.remoteJid || sender;

        if (!targetChat.endsWith("@g.us")) {
            await sock.sendMessage(targetChat, { 
                text: "This command can only be used in groups." 
            }, { quoted: msg });
            return;
        }

        try {
            let newCode = await sock.groupRevokeInvite(targetChat);
            let newInviteUrl = `https://chat.whatsapp.com/${newCode}`;

            let responseText = `---\n` +
                               `*GROUP LINK REVOKED*\n` +
                               `New Link: ${newInviteUrl}\n` +
                               `---`;

            await sock.sendMessage(targetChat, { text: responseText }, { quoted: msg });
        } catch (error) {
            console.error("Error executing revoke command:", error);
            await sock.sendMessage(targetChat, { 
                text: "Failed to revoke the invite link. Make sure the bot has admin privileges." 
            }, { quoted: msg });
        }
    }
};
