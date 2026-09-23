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

        // Complete Multi-language dictionary for all commands & categories
        const translations = {
            en: {
                title: "MAIN MENU",
                notFound: "No commands found or loaded.",
                categories: { GENERAL: "GENERAL", TOOLS: "TOOLS", AI: "AI", GROUP: "GROUP" },
                descriptions: {
                    menu: "Shows the main command list",
                    setlang: "Change bot language (en/it/ur)",
                    adduser: "Add a new user to owners/whitelist",
                    install: "Install a new plugin dynamically via raw URL",
                    ai: "Chat with official Google Gemini AI",
                    alive: "Check if the bot is online with latency",
                    "99names": "Get one of the 99 Beautiful Names of Allah",
                    anon: "Send an anonymous message to someone",
                    antilink: "Enable or disable anti-link protection in the group",
                    ascii: "Convert text into ASCII cool stylish art"
                }
            },
            it: {
                title: "MENU PRINCIPALE",
                notFound: "Nessun comando trovato o caricato.",
                categories: { GENERAL: "GENERALE", TOOLS: "STRUMENTI", AI: "INTELLIGENZA ARTIFICIALE", GROUP: "GRUPPO" },
                descriptions: {
                    menu: "Mostra la lista dei comandi principali",
                    setlang: "Cambia la lingua del bot (en/it/ur)",
                    adduser: "Aggiungi un nuovo utente ai proprietari",
                    install: "Installa un nuovo plugin dinamicamente tramite URL",
                    ai: "Chatta con l'IA ufficiale di Google Gemini",
                    alive: "Verifica se il bot è online con la latenza",
                    "99names": "Ottieni uno dei 99 Bellissimi Nomi di Allah",
                    anon: "Invia un messaggio anonimo a qualcuno",
                    antilink: "Abilita o disabilita la protezione anti-link nel gruppo",
                    ascii: "Converti il testo in fantastica grafica ASCII"
                }
            },
            ur: {
                title: "مرکزی مینو",
                notFound: "کوئی کمانڈ نہیں ملی۔",
                categories: { GENERAL: "جنرل", TOOLS: "ٹولز", AI: "اے آئی", GROUP: "گروپ" },
                descriptions: {
                    menu: "مین کمانڈ لسٹ دکھاتا ہے",
                    setlang: "بوٹ کی زبان تبدیل کریں (en/it/ur)",
                    adduser: "نیا یوزر اونرز لسٹ میں شامل کریں",
                    install: "را یو آر ایل کے ذریعے نیا پلگ ان انسٹال کریں",
                    ai: "گوگل جمنای اے آئی کے ساتھ چیٹ کریں",
                    alive: "چیک کریں کہ بوٹ آن لائن ہے یا نہیں",
                    "99names": "اللہ کے 99 پیارے ناموں میں سے ایک حاصل کریں",
                    anon: "کسی کو گمنام پیغام بھیجیں",
                    antilink: "گروپ میں اینٹی لنک پروٹیکشن آن یا آف کریں",
                    ascii: "ٹیکسٹ کو خوبصورت ASCII آرٹ میں تبدیل کریں"
                }
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
                            
                            // Smart translation lookup with fallback to command file description
                            let desc = t.descriptions[command.name] || command.description || "";
                            
                            categories[cat].push({ name: command.name, description: desc });
                        }
                    } catch (err) {
                        console.error(`Error loading command file ${file}:`, err);
                    }
                }
            }
        } catch (e) {
            console.error("Error reading commands folder:", e);
        }

        let menuText = 
            `╔════════════════════════════╗\n` +
            `║     ✦ THE SYNDICATE ✦      ║\n` +
            `╠════════════════════════════╣\n` +
            `║ ${t.title.padEnd(26)}║\n` +
            `║ LANG    :: ${langCode.toUpperCase().padEnd(16)}║\n` +
            `║ PREFIX  :: ${prefix.padEnd(16)}║\n` +
            `╚════════════════════════════╝\n\n`;

        const sortedCategories = Object.keys(categories).sort();
        if (sortedCategories.length === 0) {
            menuText += `┃ ${t.notFound}\n`;
        } else {
            for (const cat of sortedCategories) {
                menuText += `┏━━━━━━━〔 ${cat} 〕━━━━━━━┓\n\n`;
                categories[cat].sort((a, b) => a.name.localeCompare(b.name));
                for (const cmd of categories[cat]) {
                    const desc = cmd.description ? `\n┃   └─ ${cmd.description}` : "";
                    menuText += `┃◈ ${prefix}${cmd.name}${desc}\n┃\n`;
                }
                menuText += `┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n\n`;
            }
        }

        let targetChat = msg.key?.remoteJid || sender;
        if (targetChat) {
            await sock.sendMessage(targetChat, { text: menuText.trim() }, { quoted: msg });
        }
    }
};
