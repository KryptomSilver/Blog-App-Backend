import { Response, Request, NextFunction } from "express";
import { validateEmail, validatePhone } from "../helpers";

export const validateRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, account, password } = req.body;
  if (!name) {
    return res.status(400).json({ msg: "Please add your name." });
  } else if (name.length > 20) {
    return res.status(400).json({ msg: "Your name is up to 20 chars long." });
  }
  if (!account) {
    return res
      .status(400)
      .json({ msg: "Please add your account or phone number" });
  } else if (!validateEmail(account) && !validatePhone(account)) {
    return res
      .status(400)
      .json({ msg: "Email or phone number format is incorrect." });
  }
  if (!password) {
    return res.status(400).json({ msg: "Please add your password." });
  } else if (password.length < 6) {
    return res.status(400).json({ msg: "Password must be at least 6 chars" });
  }
  next();
};
