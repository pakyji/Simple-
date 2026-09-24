module.exports = {
    name: "setname",
    category: "GROUP",
    description: "Change the name of the current group",
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
        let newName = text.split(" ").slice(1).join(" ");

        if (!newName) {
            await sock.sendMessage(targetChat, { 
                text: "Please provide a new name for the group.\nExample: ,setname New Group Name" 
            }, { quoted: msg });
            return;
        }

        try {
            await sock.groupUpdateSubject(targetChat, newName);

            let responseText = `---\n` +
                               `*GROUP NAME UPDATED*\n` +
                               `New Name: ${newName}\n` +
                               `---`;

            await sock.sendMessage(targetChat, { text: responseText }, { quoted: msg });
        } catch (error) {
            console.error("Error executing setname command:", error);
            await sock.sendMessage(targetChat, { 
                text: "Failed to update the group name. Make sure the bot has admin privileges." 
            }, { quoted: msg });
        }
    }
};
