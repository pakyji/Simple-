module.exports = {
    name: "kick",
    description: "Removes a tagged or replied user from the group",
    execute: async function(sock, msg, sender, args) {
        if (!sender.endsWith("@g.us")) {
            await sock.sendMessage(sender, { text: "❌ This command can only be used inside groups!" }, { quoted: msg });
            return;
        }

        try {
            const groupMetadata = await sock.groupMetadata(sender);
            const participants = groupMetadata.participants;

            const botJid = sock.user.id.split(":")[0] + "@s.whatsapp.net";
            let botParticipant = null;
            let senderParticipant = null;

            for (let i = 0; i < participants.length; i++) {
                if (participants[i].id === botJid) botParticipant = participants[i];
                if (participants[i].id === msg.key.participant || participants[i].id === sender) senderParticipant = participants[i];
            }

            if (!botParticipant || (botParticipant.admin !== "admin" && botParticipant.admin !== "superadmin")) {
                await sock.sendMessage(sender, { text: "❌ Please make the bot an admin first to use the kick command!" }, { quoted: msg });
                return;
            }

            if (!senderParticipant || !senderParticipant.admin) {
                await sock.sendMessage(sender, { text: "❌ Only group admins can use the kick command!" }, { quoted: msg });
                return;
            }

            let targetJid = null;
            const extMsg = msg.message && msg.message.extendedTextMessage;
            const contextInfo = extMsg && extMsg.contextInfo;

            if (contextInfo && contextInfo.mentionedJid && contextInfo.mentionedJid.length > 0) {
                targetJid = contextInfo.mentionedJid[0];
            } else if (contextInfo && contextInfo.participant) {
                targetJid = contextInfo.participant;
            }

            if (!targetJid) {
                await sock.sendMessage(sender, { text: "ℹ️ Please tag a user or reply to their message to kick them." }, { quoted: msg });
                return;
            }

            let targetParticipant = null;
            for (let i = 0; i < participants.length; i++) {
                if (participants[i].id === targetJid) {
                    targetParticipant = participants[i];
                    break;
                }
            }

            if (targetJid === botJid) {
                await sock.sendMessage(sender, { text: "❌ I cannot kick myself!" }, { quoted: msg });
                return;
            }

            if (targetParticipant && targetParticipant.admin) {
                await sock.sendMessage(sender, { text: "❌ I cannot kick another group admin!" }, { quoted: msg });
                return;
            }

            await sock.groupParticipantsUpdate(sender, [targetJid], "remove");
            await sock.sendMessage(sender, { text: "✅ Successfully removed the user from the group." }, { quoted: msg });
            
            console.log("👢 Kicked user successfully.");
        } catch (error) {
            console.error("Error executing kick command:", error);
            await sock.sendMessage(sender, { text: "❌ Failed to kick the user. Make sure bot has proper admin permissions." }, { quoted: msg });
        }
    }
};
                    
