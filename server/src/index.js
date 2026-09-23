require("dotenv").config();
const express = require("express");
const cors = require("cors");
const client = require("./config/mongodb");
const getCollections = require("./models/collections");

// Routes
const authRoutes = require("./routes/auth");
const areaRoutes = require("./routes/area");
const userRoutes = require("./routes/user");
const requestRoutes = require("./routes/request");
const blogRoutes = require("./routes/blog");
const paymentRoutes = require("./routes/payment");
const statsRoutes = require("./routes/stats");

const app = express();
const port = process.env.PORT || 5000;

// Allowed origins for CORS
const allowedOrigins = [
  "https://life-flow-donor.vercel.app",
  "http://localhost:5173",
];

// Middleware setup
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 3600,
  }),
);

app.use(express.json());

// Initialize database collections and attach to app
async function initializeCollections() {
  try {
    console.log("📦 Initializing MongoDB collections...");
    const collections = getCollections(client);
    app.locals.DistrictCollection = collections.DistrictCollection;
    app.locals.UpazilaCollection = collections.UpazilaCollection;
    app.locals.usersCollection = collections.usersCollection;
    app.locals.requestsCollection = collections.requestsCollection;
    app.locals.blogCollection = collections.blogCollection;
    app.locals.donationCollection = collections.donationCollection;
    console.log("✅ MongoDB collections initialized successfully!");
  } catch (error) {
    console.error("❌ Failed to initialize collections:", error);
    throw error;
  }
}

// Route setup
function setupRoutes(app) {
  app.use(authRoutes);
  app.use(areaRoutes);
  app.use(userRoutes);
  app.use(requestRoutes);
  app.use(blogRoutes);
  app.use(paymentRoutes);
  app.use(statsRoutes);
}

// Health check endpoint
app.get("/", (req, res) => {
  res.send("LifeFlowDonor server running");
});

// Main function
async function run() {
  try {
    console.log("🚀 Starting LifeFlowDonor server...");
    console.log("📝 Environment Check:");
    console.log(`   - PORT: ${port}`);
    console.log(`   - MONGO_URL: ${process.env.MONGO_URL ? "✅ Set" : "❌ Not set"}`);
    console.log(`   - TOKEN: ${process.env.TOKEN ? "✅ Set" : "❌ Not set"}`);
    console.log(`   - STRIPE_KEY: ${process.env.SECRET_KEY_STRIPE ? "✅ Set" : "❌ Not set"}`);

    // Initialize collections
    await initializeCollections();

    // Setup routes
    setupRoutes(app);

    // Start server
    app.listen(port, () => {
      console.log(
        `✅ LifeFlowDonor server running on port : http://localhost:${port}`,
      );
      console.log("📡 API endpoints ready for requests");
    });

    // Optional: Connect to MongoDB (currently commented out)
    // await client.connect();
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
}

run().catch(console.dir);

module.exports = app;
