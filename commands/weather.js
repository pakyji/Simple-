const axios = require("axios");

module.exports = {
    name: "weather",
    description: "Check current weather for any city",
    async execute(sock, msg, sender, args) {
        try {
            const city = args.join(" ");
            if (!city) {
                await sock.sendMessage(sender, { 
                    text: "❌ Per favore inserisci il nome della città! Esempio: `weather London` oppure `weather Rome`" 
                }, { quoted: msg });
                return;
            }

            await sock.sendMessage(sender, { text: `⏳ Cercando le previsioni meteo per *${city}*...` }, { quoted: msg });

            // Usiamo wttr.in in formato JSON per ottenere dati precisi
            const url = `https://wttr.in/${encodeURIComponent(city)}?format=j1`;
            const response = await axios.get(url);
            const data = response.data;

            const current = data.current_condition[0];
            const area = data.nearest_area[0];

            const cityName = area.areaName[0].value;
            const country = area.country[0].value;
            const tempC = current.temp_C;
            const tempF = current.temp_F;
            const desc = current.weatherDesc[0].value;
            const humidity = current.humidity;
            const windSpeed = current.windspeedKmph;

            const weatherText = `╭━━━〔 🌤️ *WEATHER REPORT* 🌤️ 〕━━━⣣\n` +
                                `┃\n` +
                                `┃  📍 *Location:* ${cityName}, ${country}\n` +
                                `┃  🌡️ *Temperature:* ${tempC}°C (${tempF}°F)\n` +
                                `┃  ☁️ *Condition:* ${desc}\n` +
                                `┃  💧 *Humidity:* ${humidity}%\n` +
                                `┃  🌬️ *Wind Speed:* ${windSpeed} km/h\n` +
                                `┃\n` +
                                `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;

            await sock.sendMessage(sender, { text: weatherText }, { quoted: msg });

        } catch (error) {
            console.error("Weather error:", error);
            await sock.sendMessage(sender, { 
                text: "❌ Impossibile trovare il meteo per questa città. Assicurati che il nome sia corretto!" 
            }, { quoted: msg });
        }
    }
};
