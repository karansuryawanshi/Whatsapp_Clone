import Message from "../models/Message.js";

export async function insertOrUpdateMessage(payload) {
  // payload should be normalized to contain msg_id or meta_msg_id and wa_id etc.
  const query = payload.msg_id
    ? { msg_id: payload.msg_id }
    : payload.meta_msg_id
    ? { meta_msg_id: payload.meta_msg_id }
    : {};
  if (!Object.keys(query).length) {
    // create new
    const m = new Message(payload);
    await m.save();
    return m;
  }
  // upsert: if exists update, else create
  const updated = await Message.findOneAndUpdate(
    query,
    { $set: payload },
    { upsert: true, new: true }
  );
  return updated;
}

export async function updateStatusByMetaId(meta_msg_id, status) {
  return Message.findOneAndUpdate(
    { meta_msg_id },
    { $set: { status } },
    { new: true }
  );
}

export async function getConversations() {
  const rows = await Message.aggregate([
    { $sort: { timestamp: -1 } },
    {
      $group: {
        _id: "$wa_id",
        wa_id: { $first: "$wa_id" },
        name: { $first: "$name" }, // 👈 include name
        lastMessage: { $first: "$body" },
        lastTimestamp: { $first: "$timestamp" },
        lastStatus: { $first: "$status" },
        count: { $sum: 1 },
      },
    },
    { $sort: { lastTimestamp: -1 } },
  ]);
  return rows;
}

export async function getMessagesForWaId(wa_id) {
  return Message.find({ wa_id }).sort({ timestamp: 1 });
}
