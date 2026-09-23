module.exports = {
    name: "Menu",
    description: "Shows this command list",
    execute: async (sock, msg, sender) => {
        let prefix = ",";
        
        const menuText = 
            `COMMAND LIST\n\n` +
            `[ The Syndicate ]\n` +
            `- Prefix: ${prefix}\n` +
            `- Menu: \n` +
            `- Version: 2.5.0\n` +
            `- Server Link: https://discord.gg/syndicateps\n\n\n\n` +
            `[ AVAILABLE COMMANDS ]\n` +
            `* Menu - Shows this command list\n` +
            `* tagall - Mentions all members in the group\n\n` +
            `Use the prefix followed by the command name.`;

        await sock.sendMessage(sender, { text: menuText }, { quoted: msg });
    }
};
