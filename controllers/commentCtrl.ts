import { Request, Response } from "express";
import mongoose from "mongoose";
import { IReqAuth } from "../interfaces";
import Comments from "../models/commentModel";

const pagination = (req: IReqAuth) => {
  let page = Number(req.query.page) * 1 || 1;
  let limit = Number(req.query.limit) * 1 || 4;
  let skip = (page - 1) * limit;
  return { page, limit, skip };
};
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
  getComments: async (req: Request, res: Response) => {
    const { limit, skip } = pagination(req);
    try {
      const idBlog = new mongoose.Types.ObjectId(req.params.id);
      const data = await Comments.aggregate([
        {
          $facet: {
            totalData: [
              {
                $match: {
                  blog_id: idBlog,
                },
              },
              {
                $lookup: {
                  from: "users",
                  localField: "user",
                  foreignField: "_id",
                  as: "user",
                },
              },
              { $unwind: "$user" },
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },
            ],
            totalCount: [
              {
                $match: {
                  blog_id: idBlog,
                },
              },
              { $count: "count" },
            ],
          },
        },
        {
          $project: {
            count: { $arrayElemAt: ["$totalCount.count", 0] },
            totalData: 1,
          },
        },
      ]);
      const comments = data[0].totalData;
      const count = data[0].count;
      let total = 0;
      if (count % limit === 0) {
        total = count / limit;
      } else {
        total = Math.floor(count / limit) + 1;
      }
      return res.json({ comments, total });
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },
};
export default commentCtrl;
