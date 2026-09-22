const { setGroupSetting } = require("../utils/settings");

module.exports = {
    name: "antilink",
    description: "Turns anti-link protection on or off for the group",
    execute: async (sock, msg, sender, args) => {
        // Ensure this command is only used in groups
        if (!sender.endsWith("@g.us")) {
            await sock.sendMessage(sender, { text: "❌ This command can only be used inside groups!" }, { quoted: msg });
            return;
        }

        const action = args[1]?.toLowerCase();

        if (action === "on") {
            setGroupSetting(sender, "antiLink", true);
            await sock.sendMessage(sender, { text: "🛡️ Anti-link protection has been turned **ON** for this group." }, { quoted: msg });
        } else if (action === "off") {
            setGroupSetting(sender, "antiLink", false);
            await sock.sendMessage(sender, { text: "🛡️ Anti-link protection has been turned **OFF** for this group." }, { quoted: msg });
        } else {
            await sock.sendMessage(sender, { text: "ℹ️ Usage: `.antilink on` or `.antilink off`" }, { quoted: msg });
        }
    }
};
