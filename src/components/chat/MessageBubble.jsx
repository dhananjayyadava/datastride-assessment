import React from "react";
import { User } from "lucide-react"; // Lucide icon
import { useSelector } from "react-redux";

const MessageBubble = ({ msg }) => {
  const isSent = msg.sender === "user";
  console.log("Rendering MessageBubble:", msg);

  return (
    <div
      className={`flex items-start gap-3 mb-4 ${
        isSent ? "justify-end" : "justify-start"
      }`}
    >
      {/* User Icon for Received Messages */}
      {!isSent && (
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <User size={22} className="text-gray-600" />
        </div>
      )}

      <div
        className={`max-w-[80%] ${
          isSent ? "text-right" : "text-left"
        } flex flex-col`}
      >
        {/* Username and handle like Twitter */}
        {!isSent && (
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-[14px]">
              @{msg.handle || "username"}
            </span>
          </div>
        )}

        {/* Message Body */}
        <div
          className={`px-4 py-3 rounded-2xl shadow-sm border 
            ${
              isSent
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-900 border-gray-200"
            }`}
        >
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
            {highlightText(msg.text, isSent)}
          </p>
        </div>

        {/* Timestamp Twitter style */}
        <span className="text-[12px] text-gray-400 mt-1">{msg.timestamp}</span>
      </div>

      {/* Avatar for Sent messages (right side like Twitter DMs) */}
      {isSent && (
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <User size={22} className="text-gray-600" />
        </div>
      )}
    </div>
  );
};

/* ---------------------------------------
   Twitter-Style Mention & Hashtag highlight
---------------------------------------- */
export const highlightText = (text, isSent) => {
  const regex = /(@\w+|#\w+)/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (part.startsWith("@") || part.startsWith("#")) {
      return (
        <span
          key={i}
          className={`font-semibold ${
            isSent ? "text-yellow-200" : "text-blue-600"
          } cursor-pointer hover:underline`}
        >
          {part}
        </span>
      );
    }

    return <span key={i}>{part}</span>;
  });
};

export default MessageBubble;
