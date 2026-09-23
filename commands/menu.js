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

        // Mukammal Multi-language dictionary (EN, IT, UR)
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
                    ascii: "Convert text into ASCII cool stylish art",
                    broadcast: "Broadcast message to all chats while excluding specific JIDs",
                    calc: "Perform mathematical calculations",
                    cat: "Get a random cute cat image",
                    clear: "Delete a specific message by replying to it",
                    dog: "Get a random cute dog image",
                    dua: "Get a daily Islamic Dua",
                    fact: "Get a random interesting fact",
                    fancy: "Convert normal text into stylish fonts and decorations",
                    flip: "Flip text upside down",
                    gennum: "Generate a mock/dummy phone number for a specific country",
                    gta: "Get the latest GTA Online weekly update details and bonuses",
                    hack: "Run a fake funny hacking simulation",
                    hadith: "Get a random Hadith",
                    hidetag: "Tag all group members invisibly with a message",
                    islamicdate: "Get current Hijri/Islamic date",
                    meme: "Get a random funny meme",
                    owner: "Shows the bot community link",
                    pickup: "Get a funny pickup line",
                    ping: "Check bot latency and response speed with funny remarks",
                    poll: "Create a voting poll",
                    prefix: "Change the command prefix of the bot",
                    quote: "Get an inspirational quote",
                    quran: "Get a random Quranic Ayah translation",
                    roast: "Send a light, funny roast",
                    sticker: "Convert any image into a WhatsApp sticker",
                    style: "Convert text or names into stylish fonts",
                    tagall: "Mention all members in the group",
                    take: "Steal or rename a sticker's pack name and author",
                    time: "Get live time, code, and weather for any country",
                    translate: "Translate text to any language",
                    url: "Convert an image into a public URL",
                    vaporwave: "Convert text to aesthetic vaporwave style",
                    weather: "Get real-time weather details for any city",
                    ytmp3: "Download audio from YouTube video links"
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
                    ascii: "Converti il testo in fantastica grafica ASCII",
                    broadcast: "Invia un messaggio broadcast a tutte le chat",
                    calc: "Esegui calcoli matematici",
                    cat: "Ottieni un'immagine di un gattino carino",
                    clear: "Elimina un messaggio specifico rispondendovi",
                    dog: "Ottieni un'immagine di un cane carino",
                    dua: "Ottieni una Dua islamica giornaliera",
                    fact: "Ottieni un fatto interessante casuale",
                    fancy: "Converti il testo normale in caratteri e decorazioni eleganti",
                    flip: "Capovolgi il testo sottosopra",
                    gennum: "Genera un numero di telefono fittizio per un paese specifico",
                    gta: "Ottieni gli ultimi aggiornamenti e bonus settimanali di GTA Online",
                    hack: "Esegui una finta simulazione di hacking divertente",
                    hadith: "Ottieni un Hadith casuale",
                    hidetag: "Tagga tutti i membri del gruppo in modo invisibile",
                    islamicdate: "Ottieni la data islamica/Hijri corrente",
                    meme: "Ottieni un meme divertente casuale",
                    owner: "Mostra il link della community del bot",
                    pickup: "Ottieni una frase di corteggiamento divertente",
                    ping: "Verifica la latenza e la velocità di risposta del bot",
                    poll: "Crea un sondaggio di voto",
                    prefix: "Modifica il prefisso dei comandi del bot",
                    quote: "Ottieni una citazione stimolante",
                    quran: "Ottieni la traduzione casuale di un versetto coranico",
                    roast: "Invia un arrosto leggero e divertente",
                    sticker: "Converti qualsiasi immagine in un adesivo WhatsApp",
                    style: "Converti testo o nomi in caratteri eleganti",
                    tagall: "Menziona tutti i membri nel gruppo",
                    take: "Ottieni o rinomina il pacchetto e l'autore di un adesivo",
                    time: "Ottieni ora, codice e meteo in tempo reale per qualsiasi paese",
                    translate: "Traduci il testo in qualsiasi lingua",
                    url: "Converti un'immagine in un URL pubblico",
                    vaporwave: "Converti il testo in stile estetico vaporwave",
                    weather: "Ottieni dettagli meteorologici in tempo reale per qualsiasi città",
                    ytmp3: "Scarica l'audio dai link video di YouTube"
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
                    ascii: "ٹیکسٹ کو خوبصورت ASCII آرٹ میں تبدیل کریں",
                    broadcast: "تمام چیٹس میں براڈکاسٹ پیغام بھیجیں",
                    calc: "ریاضی کے حساب کتاب کریں",
                    cat: "بلی کی ایک پیاری تصویر حاصل کریں",
                    clear: "کسی پیغام کا جواب دے کر اسے ڈیلیٹ کریں",
                    dog: "کتے کی ایک پیاری تصویر حاصل کریں",
                    dua: "روزانہ کی اسلامی دعا حاصل کریں",
                    fact: "ایک دلچسپ حقیقت حاصل کریں",
                    fancy: "عام ٹیکسٹ کو اسٹائلش فونٹس میں بدلیں",
                    flip: "ٹیکسٹ کو الٹا کریں",
                    gennum: "مخصوص ملک کا نقلی فون نمبر بنائیں",
                    gta: "GTA Online کی ہفتہ وار اپڈیٹس اور بونس حاصل کریں",
                    hack: "جعلی اور مزاحیہ ہیکنگ سیمুলেشن چلائیں",
                    hadith: "ایک مبارک حدیث حاصل کریں",
                    hidetag: "گروپ کے تمام ممبران کو پوشیدہ طور پر ٹیگ کریں",
                    islamicdate: "موجودہ ہجری/اسلامی تاریخ معلوم کریں",
                    meme: "ایک مزاحیہ میم حاصل کریں",
                    owner: "بوٹ کمیونٹی کا لنک دیکھیں",
                    pickup: "ایک مزاحیہ پک اپ لائن حاصل کریں",
                    ping: "بوٹ کی رفتار اور لیٹنسی چیک کریں",
                    poll: "ووٹنگ پول بنائیں",
                    prefix: "بوٹ کا کمانڈ پریفکس تبدیل کریں",
                    quote: "ایک متاثر کن قول حاصل کریں",
                    quran: "قرآن پاک کی آیت کا ترجمہ حاصل کریں",
                    roast: "ایک ہلکا پھلکا اور مزاحیہ روسٹ بھیجیں",
                    sticker: "کسی بھی تصویر کو واٹس ایپ اسٹیکر میں بدلیں",
                    style: "ٹیکسٹ کو اسٹائلش فونٹس میں بدلیں",
                    tagall: "گروپ کے تمام ممبران کو مینشن کریں",
                    take: "اسٹیکر کا پ্যাক نام اور مصنف تبدیل کریں",
                    time: "کسی بھی ملک کا لائیو وقت اور موسم معلوم کریں",
                    translate: "کسی بھی زبان میں متن کا ترجمہ کریں",
                    url: "تصویر کو پبلک یو آر ایل میں تبدیل کریں",
                    vaporwave: "ٹیکسٹ کو ویپورویو اسٹائل میں بدلیں",
                    weather: "کسی بھی شہر کا موسم معلوم کریں",
                    ytmp3: "یوٹیوب ویڈیو سے آڈیو ڈاؤن لوڈ کریں"
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
                            
                            // Smart translation lookup
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
