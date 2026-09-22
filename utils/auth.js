const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../approved_users.json");

// Initialize approved_users.json if it doesn't exist
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
}

function isApproved(jid) {
    try {
        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
        return data.includes(jid);
    } catch (error) {
        return false;
    }
}

function approveUser(jid) {
    try {
        const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
        if (!data.includes(jid)) {
            data.push(jid);
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error("Error approving user:", error);
    }
}

module.exports = { isApproved, approveUser };
                                                      
