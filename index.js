const express = require("express");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
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

app.get("/", (request, response) => {
  response.status(200).json({ message: "HEY!" });
});

app.use(express.static("public"));
