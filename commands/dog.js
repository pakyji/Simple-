module.exports = {
    name: "dog",
    description: "Get a random cute dog image",
    async execute(sock, msg, sender, args) {
        try {
            const response = await fetch("https://dog.ceo/api/breeds/image/random");
            const data = await response.json();
            
            if (data && data.message) {
                await sock.sendMessage(sender, { 
                    image: { url: data.message }, 
                    caption: `╭━━━〔 🐶 *RANDOM DOG* 〕━━━⣣\n┃\n┃  🐾 *Woof! Here is a cute dog.*\n┃\n╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭` 
                }, { quoted: msg });
            }
        } catch (error) {
            await sock.sendMessage(sender, { text: "❌ Failed to fetch dog image." }, { quoted: msg });
        }
    }
};
