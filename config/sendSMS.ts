import { Twilio } from "twilio";
const accountSid = `${process.env.TWILIO_ACCOUNT_SID}`;
const authToken = `${process.env.TWILIO_AUTH_TOKEN}`;
const from = `${process.env.TWILIO_PHONE_NUMBER}`;
const service = `${process.env.TWILIO_SERVICE_SID}`;
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
export const smsOTP = async (to: string, channel: string) => {
  try {
    const data = await client.verify
      .services(service)
      .verifications.create({ to, channel });
    return data;
  } catch (error) {
    console.log(error);
  }
};
export const smsVerify = async (to: string, code: string) => {
  try {
    const data = await client.verify
      .services(service)
      .verificationChecks.create({ to, code });
    return data;
  } catch (error) {
    console.log(error);
  }
};
