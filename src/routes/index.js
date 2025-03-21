import { Router } from "express";
import userRouter from "./users.js";

const router = Router();

router.use(userRouter);

export default router;
