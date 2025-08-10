import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "../db.js";
import Message from "../models/Message.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function ingest() {
  await connectDB();
  const dir = path.join(__dirname, "../webhook_data");
  if (!fs.existsSync(dir)) {
    console.log("Folder not found:", dir);
    process.exit(1);
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  for (const f of files) {
    const content = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));

    let messages = [];

    // Handle WhatsApp webhook format with nested name
    if (
      content.payload_type === "whatsapp_webhook" &&
      content.metaData?.entry
    ) {
      content.metaData.entry.forEach((entry) => {
        entry.changes?.forEach((change) => {
          const value = change.value;

          let contactNameMap = {};
          value.contacts?.forEach((c) => {
            contactNameMap[c.wa_id] = c.profile?.name || null;
          });

          if (value?.messages) {
            messages = messages.concat(
              value.messages.map((m) => ({
                msg_id: m.id,
                wa_id: m.from,
                name: contactNameMap[m.from] || null, // 👈 store name here
                from: m.from,
                to: value.metadata?.display_phone_number || null,
                body: m.text?.body || null,
                timestamp: m.timestamp
                  ? new Date(parseInt(m.timestamp) * 1000)
                  : new Date(),
                status: "received",
                direction: "in",
                raw: m,
              }))
            );
          }
        });
      });
    }

    // Fallback for other formats
    if (!messages.length) {
      const events =
        content.events ||
        content.messages ||
        (Array.isArray(content) ? content : [content]);
      messages = messages.concat(
        events.map((ev) => ({
          msg_id: ev.id || ev.message_id || ev.msg_id,
          wa_id: ev.from || ev.wa_id || ev.sender,
          name: ev.name || null, // if present
          from: ev.from || ev.sender || null,
          to: ev.to || null,
          body:
            ev.text?.body || ev.body || ev.message?.text || ev.caption || null,
          timestamp: ev.timestamp
            ? new Date(ev.timestamp * 1000)
            : ev.time
            ? new Date(ev.time)
            : new Date(),
          status: ev.status || "received",
          direction: ev.direction || "in",
          raw: ev,
        }))
      );
    }

    // Save to DB
    for (const msg of messages) {
      await Message.findOneAndUpdate(
        { msg_id: msg.msg_id },
        { $set: msg },
        { upsert: true, new: true }
      );
    }

    console.log(`Processed ${messages.length} messages from ${f}`);
  }

  console.log("Done ingesting.");
  process.exit(0);
}

ingest().catch((err) => {
  console.error(err);
  process.exit(1);
});
