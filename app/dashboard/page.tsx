"use client";

import { useEffect, useState, useRef } from "react";

interface AiTrack {
  name: string;
  artist: string;
  reason: string;
}

interface AiPlaylist {
  playlistName: string;
  description: string;
  tracks: AiTrack[];
  message: string;
}

interface Message {
  role: "user" | "ai";
  content: string;
  playlist?: AiPlaylist;
}

const SUGGESTIONS = [
  "Sabah koşusu için enerjik şarkılar",
  "Gece çalışırken dinlenecek lo-fi",
  "Hüzünlü bir akşam için Türk pop",
  "90'lar rock nostalji listesi",
  "Odaklanmak için instrumental müzik",
  "Arkadaşlarla parti için dans müziği",
];

export default function Dashboard() {
  const [user, setUser] = useState<{ display_name: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "Merhaba! Ne tür bir playlist oluşturmamı istersin? Ruh halini, tarzı veya bir aktiviteyi yaz — sana özel liste hazırlayayım 🎵",
    },
  ]);
  const [input, setInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [savingPlaylist, setSavingPlaylist] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/spotify/me")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) setUser(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text?: string) {
    const msg = text || input.trim();
    if (!msg || aiLoading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setAiLoading(true);

    try {
      const res = await fetch("/api/ai/playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();

      if (data.playlist) {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: data.playlist.message, playlist: data.playlist },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: "Bir hata oluştu, tekrar deneyin." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Bağlantı hatası. Tekrar deneyin." },
      ]);
    } finally {
      setAiLoading(false);
    }
  }

  async function savePlaylist(playlist: AiPlaylist) {
    setSavingPlaylist(true);
    setSaveMsg("");
    try {
      const res = await fetch("/api/spotify/save-playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tracks: playlist.tracks }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveMsg(`✓ "${data.playlistName}" kaydedildi! ${data.tracksAdded} şarkı eklendi.`);
      } else {
        setSaveMsg("Hata: " + (data.error || "Kaydedilemedi."));
      }
    } catch {
      setSaveMsg("Bağlantı hatası.");
    } finally {
      setSavingPlaylist(false);
    }
  }

  const showSuggestions = messages.length === 1;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-black">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
          </div>
          <span className="font-bold text-lg">spoai</span>
        </div>
        <div className="flex items-center gap-4">
          {user && <span className="text-gray-400 text-sm">{user.display_name}</span>}
          <a href="/api/auth/logout" className="text-gray-500 hover:text-white text-sm transition-colors">
            Çıkış
          </a>
        </div>
      </header>

      {/* Chat alanı */}
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 flex flex-col">

        {saveMsg && (
          <div className="mb-4 px-4 py-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm">
            {saveMsg}
          </div>
        )}

        {/* Mesajlar */}
        <div className="flex-1 space-y-4 mb-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className="max-w-[85%]">
                <div
                  className={`rounded-2xl px-4 py-3 text-sm ${
                    msg.role === "user"
                      ? "bg-green-500 text-black font-medium"
                      : "bg-gray-900 text-gray-200"
                  }`}
                >
                  {msg.content}
                </div>

                {/* Playlist kartı */}
                {msg.playlist && (
                  <div className="mt-3 bg-gray-900 rounded-xl p-4 border border-gray-800">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-green-400">{msg.playlist.playlistName}</h3>
                        <p className="text-gray-500 text-xs mt-0.5">{msg.playlist.description}</p>
                      </div>
                      <span className="text-gray-600 text-xs">{msg.playlist.tracks.length} şarkı</span>
                    </div>
                    <div className="space-y-2 mb-4">
                      {msg.playlist.tracks.map((t, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="text-gray-700 text-xs w-5 text-right flex-shrink-0">{idx + 1}</span>
                          <div className="min-w-0">
                            <p className="text-white text-xs font-medium truncate">{t.name}</p>
                            <p className="text-gray-500 text-xs truncate">{t.artist}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => savePlaylist(msg.playlist!)}
                      disabled={savingPlaylist}
                      className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black font-bold py-2.5 rounded-lg text-sm transition-colors"
                    >
                      {savingPlaylist ? "Kaydediliyor..." : "Spotify'a Kaydet 🎵"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {aiLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-900 rounded-2xl px-4 py-3 flex gap-1.5">
                <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Öneri butonları - sadece başlangıçta göster */}
        {showSuggestions && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                onClick={() => sendMessage(s)}
                className="text-left px-4 py-3 bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 rounded-xl text-sm text-gray-300 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ne tür müzik istiyorsun?"
            className="flex-1 bg-gray-900 text-white placeholder-gray-600 border border-gray-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
          />
          <button
            onClick={() => sendMessage()}
            disabled={aiLoading || !input.trim()}
            className="bg-green-500 hover:bg-green-400 disabled:opacity-40 text-black font-bold px-5 py-3 rounded-xl transition-colors text-lg"
          >
            ↑
          </button>
        </div>
        <p className="text-gray-700 text-xs mt-2 text-center">Grok AI · spoai</p>
      </div>
    </div>
  );
}
