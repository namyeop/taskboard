const express = require("express");
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Start the server
app.listen(port, () => {
	console.log(`Express app listening at http://localhost:${port}`);
});
