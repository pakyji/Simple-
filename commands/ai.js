const axios = require("axios");

// List of free AI endpoints/APIs with automatic rotation & failover
const AI_PROVIDERS = [
    {
        name: "Siputzx AI Public API",
        async fetch(prompt) {
            const res = await axios.get(`https://api.siputzx.my.id/api/ai/chatgpt?prompt=${encodeURIComponent(prompt)}`);
            if (res.data && res.data.status && res.data.data) {
                return res.data.data;
            }
            throw new Error("Invalid response from Siputzx");
        }
    },
    {
        name: "Lumos AI Public Gateway",
        async fetch(prompt) {
            const res = await axios.post("https://www.api.vyturex.com/ai", { prompt });
            if (res.data && res.data.answer) {
                return res.data.answer;
            }
            throw new Error("Invalid response from Vyturex");
        }
    },
    {
        name: "Fallback GPT API",
        async fetch(prompt) {
            const res = await axios.get(`https://bk9.fun/ai/gpt4?q=${encodeURIComponent(prompt)}`);
            if (res.data && res.data.status && res.data.BK9) {
                return res.data.BK9;
            }
            throw new Error("Invalid response from BK9");
        }
    }
];

module.exports = {
    name: "ai",
    description: "Chat with AI assistant using automatic fallback APIs",
    async execute(sock, msg, sender, args) {
        try {
            const query = args.join(" ");
            if (!query) {
                await sock.sendMessage(sender, { 
                    text: "❌ Please provide a question or prompt for the AI! Example: `ai Explain quantum physics in simple terms`" 
                }, { quoted: msg });
                return;
            }

            await sock.sendMessage(sender, { text: "🤖 Thinking..." }, { quoted: msg });

            let aiResponse = null;
            let usedProvider = "";

            // Loop through the rotation pool until a working API responds successfully
            for (const provider of AI_PROVIDERS) {
                try {
                    aiResponse = await provider.fetch(query);
                    if (aiResponse) {
                        usedProvider = provider.name;
                        break;
                    }
                } catch (err) {
                    console.log(`[AI Fallback] ${provider.name} failed. Rotating to next...`);
                }
            }

            if (!aiResponse) {
                await sock.sendMessage(sender, { 
                    text: "❌ All AI providers are currently busy or unavailable. Please try again later!" 
                }, { quoted: msg });
                return;
            }

            const responseText = `╭━━━〔 🤖 *AI ASSISTANT* 🤖 〕━━━⣣\n` +
                                 `┃\n` +
                                 `┃  💬 *Prompt:* ${query}\n` +
                                 `┃\n` +
                                 `┣──────────────────────────┫\n` +
                                 `┃\n` +
                                 `┃  ${aiResponse.trim()}\n` +
                                 `┃\n` +
                                 `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;

            await sock.sendMessage(sender, { text: responseText }, { quoted: msg });

        } catch (error) {
            console.error("AI command error:", error);
            await sock.sendMessage(sender, { text: "❌ An error occurred while communicating with the AI." }, { quoted: msg });
        }
    }
};
