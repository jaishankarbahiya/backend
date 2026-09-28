import { Router } from "express";
import { listOrders, getOrder } from "../controllers/orderController.js";

const router = Router();
router.get("/orders", listOrders);
router.get("/orders/:orderId", getOrder);

export default router;