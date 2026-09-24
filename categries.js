// ==========================================
// THE SYNDICATE - Complete Categories & Menu Module
// ==========================================

const DEFAULT_CATEGORIES = {
    GENERAL: [
        "99names", "ai", "alive", "anon", "antilink", "ascii", "broadcast", 
        "calc", "cat", "clear", "dog", "dua", "fact", "fancy", "flip", 
        "gennum", "gta", "hack", "hadith", "hidetag", "islamicdate", "meme", 
        "menu", "owner", "pickup", "ping", "poll", "prefix", "quote", 
        "quran", "roast", "sticker", "style", "tagall", "take", "time", 
        "translate", "url", "vaporwave", "weather", "ytmp3"
    ],
    TOOLS: [
        "adduser", "install", "setlang"
    ]
};

// Multi-language translations for category headers and UI elements
const MENU_LOCALES = {
    en: {
        title: "THE SYNDICATE",
        mainMenu: "MAIN MENU",
        lang: "LANG",
        prefix: "PREFIX",
        general: "GENERAL",
        tools: "TOOLS",
        misc: "MISC"
    },
    it: {
        title: "IL SINDACATO",
        mainMenu: "MENU PRINCIPALE",
        lang: "LINGUA",
        prefix: "PREFISSO",
        general: "GENERALE",
        tools: "STRUMENTI",
        misc: "VARIE"
    },
    ur: {
        title: "دی سندیکیٹ",
        mainMenu: "مین مینو",
        lang: "زبان",
        prefix: "پریفکس",
        general: "جنرل",
        tools: "ٹूलز",
        misc: "متفرق"
    }
};

/**
 * Automatically assigns a category to a command.
 * If the command isn't in any default list, it falls back to "MISC".
 */
function getCategoryForCommand(commandName, customCategories = {}) {
    const categories = { ...DEFAULT_CATEGORIES, ...customCategories };
    const cleanCmd = commandName.toLowerCase().replace(/^[,\.\/#!$%^&*;:{}=\-_`~()]/, "");
    
    for (const [catName, cmds] of Object.entries(categories)) {
        if (cmds.includes(cleanCmd)) {
            return catName;
        }
    }
    
    return "MISC";
}

/**
 * Registers a new command dynamically (e.g., after using .install).
 */
function registerNewCommand(commandName, categoryName = null, customCategories = {}) {
    const categories = { ...DEFAULT_CATEGORIES, ...customCategories };
    const cleanCmd = commandName.toLowerCase().replace(/^[,\.\/#!$%^&*;:{}=\-_`~()]/, "");
    const targetCat = categoryName ? categoryName.toUpperCase() : getCategoryForCommand(cleanCmd, categories);
    
    if (!categories[targetCat]) {
        categories[targetCat] = [];
    }
    
    if (!categories[targetCat].includes(cleanCmd)) {
        categories[targetCat].push(cleanCmd);
        console.log(`[SYNDICATE] Command '${cleanCmd}' automatically added to category '${targetCat}'.`);
    }
    
    return categories;
}

/**
 * Generates the fully localized dynamic menu box structure.
 */
function generateDynamicMenu(currentLang = "en", activeCommands = {}) {
    const lang = MENU_LOCALES[currentLang] || MENU_LOCALES.en;
    const allCategories = { ...DEFAULT_CATEGORIES, ...activeCommands };
    
    let menuText = `╔════════════════════════════╗\n`;
    menuText += `║     ✦ ${lang.title} ✦      ║\n`;
    menuText += `╠════════════════════════════╣\n`;
    menuText += `║ ${lang.mainMenu.padEnd(25, " ")} ║\n`;
    menuText += `║ ${lang.lang}    :: ${currentLang.toUpperCase().padEnd(17, " ")} ║\n`;
    menuText += `║ ${lang.prefix}  :: ,              ║\n`;
    menuText += `╚════════════════════════════╝\n\n`;

    for (const [catName, cmds] of Object.entries(allCategories)) {
        if (!cmds || cmds.length === 0) continue;
        
        let displayCatName = lang[catName.toLowerCase()] || catName;
        menuText += `┏━━━━━━━〔 ${displayCatName.toUpperCase()} 〕━━━━━━━┓\n\n`;
        
        cmds.forEach(cmd => {
            menuText += `┃◈ ,${cmd}\n`;
            menuText += `┃   └─ Command handler for ${cmd}\n\n`;
        });
        
        menuText += `┗━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n\n`;
    }

    return menuText;
}

module.exports = {
    DEFAULT_CATEGORIES,
    MENU_LOCALES,
    getCategoryForCommand,
    registerNewCommand,
    generateDynamicMenu
};
