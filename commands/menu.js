const fs = require("fs");
const path = require("path");

module.exports = {
    name: "menu",
    category: "GENERAL",
    description: "Shows the main command list",
    execute: async (sock, msg, sender) => {
        let prefix = ",";
        let langCode = "en";

        const configPath = path.join(__dirname, "../config.json");
        if (fs.existsSync(configPath)) {
            try {
                const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                if (config.bot?.prefix) prefix = config.bot.prefix;
                if (config.bot?.language) langCode = config.bot.language.toLowerCase();
            } catch (e) {
                console.error("Config read error:", e);
            }
        }

        // Helper function to convert normal text into small caps / stylish bold sans-serif
        function fancyFont(text) {
            const normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            const fancy =  "𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝙹🇷🇸𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿";
            // Using standard unicode mathematical sans-serif map fallback if needed
            const map = {
                'A': '𝙰', 'B': '𝙱', 'C': '𝙲', 'D': '𝙳', 'E': '𝙴', 'F': '𝙵', 'G': '𝙶', 'H': '𝙷', 'I': '𝙸', 'J': '𝙹', 'K': '𝙺', 'L': '𝙻', 'M': '𝙼', 'N': '𝙽', 'O': '𝙾', 'P': '𝙿', 'Q': '𝚀', 'R': '𝚁', 'S': '𝚂', 'T': '𝚃', 'U': '𝚄', 'V': '𝚅', 'W': '𝚆', 'X': '𝚇', 'Y': '𝚈', 'Z': '𝚉',
                'a': '𝚊', 'b': '𝚋', 'c': '𝚌', 'd': '𝚍', 'e': '𝚎', 'f': '𝚏', 'g': '𝚐', 'h': '𝚑', 'i': '𝚒', 'j': '𝚓', 'k': '𝚔', 'l': '𝚕', 'm': '𝚖', 'n': '𝚗', 'o': '𝚘', 'p': '𝚙', 'q': '𝚚', 'r': '𝚛', 's': '𝚜', 't': '𝚝', 'u': '𝚞', 'v': '𝚟', 'w': '𝚠', 'x': '𝚡', 'y': '𝚢', 'z': '𝚣',
                '0': '𝟶', '1': '𝟷', '2': '𝟸', '3': '𝟹', '4': '𝟺', '5': '𝟻', '6': '𝟼', '7': '𝟽', '8': '𝟾', '9': '𝟿'
            };
            return text.split('').map(char => map[char] || char).join('');
        }

        // Dynamic Time & Date details
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        const dayStr = now.toLocaleDateString('en-US', { weekday: 'long' });
        const dateStr = now.toLocaleDateString('en-GB'); // DD/MM/YYYY format

        // User profile name or pushName fallback
        const pushName = msg.pushName || "USER";

        const translations = {
            en: {
                categories: { GENERAL: "GENERAL", TOOLS: "TOOLS", AI: "AI", GROUP: "GROUP" },
                notFound: "No commands found or loaded."
            },
            it: {
                categories: { GENERAL: "GENERALE", TOOLS: "STRUMENTI", AI: "INTELLIGENZA ARTIFICIALE", GROUP: "GRUPPO" },
                notFound: "Nessun comando trovato o caricato."
            },
            ur: {
                categories: { GENERAL: "جنرل", TOOLS: "ٹولز", AI: "اے آئی", GROUP: "گروپ" },
                notFound: "کوئی کمانڈ نہیں ملی۔"
            }
        };

        const t = translations[langCode] || translations["en"];
        const commandsDir = path.join(__dirname);
        const categories = {};

        try {
            if (fs.existsSync(commandsDir)) {
                const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));
                for (const file of commandFiles) {
                    try {
                        const filePath = path.join(commandsDir, file);
                        delete require.cache[require.resolve(filePath)];
                        const command = require(filePath);
                        if (command && command.name) {
                            const rawCat = (command.category || "GENERAL").toUpperCase();
                            const cat = t.categories[rawCat] || rawCat;
                            if (!categories[cat]) categories[cat] = [];
                            categories[cat].push(command.name);
                        }
                    } catch (err) {
                        console.error(`Error loading command file ${file}:`, err);
                    }
                }
            }
        } catch (e) {
            console.error("Error reading commands folder:", e);
        }

        // Build Menu Output matching the exact requested style
        let menuText = 
            `╭═══ THE SYNDICATE ═══⊷\n` +
            `┃❃╭──────────────\n` +
            `┃❃│ Prefix  : ${prefix}\n` +
            `┃❃│ User    : ${pushName}\n` +
            `┃❃│ Time    : ${timeStr}\n` +
            `┃❃│ Day     : ${dayStr}\n` +
            `┃❃│ Date    : ${dateStr}\n` +
            `┃❃│ Version : 2.5.0\n` +
            `┃❃│ Status  : Online\n` +
            `┃❃│ Platform: VPS\n` +
            `┃❃│ Server  : https://discord.gg/syndicateps\n` +
            `┃❃╰───────────────\n` +
            `╰═════════════════⊷\n\n`;

        const sortedCategories = Object.keys(categories).sort();
        if (sortedCategories.length === 0) {
            menuText += ` ╭─❏ ɴᴏᴛ 𝚏𝙾𝚄𝙽𝙳 ❏\n │ ${t.notFound}\n ╰─────────────────\n\n`;
        } else {
            for (const cat of sortedCategories) {
                const fancyCat = cat.toLowerCase(); // keep categories lowercase styled or uppercase as requested
                menuText += ` ╭─❏ ${fancyCat} ❏\n`;
                categories[cat].sort((a, b) => a.localeCompare(b));
                for (const cmdName of categories[cat]) {
                    menuText += ` │ ${fancyFont(cmdName.toUpperCase())}\n`;
                }
                menuText += ` ╰─────────────────\n\n`;
            }
        }

        menuText += 
            `╭═══ THE SYNDICATE ═══⊷\n` +
            `┃\n` +
            `┃\n` +
            `┃\n` +
            `┃❃ Server : https://discord.gg/syndicateps\n` +
            `╰════════════════════⊷`;

        let targetChat = msg.key?.remoteJid || sender;
        if (targetChat) {
            await sock.sendMessage(targetChat, { text: menuText.trim() }, { quoted: msg });
        }
    }
};
