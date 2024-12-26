// Import the required modules
const express = require("express"); // Express for creating the HTTP server
const { createClient } = require("redis"); // Redis client for interacting with the Redis server

// Initialize the Express application
const app = express();
app.use(express.json()); // Middleware to parse incoming JSON requests

// Create a Redis client instance
const client = createClient(
    //{here we need to keep the our cloud client reddis urls to connect to it}
);


// Example: For a Redis instance with SSL (e.g., on AWS or Azure)
// const client = createClient({
//     url: "rediss://<username>:<password>@<host>:<port>"
// });


// Handle Redis connection errors
client.on("error", (err) => console.log("Redis Client Error", err));

/**
 * Endpoint to handle code submissions
 * 
 * Route: POST /submit
 * Body Parameters:
 * - problemId: The ID of the problem being submitted
 * - code: The code written by the user
 * - language: The programming language of the code
 */
app.post("/submit", async (req, res) => {
    const problemId = req.body.problemId; // Extract problemId from the request body
    const code = req.body.code;           // Extract code from the request body
    const language = req.body.language;   // Extract language from the request body

    try {
        // we need to store the data in to data base.
        // Push the problem details to the Redis list named "problems"
        await client.lPush("problems", JSON.stringify({ code, language, problemId }));

        // Respond to the client with a success message
        res.status(200).send("Submission received and stored.");
    } catch (error) {
        // Log the error and send a failure response
        console.error("Redis error:", error);
        res.status(500).send("Failed to store submission.");
    }
});

/**
 * Function to start the server and connect to Redis
 */
async function startServer() {
    try {
        // Connect to the Redis server
        await client.connect();
        console.log("Connected to Redis");

        // Start the Express server on port 3000
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    } catch (error) {
        // Log an error if the Redis connection fails
        console.error("Failed to connect to Redis", error);
    }
}

// Start the server
startServer();
