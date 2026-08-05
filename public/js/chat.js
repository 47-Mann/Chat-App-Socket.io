const socket = io();

const sendBtn = document.querySelector(".send-button");
const messageArea = document.getElementById("messageArea");
const input = document.querySelector("#messageInput");

/**
 * Append a message to the chat message area.
 *
 * string message - The text content to display.
 * string sender - Identifier for the sender used to apply CSS (e.g. "client" or "server").
 *
 * Creates a new <div>, sets its classes to include the sender-specific class,
 * sets the text content, appends it to the message container, and scrolls
 * the container to the bottom so the new message is visible.
 */
function addMessage(message, sender) {
  if (!messageArea) return;
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}-message`; // --> Add sender-specific class for styling
  messageDiv.textContent = message;
  messageArea.appendChild(messageDiv);
  messageArea.scrollTop = messageArea.scrollHeight;
}

/**
 * Handle messages emitted from the server.
 * The server emits the `messageFromServer` event; when received, display
 * the message using `addMessage` with the sender set to "server" so styles
 * and alignment are applied accordingly.
 */
socket.on("messageFromServer", (message) => {
  addMessage(message, "server");
});

// Acknowledgement handling:
// - The server will emit `messageAck` back to the original sender only
//   to confirm it received the message. The client listens for that event
//   and displays the acknowledgement as a server-styled message.
socket.on("messageAck", (ack) => {
  // Instead of inserting the acknowledgement text into the message area
  // (which would show "Server received: ..."), mark the last message
  // sent by this client as acknowledged. This keeps the message area
  // free of ack text while still providing a delivery indicator.
  if (!messageArea) return;
  const clientMessages = messageArea.querySelectorAll(
    ".message.client-message",
  );
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

  addMessage(message, "client");
  input.value = "";

  if (socket && typeof socket.emit === "function") {
    socket.emit("messageFromClient", message);
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
}

socket.on("greeting", (message, callBack) => {
  console.log(message);

  callBack({
    status: "received",
    time: new Date(),
    message: message,
  });
});
