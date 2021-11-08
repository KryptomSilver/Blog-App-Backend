import { Response } from "express";
import { IReqAuth } from "../interfaces";
import Comments from "../models/commentModel";

const commentCtrl = {
  createComment: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication" });
    try {
      const { content, blog_id, blog_user_id } = req.body;
      const newComment = new Comments({
        user: req.user.id,
        content,
        blog_id,
        blog_user_id,
      });
      await newComment.save();
      return res.json(newComment);
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },
};
export default commentCtrl;
