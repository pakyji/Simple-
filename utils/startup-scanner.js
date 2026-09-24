const fs = require('fs');
const path = require('path');

function runStartupScan() {
    const commandsDir = path.join(__dirname, '../commands');
    
    if (!fs.existsSync(commandsDir)) {
        console.log("---");
        console.log("*STARTUP COMMAND SUITE AUDIT*");
        console.log("Status: Error - commands/ directory not found.");
        console.log("---");
        return;
    }

    let files = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));
    let validCount = 0;
    let errorFiles = [];

    for (let file of files) {
        try {
            let filePath = path.join(commandsDir, file);
            delete require.cache[require.resolve(filePath)];
            let cmd = require(filePath);

            if (!cmd.name || typeof cmd.execute !== 'function') {
                errorFiles.push(`${file} (missing name or execute function)`);
            } else {
                validCount++;
            }
        } catch (err) {
            errorFiles.push(`${file} (${err.message})`);
        }
    }

    console.log("---");
    console.log("*STARTUP COMMAND SUITE AUDIT*");
    console.log(`Total Files Scanned: ${files.length}`);
    console.log(`Valid Commands: ${validCount}`);
    console.log(`Errors Found: ${errorFiles.length}`);
    if (errorFiles.length > 0) {
        console.log(`Issues:\n- ${errorFiles.join("\n- ")}`);
    } else {
        console.log("Status: All systems operational");
    }
    console.log("---");
}

module.exports = { runStartupScan };
