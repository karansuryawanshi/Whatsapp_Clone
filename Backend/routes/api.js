import express from "express";
import {
  getConversations,
  getMessagesForWaId,
  insertOrUpdateMessage,
} from "../controllers/messageController.js";

// Create the router instance
const router = express.Router();

// GET list of conversations
router.get("/conversations", async (req, res) => {
  const convos = await getConversations();
  res.json(convos);
});

// GET messages for a given wa_id
router.get("/conversations/:wa_id/messages", async (req, res) => {
  const wa_id = req.params.wa_id;
  const msgs = await getMessagesForWaId(wa_id);
  res.json(msgs);
});

// POST send a message
// router.post("/messages", async (req, res) => {
//   const { wa_id, body } = req.body;
//   if (!wa_id || !body) {
//     return res.status(400).json({ error: "missing wa_id or body" });
//   }
//   const payload = {
//     msg_id: `local-${Date.now()}`,
//     wa_id,
//     from: "me",
//     to: wa_id,
//     body,
//     timestamp: new Date(),
//     status: "sent",
//     direction: "out",
//     raw: { source: "local-sent" },
//   };
//   const msg = await insertOrUpdateMessage(payload);

//   // Broadcast via socket
//   req.app.get("io")?.emit("new_message", msg);

//   res.json(msg);
// });

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

// Export the router as default
export default router;
