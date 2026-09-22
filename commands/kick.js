module.exports = {
    name: "kick",
    description: "Removes a tagged or replied user from the group",
    execute: async (sock, msg, sender, args) => {
        if (!sender.endsWith("@g.us")) {
            await sock.sendMessage(sender, { text: "❌ This command can only be used inside groups!" }, { quoted: msg });
            return;
        }

        try {
            const groupMetadata = await sock.groupMetadata(sender);
            const participants = groupMetadata.participants;

            const botJid = sock.user.id.split(":")[0] + "@s.whatsapp.net";
            const botParticipant = participants.find(p => p.id === botJid);
            const senderParticipant = participants.find(p => p.id === msg.key.participant || p.id === sender);

            if (!botParticipant || (botParticipant.admin !== "admin" && botParticipant.admin !== "superadmin")) {
                await sock.sendMessage(sender, { text: "❌ Please make the bot an admin first to use the kick command!" }, { quoted: msg });
                return;
            }

            if (!senderParticipant || (!senderParticipant.admin)) {
                await sock.sendMessage(sender, { text: "❌ Only group admins can use the kick command!" }, { quoted: msg });
                return;
            }

            let targetJid = null;

            if (msg.message.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
                targetJid = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
            } else if (msg.message.extendedTextMessage?.contextInfo?.participant) {
                targetJid = msg.message.extendedTextMessage.contextInfo.participant;
            }

            if (!targetJid) {
                await sock.sendMessage(sender, { text: "ℹ️ Please tag a user or reply to their message to kick them.\nExample: `.kick @user`" }, { quoted: msg });
                return;
            }

            const targetParticipant = participants.find(p => p.id === targetJid);
            if (targetJid === botJid) {
                await sock.sendMessage(sender, { text: "❌ I cannot kick myself!" }, { quoted: msg });
                return;
            }

            if (targetParticipant && targetParticipant.admin) {
                await sock.sendMessage(sender, { text: "❌ I cannot kick another group admin!" }, { quoted: msg });
                return;
            }

            await sock.groupParticipantsUpdate(sender, [targetJid], "remove");
            await sock.sendMessage(sender, { text: `✅ Successfully removed @${targetJid.split("@")[0]} from the group.`, mentions: [targetJid] }, { quoted: msg });
            
            console.log(`👢 Kicked user ${targetJid} from group ${sender}`);
        } catch (error) {
            console.error("❌ Error executing kick command:", error);
            await sock.sendMessage(sender, { text: "❌ Failed to kick the user. Make sure bot has proper admin permissions." }, { quoted: msg });
        }
    }
};
