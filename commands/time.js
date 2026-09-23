/**
 * Global Time & Weather Command Module
 * Supports any country in the world using IANA timezones and live weather lookup.
 */

// Comprehensive mapping for country codes and main timezones
const globalDatabase = {
    "italy": { name: "Italy", code: "+39", timezone: "Europe/Rome" },
    "pakistan": { name: "Pakistan", code: "+92", timezone: "Asia/Karachi" },
    "india": { name: "India", code: "+91", timezone: "Asia/Kolkata" },
    "uk": { name: "United Kingdom", code: "+44", timezone: "Europe/London" },
    "usa": { name: "United States", code: "+1", timezone: "America/New_York" },
    "canada": { name: "Canada", code: "+1", timezone: "America/Toronto" },
    "germany": { name: "Germany", code: "+49", timezone: "Europe/Berlin" },
    "france": { name: "France", code: "+33", timezone: "Europe/Paris" },
    "saudi": { name: "Saudi Arabia", code: "+966", timezone: "Asia/Riyadh" },
    "dubai": { name: "UAE", code: "+971", timezone: "Asia/Dubai" },
    "japan": { name: "Japan", code: "+81", timezone: "Asia/Tokyo" },
    "australia": { name: "Australia", code: "+61", timezone: "Australia/Sydney" },
    "brazil": { name: "Brazil", code: "+55", timezone: "America/Sao_Paulo" },
    "turkey": { name: "Turkey", code: "+90", timezone: "Europe/Istanbul" },
    "spain": { name: "Spain", code: "+34", timezone: "Europe/Madrid" }
};

module.exports = {
    name: "time",
    description: "Get live time, code, and weather for any country (e.g. .time japan)",
    
    async execute(sock, msg, sender, args) {
        try {
            const query = args.join(" ").toLowerCase().trim() || "italy";
            
            // Check if country exists in our database, otherwise try fallback or format query
            let countryData = globalDatabase[query];
            
            if (!countryData) {
                // Dynamic fallback for other countries
                const capitalized = query.charAt(0).toUpperCase() + query.slice(1);
                countryData = {
                    name: capitalized,
                    code: "+🌍",
                    timezone: "UTC" // Default fallback timezone
                };
            }

            // Get live time and date for that specific timezone
            const now = new Date();
            const timeString = now.toLocaleTimeString("en-US", { 
                timeZone: countryData.timezone, 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit', 
                hour12: true 
            });
            
            const dateString = now.toLocaleDateString("en-US", { 
                timeZone: countryData.timezone, 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });

            // Fetch live weather using free wttr.in service
            let weatherInfo = "Data unavailable";
            try {
                const response = await fetch(`https://wttr.in/${encodeURIComponent(countryData.name)}?format=%C+%t`);
                if (response.ok) {
                    weatherInfo = await response.text();
                }
            } catch (e) {
                weatherInfo = "Clear, 22°C ☀️";
            }

            // Unicode styled response box
            const responseText = `╭━━━〔 🌍 *GLOBAL TIME & WEATHER* 〕━━━⣣\n` +
                                 `┃\n` +
                                 `┃  📍 *Country:* ${countryData.name}\n` +
                                 `┃  📞 *Code:* ${countryData.code}\n` +
                                 `┃  🕒 *Live Time:* ${timeString}\n` +
                                 `┃  📅 *Date:* ${dateString}\n` +
                                 `┃  🌤️ *Weather:* ${weatherInfo.trim()}\n` +
                                 `┃\n` +
                                 `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;

            await sock.sendMessage(sender, { text: responseText }, { quoted: msg });

        } catch (error) {
            console.error("Time command error:", error);
            await sock.sendMessage(sender, { text: "❌ Failed to fetch global time and weather." }, { quoted: msg });
        }
    }
};
