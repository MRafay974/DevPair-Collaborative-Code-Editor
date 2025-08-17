import { useEffect, useRef, useState } from "react";

export default function ChatBox({ roomId, messagesRef, initialMessages, socket }) {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState(() =>
    (initialMessages || []).map((m) =>
      typeof m === "string" ? { message: m, from: "unknown", ts: Date.now() } : m
    )
  );
  
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // keep messagesRef in sync for persistence on leave
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages, messagesRef]);

  useEffect(() => {
    // handler needs stable reference for off()
    const handleIncoming = (payload) => {
      // payload expected: { message, from, ts }
      setMessages((prev) => [...prev, payload]);
    };

    socket.on("chat-message", handleIncoming);
    return () => {
      socket.off("chat-message", handleIncoming);
    };
  }, [socket]);

  const sendMessage = () => {
    const text = msg.trim();
    if (!text) return;

    // Emit to server (it will broadcast to others)
    socket.emit("chat-message", { roomId, message: text });

    // Optimistically add to own list
    const mine = { message: text, from: "me", ts: Date.now() };
    setMessages((prev) => [...prev, mine]);
    setMsg("");
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp || Date.now()).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMessageAlignment = (from) => {
    return from === "me" ? "chat-end" : "chat-start";
  };

  const getBubbleStyle = (from) => {
    return from === "me" ? "chat-bubble-primary" : "chat-bubble-secondary";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto rounded-lg border border-base-300 bg-base-50 p-3 min-h-[280px] max-h-[400px]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-4xl mb-3 opacity-50">💬</div>
            <p className="text-sm text-base-content/60 font-medium">No messages yet</p>
            <p className="text-xs text-base-content/40 mt-1">Start the conversation! 👋</p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((m, i) => (
              <div key={i} className={`chat ${getMessageAlignment(m.from)}`}>
                <div className="chat-header text-xs opacity-70 mb-1">
                  <span className="font-medium">
                    {m.from === "me" ? "You" : (m.from || "Anonymous")}
                  </span>
                  <time className="ml-2">{formatTime(m.ts)}</time>
                </div>
                <div className={`chat-bubble text-sm ${getBubbleStyle(m.from)} shadow-sm`}>
                  {m.message}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Container */}
      <div className="mt-3">
        <div className="join w-full shadow-sm">
          <input
            className="input input-bordered join-item flex-1 text-sm placeholder:text-base-content/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Type your message..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            maxLength={500}
          />
          <button 
            className="btn btn-primary join-item px-6 hover:scale-105 transition-transform"
            onClick={sendMessage}
            disabled={!msg.trim()}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span className="hidden sm:inline ml-1">Send</span>
          </button>
        </div>
        {msg.length > 0 && (
          <div className="text-xs text-base-content/50 mt-1 text-right">
            {msg.length}/500
          </div>
        )}
      </div>
    </div>
  );
}