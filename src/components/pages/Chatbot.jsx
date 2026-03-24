import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { 
      sender: "bot", 
      text: "🌈 Hello! I'm your colorful CRM Assistant. Ask me anything about the CRM system! 🚀" 
    }
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions] = useState([
    "How to add a deal? 💰",
    "What are leads? 👥",
    "Create a ticket 🎫",
    "Show reports 📊",
    "Dashboard overview 📈",
    "Contact management 📇"
  ]);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const getBotReply = (question) => {
    const q = question.toLowerCase();

    if (q.includes("deal") || q.includes("💰")) {
      if (q.includes("add") || q.includes("create")) {
        return "💰 To add a deal: Go to Deals → Click 'Add Deal' → Fill details → Click Save. Easy as that!";
      }
      return "💰 Deals track sales opportunities. Each deal has stages from qualification to closed won/lost. Want to know more?";
    }

    if (q.includes("lead") || q.includes("👥")) {
      if (q.includes("add") || q.includes("create")) {
        return "👥 To add a lead: Go to Leads → Click 'Add Lead' → Enter details → Click Save. They'll appear in your pipeline!";
      }
      if (q.includes("convert")) {
        return "👥 To convert a lead: Open the lead → Click 'Convert to Deal' → Confirm. They become a real opportunity!";
      }
      return "👥 Leads are potential customers. Track them from new to qualified or lost. Each lead brings opportunity!";
    }

    if (q.includes("ticket") || q.includes("🎫") || q.includes("support")) {
      if (q.includes("create") || q.includes("add") || q.includes("open")) {
        return "🎫 To create a ticket: Go to Tickets → Click 'Add Ticket' → Enter details → Set priority → Click Create. Support will handle it!";
      }
      return "🎫 Tickets manage customer support requests. Track by priority: 🔴 Critical, 🟠 High, 🟡 Medium, 🟢 Low.";
    }

    if (q.includes("contact") || q.includes("📇")) {
      if (q.includes("add") || q.includes("create")) {
        return "📇 To add a contact: Go to Contacts → Click 'Add Contact' → Fill information → Click Save. Keep your network organized!";
      }
      return "📇 Contacts store customer information like name, email, phone, and company. Your address book on steroids!";
    }

    if (q.includes("report") || q.includes("📊") || q.includes("analytics")) {
      return "📊 Reports show sales performance, revenue, deals won, and team metrics. Access in Reports module. Numbers don't lie!";
    }

    if (q.includes("dashboard") || q.includes("📈")) {
      return "📈 Dashboard shows key metrics: total deals, active leads, open tickets, and revenue charts. Your command center!";
    }

    if (q.includes("login") || q.includes("password") || q.includes("account")) {
      if (q.includes("forgot") || q.includes("reset")) {
        return "🔐 Click 'Forgot Password' on login page → Enter email → Follow reset link sent to your inbox. Keep it secure!";
      }
      return "🔐 Login with your email and password. Contact admin if you need access. Security first!";
    }

    if (q.includes("hello") || q.includes("hi") || q.includes("hey") || q.includes("👋")) {
      return "👋 Hello there! Ready to explore the CRM? Ask me anything about deals, leads, tickets, or reports!";
    }

    if (q.includes("thank") || q.includes("thanks") || q.includes("🙏")) {
      return "🎉 You're welcome! Always happy to help! Got more questions? I'm here 24/7!";
    }

    if (q.includes("help") || q.includes("?")) {
      return "🤔 I can help with:\n💰 Deals\n👥 Leads\n🎫 Tickets\n📇 Contacts\n📊 Reports\n📈 Dashboard\n🔐 Login\nJust ask away!";
    }

    return "✨ I'm not sure about that. Try asking about deals, leads, tickets, contacts, reports, or dashboard. I'm here to help! 🌈";
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { 
      sender: "user", 
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        sender: "bot",
        text: getBotReply(input),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  const clearChat = () => {
    setMessages([
      { 
        sender: "bot", 
        text: "🌈 Hello! I'm your colorful CRM Assistant. Ask me anything about the CRM system! 🚀" 
      }
    ]);
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setTimeout(() => {
      sendMessage();
    }, 100);
  };

  return (
    <div className="chatbot-wrapper">
      <div className="chatbot-container">
        {/* Header */}
        <div className="chat-header">
          <div className="header-left">
            <span className="bot-icon">🤖</span>
            <div className="header-info">
              <h3>🌈 Colorful CRM Assistant</h3>
              <span className="status">✨ Online & Ready</span>
            </div>
          </div>
          <div className="header-actions">
            <button className="clear-btn" onClick={clearChat} title="Clear chat">
              🗑️
            </button>
          </div>
        </div>

        {/* Chat Body */}
        <div className="chat-body">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message-wrapper ${msg.sender === "user" ? "user-wrapper" : "bot-wrapper"}`}
            >
              {msg.sender === "bot" && <span className="avatar bot-avatar">🤖</span>}
              <div className={`message ${msg.sender === "user" ? "user-msg" : "bot-msg"}`}>
                <div className="message-content">{msg.text}</div>
                {msg.timestamp && <span className="timestamp">{msg.timestamp}</span>}
              </div>
              {msg.sender === "user" && <span className="avatar user-avatar">👤</span>}
            </div>
          ))}

          {isTyping && (
            <div className="message-wrapper bot-wrapper">
              <span className="avatar bot-avatar">🤖</span>
              <div className="message bot-msg typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* Suggestions */}
        <div className="suggestions-container">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="suggestion-chip"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="chat-input">
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask your CRM question... 💬"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button 
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className={!input.trim() || isTyping ? "disabled" : ""}
          >
            {isTyping ? '✨ Thinking...' : 'Send ✨'}
          </button>
        </div>

        {/* Footer */}
        <div className="chat-footer">
          <span>🌈 Colorful CRM Assistant v1.0</span>
          <span className="typing-status">{isTyping ? '🌟 Bot is typing...' : '✨ Ready to help'}</span>
        </div>
      </div>
    </div>
  );
}