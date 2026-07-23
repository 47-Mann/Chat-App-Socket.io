const socket = io();

const sendButn = document.getElementsByClassName(".send-button");
const messageArea = document.getElementById("#messageArea");
const input = document.querySelector("#messageInput");

function addMessage(message, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.className = "message ${sender}-message";
  messageDiv.textContent = message;
  messageArea.appendChild(messageDiv);
  messageArea.scrollTop = messageArea.scrollHeight;
}
