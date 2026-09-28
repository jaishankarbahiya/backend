import { Router } from "express";
import { receiveWebhook, listWebhooks } from "../controllers/webhookController.js";

const router = Router();

router.post("/webhook", receiveWebhook);
router.get("/webhooks", listWebhooks);

export default router;
