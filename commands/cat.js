module.exports = {
    name: "cat",
    description: "Get a random cute cat image",
    async execute(sock, msg, sender, args) {
        try {
            const response = await fetch("https://api.thecatapi.com/v1/images/search");
            const data = await response.json();
            
            if (data && data[0] && data[0].url) {
                await sock.sendMessage(sender, { 
                    image: { url: data[0].url }, 
                    caption: `╭━━━〔 🐱 *RANDOM CAT* 〕━━━⣣\n┃\n┃  🐾 *Meow! Here is a cute cat.*\n┃\n╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭` 
                }, { quoted: msg });
            }
        } catch (error) {
            await sock.sendMessage(sender, { text: "❌ Failed to fetch cat image." }, { quoted: msg });
        }
    }
};
