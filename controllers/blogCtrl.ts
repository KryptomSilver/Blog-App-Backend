import { Request, Response } from "express";
import { IReqAuth } from "../interfaces";
import Blogs from "../models/blogModel";

const blogCtrl = {
  createBlog: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid authentication." });
    try {
      const { title, content, category, thumbnail, description } = req.body;
      const newBlog = new Blogs({
        user: req.user._id,
        title: title.toLowerCase(),
        content,
        category,
        thumbnail,
        description,
      });
      await newBlog.save();
      res.json({ newBlog });
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getBlogs: async (req: Request, res: Response) => {
    try {
      const blogs = await Blogs.aggregate([
        //User
        {
          $lookup: {
            from: "users",
            let: { user_id: "$user" },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
              { $project: { password: 0 } },
            ],
            as: "user",
          },
        },
        { $unwind: "$user" },
        //Category
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: "$category" },
        //Sort
        { $sort: { createdAt: -1 } },
        //Grup
        {
          $group: {
            _id: "$category._id",
            name: { $first: "$category.name" },
            blogs: { $push: "$$ROOT" },
            count: { $sum: 1 },
          },
        },
        //Pagination
        {
          $project: {
            blogs: {
              $slice: ["$blogs", 0, 4],
            },
            count: 1,
            name: 1,
          },
        },
      ]);
      res.json(blogs);
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

export default blogCtrl;
