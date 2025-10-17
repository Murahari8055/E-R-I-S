export default function ModeSwitchBubble({ currentMode, onSwitch }) {
  return (
    <button className="bubble right" onClick={onSwitch}>
      {currentMode === "chatbot" ? "🎙️" : "💬"}
    </button>
  );
}
