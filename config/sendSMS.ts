import { Twilio } from "twilio";
const accountSid = `${process.env.TWILIO_ACCOUNT_SID}`;
const authToken = `${process.env.TWILIO_AUTH_TOKEN}`;
const from = `${process.env.TWILIO_PHONE_NUMBER}`;
const client = new Twilio(accountSid, authToken);

export const sendSMS = (to: string, body: string, txt: string) => {
  try {
    client.messages
      .create({
        body: `BLOG ${txt} - ${body}`,
        from,
        to,
      })
      .then((message) => console.log(message.sid));
  } catch (error) {
    console.log(error);
  }
};
