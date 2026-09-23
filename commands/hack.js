module.exports = {
    name: "hack",
    description: "Run a fake funny hacking simulation",
    async execute(sock, msg, sender, args) {
        const target = args[0] ? args[0] : "System";
        const sent = await sock.sendMessage(sender, { text: `╭━━━〔 💻 *HACKING* 〕━━━⣣\n┃\n┃  🚀 Initializing hack on ${target}...\n┃\n╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭` }, { quoted: msg });
        
        setTimeout(async () => {
            await sock.sendMessage(sender, { text: `╭━━━〔 💻 *HACKING* 〕━━━⣣\n┃\n┃  🔓 Bypassing firewall... 45%\n┃\n╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭` });
        }, 1500);

        setTimeout(async () => {
            await sock.sendMessage(sender, { text: `╭━━━〔 💻 *HACKING* 〕━━━⣣\n┃\n┃  📂 Extracting private data... 99%\n┃\n╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭` });
        }, 3000);

        setTimeout(async () => {
            await sock.sendMessage(sender, { text: `╭━━━〔 💻 *HACKING* 〕━━━⣣\n┃\n┃  ✅ Hack complete! Target successfully owned. 😎\n┃\n╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭` });
        }, 4500);
    }
};
