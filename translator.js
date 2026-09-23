const fs = require('fs');
const path = require('path');

const dictionary = {
    it: {
        "Current Status: Disabled": "Stato attuale: Disabilitato",
        "Current Status: Enabled": "Stato attuale: Abilitato",
        "Usage: .antilink on / off": "Uso: .antilink on / off",
        "Success": "Successo",
        "Error": "Errore",
        "Access Denied": "Accesso negato"
    },
    ur: {
        "Current Status: Disabled": "موجودہ حالت: بند ہے (Disabled)",
        "Current Status: Enabled": "موجودہ حالت: چالو ہے (Enabled)",
        "Usage: .antilink on / off": "استعمال کا طریقہ: .antilink on / off",
        "Success": "کامیاب",
        "Error": "خرابی",
        "Access Denied": "رسائی مسترد کر دی گئی"
    }
};

function getActiveLang() {
    try {
        const configPath = path.join(__dirname, "config.json");
        if (fs.existsSync(configPath)) {
            const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            return config.bot?.language ? config.bot.language.toLowerCase() : "en";
        }
    } catch (e) {
        console.error("Language read error:", e);
    }
    return "en";
}

function translateText(text) {
    const lang = getActiveLang();
    if (lang === "en" || !dictionary[lang]) return text;
    
    // Exact match check
    if (dictionary[lang][text]) {
        return dictionary[lang][text];
    }
    
    // Partial match check (agar text ke andar status ya usage ho)
    for (const key in dictionary[lang]) {
        if (text.includes(key)) {
            text = text.replace(key, dictionary[lang][key]);
        }
    }
    
    return text;
}

module.exports = { translateText };
