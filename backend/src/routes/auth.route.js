import { authCallback } from "../controller/auth.controller.js";
import { Router } from "express";

const router = Router();

router.post('/callback', authCallback);

export default router;