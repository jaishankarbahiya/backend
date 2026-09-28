import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        orderId: { type: String, required: true, unique: true },
        paymentId: { type: String },
        amount: { type: Number, required: true },
        currency: { type: String, default: "INR" },
        customer: { name: String, email: String, mobile: String },
        status: {
            type: String,
            enum: ["CREATED", "PENDING", "UNDER_VERIFICATION", "SUCCESS", "FAILED", "EXPIRED"],
            default: "CREATED",
        },
        paymentUrl: { type: String },
        lastWebhookEvent: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);