const axios = require("axios");

module.exports = {
    name: "fact",
    description: "Get a random interesting fact",
    async execute(sock, msg, sender, args) {
        try {
            // Fetching a random interesting fact from a public API
            const response = await axios.get("https://uselessfacts.jsph.pl/api/v2/facts/random?language=en");
            const factText = response.data.text;

            const responseText = `Fact: ${factText}`;

            await sock.sendMessage(sender, { text: responseText }, { quoted: msg });

        } catch (error) {
            console.error("Fact error:", error);
            await sock.sendMessage(sender, { text: "Failed to fetch an interesting fact." }, { quoted: msg });
        }
    }
};
