"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, ArrowRight, Leaf } from "lucide-react";
import { useChat } from "@ai-sdk/react";

export default function PlantChatWidget({ plant }) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Listen for external open requests
  useEffect(() => {
    const handleOpen = () => setIsChatOpen(true);
    window.addEventListener('open-plant-chat', handleOpen);
    return () => window.removeEventListener('open-plant-chat', handleOpen);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsChatOpen(true)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          background: "#10b981",
          color: "#fff",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 32px rgba(16, 185, 129, 0.4)",
          border: "none",
          cursor: "pointer",
          zIndex: 10001,
          transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1) rotate(5deg)"}
        onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1) rotate(0deg)"}
      >
        <MessageCircle size={28} />
      </button>

      {isChatOpen && <ChatModal plant={plant} onClose={() => setIsChatOpen(false)} />}
    </>
  );
}

function ChatModal({ plant, onClose }) {
  const [localInput, setLocalInput] = useState("");
  const [isManualLoading, setIsManualLoading] = useState(false);
  const scrollRef = useRef(null);
  
  const chat = useChat({
    api: '/api/chat',
    body: {
      plantInfo: {
        name: plant.nickname || plant.name,
        species: plant.species,
        owner_name: plant.owner_name,
        owner_details: plant.owner_details || plant.caretaker?.note,
        acquired_date: plant.acquired_date || plant.acquired,
        location: plant.location
      }
    }
  });

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat.messages]);

  const handleSend = async () => {
    const text = localInput.trim();
    if (!text || isManualLoading) return;

    try {
      setIsManualLoading(true);
      
      // 1. Manually add user message to UI
      const newUserMsg = { id: Date.now().toString(), role: 'user', content: text };
      chat.setMessages([...(chat.messages || []), newUserMsg]);
      setLocalInput("");

      // 2. Fetch AI response manually
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          messages: [...(chat.messages || []), newUserMsg],
          plantInfo: {
            name: plant.nickname || plant.name,
            species: plant.species,
            owner_name: plant.owner_name,
            owner_details: plant.owner_details || plant.caretaker?.note,
            acquired_date: plant.acquired_date || plant.acquired,
            location: plant.location
          }
        })
      });

      if (!res.ok) throw new Error("API failed");
      
      const aiResponse = await res.text();
      
      // 3. Manually add AI message to UI
      chat.setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: aiResponse }]);
    } catch (err) {
      console.error("ChatWidget: Manual Send Error:", err);
    } finally {
      setIsManualLoading(false);
    }
  };

  return (
    <div style={{ 
      position: "fixed", 
      top: 0, 
      left: 0, 
      width: "100vw", 
      height: "100dvh", 
      background: "rgba(15, 23, 42, 0.7)", 
      backdropFilter: "blur(4px)",
      zIndex: 1000000, 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      padding: "10px"
    }}>
      <div style={{ 
        background: "#fff", 
        width: "100%", 
        maxWidth: "480px", 
        height: "100%", 
        maxHeight: "750px", 
        borderRadius: "28px", 
        display: "flex", 
        flexDirection: "column", 
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        overflow: "hidden",
        animation: "slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)"
      }}>
        {/* Header */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          padding: "20px 24px", 
          background: "linear-gradient(135deg, #1e293b, #0f172a)",
          color: "#fff"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ width: "45px", height: "45px", borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "2px solid #10b981", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              {plant.image ? <img src={plant.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "🌿"}
            </div>
            <div>
              <div style={{ fontSize: "17px", fontWeight: 800 }}>{plant.nickname || plant.name || "Plant"}</div>
              <div style={{ fontSize: "12px", color: "#10b981", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }} /> Online
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", borderRadius: "50%", width: "36px", height: "36px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div 
          ref={scrollRef}
          style={{ 
            flex: 1, 
            overflowY: "auto", 
            padding: "24px", 
            display: "flex", 
            flexDirection: "column", 
            gap: "16px",
            background: "#f8fafc" 
          }}
        >
          {chat.messages?.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: "40px", marginBottom: "16px" }}>👋</div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "#1e293b" }}>Say hi to {plant.nickname || plant.name}!</div>
              <p style={{ fontSize: "14px", color: "#64748b", marginTop: "8px" }}>Your specimen is waiting for a chat...</p>
            </div>
          )}
          
          {chat.messages?.map((m, i) => {
            const isUser = m.role === 'user';
            
            // Extract content from either content, text, or parts array
            let content = m.content;
            
            // Handle parts array if present
            if (!content && m.parts && Array.isArray(m.parts)) {
                content = m.parts
                    .filter(p => p.type === 'text')
                    .map(p => p.text)
                    .join(' ');
            }
            
            // Fallback to plain text key
            if (!content) content = m.text;
            
            if (!content || (typeof content === 'string' && content.trim() === '')) return null;

            return (
              <div key={i} style={{ display: "flex", justifyContent: isUser ? 'flex-end' : 'flex-start', animation: "fadeIn 0.3s ease-in", margin: "4px 0" }}>
                <div style={{ 
                  maxWidth: "85%", 
                  padding: "12px 16px", 
                  borderRadius: "20px", 
                  borderBottomRightRadius: isUser ? "4px" : "20px",
                  borderBottomLeftRadius: !isUser ? "4px" : "20px",
                  background: isUser ? "#10b981" : "#1e293b", 
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: 500,
                  lineHeight: 1.4,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  wordBreak: "break-word"
                }}>
                  {typeof content === 'string' ? content : JSON.stringify(content)}
                </div>
              </div>
            );
          })}
          
          {(chat.isLoading || chat.status === 'loading' || isManualLoading) && (
            <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: "8px", animation: "fadeIn 0.3s ease-in" }}>
               <div style={{ padding: "12px 20px", borderRadius: "20px", background: "#e2e8f0", color: "#1e293b", fontSize: "14px", fontWeight: 600, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                 Planting thoughts... 🌱
               </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ padding: "20px 24px", background: "#fff", borderTop: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", gap: "12px", background: "#f1f5f9", padding: "6px", borderRadius: "100px", border: "1px solid #e2e8f0" }}>
            <input
              value={localInput}
              onChange={(e) => setLocalInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Talk to your plant..."
              style={{ flex: 1, padding: "12px 20px", background: "transparent", border: "none", outline: "none", fontSize: "15px", fontWeight: 500, color: "#1e293b" }}
            />
            <button 
              onClick={handleSend}
              style={{ 
                background: "#10b981", 
                color: "#fff", 
                border: "none", 
                width: "44px", 
                height: "44px", 
                borderRadius: "50%", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                cursor: "pointer",
                transition: "all 0.2s",
                opacity: (localInput.trim() && !isManualLoading) ? 1 : 0.5
              }}
              disabled={isManualLoading}
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
