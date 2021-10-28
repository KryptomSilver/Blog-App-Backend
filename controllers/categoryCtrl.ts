import { Response } from "express";
import { IReqAuth } from "../interfaces";
import Categories from "../models/categoryModel";

const categoryCtrl = {
  createCategory: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication" });
    if (req.user.role !== "admin")
      return res.status(400).json({ msg: "Invalid Authentication" });
    try {
      const name = req.body.name.toLowerCase();
      const category = await Categories.findOne({ name });
      const newCategory = new Categories({ name });
      await newCategory.save();
      res.json({ newCategory });
    } catch (error: any) {
      let errorMsg;
      if (error.code === 11000) {
        errorMsg = `Category ${
          Object.values(error.keyValue)[0]
        } already exists!`;
      } else {
        let name = Object.keys(error.errors)[0];
        errorMsg = error.errors[`${name}`].message;
      }
      return res.status(500).json({ msg: errorMsg });
    }
  },
  getCategories: async (req: IReqAuth, res: Response) => {
    try {
      const categories = await Categories.find().select("-createdAt");
      res.json({ categories });
    } catch (error: any) {
      let errorMsg;
      if (error.code === 11000) {
        errorMsg = `Category ${
          Object.values(error.keyValue)[0]
        } already exists!`;
      } else {
        let name = Object.keys(error.errors)[0];
        errorMsg = error.errors[`${name}`].message;
      }
      return res.status(500).json({ msg: errorMsg });
    }
  },
  updateCategory: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication" });
    if (req.user.role !== "admin")
      return res.status(400).json({ msg: "Invalid Authentication" });
    try {
      const category = await Categories.findOne({ _id: req.params.id });
      if (!category)
        return res.status(400).json({ msg: "This category not exists!" });
      await Categories.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        { name: req.body.name.toLowerCase() }
      );
      res.json({ msg: "Update Success!" });
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },
  deleteCategory: async (req: IReqAuth, res: Response) => {
    if (!req.user)
      return res.status(400).json({ msg: "Invalid Authentication" });
    if (req.user.role !== "admin")
      return res.status(400).json({ msg: "Invalid Authentication" });
    try {
      const category = await Categories.findOne({ _id: req.params.id });
      if (!category)
        return res.status(400).json({ msg: "This category not exists!" });
      await Categories.findByIdAndDelete(req.params.id);
      res.json({ msg: "Delete Success!" });
    } catch (error: any) {
      return res.status(500).json({ msg: error.message });
    }
  },
};
export default categoryCtrl;
