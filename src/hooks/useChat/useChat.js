import { useCallback } from "react";
import api from "../../store/axios";
import formatTime from "../../utils/formatTime";

const useConversation = (userId, setMessages) => {
  const fetchConversation = useCallback(
    async (receiverId) => {
      try {
        const { data } = await api.get(
          `chat/conversation?receiverId=${receiverId}`
        );

        const formattedMessages = data.discussions.map((msg) => ({
          id: msg._id,
          text: msg.message,
          sender: msg.senderId === userId ? "user" : "other",
          timestamp: formatTime(msg.createdAt),
        }));

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error fetching conversation:", error);
      }
    },
    [userId]
  );

  return { fetchConversation };
};

export default useConversation;
