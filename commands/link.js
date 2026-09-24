module.exports = {
    name: "link",
    category: "GROUP",
    description: "Get the invite link of the current group",
    execute: async (sock, msg, sender) => {
        let targetChat = msg.key?.remoteJid || sender;

        // Controlla se il comando viene eseguito all'interno di un gruppo
        if (!targetChat.endsWith("@g.us")) {
            await sock.sendMessage(targetChat, { 
                text: "This command can only be used in groups." 
            }, { quoted: msg });
            return;
        }

        try {
            // Ottiene il codice d'invito del gruppo
            let inviteCode = await sock.groupInviteCode(targetChat);
            let inviteUrl = `https://chat.whatsapp.com/${inviteCode}`;

            let responseText = `---\n` +
                               `*GROUP INVITE LINK*\n` +
                               `Link: ${inviteUrl}\n` +
                               `---`;

            await sock.sendMessage(targetChat, { text: responseText }, { quoted: msg });
        } catch (error) {
            console.error("Error executing link command:", error);
            await sock.sendMessage(targetChat, { 
                text: "Failed to get the group link. Make sure the bot has administrator privileges." 
            }, { quoted: msg });
        }
    }
};
