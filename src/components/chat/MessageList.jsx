import MessageBubble from "./MessageBubble";
import { Users } from "lucide-react";

const MessageList = ({
  messages,
  otherUserTyping,
  currentReceiver,
  username,
  messagesEndRef,
  setShowUsersModal,
}) => {
  console.log("Current Receiver in MessageList:", currentReceiver);
  if (!currentReceiver) {
    return (
      <div className="h-full flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-5">
            <Users size={32} className="text-indigo-600" />
          </div>
          <h2 className="text-[28px] font-bold text-gray-900 mb-2">
            Welcome back, {username}
          </h2>
          <p className="text-[15px] text-gray-500 mb-6">
            Select a conversation or start a new message
          </p>
          <button
            onClick={() => setShowUsersModal(true)}
            className="px-6 py-3 bg-indigo-600 text-white text-[15px] font-semibold rounded-full hover:bg-indigo-700 active:scale-95 transition-all shadow-sm"
          >
            Browse users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} msg={msg} />
      ))}

      {otherUserTyping && (
        <div className="flex justify-start">
          <div className="bg-white px-4 py-3 rounded-2xl shadow border border-gray-200">
            <div className="flex gap-1">
              {[0, 150, 300].map((d) => (
                <div
                  key={d}
                  className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${d}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
