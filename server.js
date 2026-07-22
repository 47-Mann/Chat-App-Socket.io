import express from "express";
import http from "http"; // --> For creating server
import { Server } from "socket.io";
import path from "path"; // --> For serving static file in "public" folder
import { fileURLToPath } from "url"; // --> Because of ES6 create __filename & __dirname

// --> Because of ES6 create __filename & __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*  
--> Express handles HTTP requests and responses, while Socket.IO handles WebSocket connections. We create an HTTP server using the Express app and then attach Socket.IO to that server. This allows us to handle both HTTP requests and WebSocket connections in the same application. 
*/
const app = express();
const server = http.createServer(app); // Bridge between express & socket.io
const io = new Server(server); // From socket.io library, we create a new instance of the Server class and pass the HTTP server as an argument. This allows Socket.IO to listen for WebSocket connections on the same server that is handling HTTP requests.

const PORT = process.env.PORT || 3000;

// --> Serving static file in "public" folder
app.use(express.static(path.join(__dirname, "public")));

// --> One Approach: using "res.sendFile()" otherwise above method is fine.
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "index.html"));
// });

/* 
 --> io.on("connection") is an event listener that listens for new client connections. When a client connects, it triggers the callback function, which receives a socket object representing the connection. Inside this callback, we can emit messages to the connected client and listen for messages from the client. 
*/
io.on("connection", (socket) => {
  console.log("A user connected.");
  // Emitting message to the client
  socket.emit("messageFromServer", "Hello from server");
  // Listening message from the client
  socket.on("messageFromClient", (data) => {
    console.log(data);
  });
});

server.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
