import { Request, Response } from "express";
import Users from "../models/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { generateActiveToken } from "../config/generateToken";
import { validateEmail } from "../helpers";
import sendEmail from "../config/sendMail";

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
      if (validateEmail(account)) {
        sendEmail(account, URL_BASE, "Verify your email address");
        res
          .status(200)
          .json({ msg: "Success! Please check your email", data: newUser, active_token });
      }
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },
};

export default authCtrl;
