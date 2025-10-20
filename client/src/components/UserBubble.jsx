import { useState, useEffect } from "react";

export default function UserBubble({ setUser }) {
  const [showForm, setShowForm] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [user, setUserLocal] = useState(() => JSON.parse(localStorage.getItem("user")));
  const [chats, setChats] = useState([]);

  const toggleForm = () => setShowForm(!showForm);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/api/login" : "/api/signup";

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();

    if (data.token) {
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      setUserLocal(data);
      setShowForm(false);
      fetchChats(); // Fetch chats immediately after login
    } else {
      alert(data.message || "Authentication failed");
    }
  };
  

  const fetchChats = async () => {
    if (!user?.token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chats`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setChats(data);
      }
    } catch (error) {
      console.error("Failed to fetch chats:", error);
      // Could add user notification here
    }
  };

  const deleteChat = async (chatId) => {
    if (!user?.token) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chats/${chatId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.ok) {
        setChats(chats.filter(chat => chat._id !== chatId));
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  // Function to refresh chats when new chat is saved
  const refreshChats = () => {
    if (user) fetchChats();
  };

  useEffect(() => {
    if (user) fetchChats();
  }, [user]);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      setUserLocal(updatedUser);
      if (updatedUser) fetchChats();
    };

    const handleChatSaved = () => {
      if (user) fetchChats();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("chatSaved", handleChatSaved);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("chatSaved", handleChatSaved);
    };
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setUserLocal(null);
    setChats([]);
  };

  return (
    <>
      <div id="userBubble" onClick={toggleForm}>
        <img src="https://res.cloudinary.com/daa3yhyvy/image/upload/v1760357220/user_txz9oc.png" alt="User" />
      </div>

      {showForm && (
        <div className="auth-popup">
          {user ? (
            <div className="user-info">
              <h3>Welcome, {user.name}</h3>
              <button onClick={handleLogout}>Logout</button>
              <div className="chat-history-popup">
                <h4>Chat History</h4>
                <div className="chat-list">
                  {chats.length > 0 ? (
                    chats.map(chat => (
                      <div key={chat._id} className="chat-item-popup">
                        <p><strong>You:</strong> {chat.message}</p>
                        <p><strong>ERIS:</strong> {chat.response}</p>
                        <p><small>{new Date(chat.timestamp).toLocaleString()}</small></p>
                        <button onClick={() => deleteChat(chat._id)}>Delete</button>
                      </div>
                    ))
                  ) : (
                    <p>No chats yet.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <h3>{isLogin ? "Login" : "Signup"}</h3>
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Name"
                  required
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              )}
              <input
                type="email"
                placeholder="Email"
                required
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                required
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button type="submit">{isLogin ? "Login" : "Signup"}</button>
              <p onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Create Account" : "Have an Account? Login"}
              </p>
            </form>
          )}
        </div>
      )}
    </>
  );
}
