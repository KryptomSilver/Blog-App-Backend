import express from "express";
import authCtrl from "../controllers/authCtrl";
import { validateRegister } from "../middlewares/validate";

const router = express.Router();

router.post("/register", validateRegister, authCtrl.register);
router.post("/active", authCtrl.activeAccount);

export default router;
