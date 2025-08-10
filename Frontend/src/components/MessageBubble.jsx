import React from "react";
import { Check, CheckCheck } from "lucide-react";

export default function MessageBubble({ m }) {
  const mine = m.direction === "out";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`${
          mine ? "bg-green-600 text-white" : "bg-white text-gray-900"
        } p-2 rounded-lg shadow max-w-[60%]`}
      >
        <div className="whitespace-pre-wrap">{m.body}</div>
        <div className="text-right flex text-xs opacity-70 items-center">
          {new Date(m.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {m.status == "sent" && (
            <div>
              <Check size={15} />
            </div>
          )}
          {m.status == "delivered" && (
            <div>
              <CheckCheck size={15} />
            </div>
          )}

          {m.status == "read" && (
            <div>
              <CheckCheck size={15} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
