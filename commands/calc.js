module.exports = {
    name: "calc",
    description: "Perform mathematical calculations",
    async execute(sock, msg, sender, args) {
        try {
            const query = args.join(" ");
            if (!query) {
                await sock.sendMessage(sender, { 
                    text: "❌ Please provide a math expression! Example: `calc 25 * 4 + (10 / 2)`" 
                }, { quoted: msg });
                return;
            }

            // Sanitize input to allow only safe mathematical characters
            if (!/^[\d+\-*/().%\s^]+$/.test(query)) {
                await sock.sendMessage(sender, { 
                    text: "❌ Invalid characters detected! Only numbers and basic operators (+, -, *, /, %, ^, ()) are allowed." 
                }, { quoted: msg });
                return;
            }

            // Replace ^ with ** for JavaScript exponentiation if needed
            const sanitizedQuery = query.replace(/\^/g, '**');

            let result;
            try {
                result = Function(`return ${sanitizedQuery}`)();
            } catch (err) {
                await sock.sendMessage(sender, { text: "❌ Invalid mathematical expression!" }, { quoted: msg });
                return;
            }

            if (result === undefined || isNaN(result) || !isFinite(result)) {
                await sock.sendMessage(sender, { text: "❌ Could not calculate a valid result." }, { quoted: msg });
                return;
            }

            const responseText = `╭━━━〔 🔢 *CALCULATOR* 🔢 〕━━━⣣\n` +
                                 `┃\n` +
                                 `┃  📝 *Expression:* ${query}\n` +
                                 `┃  ✨ *Result:* ${result}\n` +
                                 `┃\n` +
                                 `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;

            await sock.sendMessage(sender, { text: responseText }, { quoted: msg });

        } catch (error) {
            console.error("Calc error:", error);
            await sock.sendMessage(sender, { text: "❌ Failed to perform calculation." }, { quoted: msg });
        }
    }
};
