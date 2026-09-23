const fs = require("fs");
const path = require("path");

module.exports = {
    name: "broadcast",
    description: "Broadcast message to all chats while excluding specific JIDs (Owner Only)",
    async execute(sock, msg, sender, args) {
        // 1. Read owner number from config.json
        let ownerNumber = "393802347902";
        const configPath = path.join(__dirname, "../config.json");
        if (fs.existsSync(configPath)) {
            try {
                const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                if (config.bot?.ownerNumber) {
                    ownerNumber = config.bot.ownerNumber;
                }
            } catch (e) {
                console.error("Error reading config.json:", e);
            }
        }

        // Security Check: Only Owner
        const senderNumber = sender.split("@")[0];
        if (senderNumber !== ownerNumber) {
            const deniedText = `╭━━━〔 ⚠️ *ACCESS DENIED* 〕━━━⣣\n` +
                               `┃\n` +
                               `┃  ❌ This command is only for the Bot Owner!\n` +
                               `┃\n` +
                               `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;
            return await sock.sendMessage(sender, { text: deniedText }, { quoted: msg });
        }

        const broadcastText = args.join(" ");
        if (!broadcastText) {
            const usageText = `╭━━━〔 📢 *BROADCAST* 〕━━━⣣\n` +
                              `┃\n` +
                              `┃  ⚠️ Please provide a message!\n` +
                              `┃  💡 *Usage:* ,broadcast Hello everyone!\n` +
                              `┃\n` +
                              `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;
            return await sock.sendMessage(sender, { text: usageText }, { quoted: msg });
        }

        // ==========================
        // EXCLUDE LIST (Yahan un groups ya numbers ki JID likhein jinhein chhorna hai)
        // Misal ke taur par: "1234567890-group@g.us" ya "393802347902@s.whatsapp.net"
        // ==========================
        const excludeList = [
            // "123456789-group@g.us",
            // "393802347902@s.whatsapp.net"
        ];

        await sock.sendMessage(sender, { text: `📢 Starting broadcast (excluding specified chats)... Please wait.` }, { quoted: msg });

        try {
            let successCount = 0;
            let skippedCount = 0;
            const finalMessage = `╭━━━〔 📢 *ANNOUNCEMENT* 〕━━━⣣\n` +
                                 `┃\n` +
                                 `┃  ${broadcastText}\n` +
                                 `┃\n` +
                                 `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;

            // Fetch all participating groups
            const groupChats = await sock.groupFetchAllParticipating();
            const groupJids = Object.keys(groupChats);

            for (const jid of groupJids) {
                // Check if this chat is in the exclude list
                if (excludeList.includes(jid)) {
                    skippedCount++;
                    console.log(`⏩ Skipped chat: ${jid}`);
                    continue; // Is chat ko chhor kar agli par chalay jao
                }

                try {
                    await sock.sendMessage(jid, { text: finalMessage });
                    successCount++;
                    // Anti-ban delay (1.5 seconds)
                    await new Promise(resolve => setTimeout(resolve, 1500));
                } catch (err) {
                    console.error(`Failed to send to ${jid}:`, err);
                }
            }

            const successText = `╭━━━〔 ✅ *BROADCAST COMPLETE* 〕━━━⣣\n` +
                                `┃\n` +
                                `┃  🚀 Delivered: *${successCount}* chats\n` +
                                `┃  ⏩ Skipped: *${skippedCount}* chats\n` +
                                `┃\n` +
                                `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;
            await sock.sendMessage(sender, { text: successText }, { quoted: msg });

        } catch (error) {
            console.error("❌ Error during broadcast:", error);
            await sock.sendMessage(sender, { text: "❌ Failed to complete broadcast." }, { quoted: msg });
        }
    }
};
