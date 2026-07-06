import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Send, Bot } from "lucide-react";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// 1. Mise à jour de l'interface pour accepter la prop onQuerySent
interface ChatbotSectionProps {
    onQuerySent: (query: string) => void;
}

// 1. Réception de la prop onQuerySent
const ChatbotSection = ({ onQuerySent }: ChatbotSectionProps) => {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello i'm your medical assistant. How can I help you today?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // NOTE: J'ai retiré 'alert()' ici car c'est interdit dans les immersives.
  const WEBHOOK_URL = "http://localhost:5678/webhook/medical-questions";

  const cleanText = (text: string) => {
    return text.replace(/\\n/g, "\n").replace(/\\/g, "");
  };

  // 💡 Liste de questions rapides suggérées à l'utilisateur
  const quickReplies = [
    "What can this assistant do?",
    "What are the symptoms of diabetes?",
    "Tell me about hypertension"
  ];

  const handleQuickReply = (question: string) => {
    handleSendQuestion(question);
  };

  const handleSendQuestion = async (question?: string) => {
    const messageToSend = question || inputMessage;
    if (!messageToSend.trim()) {
      toast.error("Please enter a question");
      return;
    }

    // 2. Appel de la fonction onQuerySent AVANT l'envoi à l'API.
    // Cela permet au composant parent (Index) de conditionner l'affichage du bouton de téléchargement.
    if (onQuerySent) {
        onQuerySent(messageToSend);
    }

    const userMessage: Message = { role: "user", content: messageToSend };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: messageToSend }),
      });

      if (response.ok) {
        const result = await response.json();
        const content =
            result?.output ||
            result[0]?.json?.output ||
            result[0]?.output ||
            result[0]?.message?.content ||
            "No response received.";


        const assistantMessage: Message = {
          role: "assistant",
          content: cleanText(content)
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        toast.error(`Error: ${response.status}`);
      }
    } catch (error) {
      toast.error("Connection error. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendQuestion();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Bouton bulle flottante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        >
          <Bot className="w-8 h-8 text-white" />
        </button>
      )}

      {/* Fenêtre du chatbot */}
      {isOpen && (
        <Card className="p-0 bg-card border-border shadow-xl flex flex-col h-[600px] w-[380px] rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Virtual Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground text-lg"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}

            {/* Suggestions initiales */}
            {messages.length === 1 && (
              <div className="flex flex-col gap-2 items-end">
                {quickReplies.map((reply, index) => (
                  <Button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full px-5 py-2 h-auto text-sm"
                    disabled={isLoading}
                  >
                    {reply}
                  </Button>
                ))}
              </div>
            )}

            {/* Animation de chargement */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce delay-200"></span>
                    <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce delay-400"></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Zone d'entrée */}
          <div className="p-4 border-t border-border bg-background rounded-b-2xl">
            <div className="flex gap-2 items-end">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Write your message..."
                className="flex-1 resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[50px] max-h-[100px]"
                rows={1}
              />
              <Button
                onClick={() => handleSendQuestion()}
                disabled={isLoading || !inputMessage.trim()}
                size="icon"
                className="h-[50px] w-[50px] rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 flex-shrink-0"
              >
                <Send className="w-5 h-5 text-white" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ChatbotSection;
