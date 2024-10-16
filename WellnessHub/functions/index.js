// Import Firebase functions
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const mailjet = require("node-mailjet");
const bodyParser = require("body-parser");
const fs = require("fs");
const multer = require("multer");
const dotenv = require("dotenv");
dotenv.config();

// Initialize the Mailjet client with environment variables
const apiKey = "8f758c931f6b94b4fe1de04ed7d8d1c3";
const apiSecret = "396828f80f79c00fc1f14c4da3e9485f";
const mailjetClient = mailjet.apiConnect(apiKey, apiSecret);

// Set up multer for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Create a Firebase Cloud Function to send emails
exports.sendEmail = onRequest(upload.single("attachment"), async (req, res) => {
  try {
    const recipientEmail = req.body.recipientEmail;
    const subject = req.body.subject;
    const message = req.body.message;
    const attachment = req.file;

    if (!recipientEmail || !subject || !message) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing required fields." });
    }

    // Convert file buffer to Base64 if an attachment is present
    let base64Content = null;
    if (attachment) {
      base64Content = attachment.buffer.toString("base64");
    }

    const request = mailjetClient.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "netharaathukorala10@gmail.com",
            Name: "Wellness Hub",
          },
          To: [
            {
              Email: recipientEmail,
              Name: "User",
            },
          ],
          Subject: subject,
          TextPart: message,
          Attachments: base64Content
            ? [
                {
                  ContentType: attachment.mimetype,
                  Filename: attachment.originalname,
                  Base64Content: base64Content,
                },
              ]
            : [],
        },
      ],
    });

    const response = await request;
    res.status(200).json({ status: "success", data: response.body });
  } catch (error) {
    logger.error("Error sending email: ", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});
