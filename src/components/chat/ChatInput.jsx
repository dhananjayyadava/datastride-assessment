import { Send } from "lucide-react";
import MentionInput from "./MentionInput";

const ChatInput = ({
  newMessage,
  handleInputChange,
  handleSubmit,
  disabled,
  suggestions,
  showSuggestions,
  suggestionIndex,
  isLoading,
  triggerInfo,
  handleMentionInput,
  navigateSuggestions,
  selectSuggestion,
  resetMentions,
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-200 p-4 bg-white"
    >
      <div className="flex items-center gap-2">
        <MentionInput
          value={newMessage}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          suggestionIndex={suggestionIndex}
          isLoading={isLoading}
          triggerInfo={triggerInfo}
          onMentionInput={handleMentionInput}
          onNavigate={navigateSuggestions}
          onSelectSuggestion={selectSuggestion}
          onResetMentions={resetMentions}
          disabled={disabled}
          placeholder="Type messages..."
        />

        <button
          type="submit"
          disabled={disabled}
          className={`px-4 py-3 rounded-lg text-white ${
            disabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
