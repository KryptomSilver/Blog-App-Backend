import { Response, Request, NextFunction } from "express";
import { validateEmail, validatePhone } from "../helpers";

export const validateRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, account, password } = req.body;
  const errors = [];
  if (!name) {
    errors.push("Please add your name.");
  } else if (name.length > 20) {
    errors.push("Your name is up to 20 chars long.");
  }
  if (!account) {
    errors.push("Please add your account or phone number");
  } else if (!validateEmail(account) && !validatePhone(account)) {
    errors.push("Email or phone number format is incorrect.");
  }
  if (!password) {
    errors.push("Please add your password.");
  } else if (password.length < 6) {
    errors.push("Password must be at least 6 chars");
  }
  if (errors.length > 0) return res.status(400).json({ msg: errors });
  next();
};
