const axios = require('axios');

module.exports = {
    name: "ai",
    description: "Chat with an AI assistant",
    async execute(sock, msg, sender, args) {
        if (!args.length) {
            return await sock.sendMessage(sender, { 
                text: "⚠️ Please provide a prompt or question! Example: `,ai Whatis Syndicate?`" 
            }, { quoted: msg });
        }

        const prompt = args.join(" ");

        try {
            await sock.sendPresenceUpdate('composing', sender);

            // Using an alternative stable endpoint
            const response = await axios.get(`https://bk9.fun/ai/gpt4o?q=${encodeURIComponent(prompt)}`);
            
            let replyText = "";
            if (response.data && response.data.status && response.data.BK9) {
                replyText = response.data.BK9;
            } else if (response.data && response.data.result) {
                replyText = response.data.result;
            } else {
                replyText = "❌ Received an empty response from the AI.";
            }

            await sock.sendMessage(sender, { text: replyText }, { quoted: msg });

        } catch (error) {
            console.error("❌ Error in AI command:", error);
            await sock.sendMessage(sender, { 
                text: "❌ An error occurred while communicating with the AI service." 
            }, { quoted: msg });
        }
    }
};
