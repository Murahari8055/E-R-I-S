import { useState, useEffect, useRef } from "react";

export default function VoiceAssistantView() {
  const [listening, setListening] = useState(false);
  const [content, setContent] = useState("Click here to speak");
  const [chats, setChats] = useState([]);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const hasInitialized = useRef(false);

  // Speech Synthesis
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  // Speech Recognition
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.onresult = (event) => {
      const transcript = event.results[event.resultIndex][0].transcript;
      setContent(transcript);
      takeCommand(transcript.toLowerCase());
    };
  }

  const handleClick = () => {
    if (!recognition) return;
    setContent("Listening...");
    setListening(true);
    recognition.start();
  };

  useEffect(() => {
    if (user?.token) {
      fetchChats();
    }
  }, [user]);

  const fetchChats = async () => {
    if (!user?.token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chats`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      setChats(data);
    } catch (e) {
      console.error("Error fetching chats:", e);
    }
  };

  const saveChat = async (message, response) => {
    if (!user?.token) return;
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ message, response, type: "voice" }),
      });
      // Trigger refresh in UserBubble
      window.dispatchEvent(new CustomEvent('chatSaved'));
    } catch (e) {
      console.error("Error saving chat:", e);
    }
  };

  const deleteChat = async (id) => {
    if (!user?.token) return;
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chats/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      fetchChats(); // Refresh chats
    } catch (e) {
      console.error("Error deleting chat:", e);
    }
  };

  const takeCommand = async (message) => {
    if (!message) return;

    let response = "";

    // Basic greetings
    if (message.includes("hey") || message.includes("hello")) {
      response = "Hello Sir, How may I help you?";
      speak(response);
    }
    // Open websites
    else if (message.includes("open google")) {
      window.open("https://google.com", "_blank");
      response = "Opening Google...";
      speak(response);
    } else if (message.includes("open youtube")) {
      window.open("https://youtube.com", "_blank");
      response = "Opening Youtube...";
      speak(response);
    } else if (message.includes("open facebook")) {
      window.open("https://facebook.com", "_blank");
      response = "Opening Facebook...";
      speak(response);
    }
    // Time
    else if (message.includes("time") || message.includes("what is the time")) {
      const time = new Date().toLocaleTimeString();
      response = `The current time is ${time}`;
      speak(response);
    }
    // Date
    else if (message.includes("date")) {
      const date = new Date().toLocaleDateString();
      response = `Today's date is ${date}`;
      speak(response);
    }
    // Wikipedia / Google search
    else if (
      message.includes("what is") ||
      message.includes("who is") ||
      message.includes("what are")
    ) {
      window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
      response = "This is what I found on the internet regarding " + message;
      speak(response);
    } else if (message.includes("wikipedia")) {
      window.open(
        `https://en.wikipedia.org/wiki/${message.replace("wikipedia", "").trim()}`,
        "_blank"
      );
      response = "This is what I found on Wikipedia regarding " + message;
      speak(response);
    } else {
      window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
      response = "I found some information for " + message + " on Google";
      speak(response);
    }

    if (user?.token && response) {
      await saveChat(message, response);
    }
  };

  return (
    <div className="side2 active">
      <div className="video-container2">
        <video
          className="video"
          autoPlay
          loop
          muted
          disablePictureInPicture
          src="https://res.cloudinary.com/daa3yhyvy/video/upload/v1725464354/Nexi%20Ai/Nexi%20AS.mp4"
        />
        <h1>E R I S</h1>
        <h2>ERIS Assistant</h2>
        <p>I am your Virtual Assistant, How may I help you?</p>

        <div className="input2">
          <button className="talk" onClick={handleClick}>
          <h3 className="content">{content}</h3>
          </button>
        </div>
      </div>
    </div>
  );
}

