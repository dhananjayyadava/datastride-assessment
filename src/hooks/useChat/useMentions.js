import { useState, useCallback, useRef } from "react";
import api from "../../store/axios";

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const useMentions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [triggerInfo, setTriggerInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSuggestions = useCallback(async (type, query) => {
    setIsLoading(true);
    try {
      const endpoint = type === "@" ? "chat/users/search" : "chat/tags/search";
      const { data } = await api.get(
        `${endpoint}?q=${encodeURIComponent(query)}`
      );
      setSuggestions(data.results || []);
      console.log("data", data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedFetch = useRef(
    debounce((type, query) => fetchSuggestions(type, query), 300)
  ).current;

  // Detect @mention or #hashtag trigger
  const detectTrigger = useCallback((text, cursorPos) => {
    const textBeforeCursor = text.slice(0, cursorPos);

    // Match @ or # followed by word characters (no spaces)
    const match = textBeforeCursor.match(/(?:^|\s)([@#])(\w*)$/);

    if (!match) return null;

    const triggerChar = match[1];
    const query = match[2];
    const startPos = textBeforeCursor.lastIndexOf(triggerChar);

    return { type: triggerChar, startPos, query };
  }, []);

  const handleMentionInput = useCallback(
    (text, cursorPos) => {
      const trigger = detectTrigger(text, cursorPos);

      if (trigger) {
        setTriggerInfo(trigger);
        setShowSuggestions(true);
        setSuggestionIndex(0);
        debouncedFetch(trigger.type, trigger.query);
      } else {
        setShowSuggestions(false);
        setTriggerInfo(null);
        setSuggestions([]);
      }
    },
    [detectTrigger, debouncedFetch]
  );

  const navigateSuggestions = useCallback(
    (direction) => {
      setSuggestionIndex((prev) => {
        if (direction === "up")
          return prev > 0 ? prev - 1 : suggestions.length - 1;
        return prev < suggestions.length - 1 ? prev + 1 : 0;
      });
    },
    [suggestions.length]
  );

  const selectSuggestion = useCallback((suggestion) => {
    setShowSuggestions(false);
    setTriggerInfo(null);
    setSuggestions([]);
    return suggestion;
  }, []);

  const resetMentions = useCallback(() => {
    setShowSuggestions(false);
    setTriggerInfo(null);
    setSuggestions([]);
    setSuggestionIndex(0);
  }, []);

  return {
    suggestions,
    showSuggestions,
    suggestionIndex,
    triggerInfo,
    isLoading,
    handleMentionInput,
    navigateSuggestions,
    selectSuggestion,
    resetMentions,
    setSuggestionIndex,
  };
};

export default useMentions;
