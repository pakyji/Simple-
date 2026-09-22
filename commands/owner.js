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

        // Image ke sath text message bhejne ka tarika
        await sock.sendMessage(
            sender, 
            { 
                image: { url: "https://i.imgur.com/05xbdqS.jpeg" }, 
                caption: ownerText 
            }, 
            { quoted: msg }
        );
    }
};
