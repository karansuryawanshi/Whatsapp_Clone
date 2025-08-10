import express from "express";
import {
  insertOrUpdateMessage,
  updateStatusByMetaId,
} from "../controllers/messageController.js";

const router = express.Router();

/**
 * Generic webhook receiver that handles different payload types.
 * Expect body to contain events/messages/statuses in the format of the sample payloads.
 */
router.post("/", async (req, res) => {
  const events = req.body?.events || req.body?.messages || [req.body];
  const processed = [];

  for (const ev of events) {
    // simple normalization: adapt to your payload schema
    const normalized = {
      msg_id: ev.id || ev.message_id || ev.msg_id,
      meta_msg_id: ev.meta_msg_id || ev.parent_id || null,
      wa_id: ev.from || ev.wa_id || ev.sender,
      from: ev.from || ev.sender || null,
      to: ev.to || null,
      body: ev.text?.body || ev.body || ev.message?.text || ev.caption || null,
      timestamp: ev.timestamp
        ? new Date(ev.timestamp * 1000)
        : ev.time
        ? new Date(ev.time)
        : new Date(),
      status: ev.status || (ev.event_type === "status" ? ev.status : undefined),
      direction:
        ev.direction || (ev.from && ev.from.includes("+") ? "in" : "in"),
      raw: ev,
    };

    const saved = await insertOrUpdateMessage(normalized);
    processed.push(saved);

    // If this event is a status update (sent/delivered/read) and references meta_msg_id
    if (ev.status && ev.meta_msg_id) {
      await updateStatusByMetaId(ev.meta_msg_id, ev.status);
    }
  }

  return res.json({ ok: true, processed: processed.length });
});

export default router;
