# Chat App

A simple realtime chat app built with Node.js, Express, and Socket.IO.

## Features

- Serves a frontend from `public/`
- Uses Socket.IO for realtime connection between client and server
- Sends a welcome message from server when a client connects
- Logs incoming client messages on the server

## Project Structure

- `server.js` - Express server and Socket.IO setup
- `package.json` - project metadata and dependencies
- `public/index.html` - chat page UI
- `public/css/styles.css` - frontend styling
- `public/css/js/chat.js` - frontend Socket.IO initialization

## Requirements

- Node.js 18+ (or any supported current version)
- npm

## Installation

```bash
npm install
```

## Running the App

```bash
node server.js
```

Then open `http://localhost:3000` in your browser.

## How It Works

- `server.js` creates an Express app and serves static files from `public/`.
- It creates an HTTP server and attaches Socket.IO.
- When a client connects, the server sends a `messageFromServer` event.
- The server also listens for `messageFromClient` events from the client.

## Notes

- The client currently only initializes the Socket.IO connection.
- To complete the chat experience, add client-side handlers for server events and emit chat messages from the browser.

## License

This project is open source and free to use.
