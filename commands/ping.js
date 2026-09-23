module.exports = {
    name: "ping",
    description: "Check bot latency and response speed with funny remarks",
    async execute(sock, msg, sender, args) {
        try {
            const startTimestamp = Date.now();
            
            // Send initial measuring message
            const sentMsg = await sock.sendMessage(sender, { text: "🏓 Measuring ping..." }, { quoted: msg });
            
            const endTimestamp = Date.now();
            const latency = endTimestamp - startTimestamp;

            // Pool of 30 funny Urdu/Hinglish comments
            const urduFunnyComments = [
                "Bhai itni fast speed? Lagta hai fiber optic par chai gira di! ☕",
                "Ping toh aisi hai jaise abhi exam se bhaag kar aaya ho! 🏃‍♂️",
                "Net itna slow hai ke message kal subah pohchega! 🐢",
                "Wah bhai! Itni speed dekh kar Wi-Fi router bhi sharma gaya. 😉",
                "Lagta hai server par kisi ne kala jadoo kar diya hai! 🔮",
                "Bhai internet bill time par bhara karo warna itni speed nahi milegi! 💸",
                "⚡ Bijli ki raftar! Lekin bill aane par rona mat.",
                "Tumhara ping dekh kar Einstein bhi soch mein pad gaya. 🧠",
                "Bhai 4G chal raha hai ya kachway ki race? 🐢",
                "Speed itni tez hai ke kal ke messages aaj hi aa rahe hain! ⏳",
                "Lagta hai router ne Red Bull pee li hai! 🐂",
                "Ping aisi hai jaise rishwat de kar pass hua ho! 📜",
                "Bhai mobile ko thodi thandak do, garam ho gaya hai! 🔥",
                "Signal kam hain ya tumhara dimaag kharab hai? 😂",
                "Itni smooth ping ke dil khush ho gaya! ❤️",
                "Server ka mood aaj achha hai, warna itni speed kahan! 🌟",
                "Bhai sahab! Rocket launch kar rahe ho kya? 🚀",
                "Net slow ho toh gussa mat karo, lambi saans lo! 🧘‍♂️",
                "Ping dekh kar lagta hai tum NASA mein kaam karte ho. 🛰️",
                "Connection itna strong hai ke nuclear bomb bhi fail hai! 💣",
                "Bhai yeh ping hai ya rollercoaster ki ride? 🎢",
                "Internet connection ekdum 'Majnu' jaisa hai, kab kat jaye pata nahi! 💔",
                "Speed achhi hai, ab party kab de rahe ho? 🍕",
                "Lagta hai tower tumhare ghar ke andar hi laga hai! 🗼",
                "Ping check karne se battery khatam nahi hoti, par sabar zaroor hota hai! 🔋",
                "Bhai speed itni slow kyu hai? Kabootar se bhej rahe ho kya? 🕊️",
                "Aisi speed ho toh dushman bhi dost ban jaye! 🤝",
                "Connection stable hai, jaise shaadi ke baad promise! 💍",
                "Wah re speed! Dil garden garden ho gaya. 🌸",
                "Ping test pass! Ab chai peene chalte hain. ☕"
            ];

            // Pool of 30 funny English comments
            const englishFunnyComments = [
                "Faster than light! Did you pour coffee on the router? ☕",
                "Ping is so high, it's talking to aliens in outer space. 👽",
                "Your internet speed is running on emotional support only. 🥺",
                "Lightning fast! Even the Wi-Fi router is blushing right now. 😉",
                "Server status: Working harder than a student before exams! 📚",
                "Did you pay your internet bill or are you stealing neighbor's Wi-Fi? 📶",
                "Speed so high, you can download the entire internet by tomorrow. 🌍",
                "Ping is smoother than butter on a hot pancake. 🥞",
                "Is this a 5G connection or a turtle wearing sneakers? 🐢",
                "Your connection is stable, unlike my life choices. 📉",
                "Rocket mode activated! Hold onto your seat. 🚀",
                "Ping looking cleaner than my browser history after midnight. 🕵️‍♂️",
                "Server responded faster than text replies from your crush. 💔",
                "Network speed equivalent to a cheetah on energy drinks. 🐆",
                "Error 404: Slow speed not found! Great connection. ✨",
                "Ping test successful! The Matrix is pleased with you. 🕶️",
                "Connection strength: 100% vibes and zero lag. 🎧",
                "Speed so fast it arrived before you even sent the command! ⏱️",
                "Your router deserves a vacation package to Hawaii. 🏖️",
                "Ping is lower than my patience level on Monday mornings. 🥱",
                "That response was quicker than gossip in a small town. 🗣️",
                "Network running smoothly like a professional skateboarder. 🛹",
                "Are you hosting this server inside NASA headquarters? 🛰️",
                "Ping is fine, but make sure you drink enough water today! 💧",
                "Connection is solid, built like a brick wall. 🧱",
                "Speed check done. Time to celebrate with some snacks! 🍿",
                "The server blinked and missed your message entirely. 👀",
                "Blazing fast speed! Absolute gaming mode unlocked. 🎮",
                "Your internet connection is flexin' on everyone today. 💪",
                "Ping looks great! Everything is fully operational. 🟢"
            ];

            // Combine both pools and pick a random funny comment
            const allComments = [...urduFunnyComments, ...englishFunnyComments];
            const randomComment = allComments[Math.floor(Math.random() * allComments.length)];

            const responseText = 
                `🏓 PONG 🏓\n\n` +
                `⚡ Latency: ${latency}ms\n` +
                `💬 Remark: ${randomComment}`;

            // Send the final response
            await sock.sendMessage(sender, { text: responseText }, { quoted: msg });

        } catch (error) {
            console.error("Ping command error:", error);
            await sock.sendMessage(sender, { text: "❌ Failed to execute ping command." }, { quoted: msg });
        }
    }
};
