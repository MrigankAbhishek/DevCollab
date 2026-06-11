import { useState, useEffect, useRef } from "react";
import socket from "../socket";

export default function Chat({ roomId, user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    socket.on("new-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => socket.off("new-message");
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    socket.emit("send-message", {
      roomId,
      message: input.trim(),
      user: { name: user.name, avatar: user.avatar, _id: user._id },
      timestamp: new Date().toISOString(),
    });
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-night-700 bg-night-800">
        <h3 className="text-white font-sans font-semibold text-sm flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          Chat
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-night-400 text-xs text-center font-sans pt-8">No messages yet. Say hello!</p>
        )}
        {messages.map((msg, i) => {
          const isMe = msg.user._id === user._id;
          return (
            <div key={i} className={`flex gap-2 ${isMe ? "flex-row-reverse" : ""} animate-fade-in`}>
              <img src={msg.user.avatar} alt={msg.user.name} className="w-6 h-6 rounded-full flex-shrink-0 mt-0.5" />
              <div className={`max-w-[80%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
                <span className="text-night-400 text-xs font-sans">{isMe ? "You" : msg.user.name}</span>
                <div className={`px-3 py-2 rounded-2xl text-sm font-sans leading-relaxed ${isMe ? "bg-electric-600 text-white rounded-tr-sm" : "bg-night-700 text-night-100 rounded-tl-sm"}`}>
                  {msg.message}
                </div>
                <span className="text-night-500 text-xs font-mono">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="p-3 border-t border-night-700 flex gap-2">
        <input
          className="input text-sm flex-1"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="btn-primary px-3 py-2 text-sm" disabled={!input.trim()}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </form>
    </div>
  );
}
