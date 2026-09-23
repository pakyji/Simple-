/**
 * Anonymous Message Command Module
 * Allows users to send secret messages to any number via the bot.
 */

module.exports = {
    name: "anon",
    description: "Send an anonymous message to someone (e.g. .anon 1234567890 Hello)",
    
    async execute(sock, msg, sender, args) {
        try {
            const targetNumber = args[0];
            const secretMessage = args.slice(1).join(" ");

            // Check if arguments are provided correctly
            if (!targetNumber || !secretMessage) {
                const helpText = `╭━━━〔 🥷 *ANONYMOUS MESSAGE* 🥷 〕━━━⣣\n` +
                                 `┃\n` +
                                 `┃  💡 *How to use:*\n` +
                                 `┃  • \`.anon <number> <message>\`\n` +
                                 `┃  • *Example:* \`.anon 1234567890 Hello there!\`\n` +
                                 `┃\n` +
                                 `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;
                
                await sock.sendMessage(sender, { text: helpText }, { quoted: msg });
                return;
            }

            // Clean the target number and format it into JID
            let cleanNumber = targetNumber.replace(/[^0-9]/g, "");
            const targetJid = cleanNumber + "@s.whatsapp.net";

            // Styled anonymous message layout for the receiver
            const anonText = `╭━━━〔 🥷 *SECRET MESSAGE* 🥷 〕━━━⣣\n` +
                             `┃\n` +
                             `┃  💬 *Message:* ${secretMessage}\n` +
                             `┃\n` +
                             `┃  _Note: Someone sent you an anonymous message via bot._\n` +
                             `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;

            // Send the secret message to the target person
            await sock.sendMessage(targetJid, { text: anonText });

            // Confirm back to the sender privately
            await sock.sendMessage(sender, { text: "✅ *Anonymous message sent successfully!* 🥷" }, { quoted: msg });

        } catch (error) {
            console.error("Anon command error:", error);
            await sock.sendMessage(sender, { text: "❌ Failed to send anonymous message. Make sure the phone number is correct and includes the country code (without +)." }, { quoted: msg });
        }
    }
};
