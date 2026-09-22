const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  Browsers
} = require("@whiskeysockets/baileys");

const P = require("pino");
const readline = require("readline");

const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER;

if (!WHATSAPP_NUMBER) {
  console.error("ERROR: WHATSAPP_NUMBER environment variable is missing.");
  process.exit(1);
}

const phoneNumber = WHATSAPP_NUMBER.replace(/\D/g, "");

if (!phoneNumber) {
  console.error("ERROR: WHATSAPP_NUMBER is invalid.");
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function startBot() {
  console.log("================================");
  console.log("WHATSAPP BOT STARTING");
  console.log("================================");
  console.log("Number:", phoneNumber);

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

    syncFullHistory: false
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async (update) => {
    const {
      connection,
      lastDisconnect,
      qr
    } = update;

    if (qr) {
      console.log("QR CODE RECEIVED");
    }

    if (connection === "connecting") {
      console.log("Connecting to WhatsApp...");
    }

    if (connection === "open") {
      console.log("================================");
      console.log("WHATSAPP CONNECTED SUCCESSFULLY");
      console.log("================================");

      rl.close();
    }

    if (connection === "close") {
      console.log("================================");
      console.log("WHATSAPP CONNECTION CLOSED");
      console.log("================================");

      const statusCode =
        lastDisconnect?.error?.output?.statusCode;

      console.log("Disconnect status code:", statusCode);

      if (statusCode === DisconnectReason.loggedOut) {
        console.log("WhatsApp session was logged out.");
        console.log("Delete auth_info_baileys and pair again.");
        process.exit(1);
      }

      console.log("Connection closed. Restarting...");

      setTimeout(() => {
        startBot().catch((err) => {
          console.error("Restart error:", err);
        });
      }, 3000);
    }
  });

  if (!state.creds.registered) {
    try {
      console.log("================================");
      console.log("GENERATING PAIRING CODE");
      console.log("================================");

      const code = await sock.requestPairingCode(phoneNumber);

      console.log("");
      console.log("================================");
      console.log("PAIRING CODE:", code);
      console.log("================================");
      console.log("");
      console.log("WhatsApp > Linked Devices > Link a Device");
      console.log("Enter this pairing code on your phone.");
      console.log("");
    } catch (error) {
      console.error("PAIRING CODE ERROR:");
      console.error(error);
    }
  } else {
    console.log("Existing WhatsApp session found.");
    console.log("Waiting for connection...");
  }
}

startBot().catch((error) => {
  console.error("FATAL ERROR:");
  console.error(error);
});
