import "dotenv/config";
import express from "express";
import cors from "cors";

import { connectDB } from "./src/config/db.js";
import testRoutes from "./src/routes/testRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import webhookRoutes from "./src/routes/webhookRoutes.js";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.use("/api/test", testRoutes);
app.use("/api", webhookRoutes); // exposes POST /api/webhook and GET /api/webhooks
app.use("/api", orderRoutes);

app.get("/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 6001;

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Merchant simulator backend running on http://localhost:${PORT}`);
            console.log(`Webhook URL to register: http://localhost:${PORT}/api/webhook`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB:", err.message);
        process.exit(1);
    });
