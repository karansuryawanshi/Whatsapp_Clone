import express from "express";
import {
  getConversations,
  getMessagesForWaId,
  insertOrUpdateMessage,
} from "../controllers/messageController.js";

const router = express.Router();

router.get("/conversations", async (req, res) => {
  const convos = await getConversations();
  res.json(convos);
});

router.get("/conversations/:wa_id/messages", async (req, res) => {
  const wa_id = req.params.wa_id;
  const msgs = await getMessagesForWaId(wa_id);
  res.json(msgs);
});

router.post("/messages", async (req, res) => {
  const { wa_id, body, from, direction, name } = req.body;
  if (!wa_id || !body)
    return res.status(400).json({ error: "missing wa_id or body" });

  const payload = {
    msg_id: `local-${Date.now()}`,
    wa_id,
    from: from || "me",
    to: direction === "in" ? "me" : wa_id,
    name: name || null,
    body,
    timestamp: new Date(),
    status: "sent",
    direction: direction || "out",
    raw: { source: "local-sent" },
  };

  const msg = await insertOrUpdateMessage(payload);
  req.app.get("io")?.emit("new_message", msg);
  res.json(msg);
});

export default router;
