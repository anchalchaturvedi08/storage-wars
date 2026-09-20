import React, { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import api from "../../api/axios";
import "./ChatBot.css";

function ChatBot() {
  const [chat, setChat] = useState(false);
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      setLoading(true);

      const response = await api.post("/ai", {
        message: message
      });

      setReply(response.data.reply);
      setMessage("");
    } catch (error) {
      console.log("CHATBOT ERROR:", error);
      setReply("Sorry, I could not process your request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setChat(!chat)}
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-gold text-ink shadow-xl"
      >
        <MessageCircle />
      </button>

      {chat && (
        <div className="fixed bottom-24 right-5 z-50 w-[310px] rounded-2xl bg-white shadow-2xl border">
          <div className="bg-ink p-4 text-white">
            <b>StorageWars AI</b>
            <p className="text-xs text-white/60">AI assistant</p>
          </div>

          <div className="p-4">
            <p className="rounded-xl bg-cream p-3 text-sm">
              Hi! I can help you find auctions and understand bidding.
            </p>

            {reply && (
              <p className="mt-3 rounded-xl bg-cream p-3 text-sm">
                {reply}
              </p>
            )}

            <div className="mt-3 flex gap-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                className="min-w-0 flex-1 rounded-xl border p-2"
                placeholder="Ask something..."
              />

              <button
                onClick={sendMessage}
                disabled={loading}
                className="rounded-xl bg-ink p-2 text-white"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBot;