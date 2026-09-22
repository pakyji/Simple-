const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  Browsers
} = require("@whiskeysockets/baileys");

const P = require("pino");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("WhatsApp Bot is running.");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER;

if (!WHATSAPP_NUMBER) {
  console.error("BOT STARTUP ERROR:");
  console.error("WHATSAPP_NUMBER environment variable is missing.");
  process.exit(1);
}

const phoneNumber = WHATSAPP_NUMBER.replace(/\D/g, "");

if (!phoneNumber) {
  console.error("BOT STARTUP ERROR:");
  console.error("WHATSAPP_NUMBER is invalid.");
  process.exit(1);
}

async function startBot() {
  try {
    console.log("Starting WhatsApp connection...");

    const { state, saveCreds } =
      await useMultiFileAuthState("./auth_info_baileys");

    const sock = makeWASocket({
      auth: state,

      logger: P({
        level: "silent"
      }),

      browser: Browsers.ubuntu("WhatsApp Bot"),

      markOnlineOnConnect: false,

      generateHighQualityLinkPreview: false,

      syncFullHistory: false,

      connectTimeoutMs: 60000,

      defaultQueryTimeoutMs: 60000
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", async (update) => {
      const {
        connection,
        lastDisconnect
      } = update;

      if (connection === "connecting") {
        console.log("Connecting to WhatsApp...");
      }

      if (connection === "open") {
        console.log("================================");
        console.log("WHATSAPP CONNECTED SUCCESSFULLY");
        console.log("================================");
      }

      if (connection === "close") {
        const statusCode =
          lastDisconnect?.error?.output?.statusCode;

        console.log("================================");
        console.log("WHATSAPP CONNECTION CLOSED");
        console.log("================================");
        console.log("Disconnect status code:", statusCode);

        if (statusCode === DisconnectReason.loggedOut) {
          console.log("WhatsApp session was logged out.");
          console.log("Delete auth_info_baileys and pair again.");
          process.exit(1);
        }

        console.log("Connection closed. Restarting in 3 seconds...");

        setTimeout(() => {
          startBot().catch((error) => {
            console.error("RESTART ERROR:");
            console.error(error);
          });
        }, 3000);
      }
    });

    if (!state.creds.registered) {
      console.log("================================");
      console.log("GENERATING PAIRING CODE");
      console.log("================================");

      try {
        const code = await sock.requestPairingCode(phoneNumber);

        console.log("");
        console.log("================================");
        console.log("PAIRING CODE:", code);
        console.log("================================");
        console.log("");
        console.log("On your phone:");
        console.log("WhatsApp > Linked Devices > Link a Device");
        console.log("Enter the pairing code shown above.");
        console.log("");
      } catch (error) {
        console.error("PAIRING CODE ERROR:");
        console.error(error);
      }
    } else {
      console.log("Existing WhatsApp session found.");
      console.log("Waiting for WhatsApp connection...");
    }

  } catch (error) {
    console.error("");
    console.error("BOT STARTUP ERROR:");
    console.error(error);
    console.error("");
  }
}

startBot();
