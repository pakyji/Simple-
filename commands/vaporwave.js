module.exports = {
    name: "vaporwave",
    description: "Convert text to aesthetic vaporwave style",
    async execute(sock, msg, sender, args) {
        const text = args.join(" ") || "Vaporwave";
        const vapor = text.split("").map(c => c === " " ? "  " : String.fromCharCode(c.charCodeAt(0) + 65248)).join("");
        
        const response = 
            `VAPORWAVE\n\n` +
            `${vapor}`;

        await sock.sendMessage(sender, { text: response }, { quoted: msg });
    }
};
