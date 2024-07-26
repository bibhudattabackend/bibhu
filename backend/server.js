// index.js
import http from 'http';

// Create a server object
const server = http.createServer((req, res) => {
    // Check if the request is for the /api/test path
    if (req.method === 'GET' && req.url === '/api/test') {
        // Set the response header for plain text content
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        // Send a simple message as the response
        res.end('API is working!');
    } else {
        // For all other routes, return a 404 not found
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// Define the port to listen on
const port = 3000;

// Start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
