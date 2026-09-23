const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "ai",
    description: "Chat with official Google Gemini AI using secure environment/config keys",
    async execute(sock, msg, sender, args) {
        const query = args.join(" ");
        
        if (!query) {
            const usageText = `╭━━━〔 🤖 *GEMINI AI* 〕━━━⣣\n` +
                              `┃\n` +
                              `┃  ⚠️ Please provide a prompt!\n` +
                              `┃  💡 *Usage:* ,ai kesi ho?\n` +
                              `┃\n` +
                              `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;
            return await sock.sendMessage(sender, { text: usageText }, { quoted: msg });
        }

        // 1. Fetch API Key securely from Environment Variable or config.json
        let apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            const configPath = path.join(__dirname, "../config.json");
            if (fs.existsSync(configPath)) {
                try {
                    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                    apiKey = config.apis?.geminiKey || config.geminiKey;
                } catch (e) {
                    console.error("Error reading config.json for API key:", e);
                }
            }
        }

        if (!apiKey) {
            return await sock.sendMessage(sender, { 
                text: `❌ Gemini API Key is not configured in environment variables or config.json!` 
            }, { quoted: msg });
        }

        await sock.sendMessage(sender, { text: `🤖 *Thinking...*` }, { quoted: msg });

        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent(query);
            const response = await result.response;
            const replyText = response.text();

            if (!replyText) {
                throw new Error("Empty response from Gemini.");
            }

            const finalResponse = `╭━━━〔 🤖 *AI RESPONSE* 〕━━━⣣\n` +
                                  `┃\n` +
                                  `┃  ${replyText.trim()}\n` +
                                  `┃\n` +
                                  `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;

            await sock.sendMessage(sender, { text: finalResponse }, { quoted: msg });

        } catch (error) {
            console.error("❌ Gemini API Error:", error);
            await sock.sendMessage(sender, { 
                text: `❌ Error communicating with Gemini API. Please check your API key!` 
            }, { quoted: msg });
        }
    }
};
