/**
 * GTA Online Weekly Update Command Module
 * Displays the latest weekly bonuses, discounts, and rewards for GTA Online (PS4/PS5/PC).
 * Strictly written in English according to project guidelines.
 */

module.exports = {
    name: "gta",
    description: "Get the latest GTA Online weekly update details and bonuses (Usage: .gta)",
    
    async execute(sock, msg, sender, args) {
        try {
            // GTA Online Weekly Update formatting
            const gtaText = `╭━━━〔 🎮 *GTA ONLINE WEEKLY UPDATE* 🎮 〕━━━⣣\n` +
                            `┃\n` +
                            `┃  🗓️ *Refreshes every Thursday!*\n` +
                            `┃\n` +
                            `┣━━━〔 💰 *THIS WEEK HIGHLIGHTS* 〕━━━⣣\n` +
                            `┃  • 💵 *Bonus Cash & RP:* Check out the\n` +
                            `┃    latest active mission bonuses.\n` +
                            `┃  • 🚗 *Podium Vehicle:* Spin the\n` +
                            `┃    Diamond Casino Lucky Wheel!\n` +
                            `┃  • 🏷️ *Discounts:* Save big on select\n` +
                            `┃    properties, cars, and weapons.\n` +
                            `┃\n` +
                            `┣──────────────────────────┫\n` +
                            `┃\n` +
                            `┃  🔗 *Full Detailed Updates:*\n` +
                            `┃  https://www.gtaboom.com/gta-online-weekly-updates/\n` +
                            `┃\n` +
                            `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;

            await sock.sendMessage(sender, { text: gtaText }, { quoted: msg });

        } catch (error) {
            console.error("GTA command error:", error);
            await sock.sendMessage(sender, { text: "❌ Failed to fetch GTA weekly update info." }, { quoted: msg });
        }
    }
};
