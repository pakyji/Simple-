module.exports = {
    name: "owner",
    description: "Shows the bot owner details and community link",
    execute: async (sock, msg, sender) => {
        const ownerText = `
╭━━━〔 *👑 BOT OWNER & COMMUNITY* 〕━━━
┃ 
┃ 🤖 Bot Developer / Owner
┃ 💬 Discord Server: https://discord.gg/syndicateps
┃ 
╰━━━━━━━━━━━━━━━━━━━━━━━`.trim();

        try {
            // Bina fetch ke direct URL object pass kar rahe hain
            await sock.sendMessage(
                sender, 
                { 
                    image: { url: "https://i.imgur.com/05xbdqS.jpeg" }, 
                    caption: ownerText 
                }, 
                { quoted: msg }
            );
        } catch (error) {
            console.error("Owner command error:", error);
            await sock.sendMessage(sender, { text: ownerText }, { quoted: msg });
        }
    }
};
