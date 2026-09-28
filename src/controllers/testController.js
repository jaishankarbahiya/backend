import axios from "axios";
import Order from "../models/Order.js";

function gatewayHeaders() {
    return {
        "X-API-Key": process.env.GATEWAY_API_KEY,
        "X-API-Secret": process.env.GATEWAY_API_SECRET,
        "Content-Type": "application/json",
    };
}

function baseUrl() {
    return (process.env.GATEWAY_BASE_URL || "").replace(/\/$/, "");
}

// Forwards the gateway's error response as-is where possible,
// so the frontend can show exactly what the gateway said.
function relayError(res, error) {
    if (error.response) {
        return res.status(error.response.status).json(error.response.data);
    }

    return res.status(500).json({ success: false, message: error.message });
}

export async function createPayment(req, res) {
    const { orderId, amount, name, email, mobile } = req.body;
    const finalOrderId = orderId || `ORDER_${Date.now()}`;

    const body = {
        orderId: finalOrderId,
        amount: Number(amount),
        currency: "INR",
        customer: { name, email, mobile },
    };

    try {
        const response = await axios.post(`${baseUrl()}/payments/create`, body, {
            headers: gatewayHeaders(),
        });

        const data = response.data?.data || {};

        await Order.create({
            orderId: finalOrderId,
            paymentId: data.paymentId,
            amount: Number(amount),
            customer: { name, email, mobile },
            status: data.status || "CREATED",
            paymentUrl: data.paymentUrl,
        });

        res.status(response.status).json(response.data);
    } catch (error) {
        relayError(res, error);
    }
}

export async function checkStatus(req, res) {
    const { paymentId } = req.body;

    const path = (process.env.GATEWAY_STATUS_PATH || "/payments/status/{id}").replace(
        "{id}",
        paymentId
    );

    try {
        const response = await axios.get(`${baseUrl()}${path}`, {
            headers: gatewayHeaders(),
        });

        res.status(response.status).json(response.data);
    } catch (error) {
        relayError(res, error);
    }
}

export async function createPayout(req, res) {
    const { holderName, accountNumber, ifsc, amount } = req.body;

    const body = { holderName, accountNumber, ifsc, amount: Number(amount) };

    try {
        const response = await axios.post(`${baseUrl()}/payouts/create`, body, {
            headers: gatewayHeaders(),
        });

        res.status(response.status).json(response.data);
    } catch (error) {
        relayError(res, error);
    }
}
