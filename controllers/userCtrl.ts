import { Request, Response } from "express";
import Users from "../models/userModel";
import { IReqAuth } from "../interfaces";

const userCtrl = {
  updateUser: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication" });
    try {
      const { avatar, name } = req.body;
      await Users.findOneAndUpdate({ _id: req.user._id }, { avatar, name });
      res.json({ msg: "Update Success!" });
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },
};
export default userCtrl;
