import mongoose from "mongoose";

const webhookLogSchema = new mongoose.Schema(
    {
        event: { type: String, default: "unknown" },
        paymentId: { type: String },
        payload: { type: mongoose.Schema.Types.Mixed },
        headers: { type: mongoose.Schema.Types.Mixed },
    },
    { timestamps: true }
);

export default mongoose.model("WebhookLog", webhookLogSchema);
