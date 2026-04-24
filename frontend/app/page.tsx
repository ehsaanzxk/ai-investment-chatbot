"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function formatMessage(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const parts = line.split(/\*\*(.*?)\*\*/g);
    return (
      <span key={i}>
        {parts.map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )}
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    const newMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100vh", backgroundColor:"#f8f7ff", color:"#1e1b2e", fontFamily:"system-ui, -apple-system, sans-serif" }}>

      {/* Header */}
      <div style={{ backgroundColor:"#ffffff", borderBottom:"1px solid #e5e0ff", padding:"14px 24px", display:"flex", alignItems:"center", gap:"12px", flexShrink:0, boxShadow:"0 1px 8px rgba(109,77,255,0.07)" }}>
        <div style={{ width:"38px", height:"38px", borderRadius:"10px", background:"linear-gradient(135deg,#7c3aed,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:"700", fontSize:"16px", color:"#fff", flexShrink:0 }}>$</div>
        <div>
          <div style={{ fontWeight:"600", fontSize:"15px", color:"#1e1b2e" }}>Investment Assistant</div>
          <div style={{ fontSize:"12px", color:"#9ca3af" }}>Powered by GPT-4o mini</div>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", alignItems:"center", gap:"6px", fontSize:"12px", color:"#7c3aed" }}>
          <div style={{ width:"7px", height:"7px", borderRadius:"50%", backgroundColor:"#7c3aed" }}/>
          Online
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"24px 16px" }}>
        <div style={{ maxWidth:"680px", margin:"0 auto", display:"flex", flexDirection:"column", gap:"16px" }}>

          {messages.length === 0 && (
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"80px 20px", gap:"16px", textAlign:"center" }}>
              <div style={{ fontSize:"40px" }}>📈</div>
              <div style={{ fontSize:"18px", fontWeight:"600", color:"#1e1b2e" }}>Ask me anything about investing</div>
              <div style={{ fontSize:"13px", color:"#6b7280" }}>Stocks, ETFs, bonds, portfolio strategy — I&apos;m here to help.</div>
              <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", justifyContent:"center", marginTop:"8px" }}>
                {["What is an index fund?", "How do I start investing?", "What is dollar-cost averaging?"].map((q) => (
                  <button key={q} onClick={() => setInput(q)} style={{ padding:"8px 14px", backgroundColor:"#ede9ff", border:"1px solid #c4b5fd", borderRadius:"20px", color:"#7c3aed", fontSize:"12px", cursor:"pointer", fontWeight:"500" }}>{q}</button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} style={{ display:"flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", alignItems:"flex-start", gap:"10px" }}>
              {msg.role === "assistant" && (
                <div style={{ width:"28px", height:"28px", borderRadius:"8px", background:"linear-gradient(135deg,#7c3aed,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", fontWeight:"700", color:"#fff", flexShrink:0, marginTop:"2px" }}>$</div>
              )}
              <div style={{
                maxWidth:"75%",
                padding:"12px 16px",
                borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                backgroundColor: msg.role === "user" ? "#7c3aed" : "#ffffff",
                color: msg.role === "user" ? "#ffffff" : "#1e1b2e",
                fontSize:"14px",
                lineHeight:"1.7",
                border: msg.role === "assistant" ? "1px solid #e5e0ff" : "none",
                boxShadow: msg.role === "assistant" ? "0 1px 6px rgba(109,77,255,0.08)" : "none",
              }}>{formatMessage(msg.content)}</div>
            </div>
          ))}

          {loading && (
            <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
              <div style={{ width:"28px", height:"28px", borderRadius:"8px", background:"linear-gradient(135deg,#7c3aed,#a855f7)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", fontWeight:"700", color:"#fff", flexShrink:0 }}>$</div>
              <div style={{ padding:"12px 16px", backgroundColor:"#ffffff", border:"1px solid #e5e0ff", borderRadius:"18px 18px 18px 4px", display:"flex", gap:"5px", boxShadow:"0 1px 6px rgba(109,77,255,0.08)" }}>
                {[0,1,2].map(i => <div key={i} style={{ width:"7px", height:"7px", borderRadius:"50%", backgroundColor:"#a855f7", animation:"bounce 1.2s infinite", animationDelay:`${i*0.2}s` }}/>)}
              </div>
            </div>
          )}

          <div ref={bottomRef}/>
        </div>
      </div>

      {/* Input */}
      <div style={{ backgroundColor:"#ffffff", borderTop:"1px solid #e5e0ff", padding:"16px", flexShrink:0, boxShadow:"0 -1px 8px rgba(109,77,255,0.05)" }}>
        <div style={{ maxWidth:"680px", margin:"0 auto", display:"flex", gap:"10px" }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about stocks, investing, or finance..."
            style={{ flex:1, backgroundColor:"#f8f7ff", border:"1px solid #c4b5fd", borderRadius:"12px", padding:"12px 16px", color:"#1e1b2e", fontSize:"14px", outline:"none" }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{ padding:"12px 22px", backgroundColor: loading || !input.trim() ? "#ede9ff" : "#7c3aed", color: loading || !input.trim() ? "#a78bfa" : "#fff", border:"none", borderRadius:"12px", fontSize:"14px", fontWeight:"600", cursor: loading || !input.trim() ? "not-allowed" : "pointer", flexShrink:0 }}
          >Send</button>
        </div>
        <div style={{ textAlign:"center", fontSize:"11px", color:"#9ca3af", marginTop:"10px" }}>For educational purposes only — not financial advice</div>
      </div>

      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
        input::placeholder { color: #9ca3af; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #c4b5fd; border-radius: 3px; }
      `}</style>
    </div>
  );
}
