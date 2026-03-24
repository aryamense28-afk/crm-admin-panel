const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const gmail = google.gmail({ version: "v1", auth: oauth2Client });

async function sendEmail(to, subject, message) {
  const raw = Buffer.from(
    `To: ${to}\r\nSubject: ${subject}\r\n\r\n${message}`
  ).toString("base64");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  });
}