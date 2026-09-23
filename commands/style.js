/**
 * Name/Text Style Command Module
 * Converts regular text into various stylish Unicode fonts.
 * Strictly written in English according to project guidelines.
 */

module.exports = {
    name: "style",
    description: "Convert text or names into stylish fonts",
    
    async execute(sock, msg, sender, args) {
        try {
            // Check if text is provided
            if (!args || args.length === 0) {
                await sock.sendMessage(sender, { 
                    text: "❌ Please provide text or a name to style! Example: `.style Syndicate`" 
                }, { quoted: msg });
                return;
            }

            const inputTxt = args.join(" ");

            // Simple Unicode styling dictionaries
            const fonts = {
                bold: inputTxt.replace(/[a-zA-Z]/g, c => String.fromCodePoint(c.charCodeAt(0) + (c <= 'Z' ? 120279 : 120275))),
                italic: inputTxt.replace(/[a-zA-Z]/g, c => String.fromCodePoint(c.charCodeAt(0) + (c <= 'Z' ? 120331 : 120327))),
                script: inputTxt.replace(/[a-zA-Z]/g, c => String.fromCodePoint(c.charCodeAt(0) + (c <= 'Z' ? 119965 : 119961))),
                sans: inputTxt.replace(/[a-zA-Z]/g, c => String.fromCodePoint(c.charCodeAt(0) + (c <= 'Z' ? 120383 : 120379)))
            };

            // Format response message with clean plain text and emojis
            const responseText = 
                `✒️ NAME STYLES ✒️\n\n` +
                `🔤 Original: ${inputTxt}\n` +
                `🔹 Bold: ${fonts.bold}\n` +
                `🔹 Italic: ${fonts.italic}\n` +
                `🔹 Script: ${fonts.script}\n` +
                `🔹 Sans: ${fonts.sans}`;

            await sock.sendMessage(sender, { text: responseText }, { quoted: msg });

        } catch (error) {
            // Log unexpected execution errors
            console.error("Style command error:", error);
            await sock.sendMessage(sender, { text: "❌ Failed to generate text styles." }, { quoted: msg });
        }
    }
};
