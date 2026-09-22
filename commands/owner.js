module.exports = {
    name: "owner",
    description: "Shows the bot owner details and community link",
    execute: async (sock, msg, sender) => {
        const ownerText = `
╭━━━〔 *👑 BOT OWNER & COMMUNITY* 〕━━━
┃ 
┃ 🤖 Bot Developer / join us
┃ 💬 Discord Server: https://discord.gg/syndicateps
┃ 
╰━━━━━━━━━━━━━━━━━━━━━━━`.trim();

        await sock.sendMessage(sender, { text: ownerText }, { quoted: msg });
    }
};
