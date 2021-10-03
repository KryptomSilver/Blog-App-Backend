import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";

const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";

const CLIENT_ID = `${process.env.MAIL_CLIENT_ID}`;
const CLIENT_SECRET = `${process.env.MAIL_CLIENT_SECRET}`;
const REFRESH_TOKEN = `${process.env.MAIL_REFRESH_TOKEN}`;
const SENDER_EMAIL = `${process.env.SENDER_EMAIL_ADDRESS}`;

//Send email
const sendEmail = async (to: string, url: string, txt: string) => {
  const oAuth2Client = new OAuth2Client(
    CLIENT_ID,
    CLIENT_SECRET,
    OAUTH_PLAYGROUND
  );
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  try {
    const access_token = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: SENDER_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
      },
    });
    const mailOptions = {
      from: SENDER_EMAIL,
      to: to,
      subject: txt,
      html: `<h1>Verify your email address:</h1>
      <p>${url}</p>
      `,
      auth: {
        user: SENDER_EMAIL,
        refreshToken: REFRESH_TOKEN,
        accessToken: access_token,
      },
    };
    const result = await transport.sendMail(mailOptions);
    return result
  } catch (error) {
    return error;
  }
};
export default sendEmail;
