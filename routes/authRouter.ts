import express from "express";
import authCtrl from "../controllers/authCtrl";
import { validateRegister } from "../middlewares/validate";

const router = express.Router();

router.post("/register", validateRegister, authCtrl.register);
router.post("/active", authCtrl.activeAccount);
router.post("/login", authCtrl.login);
router.get("/logout", authCtrl.logout);
router.get("/refresh_token", authCtrl.refreshToken);

export default router;
