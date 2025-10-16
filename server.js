// server.js (COMMONJS SYNTAX)
// FULLY SECURE VERSION WITH FINAL VERCEL CORS WHITELIST

// 1. Replace 'import' with 'require()' for all external and internal packages
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const path = require("path");
const mongoose = require("mongoose");
// ✅ Import Task model using require()
const Task = require("./models/Task");

// ===== Environment Setup =====
// In CommonJS, __dirname is natively available.
dotenv.config({ path: path.join(__dirname, "key.env") });

// ===== Initialize app and CORS Configuration (THE SECURE FIX) =====
const app = express();
app.use(express.json());

// 🛑 FINAL SECURE CORS FIX: Whitelist your Vercel Frontend URL
const allowedOrigins = ['https://smart-task-planner-frontend-henna.vercel.app/']; 

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl) and the whitelisted domain
        if (!origin || allowedOrigins.includes(origin)) { 
            callback(null, true);
        } else {
            // Block all other domains
            callback(new Error(`Not allowed by CORS: ${origin}`), false);
        }
    }
};

app.use(cors(corsOptions)); // <-- Apply secure CORS options

// ===== MongoDB connection =====
if (process.env.MONGO_URI) {
    mongoose
        .connect(process.env.MONGO_URI)
        .then(() => console.log("✅ MongoDB connected"))
        .catch((e) => console.warn("⚠️ MongoDB connection error:", e));
} else {
    console.warn("⚠️ No MONGO_URI found in key.env — skipping database connection.");
}

// ===== Debug check for API key =====
console.log(
    "OPENAI_API_KEY:",
    process.env.OPENAI_API_KEY ? "Loaded ✅" : "Missing ❌"
);

// ===== Initialize OpenAI client =====
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// ===== Utility: safe JSON parser =====
const safeJSONParse = (text) => {
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
};

// ===== ROUTE: Generate task plan =====
app.post("/generate-plan", async (req, res) => {
    try {
        const { goal } = req.body;
        if (!goal) return res.status(400).json({ error: "Goal is required" });

        const prompt = `
Break down this goal into actionable tasks with suggested deadlines
and dependencies. Respond strictly in valid JSON format like this:

[
  { "task": "Example task", "deadline": "YYYY-MM-DD or Day 1", "depends_on": [] }
]

Goal: "${goal}"
        `;

        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.6,
        });

        let result = response.choices?.[0]?.message?.content?.trim() || "[]";
        console.log("🧠 AI raw output:", result);

        // 🧹 Clean markdown code fences (```json ... ```)
        if (result.startsWith("```")) {
            result = result.replace(/```json|```/g, "").trim();
        }

        const parsed = safeJSONParse(result);
        if (!parsed || !Array.isArray(parsed)) {
            return res.status(500).json({
                error: "AI returned invalid JSON format",
                raw: result,
            });
        }

        // ✅ Sanitize output
        const sanitized = parsed.map((p, i) => ({
            id: `task-${i + 1}`,
            task: p.task || `Task ${i + 1}`,
            deadline: p.deadline || "",
            depends_on: Array.isArray(p.depends_on) ? p.depends_on : [],
        }));

        // ✅ Save to MongoDB if connected
        if (mongoose.connection.readyState === 1) {
            try {
                await Task.create({ goal, plan: sanitized });
                console.log("💾 Task plan saved to MongoDB");
            } catch (dbErr) {
                console.warn("⚠️ Failed to save to DB:", dbErr.message);
            }
        }

        // ✅ Return plan
        res.json({ goal, plan: sanitized });
    } catch (err) {
        console.error("❌ Error generating plan:", err.message);
        res.status(500).json({ error: "Failed to generate plan" });
    }
});

// ===== ROUTE: Get all saved plans =====
app.get("/plans", async (req, res) => {
    try {
        const plans = await Task.find().sort({ createdAt: -1 });
        res.json(plans);
    } catch (err) {
        console.error("❌ Error fetching plans:", err.message);
        res.status(500).json({ error: "Failed to fetch plans" });
    }
});

// ===== START SERVER =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));                                              
