import Order from "../models/Order.js";

export async function listOrders(req, res) {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(50);
    res.json(orders);
}

export async function getOrder(req, res) {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
}