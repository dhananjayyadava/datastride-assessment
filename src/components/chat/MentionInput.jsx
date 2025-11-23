import { useRef, useEffect, useCallback, useState } from "react";
import { User, Hash, Loader2 } from "lucide-react";

// Regex patterns for detecting tags
const MENTION_REGEX = /@(\w+)/g;
const HASHTAG_REGEX = /#(\w+)/g;
// const TAG_REGEX = /[@#]\w+/g;

const MentionInput = ({
  value,
  onChange,
  onSubmit,
  suggestions,
  showSuggestions,
  suggestionIndex,
  isLoading,
  triggerInfo,
  onMentionInput,
  onNavigate,
  onSelectSuggestion,
  onResetMentions,
  disabled,
  placeholder,
}) => {
  const inputRef = useRef(null);
  const mirrorRef = useRef(null);
  const suggestionsRef = useRef(null);
  const [cursorPos, setCursorPos] = useState(0);

  // Scroll selected suggestion into view
  useEffect(() => {
    if (suggestionsRef.current && showSuggestions) {
      const selected = suggestionsRef.current.children[suggestionIndex];
      selected?.scrollIntoView({ block: "nearest" });
    }
  }, [suggestionIndex, showSuggestions]);

  // Handle input change
  const handleChange = (e) => {
    const text = e.target.value;
    const cursor = e.target.selectionStart;
    setCursorPos(cursor);
    onChange(text);
    onMentionInput(text, cursor);
  };

  // Handle cursor position change
  const handleSelect = (e) => {
    setCursorPos(e.target.selectionStart);
  };

  // Insert selected tag into input
  const insertTag = useCallback(
    (suggestion) => {
      if (!triggerInfo || !inputRef.current) return;

      const { type, startPos } = triggerInfo;
      const tagValue = type === "@" ? suggestion.username : suggestion.name;
      const fullTag = `${type}${tagValue}`;

      const beforeTrigger = value.slice(0, startPos);
      const afterCursor = value.slice(cursorPos);

      const newText = `${beforeTrigger}${fullTag} ${afterCursor}`;
      const newCursorPos = beforeTrigger.length + fullTag.length + 1;

      onChange(newText);
      onSelectSuggestion(suggestion);

      // Set cursor position after tag
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.setSelectionRange(newCursorPos, newCursorPos);
        setCursorPos(newCursorPos);
      }, 0);
    },
    [triggerInfo, value, cursorPos, onChange, onSelectSuggestion]
  );

  // Handle backspace - delete entire tag if cursor is at tag boundary
  const handleBackspace = useCallback(
    (e) => {
      const input = inputRef.current;
      if (!input) return;

      const cursor = input.selectionStart;
      const text = value;

      // Check if cursor is right after a complete tag
      const textBeforeCursor = text.slice(0, cursor);
      const tagMatch = textBeforeCursor.match(/([@#]\w+)$/);

      if (tagMatch) {
        e.preventDefault();
        const tag = tagMatch[1];
        const tagStart = cursor - tag.length;

        // Also remove leading space if exists
        const hasLeadingSpace = tagStart > 0 && text[tagStart - 1] === " ";
        const deleteStart = hasLeadingSpace ? tagStart - 1 : tagStart;

        const newText = text.slice(0, deleteStart) + text.slice(cursor);
        onChange(newText);

        setTimeout(() => {
          input.setSelectionRange(deleteStart, deleteStart);
          setCursorPos(deleteStart);
        }, 0);
      }
    },
    [value, onChange]
  );

  // Handle keyboard events
  const handleKeyDown = (e) => {
    if (showSuggestions && suggestions.length > 0) {
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          onNavigate("up");
          break;
        case "ArrowDown":
          e.preventDefault();
          onNavigate("down");
          break;
        case "Enter":
        case "Tab":
          e.preventDefault();
          insertTag(suggestions[suggestionIndex]);
          break;
        case "Escape":
          e.preventDefault();
          onResetMentions();
          break;
        default:
          break;
      }
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    } else if (e.key === "Backspace") {
      handleBackspace(e);
    }
  };

  // Render highlighted text (for display only)
  const renderHighlightedText = () => {
    if (!value) return null;

    const parts = [];
    let lastIndex = 0;

    // Find all @mentions and #hashtags
    const regex = /(@\w+|#\w+)/g;
    let match;

    while ((match = regex.exec(value)) !== null) {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {value.slice(lastIndex, match.index)}
          </span>
        );
      }

      // Add highlighted tag
      const tag = match[0];
      const isMention = tag.startsWith("@");
      parts.push(
        <span
          key={`tag-${match.index}`}
          className={`font-semibold ${
            isMention ? "text-blue-600" : "text-green-600"
          }`}
        >
          {tag}
        </span>
      );

      lastIndex = match.index + tag.length;
    }

    // Add remaining text
    if (lastIndex < value.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>{value.slice(lastIndex)}</span>
      );
    }

    return parts;
  };

  return (
    <div className="relative flex-1">
      {/* Hidden mirror div for highlighted text */}
      <div
        ref={mirrorRef}
        className="absolute inset-0 px-4 py-3 pointer-events-none overflow-hidden whitespace-pre-wrap break-words text-transparent"
        aria-hidden="true"
      >
        {renderHighlightedText()}
      </div>

      {/* Visible overlay with highlights */}
      <div
        className="absolute inset-0 px-4 py-3 pointer-events-none overflow-hidden"
        style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
      >
        {renderHighlightedText()}
      </div>

      {/* Actual input (transparent text, visible caret) */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onSelect={handleSelect}
        onClick={handleSelect}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white ${
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
        style={{ color: "transparent", caretColor: "black" }}
      />

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute bottom-full left-0 w-full mb-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-50"
        >
          {isLoading ? (
            <div className="flex items-center justify-center p-3 text-gray-500">
              <Loader2 className="animate-spin mr-2" size={16} />
              <span>Loading...</span>
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <div
                key={suggestion._id || suggestion.id || index}
                onClick={() => insertTag(suggestion)}
                className={`flex items-center px-3 py-2 cursor-pointer transition-colors ${
                  index === suggestionIndex
                    ? "bg-indigo-50 text-indigo-700"
                    : "hover:bg-gray-50"
                }`}
              >
                {triggerInfo?.type === "@" ? (
                  <>
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                      <User size={16} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium">{suggestion.username}</p>
                      {suggestion.email && (
                        <p className="text-xs text-gray-500">
                          {suggestion.email}
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <Hash size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">#{suggestion.name}</p>
                      {suggestion.count !== undefined && (
                        <p className="text-xs text-gray-500">
                          {suggestion.count} posts
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-gray-500">
              No {triggerInfo?.type === "@" ? "users" : "hashtags"} found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Utility functions for extracting tags
export const extractMentions = (text) => {
  const matches = text.match(MENTION_REGEX) || [];
  return matches.map((m) => m.slice(1)); // Remove @ prefix
};

export const extractHashtags = (text) => {
  const matches = text.match(HASHTAG_REGEX) || [];
  return matches.map((h) => h.slice(1).toLowerCase()); // Remove # prefix, lowercase
};

export const getPlainText = (text) => {
  // Text is already plain, no transformation needed
  return text;
};

export default MentionInput;
