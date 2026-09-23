/**
 * Poll Command Module
 * Creates a custom voting poll with options for group chats.
 * Strictly written in English according to project guidelines.
 */

module.exports = {
    name: "poll",
    description: "Create a voting poll (Usage: .poll Question | Option1, Option2, Option3)",
    
    async execute(sock, msg, sender, args) {
        try {
            // Join all arguments back into a single string to parse question and options
            const input = args.join(" ");

            // Check if user provided options separated by a pipe (|) or comma (,)
            if (!input || !input.includes("|")) {
                const helpText = `╭━━━〔 📊 *POLL GENERATOR* 📊 〕━━━⣣\n` +
                                 `┃\n` +
                                 `┃  ❌ *Invalid format!*\n` +
                                 `┃  💡 *Usage example:*\n` +
                                 `┃  \`.poll Best Game? | Valorant, GTA V, Minecraft\`\n` +
                                 `┃\n` +
                                 `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;
                
                await sock.sendMessage(sender, { text: helpText }, { quoted: msg });
                return;
            }

            // Split input into question and options parts
            const parts = input.split("|");
            const question = parts[0].trim();
            const rawOptions = parts[1].split(",").map(opt => opt.trim()).filter(opt => opt.length > 0);

            if (rawOptions.length < 2) {
                await sock.sendMessage(sender, { text: "❌ Please provide at least **two** options to vote on!" }, { quoted: msg });
                return;
            }

            // Define custom number emojis for options (1 to 10)
            const numberEmojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

            let optionsList = "";
            rawOptions.forEach((option, index) => {
                const emoji = numberEmojis[index] || "🔹";
                optionsList += `┃  ${emoji} *${option}*\n`;
            });

            // Format final poll message
            const pollText = `╭━━━〔 📊 *GROUP POLL* 📊 〕━━━⣣\n` +
                             `┃\n` +
                             `┃  ❓ *Question:*\n` +
                             `┃  _${question}_\n` +
                             `┃\n` +
                             `┣━━━〔 🗳️ *OPTIONS* 〕━━━⣣\n` +
                             optionsList +
                             `┃\n` +
                             `┃  📌 *React or reply with your choice!*\n` +
                             `┃\n` +
                             `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;

            await sock.sendMessage(sender, { text: pollText }, { quoted: msg });

        } catch (error) {
            console.error("Poll command error:", error);
            await sock.sendMessage(sender, { text: "❌ Failed to create the poll." }, { quoted: msg });
        }
    }
};
