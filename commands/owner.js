module.exports = {
    name: "owner",
    description: "Shows the bot community link",
    execute: async (sock, msg, sender) => {
        const ownerText = 
            `Discord Server: https://discord.gg/syndicateps`;

        await sock.sendMessage(sender, { text: ownerText }, { quoted: msg });
    }
};
