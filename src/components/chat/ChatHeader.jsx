import React from "react";
import { User, LogOut, Users } from "lucide-react";

const ChatHeader = ({
  currentReceiver,
  otherUserOnline,
  setShowUsersModal,
  setShowLogoutConfirm,
}) => {
  return (
    <div className="relative bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 text-white px-5 py-4 flex justify-between items-center shadow-lg border-b border-indigo-400/40">
      {/* LEFT: Avatar + Basic Info */}
      <div className="flex items-center gap-4">
        {/* Floating Avatar */}
        <div className="relative">
          <div className="p-2 bg-white rounded-full shadow-md border border-indigo-200">
            <User size={22} className="text-indigo-600" />
          </div>
        </div>

        {/* Username + Status */}
        <div>
          <h1 className="text-lg font-semibold tracking-wide">
            {currentReceiver ? currentReceiver.username : "Chat Application"}
          </h1>

          <div className="flex items-center gap-2 mt-0.5">
            {currentReceiver ? (
              <span
                className={`px-2 py-0.5 text-xs rounded-full font-medium shadow-sm ${
                  otherUserOnline
                    ? "bg-green-300/20 text-green-200 border border-green-300/30"
                    : "bg-red-300/20 text-red-200 border border-red-300/30"
                }`}
              >
                ● {otherUserOnline ? "Online" : "Offline"}
              </span>
            ) : (
              <span className="text-xs text-indigo-200">
                Select a user to start chatting
              </span>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: Buttons */}
      <div className="flex items-center gap-3">
        {/* Users List Button */}
        <button
          onClick={() => setShowUsersModal(true)}
          className="p-2 rounded-full bg-white/15 hover:bg-white/25 transition-all backdrop-blur-sm shadow-sm"
        >
          <Users size={20} className="text-white" />
        </button>

        {/* Logout Button */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="p-2 rounded-full bg-white/15 hover:bg-white/25 transition-all backdrop-blur-sm shadow-sm"
        >
          <LogOut size={20} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
