import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import useMentions from "../../hooks/useChat/useMentions";
import useChatSocket from "../../hooks/useChat/useSocket";
import useConversation from "../../hooks/useChat/useChat";
import formatTime from "../../utils/formatTime";
import AllUsers from "./AllUsers";
import { extractMentions, extractHashtags } from "./MentionInput";
import LogoutModal from "../common/Logout";

const ChatComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.user);
  const userId = user?.id;
  const username = user?.username || user?.email || "User";

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [currentReceiver, setCurrentReceiver] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [otherUserOnline, setOtherUserOnline] = useState(false);

  const messagesEndRef = useRef(null);
  const currentReceiverRef = useRef(currentReceiver);
  const typingTimeoutRef = useRef(null);

  const { fetchConversation } = useConversation(userId, setMessages);

  const socketRef = useChatSocket({
    token,
    userId,
    setMessages,
    setOtherUserTyping,
    setOtherUserOnline,
    currentReceiverRef,
    formatTime,
  });

  const {
    suggestions,
    showSuggestions,
    suggestionIndex,
    triggerInfo,
    isLoading,
    handleMentionInput,
    navigateSuggestions,
    selectSuggestion,
    resetMentions,
  } = useMentions();

  useEffect(() => {
    currentReceiverRef.current = currentReceiver;
  }, [currentReceiver]);

  // Join chatroom when receiver changes
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !currentReceiver) return;

    setMessages([]);
    setOtherUserTyping(false);
    setOtherUserOnline(false);

    const chatroomId =
      userId < currentReceiver.id
        ? `${userId}_${currentReceiver.id}`
        : `${currentReceiver.id}_${userId}`;

    socket.emit("joinChatroom", chatroomId);
    fetchConversation(currentReceiver.id);
  }, [currentReceiver]);

  // Handle input typing status
  const handleInputChange = (text) => {
    setNewMessage(text);
    const socket = socketRef.current;
    // If user starts typing
    if (text.trim() && !isTyping) {
      setIsTyping(true);
      socket.emit("typing", {
        receiverId: currentReceiver.id,
        isTyping: true,
        username: username, // <-- ADD THIS
        userId: userId,
      });
    }

    // Reset typing timeout
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // When user stops typing (after 2 sec)
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);

      socket.emit("typing", {
        receiverId: currentReceiver.id,
        isTyping: false,
        username: username, // <-- ADD THIS
        userId: userId,
      });
    }, 2000);
  };

  // Send message
  const handleSubmit = (e) => {
    e.preventDefault();

    const socket = socketRef.current;
    if (!newMessage.trim() || !currentReceiver) return;

    const hashtags = extractHashtags(newMessage);
    const mentions = extractMentions(newMessage);

    socket.emit("sendMessage", {
      text: newMessage,
      receiverId: currentReceiver.id,
      hashtags,
      mentions,
    });

    setNewMessage("");
    resetMentions();
  };

  // Auto-scroll FIXED
  useEffect(() => {
    if (!messagesEndRef.current) return;

    messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
  }, [messages, otherUserTyping]);

  const handleUserSelect = (selectedUser) => {
    setCurrentReceiver({
      id: selectedUser._id,
      username: selectedUser.username,
    });
    setShowUsersModal(false);
  };

  const handleLogout = () => {
    socketRef.current?.disconnect();
    dispatch({ type: "logout" });
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="w-full max-w-4xl mx-auto h-full flex flex-col shadow-xl bg-white rounded-lg overflow-hidden">
        <ChatHeader
          currentReceiver={currentReceiver}
          otherUserOnline={otherUserOnline}
          setShowUsersModal={setShowUsersModal}
          setShowLogoutConfirm={setShowLogoutConfirm}
        />

        {/* MESSAGES AREA (scroll container) */}
        <div
          ref={messagesEndRef} // <-- FIXED: attach ref to scrollable div
          className="flex-1 p-5 overflow-y-auto bg-gradient-to-b from-white via-gray-50 to-gray-100"
        >
          <MessageList
            messages={messages}
            otherUserTyping={otherUserTyping}
            currentReceiver={currentReceiver}
            username={username}
            setShowUsersModal={setShowUsersModal}
          />
        </div>

        <ChatInput
          newMessage={newMessage}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          disabled={!currentReceiver}
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          suggestionIndex={suggestionIndex}
          isLoading={isLoading}
          triggerInfo={triggerInfo}
          handleMentionInput={handleMentionInput}
          navigateSuggestions={navigateSuggestions}
          selectSuggestion={selectSuggestion}
          resetMentions={resetMentions}
        />
      </div>

      {showLogoutConfirm && (
        <LogoutModal
          show={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={handleLogout}
        />
      )}

      {showUsersModal && (
        <AllUsers
          onClose={() => setShowUsersModal(false)}
          onUserSelect={handleUserSelect}
        />
      )}
    </div>
  );
};

export default ChatComponent;
