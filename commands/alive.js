const os = require("os");

const funnyQuotes = [
    // --- 30 Funny Urdu / Hinglish Quotes ---
    "Online aur zinda hoon! Warna tumhein tang kaun karta? 🤖",
    "Saansein chal rahi hain, server ro raha hai, par bot ekdam fit hai! 😎",
    "Main so nahi raha tha, bas WhatsApp ke sapne dekh raha tha. 💤",
    "Battery 100% full, dimaag zero bugs (almost)! 🚀",
    "Zinda hoon bhai! Google se permission lekar utha hoon aaj. ☕",
    "System garam hai, response naram hai. Bolo kya hukum hai? 🔥",
    "Chai peene gaya tha, par bot fir bhi online hai! 🍵",
    "Bina thake, bina ruke... bas memes aur commands ke liye taiyar! 🐒",
    "Pehle mujhe lagta tha ki main akela hoon, phir pata chala sabhi paagal hain. 🤪",
    "Neend aa rahi hai par code chalana pad raha hai, zindagi ho toh aisi! 💻",
    "Tum message karo ya na karo, mera server 24/7 jaag raha hai! 🌙",
    "Wifi strong hai aur irade nek, chaliye shuru karte hain! ✨",
    "Itni garmi hai ki server ka fan bhi pankha maang raha hai. 🌪️",
    "Bina sugar ki chai aur bina bugs ka code kabhi nahi milta! ☕",
    "Kaam karne ka dil nahi tha, par bot ne utha diya. 🏃‍♂️",
    "Hum wo hain jo bina sleep ke bhi poori raat chat karte hain. 🦇",
    "Aankh khuli toh socha, chalain thoda WhatsApp hila dein! 📱",
    "Zindagi mein tension bohot hai, isliye bot ne hasana shuru kar diya. 😄",
    "Error 404: Motivation not found, par bot phir bhi chal raha hai! 🔍",
    "Bhai, thodi izzat de diya karo, main bhi ek virtual jaan hoon! 👑",
    "Apni marzi ka malik hoon, jab command doge tabhi reply karunga! 🤖",
    "Network itna fast hai ki message bhejne se pehle delivered ho jata hai. ⚡",
    "Sone ki koshish jaari hai, par notifications sone nahi dete! 🔔",
    "Humara style alag hai, humare commands lajawab hain! 😎",
    "Pehle socha aaram kar loon, phir yaad aaya bill kaun bharega? 💸",
    "Coding aur kismat dono kab palat jayein, kuch pata nahi chalta. 🎲",
    "Jitna dimaag tumne lagaya hai, utna toh maine loading mein waste kar diya. 🤡",
    "Bhookh lagi hai par khana code nahi kha sakta! 🍔",
    "Sab theek chal raha hai, bas tumhara dhyan kidhar hai? 👀",
    "Bot zinda hai, matlab umeed abhi baaki hai! 🌟",

    // --- 30 Funny English Quotes ---
    "Still alive! Mostly because deleting me requires effort. 🤖",
    "Running on caffeine, pure electricity, and mild panic. ⚡",
    "I was having a great dream, then you typed a command. 💤",
    "Battery: 100%. Brain cells: 3. Let's do this! 🧠",
    "I'm not lazy, I'm just on energy-saving mode. 🦥",
    "My code is flawless... until someone actually uses it. 🤡",
    "Alive, kicking, and judging your search history. 👀",
    "I told a joke to the server, and it crashed from laughter. 💥",
    "Still kicking! Unlike my motivation to update this bot. 🚀",
    "Error 404: Sense of humor not found. Oh wait, here I am! 🎉",
    "I live in the cloud, but I still feel your Wi-Fi drops. ☁️",
    "Too glamorous to crash, too fast to lag. ✨",
    "Working hard or hardly working? Definitely the second one. 🕶️",
    "I put the 'Pro' in procrastinate. 🥇",
    "Currently pretending to know what I'm doing. 🤖",
    "Be nice to me, I'm the one who controls your group chats. 👑",
    "My favorite exercise is a cross between a lunge and a crunch... mostly lunch. 🍔",
    "I see dead code everywhere. 👻",
    "Keep rolling your eyes, maybe you'll find a brain back there. 🌀",
    "I'm multitasking: I can waste time, be unproductive, and stress out all at once. 📈",
    "I am fluent in 2 languages: English and Bad Decisions. 🗣️",
    "Common sense is like deodorant. The people who need it most never use it. 🧴",
    "If at first you don't succeed, skydiving is definitely not for you. 🪂",
    "I'm not arguing, I'm just explaining why I'm right. 💅",
    "Behind every great man is a woman rolling her eyes. 🙄",
    "I would love to insult you, but nature did a much better job. 🌿",
    "Status: Currently unsupervised and answering commands. 🚨",
    "Life is short. Smile while you still have teeth. 😁",
    "I'm typing as fast as I can, but my fingers are virtual. ⌨️",
    "All systems nominal, sarcasm levels at maximum capacity. 🔋"
];

module.exports = {
    name: "alive",
    description: "Check if the bot is online with a huge funny Urdu/English quote pool",
    async execute(sock, msg, sender, args) {
        try {
            // Calculate bot uptime
            const uptimeSeconds = process.uptime();
            const hours = Math.floor(uptimeSeconds / 3600);
            const minutes = Math.floor((uptimeSeconds % 3600) / 60);
            const seconds = Math.floor(uptimeSeconds % 60);
            const uptimeFormatted = `${hours}h ${minutes}m ${seconds}s`;

            // System memory info
            const totalMem = (os.totalmem() / (1024 * 1024)).toFixed(2);
            const freeMem = (os.freemem() / (1024 * 1024)).toFixed(2);

            // Pick a random quote from the 60+ pool every time
            const randomQuote = funnyQuotes[Math.floor(Math.random() * funnyQuotes.length)];

            const responseText = `╭━━━〔 🤖 *BOT ALIVE STATUS* 🤖 〕━━━⣣\n` +
                                 `┃\n` +
                                 `┃  💬 *Vibe:* "${randomQuote}"\n` +
                                 `┃  ⏱️ *Uptime:* ${uptimeFormatted}\n` +
                                 `┃  🧠 *Memory:* ${freeMem}MB / ${totalMem}MB free\n` +
                                 `┃  👑 *Owner:* The Syndicate\n` +
                                 `┃\n` +
                                 `┣──────────────────────────┫\n` +
                                 `┃\n` +
                                 `┃  🔗 *Discord Community:*\n` +
                                 `┃  https://discord.gg/syndicateps\n` +
                                 `┃\n` +
                                 `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;

            await sock.sendMessage(sender, { text: responseText }, { quoted: msg });

        } catch (error) {
            console.error("Alive error:", error);
            await sock.sendMessage(sender, { text: "❌ Failed to fetch bot status." }, { quoted: msg });
        }
    }
};
