import { Request, Response } from "express";
import Users from "../models/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { generateActiveToken } from "../config/generateToken";
import { validateEmail, validatePhone } from "../helpers";
import sendEmail from "../config/sendMail";
import { sendSMS } from "../config/sendSMS";
import { IDecodeToken } from "../interfaces/newUser";

const URL_BASE = `${process.env.URL_BASE}`;
const authCtrl = {
  register: async (req: Request, res: Response) => {
    try {
      const { name, account, password } = req.body;
      const user = await Users.findOne({ account });
      if (user)
        return res
          .status(400)
          .json({ msg: "Email or phone number already exists." });
      const passwordHash = await bcrypt.hash(password, 12);
      const newUser = {
        name,
        password: passwordHash,
        account,
      };
      const active_token = generateActiveToken({ newUser });
      const url = `${URL_BASE}/active/${active_token}`;
      if (validateEmail(account)) {
        sendEmail(account, url, "Verify your email address");
        res.status(200).json({ msg: "Success! Please check your email" });
      } else if (validatePhone(account)) {
        sendSMS(account, url, "Verify your phone number");
        res.status(200).json({ msg: "Success! Please check your phone" });
      }
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },
  activeAccount: async (req: Request, res: Response) => {
    try {
      const { active_token } = req.body;
      const decoded = <IDecodeToken>(
        jwt.verify(active_token, `${process.env.ACTIVE_TOKEN_SECRET}`)
      );
      const { newUser } = decoded;
      if (!newUser)
        return res.status(400).json({ msg: "Invalid authentication." });
      const user = new Users(newUser);
      await user.save();
      res.json({ msg: "Account has been activated!" });
    } catch (error: any) {
      console.log(error)
      let errorMsg;
      if (error.code === 11000) {
        errorMsg = Object.keys(error.keyValue)[0] + " already exists.";
      }
      return res.status(500).json({ msg: errorMsg });
    }
  },
};

export default authCtrl;
