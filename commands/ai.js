const axios = require("axios");

module.exports = {
    name: "ai",
    description: "Chat with AI assistant (No API Key needed)",
    async execute(sock, msg, sender, args) {
        const query = args.join(" ");
        
        if (!query) {
            const usageText = `╭━━━〔 🤖 *AI ASSISTANT* 〕━━━⣣\n` +
                              `┃\n` +
                              `┃  ⚠️ Please provide a question or prompt!\n` +
                              `┃  💡 *Usage:* ,ai Hello, how are you?\n` +
                              `┃\n` +
                              `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;
            return await sock.sendMessage(sender, { text: usageText }, { quoted: msg });
        }

        // Send thinking message
        const thinkingMsg = await sock.sendMessage(sender, { text: `🤖 *Thinking...*` }, { quoted: msg });

        try {
            // Using a free public LLM endpoint
            const encodedPrompt = encodeURIComponent(query);
            const apiUrl = `https://apis.davidcyriltech.my.id/ai/gemini?text=${encodedPrompt}`;
            
            const response = await axios.get(apiUrl);
            let replyText = response.data?.result || response.data?.message || response.data?.response;

            if (!replyText) {
                throw new Error("Invalid response from AI API");
            }

            const finalResponse = `╭━━━〔 🤖 *AI RESPONSE* 〕━━━⣣\n` +
                                  `┃\n` +
                                  `┃  ${replyText.trim()}\n` +
                                  `┃\n` +
                                  `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;

            // Edit the thinking message or send reply
            await sock.sendMessage(sender, { text: finalResponse }, { quoted: msg });

        } catch (error) {
            console.error("❌ AI Command Error:", error);
            await sock.sendMessage(sender, { 
                text: `❌ Sorry, I couldn't reach the AI service right now. Please try again later!` 
            }, { quoted: msg });
        }
    }
};
