module.exports = {
    name: "menu",
    description: "Shows the list of available bot commands",
    execute: async (sock, msg, sender) => {
        const menuText = `
╭━━━〔 *🤖 WHATSAPP BOT MENU* 〕━━━
┃ 
┃ 👋 Hello! Here are my commands:
┃ 
┃ 🔹 *ping* - Check bot response & latency
┃ 🔹 *owner* - Show owner community link
┃ 🔹 *menu* - Show this command list
┃ 
╰━━━━━━━━━━━━━━━━━━━━━━━`.trim();

        await sock.sendMessage(sender, { text: menuText }, { quoted: msg });
    }
};
