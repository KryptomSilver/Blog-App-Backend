import { Request, Response } from "express";
import mongoose from "mongoose";
import { IReqAuth } from "../interfaces";
import Blogs from "../models/blogModel";

const pagination = (req: IReqAuth) => {
  let page = Number(req.query.page) * 1 || 1;
  let limit = Number(req.query.limit) * 1 || 4;
  let skip = (page - 1) * limit;
  return { page, limit, skip };
};

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
  getBlogsByCategory: async (req: Request, res: Response) => {
    const { limit, skip } = pagination(req);
    try {
      //Extract category id
      const { id } = req.params;
      //Create object id category
      const idCategory = new mongoose.Types.ObjectId(id);
      const Data = await Blogs.aggregate([
        {
          $facet: {
            totalData: [
              { $match: { category: idCategory } }, //User
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
              //Sort
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },
            ],
            totalCount: [
              { $match: { category: idCategory } },
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

      const blogs = Data[0].totalData;
      const count = Data[0].count;
      let total = 0;
      if (count % limit === 0) {
        total = count / limit;
      } else {
        total = Math.floor(count / limit) + 1;
      }
      res.json({ blogs, total });
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getBlogsByUser: async (req: Request, res: Response) => {
    const { limit, skip } = pagination(req);
    try {
      //Extract category id
      const { id } = req.params;
      //Create object id category
      const idCategory = new mongoose.Types.ObjectId(id);
      const Data = await Blogs.aggregate([
        {
          $facet: {
            totalData: [
              { $match: { user: idCategory } }, //User
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
              //Sort
              { $sort: { createdAt: -1 } },
              { $skip: skip },
              { $limit: limit },
            ],
            totalCount: [{ $match: { user: idCategory } }, { $count: "count" }],
          },
        },
        {
          $project: {
            count: { $arrayElemAt: ["$totalCount.count", 0] },
            totalData: 1,
          },
        },
      ]);

      const blogs = Data[0].totalData;
      const count = Data[0].count;
      let total = 0;
      if (count % limit === 0) {
        total = count / limit;
      } else {
        total = Math.floor(count / limit) + 1;
      }
      res.json({ blogs, total });
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getBlog: async (req: Request, res: Response) => {
    try {
      const blog = await Blogs.findOne({ _id: req.params.id }).populate(
        "user",
        "-password"
      );
      if (!blog) return res.status(404).json({ msg: "Blog not found" });
      res.json(blog);
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

export default blogCtrl;
