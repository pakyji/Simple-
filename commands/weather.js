/**
 * Weather Command Module
 * Fetches real-time weather details and temperature for any requested city.
 * Strictly written in English according to project guidelines.
 */

const axios = require('axios');

module.exports = {
    name: "weather",
    description: "Get real-time weather details for any city",
    
    async execute(sock, msg, sender, args) {
        try {
            // Check if the user provided a city name
            if (!args || args.length === 0) {
                await sock.sendMessage(sender, { 
                    text: "❌ Please provide a city name! Example: `.weather London` or `.weather Karachi`" 
                }, { quoted: msg });
                return;
            }

            const cityName = args.join(" ");

            // Using wttr.in public API for simple and reliable weather data in JSON format
            const encodedCity = encodeURIComponent(cityName);
            const apiUrl = `https://wttr.in/${encodedCity}?format=j1`;

            const response = await axios.get(apiUrl);
            const data = response.data;

            // Extract relevant weather details
            const currentCondition = data.current_condition[0];
            const tempC = currentCondition.temp_C;
            const tempF = currentCondition.temp_F;
            const weatherDesc = currentCondition.weatherDesc[0].value;
            const humidity = currentCondition.humidity;
            const windSpeedKmph = currentCondition.windspeedKmph;
            const area = data.nearest_area[0].areaName[0].value;
            const country = data.nearest_area[0].country[0].value;

            // Format the response message
            const responseText = `╭━━━〔 🌤️ *WEATHER REPORT* 🌤️ 〕━━━⣣\n` +
                                 `┃\n` +
                                 `┃  📍 *Location:* ${area}, ${country}\n` +
                                 `┃  🌡️ *Temperature:* ${tempC}°C / ${tempF}°F\n` +
                                 `┃  ☁️ *Condition:* ${weatherDesc}\n` +
                                 `┃  💧 *Humidity:* ${humidity}%\n` +
                                 `┃  🌬️ *Wind Speed:* ${windSpeedKmph} km/h\n` +
                                 `┃\n` +
                                 `┣──────────────────────────┫\n` +
                                 `┃\n` +
                                 `┃  🔗 *Discord Community:*\n` +
                                 `┃  https://discord.gg/syndicateps\n` +
                                 `┃\n` +
                                 `╰━━━━━━━━━━━━━━━━━━━━━━━━━━⣭`;

            await sock.sendMessage(sender, { text: responseText }, { quoted: msg });

        } catch (error) {
            // Log error and notify user if city is not found or API fails
            console.error("Weather command error:", error);
            await sock.sendMessage(sender, { 
                text: "❌ Failed to fetch weather data. Please check the city name and try again." 
            }, { quoted: msg });
        }
    }
};
