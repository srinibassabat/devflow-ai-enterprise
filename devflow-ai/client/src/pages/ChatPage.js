import React, { useState, useEffect, useRef } from "react";
import { sendMessage, getChatHistory, getChatById, deleteChat } from "../utils/api";
import toast from "react-hot-toast";
import "./ChatPage.css";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const fetchHistory = async () => {
    try {
      const { data } = await getChatHistory();
      setHistory(data);
    } catch {
      // silent
    } finally {
      setHistoryLoading(false);
    }
  };

  const loadChat = async (id) => {
    try {
      const { data } = await getChatById(id);
      setMessages(data.messages);
      setChatId(id);
    } catch {
      toast.error("Failed to load chat");
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setChatId(null);
    inputRef.current?.focus();
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput("");

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const { data } = await sendMessage({ message: userMessage, chatId });
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      if (!chatId) {
        setChatId(data.chatId);
        fetchHistory();
      }
    } catch (err) {
      toast.error("AI service error. Check your Gemini API key.");
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "⚠️ Sorry, I encountered an error. Please check the server configuration.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDeleteChat = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteChat(id);
      setHistory((prev) => prev.filter((c) => c._id !== id));
      if (chatId === id) startNewChat();
      toast.success("Chat deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const formatContent = (content) => {
    // Basic code block formatting
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith("```")) {
        const code = part.replace(/```[\w]*\n?/, "").replace(/```$/, "");
        return <pre key={i} className="code-block"><code>{code}</code></pre>;
      }
      return <span key={i} style={{ whiteSpace: "pre-wrap" }}>{part}</span>;
    });
  };

  const suggestions = [
    "Explain RESTful API design patterns",
    "How do I connect React to Node.js backend?",
    "Write a Mongoose schema for users",
    "What is JWT authentication?",
  ];

  return (
    <div className="chat-page">
      {/* Sidebar */}
      <div className="chat-sidebar">
        <div className="chat-sidebar-header">
          <h3>Chat History</h3>
          <button className="new-chat-btn" onClick={startNewChat}>+ New</button>
        </div>

        <div className="chat-history-list">
          {historyLoading ? (
            <p className="history-empty">Loading...</p>
          ) : history.length === 0 ? (
            <p className="history-empty">No chats yet</p>
          ) : (
            history.map((chat) => (
              <div
                key={chat._id}
                className={`history-item ${chatId === chat._id ? "active" : ""}`}
                onClick={() => loadChat(chat._id)}
              >
                <span className="history-title">{chat.title}</span>
                <button
                  className="history-delete"
                  onClick={(e) => handleDeleteChat(chat._id, e)}
                  title="Delete chat"
                >✕</button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat */}
      <div className="chat-main">
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="ai-indicator">
              <span className="ai-dot"></span>
              <span>DevFlow AI Assistant</span>
            </div>
            <p>Powered by Google Gemini · Expert coding help</p>
          </div>
        </div>

        {/* Messages */}
        <div className="messages-area">
          {messages.length === 0 ? (
            <div className="chat-welcome">
              <div className="welcome-icon">🤖</div>
              <h2>How can I help you code today?</h2>
              <p>Ask me anything about React, Node.js, MongoDB, APIs, or any dev topic.</p>
              <div className="suggestions">
                {suggestions.map((s, i) => (
                  <button key={i} className="suggestion-chip" onClick={() => { setInput(s); inputRef.current?.focus(); }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`message-wrapper ${msg.role}`}>
                <div className="message-avatar">
                  {msg.role === "user" ? "👤" : "🤖"}
                </div>
                <div className={`message-bubble ${msg.role}`}>
                  {formatContent(msg.content)}
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="message-wrapper assistant">
              <div className="message-avatar">🤖</div>
              <div className="message-bubble assistant typing">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chat-input-area">
          <div className="chat-input-wrapper">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about code, debugging, architecture..."
              rows={1}
              className="chat-input"
              disabled={loading}
            />
            <button
              className={`send-btn ${loading || !input.trim() ? "disabled" : ""}`}
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              {loading ? "⏳" : "➤"}
            </button>
          </div>
          <p className="input-hint">Press Enter to send · Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
