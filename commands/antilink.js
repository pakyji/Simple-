/**
 * Anti-Link Command & Middleware Module
 * This module manages group protection against unauthorized links (URLs, WhatsApp invites, etc.).
 * Strictly written in English according to project guidelines.
 */

// In-memory storage to keep track of groups where anti-link is enabled
const antiLinkGroups = new Set();

module.exports = {
    name: "antilink",
    description: "Enable or disable anti-link protection in the group",
    
    async execute(sock, msg, sender, args) {
        try {
            // Check if the command is executed inside a WhatsApp group chat (@g.us)
            if (!sender.endsWith("@g.us")) {
                await sock.sendMessage(sender, { text: "❌ This command can only be used inside groups!" }, { quoted: msg });
                return;
            }

            // Extract the action argument ('on', 'off', or none)
            const action = args[0] ? args[0].toLowerCase() : "";

            // Handle 'on' action to enable anti-link
            if (action === "on") {
                antiLinkGroups.add(sender);
                await sock.sendMessage(sender, { 
                    text: `╭━━━〔 🛡️ *ANTI-LINK* 🛡️ 〕━━━⣣\n` +
                          `┃\n` +
                          `┃  ✅ *Status:* Enabled successfully!\n` +
                          `┃  ⚠️ Links will now be monitored and deleted.\n` +
                          `┃\n` +
                          `┣──────────────────────────┫\n` +
                          `┃\n` +
                          `┃  🔗 *Discord Community:*\n` +
                          `┃  https://discord.gg/syndicateps\n` +
                          `┃\n` +
                          `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭` 
                }, { quoted: msg });
            } 
            // Handle 'off' action to disable anti-link
            else if (action === "off") {
                antiLinkGroups.delete(sender);
                await sock.sendMessage(sender, { 
                    text: `╭━━━〔 🛡️ *ANTI-LINK* 🛡️ 〕━━━⣣\n` +
                          `┃\n` +
                          `┃  ❌ *Status:* Disabled successfully!\n` +
                          `┃\n` +
                          `┣──────────────────────────┫\n` +
                          `┃\n` +
                          `┃  🔗 *Discord Community:*\n` +
                          `┃  https://discord.gg/syndicateps\n` +
                          `┃\n` +
                          `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭` 
                }, { quoted: msg });
            } 
            // If no valid action argument is provided, show current status and usage instructions
            else {
                const status = antiLinkGroups.has(sender) ? "Enabled 🟢" : "Disabled 🔴";
                await sock.sendMessage(sender, { 
                    text: `╭━━━〔 🛡️ *ANTI-LINK* 🛡️ 〕━━━⣣\n` +
                          `┃\n` +
                          `┃  📊 *Current Status:* ${status}\n` +
                          `┃  💡 *Usage:* .antilink on / off\n` +
                          `┃\n` +
                          `┣──────────────────────────┫\n` +
                          `┃\n` +
                          `┃  🔗 *Discord Community:*\n` +
                          `┃  https://discord.gg/syndicateps\n` +
                          `┃\n` +
                          `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭` 
                }, { quoted: msg });
            }

        } catch (error) {
            // Log any unexpected execution errors
            console.error("Antilink command error:", error);
            await sock.sendMessage(sender, { text: "❌ Failed to update anti-link settings." }, { quoted: msg });
        }
    },
    
    /**
     * Helper function to check if a specific group chat has anti-link protection active.
     * @param {string} chatId - The WhatsApp group ID
     * @returns {boolean} - Returns true if protection is enabled, false otherwise
     */
    isGroupProtected(chatId) {
        return antiLinkGroups.has(chatId);
    }
};
