require("dotenv").config();

const express = require("express");
const cors = require("cors");
const webpush = require("web-push");

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173"
    })
);

app.use(express.json());

const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;

webpush.setVapidDetails(
    "mailto:your-email@example.com",
    publicKey,
    privateKey
);


// ===============================
// TEST PUSH
// ===============================

app.post("/test", async (req, res) => {
    const { subscription } = req.body;

    if (!subscription) {
        return res.status(400).json({
            error: "Subscription is required"
        });
    }

    try {
        await webpush.sendNotification(
            subscription,
            JSON.stringify({
                title: "MediGuide AI 💊",
                body: "Node Web Push is working!",
                data: {
                    type: "test"
                }
            })
        );

        console.log("TEST PUSH SENT");

        res.json({
            success: true
        });

    } catch (error) {
        console.error("TEST PUSH FAILED");
        console.error("Status:", error.statusCode);
        console.error("Body:", error.body);

        res.status(500).json({
            success: false,
            status: error.statusCode,
            error: error.body || error.message
        });
    }
});


// ===============================
// GENERAL PUSH
// ===============================

app.post("/send", async (req, res) => {
    const {
        subscription,
        title,
        body,
        data
    } = req.body;

    if (!subscription) {
        return res.status(400).json({
            error: "Push subscription is required"
        });
    }

    try {
        const payload = JSON.stringify({
            title: title || "MediGuide AI 💊",
            body: body || "It's time to take your medicine.",
            data: data || {}
        });

        await webpush.sendNotification(
            subscription,
            payload
        );

        console.log("Push notification sent successfully");

        res.json({
            success: true,
            message: "Push notification sent"
        });

    } catch (error) {
        console.error("Push notification failed:");
        console.error("Status:", error.statusCode);
        console.error("Body:", error.body);

        res.status(500).json({
            success: false,
            status: error.statusCode,
            error: error.body || error.message
        });
    }
});


// ===============================
// START SERVER
// ===============================

app.listen(3001, () => {
    console.log(
        "Push service running on http://127.0.0.1:3001"
    );
});