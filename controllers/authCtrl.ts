import { Request, Response, Router } from "express";
import Users from "../models/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  generateAccessToken,
  generateActiveToken,
  generateRefreshToken,
} from "../config/generateToken";
import { validateEmail, validatePhone } from "../helpers";
import { sendEmail } from "../config/sendEmail";
import { sendSMS } from "../config/sendSMS";
import { IDecodeToken, IUser } from "../interfaces/newUser";

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
      const user = await Users.findOne({ account: newUser.account });
      if (user) return res.status(400).json({ msg: "Account already exists." });
      const new_user = new Users(newUser);
      await new_user.save();
      res.json({ msg: "Account has been activated!" });
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },
  login: async (req: Request, res: Response) => {
    try {
      const { account, password } = req.body;
      const user = await Users.findOne({ account });
      if (!user)
        return res.status(404).json({ msg: "This account does not exists." });
      loginUser(user, password, res);
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },
  logout: async (req: Request, res: Response) => {
    try {
      res.clearCookie("refreshtoken", {
        path: "/api/refresh_token",
      });
      return res.json({ msg: "Logged out!" });
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },
  refreshToken: async (req: Request, res: Response) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token) return res.status(400).json({ msg: "Please login now!" });
      const decoded = <IDecodeToken>(
        jwt.verify(rf_token, `${process.env.REFRESH_TOKEN_SECRET}`)
      );
      console.log(typeof decoded.id);
      if (!decoded.id)
        return res.status(400).json({ msg: "Please login now!" });

      const user = await Users.findById(decoded.id).select("-password");
      if (!user)
        return res.status(400).json({ msg: "This account does not exist." });
      const access_token = generateAccessToken({ id: user._id });
      res.json({ access_token });
    } catch (error) {
      return res.status(500).json({ msg: "hola" });
    }
  },
};
const loginUser = async (user: IUser, password: string, res: Response) => {
  try {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(500).json({ msg: "Password is incorrect." });
    const access_token = generateAccessToken({ id: user._id });
    const refresh_token = generateRefreshToken({ id: user._id });
    res.cookie("refreshtoken", refresh_token, {
      httpOnly: true,
      path: "/api/refresh_token",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    res.json({
      msg: "Login Success!",
      access_token,
      user: { ...user._doc, password: "" },
    });
  } catch (error) {
    console.log(error);
  }
};

export default authCtrl;
