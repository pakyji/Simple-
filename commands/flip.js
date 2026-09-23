module.exports = {
    name: "flip",
    description: "Flip text upside down",
    async execute(sock, msg, sender, args) {
        const text = args.join(" ") || "Hello";
        const map = { a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ', j: 'ɾ', k: 'ʞ', l: 'l', m: 'ɯ', n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ', s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z' };
        const flipped = text.toLowerCase().split("").map(c => map[c] || c).reverse().join("");

        const response = `╭━━━〔 🙃 *FLIPPED TEXT* 〕━━━⣣\n` +
                         `┃\n` +
                         `┃  🔄 ${flipped}\n` +
                         `┃\n` +
                         `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;
        await sock.sendMessage(sender, { text: response }, { quoted: msg });
    }
};
