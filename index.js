const express = require("express");
const WebSocket = require("ws");

const app = express();
const port = 3001;

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const wss = new WebSocket.Server({ server });

let clients = [];

wss.on("connection", (ws) => {
  console.log("New client connected");
  clients.push(ws);

  ws.on("message", (message) => {
    console.log(`Received: ${message}`);

    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    clients = clients.filter((client) => client !== ws);
    console.log("Client disconnected");
  });
});

app.use(express.static("public"));
