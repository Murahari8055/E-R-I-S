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
    "what's the meaning of life": "Many say it's 42, but I think it's up to you to decide!",
    "tell me a joke": "Why do Java developers wear glasses? Because they don't see sharp.",
    "joke": "How do you comfort a JavaScript bug? You console it!",
    "what is the weather": "I'm sorry, I don't have access to real-time weather data. You can check a weather website for current conditions.",
    "how old are you": "As an AI, I don't have an age, but I'm always learning and improving!",
    "what is your favorite color": "As an AI, I don't have personal preferences, but I think all colors are beautiful in their own way!",
    "can you help me": "Of course! I'm here to assist you. What do you need help with?",
    "what time is it": `The current time is ${new Date().toLocaleTimeString()}.`,
    "what day is it": `Today is ${new Date().toLocaleDateString()}.`,
    "tell me something interesting": "Did you know that honey never spoils? Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible!",
    "what is machine learning": "Machine learning is a type of AI that allows computers to learn and improve from experience without being explicitly programmed.",
    "how does ai work": "AI works by using algorithms and statistical models to process data, recognize patterns, and make decisions or predictions.",
    "what is the internet": "The internet is a global network of interconnected computers that communicate using standardized protocols.",
    "tell me a fun fact": "Octopuses have three hearts and blue blood!",
    "what is programming": "Programming is the process of creating instructions for computers to follow, using programming languages like JavaScript, Python, or Java.",
    "how to learn coding": "Start with basics like HTML, CSS, and JavaScript. Practice regularly, build projects, and don't be afraid to ask for help from online communities!",
    "what is react": "React is a popular JavaScript library for building user interfaces, particularly web applications.",
    "what is node.js": "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine, allowing you to run JavaScript on the server side.",
    "what is mongodb": "MongoDB is a NoSQL database that stores data in flexible, JSON-like documents.",
    "what is express": "Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications."
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
      // Could add user notification here
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
          {window.innerWidth > 768 && <i className="fas fa-keyboard"></i>}
          <input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') processQuestion(); }}
            placeholder={window.innerWidth <= 768 ? "Ask me . . " : "Ask your question..."}
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
