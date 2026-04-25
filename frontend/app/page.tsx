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
        {parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
}

function CompoundCalculator() {
  const [principal, setPrincipal] = useState(5000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(10);
  const [frequency, setFrequency] = useState(12);
  const [monthlyContribution, setMonthlyContribution] = useState(100);

  const n = frequency;
  const r = rate / 100;
  const finalAmount = principal * Math.pow(1 + r / n, n * years) +
    monthlyContribution * ((Math.pow(1 + r / n, n * years) - 1) / (r / n));
  const totalContributions = principal + monthlyContribution * 12 * years;
  const totalInterest = finalAmount - totalContributions;

  const barData = Array.from({ length: years }, (_, i) => {
    const y = i + 1;
    const val = principal * Math.pow(1 + r / n, n * y) +
      monthlyContribution * ((Math.pow(1 + r / n, n * y) - 1) / (r / n));
    return { year: y, value: val };
  });
  const maxVal = barData[barData.length - 1]?.value || 1;

  const input = (label: string, value: number, setter: (v: number) => void, min: number, max: number, step: number, prefix?: string, suffix?: string) => (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <label style={{ fontSize: "13px", color: "#4b5563", fontWeight: "500" }}>{label}</label>
        <span style={{ fontSize: "13px", fontWeight: "600", color: "#7c3aed" }}>{prefix}{value.toLocaleString()}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => setter(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#7c3aed" }} />
    </div>
  );

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ marginBottom: "8px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1e1b2e" }}>Compound Interest Calculator</h2>
        <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>See how your money grows over time with compound interest.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "20px" }}>
        <div style={{ background: "#fff", border: "1px solid #e5e0ff", borderRadius: "16px", padding: "20px" }}>
          {input("Initial Investment", principal, setPrincipal, 100, 100000, 100, "£")}
          {input("Monthly Contribution", monthlyContribution, setMonthlyContribution, 0, 2000, 50, "£")}
          {input("Annual Return Rate", rate, setRate, 1, 20, 0.5, "", "%")}
          {input("Time Period", years, setYears, 1, 40, 1, "", " yrs")}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "13px", color: "#4b5563", fontWeight: "500" }}>Compound Frequency</label>
            <select value={frequency} onChange={e => setFrequency(Number(e.target.value))}
              style={{ width: "100%", marginTop: "6px", padding: "8px", border: "1px solid #c4b5fd", borderRadius: "8px", fontSize: "13px", color: "#1e1b2e", backgroundColor: "#f8f7ff" }}>
              <option value={1}>Annually</option>
              <option value={4}>Quarterly</option>
              <option value={12}>Monthly</option>
              <option value={365}>Daily</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)", borderRadius: "16px", padding: "20px", color: "#fff" }}>
            <div style={{ fontSize: "12px", opacity: 0.85, marginBottom: "4px" }}>Final Amount</div>
            <div style={{ fontSize: "28px", fontWeight: "700" }}>£{Math.round(finalAmount).toLocaleString()}</div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #e5e0ff", borderRadius: "16px", padding: "16px" }}>
            <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Total Contributions</div>
            <div style={{ fontSize: "20px", fontWeight: "600", color: "#1e1b2e" }}>£{Math.round(totalContributions).toLocaleString()}</div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #e5e0ff", borderRadius: "16px", padding: "16px" }}>
            <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Interest Earned</div>
            <div style={{ fontSize: "20px", fontWeight: "600", color: "#22c55e" }}>£{Math.round(totalInterest).toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e5e0ff", borderRadius: "16px", padding: "20px", marginTop: "16px" }}>
        <div style={{ fontSize: "13px", fontWeight: "600", color: "#1e1b2e", marginBottom: "16px" }}>Growth Over Time</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "120px" }}>
          {barData.map((d) => (
            <div key={d.year} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", height: "100%" }}>
              <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                <div style={{ width: "100%", height: `${(d.value / maxVal) * 100}%`, background: "linear-gradient(to top, #7c3aed, #a855f7)", borderRadius: "4px 4px 0 0", minHeight: "4px" }} />
              </div>
              {years <= 15 && <div style={{ fontSize: "10px", color: "#9ca3af" }}>{d.year}</div>}
            </div>
          ))}
        </div>
        {years > 15 && <div style={{ fontSize: "11px", color: "#9ca3af", textAlign: "center", marginTop: "8px" }}>Years 1–{years}</div>}
      </div>
    </div>
  );
}

