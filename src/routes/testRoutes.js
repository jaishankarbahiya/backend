import { Router } from "express";
import { createPayment, checkStatus, createPayout } from "../controllers/testController.js";

const router = Router();

router.post("/create-payment", createPayment);
router.post("/check-status", checkStatus);
router.post("/create-payout", createPayout);

export default router;
