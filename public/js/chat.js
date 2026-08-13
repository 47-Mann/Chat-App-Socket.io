// Initialize the Socket.IO client connection. `io()` is provided by
// the `/socket.io/socket.io.js` script included in the HTML.
const socket = io();

const sendBtn = document.querySelector(".send-button");
const messageArea = document.getElementById("messageArea");
const input = document.querySelector("#messageInput");
const usernameDisplay = document.getElementById("usernameDisplay");

const username = (() => {
  const entered = prompt("Enter your name:", "Anonymous");
  return entered && entered.trim() ? entered.trim() : "Anonymous";
})();

if (usernameDisplay) {
  usernameDisplay.textContent = username;
}

/**
 * Append a message to the chat message area.
 *
 * message: string - The text content to display.
 * sender: string  - Identifier used to apply CSS ("me", "other", or "server").
 * name: string   - Optional display name for the sender.
 * timestamp: string - Optional formatted time string to show.
 */
function addMessage(message, sender, name, timestamp) {
  if (!messageArea) return;
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}-message`;
  // subtle entrance animation
  messageDiv.classList.add("fade-in");

  // If caller provided a sender name, show it above the message text.
  if (name) {
    const senderName = document.createElement("span");
    senderName.className = "sender-name";
    senderName.textContent = name;
    messageDiv.appendChild(senderName);
  }

  const textNode = document.createElement("div");
  textNode.textContent = message;
  messageDiv.appendChild(textNode);

  // If a timestamp was provided, show a compact time label.
  if (timestamp) {
    const timeNode = document.createElement("span");
    timeNode.className = "timestamp";
    timeNode.textContent = timestamp;
    messageDiv.appendChild(timeNode);
  }

  messageArea.appendChild(messageDiv);
  // Smooth-scroll to the bottom so new messages are visible.
  if (messageArea.scrollTo) {
    messageArea.scrollTo({ top: messageArea.scrollHeight, behavior: "smooth" });
  } else {
    messageArea.scrollTop = messageArea.scrollHeight;
  }
}

/**
 * Handle messages emitted from the server.
 * The server emits the `messageFromServer` event; when received, display
 * the message as another client's message so styles and alignment are applied.
 */
// Server messages arrive here. The server usually sends an object with
// { name, message, timestamp } but we tolerate plain strings for simple
// system notices.
socket.on("messageFromServer", (payload) => {
  if (payload && typeof payload === "object") {
    addMessage(
      payload.message,
      "other",
      payload.name || "Unknown",
      payload.timestamp || formatTime(new Date()),
    );
  } else {
    // Plain string -> system/server message
    addMessage(payload, "server", "Server", formatTime(new Date()));
  }
});

// Helper to format a Date into a short, locale-aware time string.
function formatTime(date) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Acknowledgement handling:
// - The server will emit `messageAck` back to the original sender only
//   to confirm it received the message. The client listens for that event
//   and displays the acknowledgement as a server-styled message.
// The server sends a `messageAck` back to the original sender to confirm
// the message was received and (optionally) processed. We mark the
// last `me-message` element as delivered and attach an ISO timestamp
// to its `data-ack` for potential future UI features.
socket.on("messageAck", (ack) => {
  // Instead of inserting the acknowledgement text into the message area
  // (which would show "Server received: ..."), mark the last message
  // sent by this client as acknowledged. This keeps the message area
  // free of ack text while still providing a delivery indicator.
  if (!messageArea) return;
  const clientMessages = messageArea.querySelectorAll(".message.me-message");
  if (clientMessages.length > 0) {
    const lastClientMsg = clientMessages[clientMessages.length - 1];
    lastClientMsg.classList.add("delivered");
    // store ack metadata (optional) for future UI use
    lastClientMsg.dataset.ack = new Date().toISOString();
  } else {
    // fallback: log ack to console
    console.log("ACK:", ack);
  }
});

/**
 * Read the value from the input, emit it to the server, and display it
 * locally in the chat area.
 * - Returns early if the input element is missing or the trimmed message is empty.
 * - Emits `messageFromClient` to the server via the socket.
 */
function sendMessage() {
  if (!input) return; // defensive programming pattern, return early if input is not found in the DOM.

  const message = input.value.trim();
  if (!message) return;

  const timestamp = formatTime(new Date());
  addMessage(message, "me", username, timestamp);
  input.value = "";

  if (socket && typeof socket.emit === "function") {
    socket.emit("messageFromClient", {
      name: username,
      message,
      timestamp,
    });
  }
}

// Bind the click handler to the send button if it exists in the DOM.
if (sendBtn) sendBtn.addEventListener("click", sendMessage);

// Allow pressing Enter inside the input to send the message.
if (input) {
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  });
  // give keyboard users immediate focus and a nicer typing experience
  input.addEventListener("focus", () => {
    input.select();
  });
  // attempt to focus input on load
  try {
    input.focus();
  } catch (e) {
    /* ignore */
  }
}

// Example of a server-initiated event which also demonstrates the
// acknowledgement/callback pattern where the server expects a response
// from the client. This is optional and used here for demonstration.
socket.on("greeting", (message, callBack) => {
  console.log(message);

  // Reply to the server's callback to confirm receipt.
  callBack({
    status: "received",
    time: new Date(),
    message: message,
  });
});
