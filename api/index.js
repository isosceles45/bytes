import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserRoutes from "./routes/user.route.js";
import MessageRoutes from "./routes/message.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import Message from "./models/message.model.js";

const app = express();
dotenv.config();

app.use(cookieParser());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/", UserRoutes);
app.use("/api/", MessageRoutes);

const server = app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

const WSServer = new WebSocketServer({ server });

WSServer.on("connection", (connection, req) => {

  // Read username and id from the cookie for this connection
  const cookies = req.headers.cookie;
  if (cookies) {
    const tokenCookie = cookies
      .split("; ")
      .find((cookie) => cookie.startsWith("token="));
    if (tokenCookie) {
      const token = tokenCookie.split("=")[1];
      if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, userData) => {
          if (err) throw err;
          const { userId, username } = userData;
          connection.userId = userId;
          connection.username = username;
        });
      }
    }
  }

  connection.on("message", async (message) => {
    const messageData = JSON.parse(message.toString());
    const { recipient, text } = messageData;
    if (recipient && text) {
      const messageDoc = await Message.create({
        sender: connection.userId,
        recipient,
        text,
      });
      [...WSServer.clients]
        .filter((c) => c.userId === recipient)
        .forEach((c) =>
          c.send(
            JSON.stringify({
              text,
              sender: connection.userId,
              recipient: recipient,
              id: messageDoc._id,
            })
          )
        );
    }
  });

  // Send online users to all clients
  [...WSServer.clients].forEach((client) => {
    client.send(
      JSON.stringify({
        online: [...WSServer.clients].map((client) => ({
          userId: client.userId,
          username: client.username,
        })),
      })
    );
  });
});
