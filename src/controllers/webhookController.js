import WebhookLog from "../models/WebhookLog.js";
import Order from "../models/Order.js";

export async function receiveWebhook(req, res) {
    const { event, paymentId, orderId, status } = req.body || {};

    await WebhookLog.create({
        event: event || "unknown",
        paymentId,
        payload: req.body,
        headers: req.headers,
    });

    const query = orderId ? { orderId } : { paymentId };

    if (query.orderId || query.paymentId) {
        await Order.findOneAndUpdate(query, {
            status: status || (event === "payment.success" ? "SUCCESS" : event === "payment.failed" ? "FAILED" : undefined),
            lastWebhookEvent: event,
        });
    }

    res.status(200).json({ success: true });
}

export async function listWebhooks(req, res) {
    const logs = await WebhookLog.find().sort({ createdAt: -1 }).limit(50);
    res.json(logs);
}