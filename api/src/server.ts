// Packages
import express, { Request, Response } from "express";
import { config } from "dotenv";
import wwj from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

// Dotenv Config
config();

// App and Port
const app = express();
const PORT: number = Number(process.env.PORT) || 5000;

// Middlewares
app.use(express.json());

const { Client, LocalAuth } = wwj;

// WhatsApp Web Client
const client: wwj.Client = new Client({
  authStrategy: new LocalAuth(),  
});

// Generate QR Code
client.on("qr", (qr) => {
  console.log("Scan the QR Code", qr);
  qrcode.generate(qr, { small: true });
});

// If bot is ready
client.on("ready", () => {
  console.log("Bot is ready");
});

// Test to reply messages
client.on("message", async (message) => {
  if (message.body.toLowerCase() === "salam") {
    message.reply("Salam! Necəsən?");
  } else if (message.body.toLowerCase() === "bot") {
    message.reply("Bəli, mən Express ilə yazılmış WhatsApp botuyam! 🚀");
  }
});

// Express API - send message to any number
app.post("/send", async (req: Request, res: Response): Promise<any> => {
  const { message, number } = req.body;
  console.log(message, number);
  try {
    if (!number || !message) {
      return res.status(400).json({ error: "Number və Message tələb olunur" });
    }

    const chatId = number.includes("@c.us") ? number : `${number}@c.us`;
    await client.sendMessage(chatId, message);
    res.json({ success: true, message: "Mesaj uğurla göndərildi" });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Server Listenning
app.listen(PORT, () => {
  console.log(`Server is working on ${PORT} port`);
});


// Start WhatsApp Client
client.initialize();