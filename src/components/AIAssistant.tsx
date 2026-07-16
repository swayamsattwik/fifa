import { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, Sparkles, Languages, Eye } from 'lucide-react';
import { getAIAssistantResponse, UI_TEXTS, RESPONSES } from '../utils/stadiumLogic';

interface AIAssistantProps {
  stadium: string;
  scannedTicket: {
    section: string;
    row: string;
    seat: string;
    gate: string;
    transitType: string;
  } | null;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  thinking?: string;
  language?: string;
}

export default function AIAssistant({ stadium, scannedTicket }: AIAssistantProps) {
  const [lang, setLang] = useState<string>('en');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [speechSynthesisActive, setSpeechSynthesisActive] = useState<boolean>(false);
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize introductory messages
  useEffect(() => {
    setMessages([
      {
        id: '1',
        sender: 'ai',
        text: RESPONSES[lang]["default"].reply,
        thinking: "System initialization. Loaded standard multilingual response module."
      }
    ]);
  }, [lang]);

  // Handle auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);
  // Handle Text to Speech synthesis
  const speak = (text: string) => {
    if (!speechSynthesisActive) return;
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'es' ? 'es-ES' : lang === 'fr' ? 'fr-FR' : lang === 'pt' ? 'pt-BR' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const toggleSpeechSynthesis = () => {
    if (speechSynthesisActive) {
      window.speechSynthesis.cancel();
      setSpeechSynthesisActive(false);
    } else {
      setSpeechSynthesisActive(true);
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputVal).trim();
    if (!query) return;

    // Add user message
    const userMsgId = Date.now().toString();
    const newUserMsg: Message = {
      id: userMsgId,
      sender: 'user',
      text: query,
      language: lang
    };

    setMessages(prev => [...prev, newUserMsg]);
    if (!textToSend) setInputVal('');
    setIsThinking(true);

    // Simulate AI GenAI processing delay
    setTimeout(() => {
      const response = getAIAssistantResponse(query, lang, scannedTicket);

      const aiMsgId = (Date.now() + 1).toString();
      const newAiMsg: Message = {
        id: aiMsgId,
        sender: 'ai',
        text: response.reply,
        thinking: response.thinking
      };

      setMessages(prev => [...prev, newAiMsg]);
      setIsThinking(false);

      // Trigger Text-to-speech if active
      if (speechSynthesisActive) {
        speak(response.reply.replace(/\*/g, ''));
      }
    }, 1500);
  };

  // Keep a ref of handleSendMessage to avoid re-initializing SpeechRecognition
  const handleSendMessageRef = useRef(handleSendMessage);
  useEffect(() => {
    handleSendMessageRef.current = handleSendMessage;
  });

  // Set up Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = lang === 'es' ? 'es-ES' : lang === 'fr' ? 'fr-FR' : lang === 'pt' ? 'pt-BR' : 'en-US';

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setInputVal(text);
        handleSendMessageRef.current(text);
      };

      rec.onerror = () => {
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [lang]);

  // Turn voice recognition on/off
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(UI_TEXTS[lang].speechUnsupported);
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const toggleLog = (id: string) => {
    setExpandedLogs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="glass-container w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-[rgba(59,130,246,0.15)] glow-blue">
      {/* Assistant Header */}
      <div className="flex justify-between items-center bg-slate-900/80 px-6 py-4 border-b border-[rgba(59,130,246,0.15)] flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#3B82F6] to-[#10B981] flex items-center justify-center text-white font-bold">
              <Sparkles size={18} className="animate-pulse" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#10B981] border-2 border-slate-900"></div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{UI_TEXTS[lang].aiName}</h3>
            <span className="text-xs text-[#9CA3AF] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block"></span>
              GenAI Model Live • {stadium}
            </span>
          </div>
        </div>

        {/* Controls: Voice & Language */}
        <div className="flex items-center gap-2">
          {/* TTS Speaker Toggle */}
          <button
            onClick={toggleSpeechSynthesis}
            className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
              speechSynthesisActive 
                ? 'bg-[rgba(16,185,129,0.1)] text-[#10B981] border-[rgba(16,185,129,0.3)] glow-green' 
                : 'bg-slate-800 text-[#9CA3AF] border-slate-700 hover:text-white'
            }`}
            title={speechSynthesisActive ? UI_TEXTS[lang].voiceActive : UI_TEXTS[lang].voiceInactive}
          >
            {speechSynthesisActive ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span className="text-xs hidden sm:inline">Voice</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-sm text-white">
            <Languages size={14} className="text-[#3B82F6]" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent border-none text-white outline-none font-semibold cursor-pointer"
            >
              <option value="en" className="bg-slate-900 text-white">English</option>
              <option value="es" className="bg-slate-900 text-white">Español</option>
              <option value="fr" className="bg-slate-900 text-white">Français</option>
              <option value="pt" className="bg-slate-900 text-white">Português</option>
            </select>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className="flex flex-col gap-1 w-full">
              <div
                className={`chat-message ${
                  msg.sender === 'user' ? 'message-user' : 'message-ai'
                }`}
                style={{ whiteSpace: 'pre-line' }}
              >
                {msg.text}
              </div>

              {/* Display AI thinking processes if available (High operational transparency) */}
              {msg.sender === 'ai' && msg.thinking && (
                <div className="self-start ml-2 mt-1">
                  <button
                    onClick={() => toggleLog(msg.id)}
                    className="flex items-center gap-1 text-[10px] text-[#9CA3AF] hover:text-[#3B82F6] font-semibold tracking-wider uppercase cursor-pointer"
                  >
                    <Eye size={10} />
                    {expandedLogs[msg.id] ? 'Hide AI Reasoning' : 'View AI Reasoning Logs'}
                  </button>
                  {expandedLogs[msg.id] && (
                    <div className="reasoning-chain max-w-lg">
                      <strong>System Thought Log:</strong>
                      <p className="mt-1 leading-relaxed">{msg.thinking}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* AI Thinking Placeholder */}
          {isThinking && (
            <div className="message-ai-thinking flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="flex gap-1">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </span>
                <span>{UI_TEXTS[lang].thinking}</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap gap-2 px-6 py-2 bg-slate-950/45 border-t border-[rgba(59,130,246,0.1)]">
          <button
            onClick={() => handleSendMessage(lang === 'es' ? '¿Dónde está el Acceso B?' : lang === 'fr' ? 'Où est la Porte B ?' : lang === 'pt' ? 'Onde fica o Portão B?' : 'Where is Gate B?')}
            className="text-xs px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-[#9CA3AF] hover:text-white hover:border-[#3B82F6] cursor-pointer transition-colors"
          >
            📍 Gate wait times?
          </button>
          <button
            onClick={() => handleSendMessage(lang === 'es' ? 'Buscar comida sin gluten' : lang === 'fr' ? 'Alimentation sans gluten' : lang === 'pt' ? 'Comida sem glúten' : 'Find gluten-free food')}
            className="text-xs px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-[#9CA3AF] hover:text-white hover:border-[#3B82F6] cursor-pointer transition-colors"
          >
            🍔 Gluten-free options?
          </button>
          <button
            onClick={() => handleSendMessage(lang === 'es' ? 'Rutas de accesibilidad' : lang === 'fr' ? 'Accès fauteuil roulant' : lang === 'pt' ? 'Rotas de acessibilidade' : 'Wheelchair access & elevators')}
            className="text-xs px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-[#9CA3AF] hover:text-white hover:border-[#3B82F6] cursor-pointer transition-colors"
          >
            ♿ Wheelchair pathways
          </button>
          <button
            onClick={() => handleSendMessage(lang === 'es' ? 'Horarios de trenes' : lang === 'fr' ? 'Horaires du métro' : lang === 'pt' ? 'Horário dos trens' : 'Transit and Train times')}
            className="text-xs px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-[#9CA3AF] hover:text-white hover:border-[#3B82F6] cursor-pointer transition-colors"
          >
            🚆 Train & Shuttle lines
          </button>
        </div>

        {/* Text Input & Mic Panel */}
        <div className="chat-input-area bg-slate-900/80">
          <button
            onClick={toggleListening}
            className={`p-3 rounded-lg border transition-all cursor-pointer ${
              isListening
                ? 'bg-red-500/20 text-red-500 border-red-500 animate-pulse'
                : 'bg-slate-800 text-[#9CA3AF] border-slate-700 hover:text-white'
            }`}
            title={isListening ? UI_TEXTS[lang].speakNow : "Activate Speech Input"}
            aria-label="Speech Input"
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <input
            type="text"
            className="chat-input"
            placeholder={UI_TEXTS[lang].placeholder}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isThinking}
            aria-label="Chat input field"
          />
          <button
            onClick={() => handleSendMessage()}
            className="btn-primary p-3 rounded-lg flex items-center justify-center cursor-pointer"
            disabled={isThinking || !inputVal.trim()}
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
