import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import './AIAssistant.css';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I am your AI First-Aid Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await res.json();
      
      if (data.success) {
        setMessages(prev => [...prev, { sender: 'ai', text: data.reply }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I am having trouble connecting right now.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="ai-assistant-wrapper">
      {isOpen ? (
        <div className="chat-window animate-slide-up">
          <div className="chat-header">
            <div className="chat-title">
              <Bot size={20} color="white" />
              <span>AI First-Aid Assistant</span>
            </div>
            <button className="btn-close" onClick={() => setIsOpen(false)}>
              <X size={20} color="white" />
            </button>
          </div>
          
          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message-bubble ${msg.sender}`}>
                <div className="bubble-icon">
                  {msg.sender === 'ai' ? <Bot size={14} /> : <User size={14} />}
                </div>
                <div className="bubble-text">{msg.text}</div>
              </div>
            ))}
            {isTyping && (
              <div className="message-bubble ai">
                <div className="bubble-icon"><Bot size={14} /></div>
                <div className="bubble-text typing-indicator">
                  <span>.</span><span>.</span><span>.</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chat-input-area" onSubmit={handleSend}>
            <input 
              type="text" 
              placeholder="Ask about CPR, burns, bleeding..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" disabled={!input.trim() || isTyping}>
              <Send size={18} />
            </button>
          </form>
        </div>
      ) : (
        <button className="chat-fab pulse-animation" onClick={() => setIsOpen(true)}>
          <MessageSquare size={28} color="white" />
        </button>
      )}
    </div>
  );
};

export default AIAssistant;
