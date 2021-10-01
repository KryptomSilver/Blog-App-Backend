import { Request, Response } from "express";
import Users from "../models/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { generateActiveToken } from "../config/generateToken";

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
      const active_token = generateActiveToken({newUser});
      res
        .status(200)
        .json({ msg: "Register Successfully.", data: newUser, active_token });
    } catch (error) {
      return res.status(500).json({ msg: error });
    }
  },
};

export default authCtrl;