function GoalPlanner() {
  const [target, setTarget] = useState(50000);
  const [years, setYears] = useState(10);
  const [returnRate, setReturnRate] = useState(7);
  const [currentSavings, setCurrentSavings] = useState(0);

  const r = returnRate / 100 / 12;
  const n = years * 12;
  const futureCurrentSavings = currentSavings * Math.pow(1 + r, n);
  const remaining = target - futureCurrentSavings;
  const monthly = remaining > 0 ? (remaining * r) / (Math.pow(1 + r, n) - 1) : 0;
  const totalContributed = monthly * n + currentSavings;
  const interestEarned = target - totalContributed;

  const input = (label: string, value: number, setter: (v: number) => void, min: number, max: number, step: number, prefix?: string, suffix?: string) => (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <label style={{ fontSize: "13px", color: "#4b5563", fontWeight: "500" }}>{label}</label>
        <span style={{ fontSize: "13px", fontWeight: "600", color: "#7c3aed" }}>{prefix}{value.toLocaleString()}{suffix}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => setter(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#7c3aed" }} />
    </div>
  );

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ marginBottom: "8px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1e1b2e" }}>Investment Goal Planner</h2>
        <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>Find out how much you need to save each month to reach your goal.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginTop: "20px" }}>
        <div style={{ background: "#fff", border: "1px solid #e5e0ff", borderRadius: "16px", padding: "20px" }}>
          {input("Target Amount", target, setTarget, 1000, 500000, 1000, "£")}
          {input("Current Savings", currentSavings, setCurrentSavings, 0, 100000, 500, "£")}
          {input("Time to Goal", years, setYears, 1, 40, 1, "", " yrs")}
          {input("Expected Annual Return", returnRate, setReturnRate, 1, 20, 0.5, "", "%")}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ background: "linear-gradient(135deg,#7c3aed,#a855f7)", borderRadius: "16px", padding: "20px", color: "#fff" }}>
            <div style={{ fontSize: "12px", opacity: 0.85, marginBottom: "4px" }}>Monthly Savings Needed</div>
            <div style={{ fontSize: "28px", fontWeight: "700" }}>£{Math.round(monthly).toLocaleString()}</div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #e5e0ff", borderRadius: "16px", padding: "16px" }}>
            <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Total You Will Contribute</div>
            <div style={{ fontSize: "20px", fontWeight: "600", color: "#1e1b2e" }}>£{Math.round(totalContributed).toLocaleString()}</div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #e5e0ff", borderRadius: "16px", padding: "16px" }}>
            <div style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Earned From Returns</div>
            <div style={{ fontSize: "20px", fontWeight: "600", color: "#22c55e" }}>£{Math.round(interestEarned).toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e5e0ff", borderRadius: "16px", padding: "20px", marginTop: "16px" }}>
        <div style={{ fontSize: "13px", fontWeight: "600", color: "#1e1b2e", marginBottom: "12px" }}>Breakdown</div>
        <div style={{ display: "flex", height: "24px", borderRadius: "8px", overflow: "hidden" }}>
          <div style={{ width: `${Math.max((totalContributed / target) * 100, 0)}%`, background: "#7c3aed" }} />
          <div style={{ flex: 1, background: "#22c55e" }} />
        </div>
        <div style={{ display: "flex", gap: "16px", marginTop: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#6b7280" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#7c3aed" }} /> Your contributions
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#6b7280" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#22c55e" }} /> Investment returns
          </div>
        </div>
      </div>
    </div>
  );
}

function RiskChecker() {
  const [stocks, setStocks] = useState([{ name: "", allocation: 0 }]);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const addStock = () => setStocks([...stocks, { name: "", allocation: 0 }]);
  const removeStock = (i: number) => setStocks(stocks.filter((_, idx) => idx !== i));
  const updateStock = (i: number, field: "name" | "allocation", value: string | number) => {
    const updated = [...stocks];
    updated[i] = { ...updated[i], [field]: value };
    setStocks(updated);
  };

  const totalAllocation = stocks.reduce((sum, s) => sum + Number(s.allocation), 0);

  const analyzeRisk = async () => {
    const validStocks = stocks.filter(s => s.name.trim() && s.allocation > 0);
    if (validStocks.length === 0) return;
    setLoading(true);
    setResult("");
    const portfolioText = validStocks.map(s => `${s.name}: ${s.allocation}%`).join(", ");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: `Analyze the risk profile of this investment portfolio: ${portfolioText}. 
            Give a risk rating (Low/Medium/High/Very High), explain the diversification, 
            identify any concentration risks, and suggest one improvement. Keep it concise and structured.`
          }]
        }),
      });
      const data = await res.json();
      setResult(data.reply);
    } catch {
      setResult("Unable to analyze portfolio. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "600", color: "#1e1b2e" }}>Portfolio Risk Checker</h2>
        <p style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>Enter your holdings and get an AI-powered risk analysis.</p>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e5e0ff", borderRadius: "16px", padding: "20px", marginBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "#1e1b2e" }}>Your Holdings</span>
          <span style={{ fontSize: "13px", color: totalAllocation === 100 ? "#22c55e" : "#ef4444", fontWeight: "600" }}>
            Total: {totalAllocation}%
          </span>
        </div>

        {stocks.map((stock, i) => (
          <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
            <input
              placeholder="Stock / ETF (e.g. AAPL, VOO)"
              value={stock.name}
              onChange={e => updateStock(i, "name", e.target.value)}
              style={{ flex: 2, padding: "10px 12px", border: "1px solid #c4b5fd", borderRadius: "10px", fontSize: "13px", color: "#1e1b2e", backgroundColor: "#f8f7ff", outline: "none" }}
            />
            <input
              type="number" placeholder="%" min={0} max={100}
              value={stock.allocation || ""}
              onChange={e => updateStock(i, "allocation", Number(e.target.value))}
              style={{ flex: 1, padding: "10px 12px", border: "1px solid #c4b5fd", borderRadius: "10px", fontSize: "13px", color: "#1e1b2e", backgroundColor: "#f8f7ff", outline: "none" }}
            />
            {stocks.length > 1 && (
              <button onClick={() => removeStock(i)}
                style={{ padding: "8px 12px", background: "#fee2e2", border: "none", borderRadius: "8px", color: "#ef4444", cursor: "pointer", fontSize: "13px" }}>✕</button>
            )}
          </div>
        ))}

        <button onClick={addStock}
          style={{ width: "100%", padding: "10px", border: "1px dashed #c4b5fd", borderRadius: "10px", background: "transparent", color: "#7c3aed", fontSize: "13px", cursor: "pointer", marginTop: "4px" }}>
          + Add holding
        </button>
      </div>

      <button onClick={analyzeRisk} disabled={loading || totalAllocation === 0}
        style={{ width: "100%", padding: "14px", background: loading || totalAllocation === 0 ? "#ede9ff" : "#7c3aed", color: loading || totalAllocation === 0 ? "#a78bfa" : "#fff", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: "600", cursor: loading || totalAllocation === 0 ? "not-allowed" : "pointer" }}>
        {loading ? "Analysing portfolio..." : "Analyse Risk"}
      </button>

      {result && (
        <div style={{ background: "#fff", border: "1px solid #e5e0ff", borderRadius: "16px", padding: "20px", marginTop: "16px", fontSize: "14px", lineHeight: "1.7", color: "#1e1b2e" }}>
          {formatMessage(result)}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [tab, setTab] = useState<"chat" | "calculator" | "goal" | "risk">("chat");
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

  const tabs = [
    { id: "chat", label: "Chat" },
    { id: "calculator", label: "Compound Calculator" },
    { id: "goal", label: "Goal Planner" },
    { id: "risk", label: "Risk Checker" },
  ] as const;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#f8f7ff", color: "#1e1b2e", fontFamily: "system-ui, -apple-system, sans-serif" }}>

      {/* Header */}
      <div style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e5e0ff", padding: "14px 24px", display: "flex", alignItems: "center", gap: "12px", flexShrink: 0, boxShadow: "0 1px 8px rgba(109,77,255,0.07)" }}>
        <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "linear-gradient(135deg,#7c3aed,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "16px", color: "#fff", flexShrink: 0 }}>$</div>
        <div>
          <div style={{ fontWeight: "600", fontSize: "15px", color: "#1e1b2e" }}>Investment Assistant</div>
          <div style={{ fontSize: "12px", color: "#9ca3af" }}>Powered by GPT-4o mini</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#7c3aed" }}>
          <div style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#7c3aed" }} />
          Online
        </div>
      </div>

      {/* Tabs */}
      <div style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e5e0ff", padding: "0 24px", display: "flex", gap: "4px", flexShrink: 0 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding: "12px 16px", border: "none", background: "transparent", fontSize: "13px", fontWeight: tab === t.id ? "600" : "400", color: tab === t.id ? "#7c3aed" : "#6b7280", borderBottom: tab === t.id ? "2px solid #7c3aed" : "2px solid transparent", cursor: "pointer", transition: "all 0.15s" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "chat" ? (
        <>
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 16px" }}>
            <div style={{ maxWidth: "680px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
              {messages.length === 0 && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", gap: "16px", textAlign: "center" }}>
                  <div style={{ fontSize: "40px" }}>📈</div>
                  <div style={{ fontSize: "18px", fontWeight: "600", color: "#1e1b2e" }}>Ask me anything about investing</div>
                  <div style={{ fontSize: "13px", color: "#6b7280" }}>Stocks, ETFs, bonds, portfolio strategy — I&apos;m here to help.</div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", marginTop: "8px" }}>
                    {["What is an index fund?", "How do I start investing?", "What is dollar-cost averaging?"].map((q) => (
                      <button key={q} onClick={() => setInput(q)} style={{ padding: "8px 14px", backgroundColor: "#ede9ff", border: "1px solid #c4b5fd", borderRadius: "20px", color: "#7c3aed", fontSize: "12px", cursor: "pointer", fontWeight: "500" }}>{q}</button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-start", gap: "10px" }}>
                  {msg.role === "assistant" && (
                    <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg,#7c3aed,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", color: "#fff", flexShrink: 0, marginTop: "2px" }}>$</div>
                  )}
                  <div style={{ maxWidth: "75%", padding: "12px 16px", borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", backgroundColor: msg.role === "user" ? "#7c3aed" : "#ffffff", color: msg.role === "user" ? "#ffffff" : "#1e1b2e", fontSize: "14px", lineHeight: "1.7", border: msg.role === "assistant" ? "1px solid #e5e0ff" : "none", boxShadow: msg.role === "assistant" ? "0 1px 6px rgba(109,77,255,0.08)" : "none" }}>
                    {formatMessage(msg.content)}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "linear-gradient(135deg,#7c3aed,#a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", color: "#fff", flexShrink: 0 }}>$</div>
                  <div style={{ padding: "12px 16px", backgroundColor: "#ffffff", border: "1px solid #e5e0ff", borderRadius: "18px 18px 18px 4px", display: "flex", gap: "5px" }}>
                    {[0, 1, 2].map(i => <div key={i} style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#a855f7", animation: "bounce 1.2s infinite", animationDelay: `${i * 0.2}s` }} />)}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>
          <div style={{ backgroundColor: "#ffffff", borderTop: "1px solid #e5e0ff", padding: "16px", flexShrink: 0 }}>
            <div style={{ maxWidth: "680px", margin: "0 auto", display: "flex", gap: "10px" }}>
              <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="Ask about stocks, investing, or finance..."
                style={{ flex: 1, backgroundColor: "#f8f7ff", border: "1px solid #c4b5fd", borderRadius: "12px", padding: "12px 16px", color: "#1e1b2e", fontSize: "14px", outline: "none" }} />
              <button onClick={sendMessage} disabled={loading || !input.trim()}
                style={{ padding: "12px 22px", backgroundColor: loading || !input.trim() ? "#ede9ff" : "#7c3aed", color: loading || !input.trim() ? "#a78bfa" : "#fff", border: "none", borderRadius: "12px", fontSize: "14px", fontWeight: "600", cursor: loading || !input.trim() ? "not-allowed" : "pointer", flexShrink: 0 }}>
                Send
              </button>
            </div>
            <div style={{ textAlign: "center", fontSize: "11px", color: "#9ca3af", marginTop: "10px" }}>For educational purposes only — not financial advice</div>
          </div>
        </>
      ) : (
        <div style={{ flex: 1, overflowY: "auto" }}>
          {tab === "calculator" && <CompoundCalculator />}
          {tab === "goal" && <GoalPlanner />}
          {tab === "risk" && <RiskChecker />}
        </div>
      )}

      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
        input::placeholder { color: #9ca3af; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #c4b5fd; border-radius: 3px; }
      `}</style>
    </div>
  );
}
