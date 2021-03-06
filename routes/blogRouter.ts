import express from "express";
import blogCtrl from "../controllers/blogCtrl";
import auth from "../middlewares/auth";

const router = express.Router();

router.post("/blog", auth, blogCtrl.createBlog);
router.get("/blog", blogCtrl.getBlogs);
router.get("/blog/category/:id", blogCtrl.getBlogsByCategory);
router.get("/blog/user/:id", blogCtrl.getBlogsByUser);
router.get("/blog/:id", blogCtrl.getBlog);

export default router;
