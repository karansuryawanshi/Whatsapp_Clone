import React, { useState } from "react";
import StatusBar from "./StatusBar";
import {
  MessageCirclePlus,
  EllipsisVertical,
  Search,
  User,
} from "lucide-react";
import NewChatIcon from "../Icons/NewChatIcon";

export default function Sidebar({ conversations, selected, onSelect }) {
  console.log("conversations", conversations);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <>
      <StatusBar></StatusBar>

      <div className="w-full md:w-1/3 border-r border-neutral-200 bg-white p-4 overflow-auto">
        <div className="h-16 flex items-center mx-4 justify-between">
          <p className="flex text-2xl font-semibold text-green-600">WhatsApp</p>
          <div className="flex gap-6">
            <span className="hover:bg-neutral-100 p-2 rounded-full duration-300">
              <NewChatIcon />
            </span>
            <span className="hover:bg-neutral-100 p-2 rounded-full duration-300">
              <EllipsisVertical />
            </span>
          </div>
        </div>
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 mx-1 md:mx-6
        ${isFocused ? "border-2 border-green-500" : "border border-gray-300"}
        bg-neutral-100`}
        >
          <Search className="text-gray-500 justify-start" />
          <input
            type="text"
            placeholder="Search or start a new chat"
            className="bg-transparent outline-none text-gray-800"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>
        <div className="w-full">
          <div className="flex gap-4 mx-0 lg:mx-4 my-4 text-sm">
            <span className="px-3 py-1 bg-green-100 hover:bg-neutral-00 cursor-pointer text-green-600 border rounded-2xl">
              All
            </span>
            <span className="px-2 py-1 hover:bg-neutral-100 cursor-pointer text-neutral-600 border rounded-2xl">
              Unread
            </span>
            <span className="px-2 py-1 hover:bg-neutral-100 cursor-pointer text-neutral-600 border rounded-2xl">
              Favourate
            </span>
            <span className="px-2 py-1 hover:bg-neutral-100 cursor-pointer text-neutral-600 border rounded-2xl">
              Groups
            </span>
          </div>
        </div>
        {conversations.map((c) => (
          <div
            key={c._id}
            className={`px-2 py-3 flex items-center hover:bg-[#f7f5f2] my-2 mx-4 rounded-lg cursor-pointer ${
              selected === c.wa_id ? "bg-[#f7f5f2]" : "hover:bg-gray-50"
            }`}
            onClick={() => onSelect(c.wa_id)}
          >
            <span className="p-3 bg-[#f7f5f2] border text-neutral-600 border-neutral-300 rounded-full mr-3">
              <User size={24} />
            </span>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="font-medium text-gray-900">
                {c.name || c.wa_id}
              </span>
              <span className="text-sm text-gray-500 truncate">
                {c.lastMessage}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
