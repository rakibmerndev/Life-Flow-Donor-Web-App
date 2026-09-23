const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.MONGO_URL;

if (!uri) {
  console.error("❌ ERROR: MONGO_URL environment variable is not set!");
  console.error("Please add MONGO_URL to your .env file");
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Test connection on module load
client.on("error", (error) => {
  console.error("❌ MongoDB Connection Error:", error.message);
});

client.on("serverOpening", () => {
  console.log("🔄 MongoDB: Attempting to connect...");
});

client.on("serverClosed", () => {
  console.log("⚠️  MongoDB: Connection closed");
});

module.exports = client;
