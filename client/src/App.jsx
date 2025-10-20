import { useState, useEffect, useRef } from "react";
import ChatbotView from "./components/ChatbotView";
import VoiceAssistantView from "./components/VoiceAssistantView";
import UserBubble from "./components/UserBubble";
import ModeSwitchBubble from "./components/ModeSwitchBubble";

export default function App() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mode, setMode] = useState("chatbot"); // mobile mode
  const [activeSide, setActiveSide] = useState(null); // null = initial 50/50
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const hasWished = useRef(false);

  // Speech Synthesis functions
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  const wishMe = () => {
    const hour = new Date().getHours();
    if (hour < 12) speak("Good Morning Boss...");
    else if (hour < 17) speak("Good Afternoon Boss...");
    else speak("Good Evening Boss...");
  };

  useEffect(() => {
    if (!hasWished.current) {
      hasWished.current = true;
      speak("Initializing Eris...");
      wishMe();
    }
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSideClick = (side) => {
    if (!isMobile) setActiveSide(side);
  };

  return (
    <div className="app-container">
      {/* Top-left User Bubble */}
      <UserBubble setUser={setUser} />

      {/* Mobile: top-right view switch */}
      {isMobile && (
        <ModeSwitchBubble
          currentMode={mode}
          onSwitch={() =>
            setMode(mode === "chatbot" ? "voice" : "chatbot")
          }
        />
      )}

      {/* Desktop Split View */}
      {!isMobile && (
        <div className="desktop-split" style={{ display: "flex", height: "100vh" }}>
          <div
            className={`side1 ${
              activeSide === "chatbot" ? "active" : activeSide === "voice" ? "inactive" : ""
            }`}
            onClick={() => handleSideClick("chatbot")}
          >
            <ChatbotView user={user} />
          </div>

          <div
            className={`side2 ${
              activeSide === "voice" ? "active" : activeSide === "chatbot" ? "inactive" : ""
            }`}
            onClick={() => handleSideClick("voice")}
          >
            <VoiceAssistantView user={user} />
          </div>
        </div>
      )}

      {/* Mobile View */}
      {isMobile && (
        <main className="main-view">
          {mode === "chatbot" ? <ChatbotView user={user} /> : <VoiceAssistantView user={user} />}
        </main>
      )}
    </div>
  );
}
