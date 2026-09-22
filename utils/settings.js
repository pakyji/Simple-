const fs = require("fs");
const path = require("path");

const settingsPath = path.join(__dirname, "../settings.json");

if (!fs.existsSync(settingsPath)) {
    fs.writeFileSync(settingsPath, JSON.stringify({}));
}

function getGroupSettings(groupId) {
    try {
        const data = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
        return data[groupId] || { antiLink: false };
    } catch (error) {
        return { antiLink: false };
    }
}

function setGroupSetting(groupId, key, value) {
    try {
        const data = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
        if (!data[groupId]) {
            data[groupId] = { antiLink: false };
        }
        data[groupId][key] = value;
        fs.writeFileSync(settingsPath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error saving group setting:", error);
    }
}

module.exports = { getGroupSettings, setGroupSetting };
