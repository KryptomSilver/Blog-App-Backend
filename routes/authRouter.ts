import express from "express";
import authCtrl from "../controllers/authCtrl";
import { validateRegister } from "../middlewares/validate";

const router = express.Router();

router.post("/register", validateRegister, authCtrl.register);
router.post("/active", authCtrl.activeAccount);
router.post("/login", authCtrl.login);
router.get("/logout", authCtrl.logout);
router.get("/refresh_token", authCtrl.refreshToken);
router.post("/google_login", authCtrl.googleLogin);
router.post("/sms_login", authCtrl.smsLogin);
router.post("/sms_verify", authCtrl.smsVerify);

export default router;
