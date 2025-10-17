import { useState, useEffect } from "react";

export default function ChatbotView() {
  const [userInput, setUserInput] = useState("");
  const [answer, setAnswer] = useState("...");
  const [chats, setChats] = useState([]);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));

  const jokes = [
    "Why do Java developers wear glasses? Because they don't see sharp.",
    "How do you comfort a JavaScript bug? You console it!",
    "Why do programmers prefer dark mode? Because light attracts bugs!",
    "Why was the math book sad? It had too many problems.",
    "What do you call 8 hobbits? A hobbyte.",
    "Why did the computer go to the doctor? It had a virus!",
    "Why did the web developer go broke? Because he lost his domain!",
    "Why was the computer cold? It left its Windows open.",
    "How many programmers does it take to change a light bulb? None, that's a hardware problem!",
    "Why don’t skeletons fight each other? They don’t have the guts.",
    "Why was the math teacher suspicious of the graph? It was plotting something.",
    "Why do cows wear bells? Because their horns don’t work.",
    "Why don’t oysters donate to charity? Because they are shellfish.",
    "How does a penguin build its house? Igloos it together!",
    "Why can't you trust stairs? They're always up to something.",
    "What did the big flower say to the little flower? 'Hey, bud!'",
    "Why did the bicycle fall over? It was two-tired!",
    "What do you call fake spaghetti? An impasta!",
    "Why don't some couples go to the gym? Because some relationships don’t work out.",
    "What do you call cheese that isn't yours? Nacho cheese!"
  ];

  const responses = {
    "hi": "Hello! How can I assist you?",
    "hello": "Hi there! What can I do for you?",
    "who are you": "I am ERIS, your virtual assistant and chatbot.",
    "how are you": "I'm just a program, but thanks for asking! How can I assist you today?",
    "what is your name": "My name is ERIS, your personal assistant.",
    "what can you do": "I can assist you with various tasks, answer your questions, and perform online searches.",
    "thank you": "You're welcome! Happy to help!",
    "date": `Today's date is ${new Date().toLocaleDateString()}.`,
    "time": `The current time is ${new Date().toLocaleTimeString()}.`,
    "goodbye": "Goodbye! Have a great day!",
    "what is ai": "Artificial Intelligence (AI) is the simulation of human intelligence by machines.",
    "what's the meaning of life": "Many say it's 42, but I think it's up to you to decide!"
    // Add all other responses from your original code
  };

  const performMathOperation = (question) => {
    try {
      const operators = {
        "+": (a, b) => a + b,
        "-": (a, b) => a - b,
        "*": (a, b) => a * b,
        "x": (a, b) => a * b,
        "/": (a, b) => a / b,
      };
      const matched = question.match(/(\d+)\s*([\+\-\*x\/])\s*(\d+)/);
      if (matched) {
        const num1 = parseFloat(matched[1]);
        const operator = matched[2];
        const num2 = parseFloat(matched[3]);
        if (operators[operator]) {
          const result = operators[operator](num1, num2);
          return `The result of ${num1} ${operator} ${num2} is ${result}.`;
        }
      }
      return null;
    } catch {
      return null;
    }
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
        body: JSON.stringify({ message, response, type: "chatbot" }),
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

  const processQuestion = async () => {
    const question = userInput.toLowerCase().trim();
    if (!question) {
      setAnswer("Please ask a question.");
      return;
    }

    let response;
    if (
      ["tell me a joke", "joke", "tell me joke", "tell ajoke"].includes(
        question
      )
    ) {
      response = jokes[Math.floor(Math.random() * jokes.length)];
    } else if (performMathOperation(question)) {
      response = performMathOperation(question);
    } else if (responses[question]) {
      response = responses[question];
    } else {
      const url = `https://www.google.com/search?q=${encodeURIComponent(
        question
      )}`;
      response = `I'm not sure, but you can find info <a href="${url}" target="_blank">here</a>.`;
    }

    setAnswer(response);
    if (user?.token) {
      await saveChat(userInput, response);
    }
    setUserInput("");
  };

  return (
    <div className="side1 active">
      <div className="video-container1">
        <video
          className="video"
          autoPlay
          loop
          muted
          disablePictureInPicture
          src="https://res.cloudinary.com/daa3yhyvy/video/upload/v1725464365/Nexi%20Ai/Nexi%20CB.mp4"
        />
        <h1>E R I S</h1>
        <h2>ERIS ChatBot</h2>
        <p>I am your ChatBot, How may I help you?</p>

        <div className="input1">
          <i className="fas fa-keyboard"></i>
          <input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') processQuestion(); }}
            placeholder="Ask your question..."
          />
          <button className="askButton" id="askButton" onClick={processQuestion}><i className='fas fa-arrow-circle-right'></i></button>
        </div>

        <div className="answers-box">
          <p dangerouslySetInnerHTML={{ __html: answer }}></p>
        </div>
      </div>
    </div>
  );
}
