module.exports = {
    name: "ping",
    execute: async (sock, msg, sender) => {
        await sock.sendMessage(sender, { text: "Pong! 🤖 (Modular)" }, { quoted: msg });
    }
};
