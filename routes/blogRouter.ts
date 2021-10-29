import express from "express";
import blogCtrl from "../controllers/blogCtrl";
import auth from "../middlewares/auth";

const router = express.Router();

router.post("/blog", auth, blogCtrl.createBlog);
router.get("/blog", blogCtrl.getBlogs);
router.get("/blog/:id_category", blogCtrl.getBlogsByCategory);

export default router;
