module.exports = {
    name: "setdesc",
    category: "GROUP",
    description: "Change the description of the current group",
    execute: async (sock, msg, sender) => {
        let targetChat = msg.key?.remoteJid || sender;

        if (!targetChat.endsWith("@g.us")) {
            await sock.sendMessage(targetChat, { 
                text: "This command can only be used in groups." 
            }, { quoted: msg });
            return;
        }

        let text = msg.message?.conversation || 
                   msg.message?.extendedTextMessage?.text || "";
        let newDesc = text.split(" ").slice(1).join(" ");

        if (!newDesc) {
            await sock.sendMessage(targetChat, { 
                text: "Please provide a new description for the group.\nExample: ,setdesc Welcome to our official group!" 
            }, { quoted: msg });
            return;
        }

        try {
            await sock.groupUpdateDescription(targetChat, newDesc);

            let responseText = `---\n` +
                               `*GROUP DESCRIPTION UPDATED*\n` +
                               `New Description:\n${newDesc}\n` +
                               `---`;

            await sock.sendMessage(targetChat, { text: responseText }, { quoted: msg });
        } catch (error) {
            console.error("Error executing setdesc command:", error);
            await sock.sendMessage(targetChat, { 
                text: "Failed to update the group description. Make sure the bot has admin privileges." 
            }, { quoted: msg });
        }
    }
};
