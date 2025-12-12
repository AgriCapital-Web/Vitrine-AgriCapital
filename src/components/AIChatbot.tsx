import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, User, Bot, Loader2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const translations = {
  fr: {
    title: "KAPITA",
    subtitle: "Assistant AgriCapital",
    placeholder: "Tapez votre message...",
    welcome: "Bonjour ! Je suis KAPITA, votre assistant AgriCapital. Comment puis-je vous aider aujourd'hui ?",
    contactTeam: "Contacter l'équipe",
    close: "Fermer",
  },
  en: {
    title: "KAPITA",
    subtitle: "AgriCapital Assistant",
    placeholder: "Type your message...",
    welcome: "Hello! I'm KAPITA, your AgriCapital assistant. How can I help you today?",
    contactTeam: "Contact the team",
    close: "Close",
  },
  ar: {
    title: "كابيتا",
    subtitle: "مساعد أجريكابيتال",
    placeholder: "اكتب رسالتك...",
    welcome: "مرحباً! أنا كابيتا، مساعدك في أجريكابيتال. كيف يمكنني مساعدتك اليوم؟",
    contactTeam: "اتصل بالفريق",
    close: "إغلاق",
  },
  es: {
    title: "KAPITA",
    subtitle: "Asistente AgriCapital",
    placeholder: "Escribe tu mensaje...",
    welcome: "¡Hola! Soy KAPITA, tu asistente de AgriCapital. ¿Cómo puedo ayudarte hoy?",
    contactTeam: "Contactar equipo",
    close: "Cerrar",
  },
  de: {
    title: "KAPITA",
    subtitle: "AgriCapital Assistent",
    placeholder: "Nachricht eingeben...",
    welcome: "Hallo! Ich bin KAPITA, Ihr AgriCapital-Assistent. Wie kann ich Ihnen heute helfen?",
    contactTeam: "Team kontaktieren",
    close: "Schließen",
  },
  zh: {
    title: "KAPITA",
    subtitle: "AgriCapital助手",
    placeholder: "输入您的消息...",
    welcome: "您好！我是KAPITA，您的AgriCapital助手。今天我能为您做什么？",
    contactTeam: "联系团队",
    close: "关闭",
  },
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [visitorId] = useState(() => `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const t = translations[language] || translations.fr;
  const isRTL = language === "ar";

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: "assistant", content: t.welcome }]);
    }
  }, [isOpen, t.welcome]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const streamChat = useCallback(async (userMessages: Message[]) => {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: userMessages, visitorId, language }),
    });

    if (!resp.ok || !resp.body) {
      throw new Error("Failed to start stream");
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let assistantContent = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") break;

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            assistantContent += content;
            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant" && prev.length > 1) {
                return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
              }
              return [...prev, { role: "assistant", content: assistantContent }];
            });
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }
  }, [visitorId, language]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      await streamChat(newMessages.filter(m => m.content !== t.welcome));
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: "assistant", content: "Désolé, une erreur s'est produite. Veuillez réessayer ou contacter notre équipe directement." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToContact = () => {
    setIsOpen(false);
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-[99990] w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 animate-bounce`}
        style={{
          background: 'linear-gradient(135deg, #166534 0%, #14532d 100%)',
          boxShadow: '0 8px 32px rgba(22, 101, 52, 0.4)',
        }}
        aria-label="Open chat"
      >
        <MessageCircle className="w-7 h-7 text-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full animate-ping" />
      </button>

      {/* Chat window */}
      {isOpen && (
        <div
          className={`fixed bottom-24 ${isRTL ? 'left-4' : 'right-4'} z-[99995] w-[360px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[70vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scale-in`}
          style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div
            className="p-4 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, #166534 0%, #14532d 100%)' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{t.title}</h3>
                <p className="text-white/80 text-xs">{t.subtitle}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label={t.close}
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? (isRTL ? "flex-row-reverse" : "flex-row") : ""} gap-2`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-green-700" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === "user"
                      ? "bg-green-700 text-white ml-auto"
                      : "bg-gray-100 text-gray-800"
                  }`}
                  style={{
                    borderRadius: msg.role === "user"
                      ? (isRTL ? '18px 18px 4px 18px' : '18px 18px 18px 4px')
                      : (isRTL ? '18px 18px 18px 4px' : '18px 18px 4px 18px'),
                  }}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-green-700 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-green-700" />
                </div>
                <div className="bg-gray-100 p-3 rounded-2xl">
                  <Loader2 className="w-4 h-4 animate-spin text-green-700" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Contact team button */}
          <div className="px-4 pb-2">
            <button
              onClick={scrollToContact}
              className="w-full py-2 text-xs font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-3 h-3" />
              {t.contactTeam}
            </button>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder={t.placeholder}
                className="flex-1 px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-green-500 text-sm"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="w-12 h-12 rounded-full bg-green-700 hover:bg-green-800"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;
