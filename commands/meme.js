module.exports = {
    name: "meme",
    description: "Get a random funny meme",
    async execute(sock, msg, sender, args) {
        try {
            const response = await fetch("https://meme-api.com/gimme");
            const data = await response.json();
            
            if (data && data.url) {
                await sock.sendMessage(sender, { 
                    image: { url: data.url }, 
                    caption: `╭━━━〔 😂 *MEME* 〕━━━⣣\n┃\n┃  📌 *Title:* ${data.title}\n┃  🌐 *Subreddit:* r/${data.subreddit}\n┃\n╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭` 
                }, { quoted: msg });
            } else {
                await sock.sendMessage(sender, { text: "❌ Failed to fetch meme." }, { quoted: msg });
            }
        } catch (error) {
            await sock.sendMessage(sender, { text: "❌ Error fetching meme." }, { quoted: msg });
        }
    }
};
