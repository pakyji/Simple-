const axios = require('axios');

module.exports = {
    name: "bing",
    category: "AI", // Impostato correttamente nella categoria AI
    description: "Search or ask anything using Bing/AI search",
    async execute(sock, msg, sender, args) {
        if (!args.length) {
            return await sock.sendMessage(sender, { 
                text: "⚠️ Please provide a query!\nExample: `,bing What is the capital of France?`" 
            }, { quoted: msg });
        }

        const query = args.join(" ");

        try {
            await sock.sendMessage(sender, { text: `🔍 Searching for *"${query}"*...` }, { quoted: msg });
            await sock.sendPresenceUpdate('composing', sender);

            const response = await axios.get(`https://bk9.fun/ai/gpt4o?q=${encodeURIComponent(query)}`);
            
            let result = "";
            const data = response.data;

            if (typeof data === 'string') {
                result = data;
            } else if (data?.BK9) {
                result = typeof data.BK9 === 'string' ? data.BK9 : (data.BK9.result || data.BK9.message || data.BK9.answer);
            } else if (data?.result) {
                result = data.result;
            } else if (data?.message) {
                result = data.message;
            } else if (data?.answer) {
                result = data.answer;
            } else {
                result = JSON.stringify(data);
            }

            if (!result) {
                return await sock.sendMessage(sender, { text: "❌ No response received from the search server." }, { quoted: msg });
            }

            await sock.sendMessage(sender, { 
                text: `🌐 *Bing Search Result*\n\n${result}\n\n_Powered by THE SYNDICATE_` 
            }, { quoted: msg });

        } catch (error) {
            console.error("❌ Error in bing command:", error.message || error);
            await sock.sendMessage(sender, { text: "❌ An error occurred while processing your search query." }, { quoted: msg });
        }
    }
};
