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
            // Image ko fetch karke buffer banana taaki error na aaye
            const response = await fetch("https://i.imgur.com/05xbdqS.jpeg");
            const buffer = Buffer.from(await response.arrayBuffer());

            await sock.sendMessage(
                sender, 
                { 
                    image: buffer, 
                    caption: ownerText 
                }, 
                { quoted: msg }
            );
        } catch (error) {
            console.error("Owner command error:", error);
            // Agar image load hone mein koi dikkat ho toh fallback mein sirf text bhej dega
            await sock.sendMessage(sender, { text: ownerText }, { quoted: msg });
        }
    }
};
