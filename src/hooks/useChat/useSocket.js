import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const useChatSocket = ({
  token,
  userId,
  setMessages,
  setOtherUserTyping,
  setOtherUserOnline,
  currentReceiverRef,
  formatTime,
}) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const socket = io(import.meta.env.VITE_SOCKET_URL, { auth: { token } });

    socketRef.current = socket;

    socket.on("connect", () => console.log("Connected to socket server"));
    socket.on("connect_error", (err) => console.error("Socket Error:", err));

    socket.on("message", (data) => {
      const receiver = currentReceiverRef.current;
      if (!receiver) return;

      const isRelevant =
        (data.senderId === receiver.id && data.receiverId === userId) ||
        (data.receiverId === receiver.id && data.senderId === userId);

      if (isRelevant) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: data.text,
            sender: data.senderId === userId ? "user" : "other",
            timestamp: formatTime(data.createdAt),
          },
        ]);

        if (data.senderId === receiver.id) setOtherUserTyping(false);
      }
    });

    socket.on("typingStatus", (data) => {
      if (currentReceiverRef.current?.id === data.userId) {
        setOtherUserTyping(data.isTyping);
      }
    });

    socket.on("userStatus", (data) => {
      if (currentReceiverRef.current?.id === data.userId) {
        setOtherUserOnline(data.status === "online");
      }
    });
    return () => socket.disconnect();
  }, []);

  return socketRef;
};

export default useChatSocket;
