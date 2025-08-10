import React, { useEffect, useState } from "react";
import { getMessages, sendMessage } from "../api/api";
import MessageBubble from "./MessageBubble";
import {
  User,
  Video,
  Phone,
  EllipsisVertical,
  Mic,
  Plus,
  Sticker,
  SendHorizontal,
  ArrowLeft,
} from "lucide-react";

export default function ChatWindow({ wa_id, onMessageSent, onBack }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [contactName, setContactName] = useState("");
  const [sender, setSender] = useState("me");

  useEffect(() => {
    if (!wa_id) {
      setMessages([]);
      setContactName("");
      return;
    }
    loadMessages();
    loadContactName();
  }, [wa_id]);

  async function loadMessages() {
    const msgs = await getMessages(wa_id);
    setMessages(msgs);
  }

  async function loadContactName() {
    console.log("convos");
    const resp = await fetch(
      "https://whatsapp-clone-lri2.onrender.com/api/conversations"
    );
    const convos = await resp.json();
    console.log("convos", convos);
    const convo = convos.find((c) => c.wa_id === wa_id);
    if (convo) setContactName(convo.name || "");
  }

  async function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const direction = sender === "me" ? "out" : "in";
    await sendMessage({
      wa_id,
      body: text,
      from: sender,
      direction,
      name: contactName,
    });
    setText("");
    if (onMessageSent) onMessageSent();
    await loadMessages();
  }

  if (!wa_id)
    return (
      <div className="flex-1 flex items-center justify-center">
        Select a conversation
      </div>
    );

  return (
    <div className="flex-1 flex flex-col">
      <div className="h-16 w-full flex items-center justify-between border-b border-neutral-300 shadow-2xl">
        <div className="flex items-center gap-2 px-4">
          <button className="md:hidden mr-2 text-neutral-500" onClick={onBack}>
            {/* <MoveLeft /> */}
            <ArrowLeft />
          </button>

          <span className="p-2 bg-neutral-200 rounded-full">
            <User></User>
          </span>
          {/* {console.log("contactName", contactName)} */}
          <span>{contactName || wa_id}</span>
        </div>
        <div className="flex items-center gap-4 mx-4">
          <span>
            <Video size={20} />
          </span>
          <span>
            <Phone size={20} />
          </span>
          <span>
            <EllipsisVertical size={20} />
          </span>
        </div>
      </div>

      <div className="wallpaper flex flex-col h-[90vh]">
        <div className="flex-1 p-4 overflow-auto space-y-4">
          {messages.map((m) => (
            <MessageBubble key={m._id} m={m} />
          ))}
        </div>

        <form onSubmit={submit} className="flex items-center gap-2">
          <select
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            className="border p-1 rounded bg-[#f7f5f3]"
          >
            <option value="me">Me</option>
            <option value={wa_id}>{contactName || wa_id}</option>
          </select>

          <div className="my-1 gap-2 w-full">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 
          bg-white shadow`}
            >
              <span className="p-2 rounded-full hover:bg-[#f7f5f3] duration-300 cursor-pointer">
                <Plus size={20} className="text-black justify-start" />
              </span>
              <span className="p-2 rounded-full hover:bg-[#f7f5f3] duration-300">
                <Sticker size={20} className="text-black justify-start" />
              </span>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message"
                className=" text-gray-800 w-full focus:outline-none focus:border-none"
              />
              {text.length > 0 ? (
                <button
                  type="submit"
                  className={`p-2 rounded-full cursor-pointer bg-green-600 hover:bg-green-500 duration-300 
                  `}
                >
                  <SendHorizontal
                    size={20}
                    className="justify-start text-white"
                  />
                </button>
              ) : (
                <span className="p-2 rounded-full hover:bg-green-600 cursor-pointer duration-300 hover:text-white text-black">
                  <Mic size={20} className="  justify-start" />
                </span>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
