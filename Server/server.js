require("dotenv").config();
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const connectDb = require("./utils/db");

// Import Routes
const clientRoute = require("./routes/client-route");

const allowedOrigins = process.env.FRONTEND_ORIGIN?.split(",") || [];

const app = express();

// Middleware
app.use(compression());
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/clients", clientRoute);

// Root Route
app.get("/", (req, res) => {
  res.status(200).send("🚀 Client Management Backend is running");
});

// Error Handling Middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message || "Internal Server Error",
    extraDetails: error.extraDetails || "No additional information",
  });
});

// Connect to Database & Start Server
connectDb().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
  });
});
