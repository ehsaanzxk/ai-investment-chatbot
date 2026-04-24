"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
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

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];

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
      setMessages([
        ...newMessages,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      backgroundColor: "#0f1117",
      color: "#f1f5f9",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>

      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "16px 24px",
        borderBottom: "1px solid #1e2433",
        backgroundColor: "#131720",
      }}>
        <div style={{
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, #22c55e, #16a34a)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "16px",
          fontWeight: "700",
          color: "white",
          flexShrink: 0,
        }}>$</div>
        <div>
          <div style={{ fontWeight: "600", fontSize: "15px", color: "#f1f5f9" }}>
            Investment Assistant
          </div>
          <div style={{ fontSize: "12px", color: "#64748b" }}>
            Powered by GPT-4o mini
          </div>
        </div>
        <div style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "12px",
          color: "#22c55e",
        }}>
          <div style={{
            width: "7px", height: "7px",
            borderRadius: "50%",
            backgroundColor: "#22c55e",
          }}/>
          Online
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        maxWidth: "760px",
        width: "100%",
        margin: "0 auto",
        alignSelf: "center",
        boxSizing: "border-box",
      }}>
        {messages.length === 0 && (
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            textAlign: "center",
            padding: "60px 20px",
          }}>
            <div style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #22c55e20, #16a34a30)",
              border: "1px solid #22c55e30",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
            }}>📈</div>
            <div>
              <div style={{ fontSize: "18px", fontWeight: "600", color: "#e2e8f0", marginBottom: "8px" }}>
                Ask me anything about investing
              </div>
              <div style={{ fontSize: "13px", color: "#475569", lineHeight: "1.6" }}>
                Stocks, ETFs, portfolio strategy, market concepts — I&apos;m here to help.
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginTop: "8px" }}>
              {["What is an index fund?", "How do I start investing?", "What is dollar-cost averaging?"].map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  style={{
                    padding: "8px 14px",
                    backgroundColor: "#1e2433",
                    border: "1px solid #2d3748",
                    borderRadius: "20px",
                    color: "#94a3b8",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >{q}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
          }}>
            {msg.role === "assistant" && (
              <div style={{
                width: "28px", height: "28px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "12px", fontWeight: "700", color: "white",
                flexShrink: 0, marginRight: "10px", marginTop: "2px",
              }}>$</div>
            )}
            <div style={{
              maxWidth: "70%",
              padding: "12px 16px",
              borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              backgroundColor: msg.role === "user" ? "#22c55e" : "#1e2433",
              color: msg.role === "user" ? "#fff" : "#e2e8f0",
              fontSize: "14px",
              lineHeight: "1.6",
              border: msg.role === "assistant" ? "1px solid #2d3748" : "none",
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "28px", height: "28px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", fontWeight: "700", color: "white", flexShrink: 0,
            }}>$</div>
            <div style={{
              padding: "12px 16px",
              backgroundColor: "#1e2433",
              border: "1px solid #2d3748",
              borderRadius: "18px 18px 18px 4px",
              display: "flex", gap: "4px", alignItems: "center",
            }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{
                  width: "7px", height: "7px",
                  borderRadius: "50%",
                  backgroundColor: "#64748b",
                  animation: "bounce 1.2s infinite",
                  animationDelay: `${i * 0.2}s`,
                }}/>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: "16px",
        borderTop: "1px solid #1e2433",
        backgroundColor: "#131720",
      }}>
        <div style={{
          display: "flex",
          gap: "10px",
          maxWidth: "760px",
          margin: "0 auto",
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about stocks, investing, or finance..."
            style={{
              flex: 1,
              backgroundColor: "#1e2433",
              border: "1px solid #2d3748",
              borderRadius: "12px",
              padding: "12px 16px",
              color: "#f1f5f9",
              fontSize: "14px",
              outline: "none",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{
              padding: "12px 20px",
              backgroundColor: loading || !input.trim() ? "#1e2433" : "#22c55e",
              color: loading || !input.trim() ? "#475569" : "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
          >Send</button>
        </div>
        <div style={{
          textAlign: "center",
          fontSize: "11px",
          color: "#334155",
          marginTop: "10px",
        }}>
          For educational purposes only — not financial advice
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        input::placeholder { color: #475569; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2d3748; border-radius: 3px; }
      `}</style>
    </div>
  );
}