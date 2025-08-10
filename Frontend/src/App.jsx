import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import { getConversations } from "./api/api";
import { io } from "socket.io-client";

export default function App() {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    load();

    const socket = io(import.meta.env.VITE_API_BASE || "http://localhost:5000");
    socket.on("new_message", (msg) => {
      load();
    });
    return () => {
      socket.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  async function load() {
    const convos = await getConversations();
    setConversations(convos);
    if (!selected && convos.length) setSelected(convos[0].wa_id);
  }

  return (
    <div className="h-screen flex bg-gray-100">
      {(!isMobileView || (isMobileView && !selected)) && (
        <Sidebar
          conversations={conversations}
          selected={selected}
          onSelect={(id) => setSelected(id)}
        />
      )}

      {(!isMobileView || (isMobileView && selected)) && (
        <ChatWindow
          wa_id={selected}
          onMessageSent={load}
          onBack={() => setSelected(null)}
        />
      )}
    </div>
  );
}
