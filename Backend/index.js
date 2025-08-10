import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import webhookRouter from "./routes/webhook.js";
import apiRouter from "./routes/api.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));

// attach io to app so routes can use it
app.set("io", io);

app.use("/webhook", webhookRouter);
app.use("/api", apiRouter);

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);
  socket.on("disconnect", () => console.log("socket disconnected", socket.id));
});

// start
const PORT = process.env.PORT || 4000;
connectDB()
  .then(() => {
    server.listen(PORT, () => console.log(`Server started on ${PORT}`));
  })
  .catch((err) => {
    console.error("DB connect failed", err);
  });
