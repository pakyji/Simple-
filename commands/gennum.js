/**
 * Number Generator Command Module
 * Generates dummy or mock phone numbers for various countries for testing purposes.
 * Strictly written in English according to project guidelines.
 */

module.exports = {
    name: "gennum",
    description: "Generate a mock/dummy phone number for a specific country",
    
    async execute(sock, msg, sender, args) {
        try {
            // Predefined country code prefixes and mock structures
            const countryFormats = {
                "usa": { name: "United States", code: "+1", format: "+1 (###) ###-####" },
                "uk": { name: "United Kingdom", code: "+44", format: "+44 7911 ######" },
                "pakistan": { name: "Pakistan", code: "+92", format: "+92 3## #######" },
                "india": { name: "India", code: "+91", format: "+91 9### ######" },
                "italy": { name: "Italy", code: "+39", format: "+39 3## #######" },
                "italia": { name: "Italy", code: "+39", format: "+39 3## #######" }
            };

            const query = args[0] ? args[0].toLowerCase() : "";

            // If country is not supported or not provided, show list of available options
            if (!countryFormats[query]) {
                const responseText = `╭━━━〔 📱 *NUMBER GENERATOR* 📱 〕━━━⣣\n` +
                                     `┃\n` +
                                     `┃  ❌ *Invalid or missing country!*\n` +
                                     `┃  💡 *Available options:*\n` +
                                     `┃  • \`.gennum usa\`\n` +
                                     `┃  • \`.gennum uk\`\n` +
                                     `┃  • \`.gennum pakistan\`\n` +
                                     `┃  • \`.gennum india\`\n` +
                                     `┃  • \`.gennum italia\`\n` +
                                     `┃\n` +
                                     `┣──────────────────────────┫\n` +
                                     `┃\n` +
                                     `┃  🔗 *Discord Community:*\n` +
                                     `┃  https://discord.gg/syndicateps\n` +
                                     `┃\n` +
                                     `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;
                
                await sock.sendMessage(sender, { text: responseText }, { quoted: msg });
                return;
            }

            const selected = countryFormats[query];

            // Generate random digits for the placeholder '#'
            const generatedNumber = selected.format.replace(/#/g, () => Math.floor(Math.random() * 10));

            // Format success response message
            const successText = `╭━━━〔 📱 *NUMBER GENERATOR* 📱 〕━━━⣣\n` +
                                `┃\n` +
                                `┃  🌍 *Country:* ${selected.name}\n` +
                                `┃  📞 *Generated Number:* \`${generatedNumber}\`\n` +
                                `┃  ⚠️ *Note:* For testing purposes only!\n` +
                                `┃\n` +
                                `┣──────────────────────────┫\n` +
                                `┃\n` +
                                `┃  🔗 *Discord Community:*\n` +
                                `┃  https://discord.gg/syndicateps\n` +
                                `┃\n` +
                                `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;

            await sock.sendMessage(sender, { text: successText }, { quoted: msg });

        } catch (error) {
            // Log unexpected execution errors
            console.error("Gennum command error:", error);
            await sock.sendMessage(sender, { text: "❌ Failed to generate number." }, { quoted: msg });
        }
    }
};
