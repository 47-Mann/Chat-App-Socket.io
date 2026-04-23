import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

// --> Because of ES6 create __filename & __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// --> Serving static file in "public" folder
app.use(express.static(path.join(__dirname, "public")));

// --> One Approach: using "res.sendFile()" otherwise above method is fine.
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "index.html"));
// });

server.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
