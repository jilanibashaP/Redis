const { createClient } = require("redis"); // Import Redis client
const client = createClient();


// Example: For a Redis instance with SSL (e.g., on AWS or Azure)
// const client = createClient({
//     url: "rediss://<username>:<password>@<host>:<port>"
// });

/**
 * Processes a submission retrieved from the Redis queue.
 * 
 * @param {string} submission - The submission data as a JSON string.
 */
async function processSubmission(submission) {
    // Parse the submission JSON string to extract the problem details
    const { problemId, code, language } = JSON.parse(submission);

    console.log(`Processing submission for problemId ${problemId}...`);
    console.log(`Code: ${code}`);
    console.log(`Language: ${language}`);
    // Here you would add your actual processing logic

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Finished processing submission for problemId ${problemId}.`);
}

/**
 * Starts the worker to process submissions from the Redis queue.
 */
async function startWorker() {
    try {
        // Connect to the Redis server
        await client.connect();
        console.log("Worker connected to Redis.");

        // Main loop to continuously process submissions from the queue
        while (true) {
            try {
                // Retrieve the next submission from the "problems" queue
                const submission = await client.brPop("problems", 0); // Blocking operation

                // Extract the element (submission) from the result and process it
                if (submission && submission.element) {
                    await processSubmission(submission.element);
                } else {
                    console.error("Invalid submission format:", submission);
                }
            } catch (error) {
                console.error("Error processing submission:", error);
                // Error handling logic can be added here (e.g., requeueing the task)
            }
        }
    } catch (error) {
        console.error("Failed to connect to Redis", error);
    }
}

// Start the worker
startWorker();
