const socket = io();

const sendBtn = document.querySelector(".send-button");
const messageArea = document.getElementById("messageArea");
const input = document.querySelector("#messageInput");

/**
 * Append a message to the chat message area.
 * @param {string} message - The text content to display.
 * @param {string} sender - Identifier for the sender used to apply CSS (e.g. "client" or "server").
 *
 * Creates a new <div>, sets its classes to include the sender-specific class,
 * sets the text content, appends it to the message container, and scrolls
 * the container to the bottom so the new message is visible.
 */
function addMessage(message, sender) {
  if (!messageArea) return;
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}-message`;
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

/**
 * Read the value from the input, emit it to the server, and display it
 * locally in the chat area.
 * - Returns early if the input element is missing or the trimmed message is empty.
 * - Emits `messageFromClient` to the server via the socket.
 */
function sendMessage() {
  if (!input) return;
  const message = input.value.trim();
  if (!message) return;
  if (socket && typeof socket.emit === "function") {
    socket.emit("messageFromClient", message);
  }
  addMessage(message, "client");
  input.value = "";
}

// Bind the click handler to the send button if it exists in the DOM.
if (sendBtn) sendBtn.addEventListener("click", sendMessage);
