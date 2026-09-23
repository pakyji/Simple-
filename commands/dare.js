export default {
    name: "dare",
    description: "Get a random dare challenge",
    async execute(sock, msg, sender, args) {
        try {
            const dares = [
                "Send a voice note singing your favorite song.",
                "Send the last photo saved in your gallery.",
                "Text your best friend 'I know your secret' and send the screenshot.",
                "Do 20 push-ups right now and send proof.",
                "Change your WhatsApp about status to something funny for 24 hours."
            ];

            const randomDare = dares[Math.floor(Math.random() * dares.length)];

            const responseText = 
                `DARE CHALLENGE\n\n` +
                `${randomDare}`;

            await sock.sendMessage(sender, { text: responseText }, { quoted: msg });
        } catch (error) {
            console.error("Dare error:", error);
            await sock.sendMessage(sender, { text: "❌ Failed to fetch a dare challenge." }, { quoted: msg });
        }
    }
};
