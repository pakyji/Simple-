const fs = require("fs");
const path = require("path");
const https = require("https");

module.exports = {
    name: "install",
    category: "TOOLS",
    description: "Install a new plugin dynamically via raw URL",
    execute: async (sock, msg, sender, args) => {
        let prefix = ",";
        const configPath = path.join(__dirname, "../config.json");
        if (fs.existsSync(configPath)) {
            try {
                const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                if (config.bot?.prefix) prefix = config.bot.prefix;
            } catch (e) {
                console.error("Error reading config.json:", e);
            }
        }

        const pluginUrl = args && args[0] ? args[0] : "";

        if (!pluginUrl) {
            return await sock.sendMessage(sender, { 
                text: `*✦ THE SYNDICATE INSTALLER ✦*\n\nUsage: ${prefix}install <raw_url>` 
            }, { quoted: msg });
        }

        https.get(pluginUrl, (res) => {
            let codeContent = "";

            res.on("data", (chunk) => {
                codeContent += chunk;
            });

            res.on("end", async () => {
                try {
                    const parsedUrl = new URL(pluginUrl);
                    let fileName = path.basename(parsedUrl.pathname);

                    if (!fileName.endsWith('.js')) {
                        throw new Error("File must be a .js file");
                    }

                    let pluginName = fileName.replace('.js', '');
                    const nameMatch = codeContent.match(/name\s*:\s*["']([^"']+)["']/i);
                    if (nameMatch && nameMatch[1]) {
                        pluginName = nameMatch[1].toLowerCase();
                    }

                    const targetPath = path.join(__dirname, `${pluginName}.js`);
                    fs.writeFileSync(targetPath, codeContent, 'utf8');

                    await sock.sendMessage(sender, { 
                        text: `*SUCCESS:* Plugin *${pluginName}.js* installed successfully!` 
                    }, { quoted: msg });

                } catch (err) {
                    await sendError();
                }
            });

        }).on("error", async () => {
            await sendError();
        });

        async function sendError() {
            await sock.sendMessage(sender, { 
                text: `*ERROR:* Failed to download or save the plugin.` 
            }, { quoted: msg });
        }
    }
};
