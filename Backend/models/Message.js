import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    msg_id: { type: String, index: true },
    meta_msg_id: { type: String, index: true },
    wa_id: { type: String, index: true },
    name: String,
    from: String,
    to: String,
    body: String,
    timestamp: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["sent", "delivered", "read", "pending", "received"],
      default: "pending",
    },
    direction: { type: String, enum: ["in", "out"], default: "in" },
    raw: Object,
  },
  { timestamps: true }
);

// 👇 THIS LINE IS IMPORTANT
export default mongoose.model("Message", MessageSchema);
