const axios = require("axios");

module.exports = {
    name: "ai",
    description: "Chat with AI assistant",
    async execute(sock, msg, sender, args) {
        const query = args.join(" ");
        
        if (!query) {
            const usageText = `╭━━━〔 🤖 *AI ASSISTANT* 〕━━━⣣\n` +
                              `┃\n` +
                              `┃  ⚠️ Please provide a question!\n` +
                              `┃  💡 *Usage:* ,ai kesi ho?\n` +
                              `┃\n` +
                              `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;
            return await sock.sendMessage(sender, { text: usageText }, { quoted: msg });
        }

        await sock.sendMessage(sender, { text: `🤖 *Thinking...*` }, { quoted: msg });

        try {
            // Using a stable alternative free endpoint
            const response = await axios.get(`https://bk9.fun/ai/gemini?q=${encodeURIComponent(query)}`);
            
            let replyText = response.data?.result || response.data?.data || response.data?.gpt;

            if (!replyText) {
                // Fallback secondary public api if first fails
                const altResponse = await axios.get(`https://api.giftedtech.my.id/api/ai/geminiai?apikey=gifted&q=${encodeURIComponent(query)}`);
                replyText = altResponse.data?.result || altResponse.data?.response;
            }

            if (!replyText) {
                throw new Error("No response from AI servers.");
            }

            const finalResponse = `╭━━━〔 🤖 *AI RESPONSE* 〕━━━⣣\n` +
                                  `┃\n` +
                                  `┃  ${replyText.trim()}\n` +
                                  `┃\n` +
                                  `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;

            await sock.sendMessage(sender, { text: finalResponse }, { quoted: msg });

        } catch (error) {
            console.error("❌ AI Command Error:", error);
            await sock.sendMessage(sender, { 
                text: `❌ AI service is currently busy. Please try again in a moment!` 
            }, { quoted: msg });
        }
    }
};
