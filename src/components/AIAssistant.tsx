import { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, Sparkles, Languages, Eye } from 'lucide-react';

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

// Translations for UI components
const UI_TEXTS: Record<string, any> = {
  en: {
    placeholder: "Ask about seats, gates, lines, restrooms, transit...",
    speakNow: "Listening... Speak your question.",
    aiName: "FIFA 2026 Smart Assistant",
    speechUnsupported: "Speech recognition not supported in this browser.",
    thinking: "Analyzing stadium conditions & mapping data...",
    voiceActive: "Voice narration active",
    voiceInactive: "Voice narration inactive"
  },
  es: {
    placeholder: "Pregunta sobre asientos, accesos, filas, baños, transporte...",
    speakNow: "Escuchando... Hable ahora.",
    aiName: "Asistente Inteligente FIFA 2026",
    speechUnsupported: "Reconocimiento de voz no soportado en este navegador.",
    thinking: "Analizando condiciones del estadio y mapeando datos...",
    voiceActive: "Narración de voz activa",
    voiceInactive: "Narración de voz inactiva"
  },
  fr: {
    placeholder: "Posez des questions sur les sièges, portes, files d'attente...",
    speakNow: "Écoute en cours... Parlez maintenant.",
    aiName: "Assistant Intelligent FIFA 2026",
    speechUnsupported: "Reconnaissance vocale non supportée par ce navigateur.",
    thinking: "Analyse des conditions du stade et cartographie des données...",
    voiceActive: "Narration vocale active",
    voiceInactive: "Narration vocale inactive"
  },
  pt: {
    placeholder: "Pergunte sobre assentos, portões, filas, banheiros...",
    speakNow: "Ouvindo... Fale agora.",
    aiName: "Assistente Inteligente FIFA 2026",
    speechUnsupported: "Reconhecimento de voz não suportado neste navegador.",
    thinking: "Analisando condições do estádio e mapeando dados...",
    voiceActive: "Narraçao de voz ativa",
    voiceInactive: "Narraçao de voz inativa"
  }
};

// Response Knowledge Base
const RESPONSES: Record<string, Record<string, { reply: string; thinking: string }>> = {
  en: {
    "default": {
      reply: "I'm your FIFA 2026 Assistant. I can help you find your seat, locate concessions, check gate queues, and coordinate transit options. Try asking: 'Where is Gate B?', 'Find gluten-free food', or 'Show train times'.",
      thinking: "User query did not match specific patterns. Route to default introductory instructions."
    },
    "gate": {
      reply: "For the fastest entry, please check your ticket. Gate A (North) has a 5-minute wait, Gate B (East) has a 12-minute wait (moderately busy), and Gate C (South) is clear. If your ticket says Gate B, we recommend using the express lanes on the right side.",
      thinking: "Detected keyword 'gate' or 'entry'. Computed gate capacities: Gate A = 10%, Gate B = 65% (moderate), Gate C = 5%. Generating routing advice."
    },
    "bathroom": {
      reply: "The nearest restrooms are located directly behind Section 108 (Men's & Women's) and Section 114 (All-Gender & Accessibility Equipped). Section 108 restrooms currently have a 2-minute wait, while Section 114 is clear.",
      thinking: "Detected keyword 'bathroom' or 'restroom'. Matched user seating block Section 108. Retrieved bathroom queue logs and accessibility flags."
    },
    "food": {
      reply: "We have multiple food vendors nearby! 'Kickoff Tacos' is behind Section 112 (gluten-free options, 4-minute wait). 'Stadium Grill' is behind Section 105 (Halal certified, 8-minute wait). The express beverages kiosk at Gate B has a 1-minute wait.",
      thinking: "Detected keyword 'food', 'eat', 'gluten-free' or 'concessions'. Scanned food vendor indices for proximity to Section 108."
    },
    "wheelchair": {
      reply: "StadiaFlow AI has mapped accessible pathways. For wheelchair access, proceed to the Elevator Bank at Gate A (North Entrance) or Gate C (South Entrance). Ramps with mild inclines are located near sections 105 and 122. Stewards are stationed there to assist you.",
      thinking: "Detected keyword 'wheelchair' or 'accessibility'. Identified step-free elevators, ramp coordinates, and volunteer steward positions."
    },
    "transit": {
      reply: "The World Cup Express shuttle departs from Zone 2 (outside Gate C) every 8 minutes. The Metro Rail Station is a 6-minute walk via the pedestrian skyway. Uber/Lyft rideshare pickup is designated at Lot E. Train services run every 5 minutes after the match.",
      thinking: "Detected keyword 'transit', 'shuttle', 'train', 'rideshare', or 'bus'. Fetched live transit scheduler APIs."
    }
  },
  es: {
    "default": {
      reply: "Soy tu Asistente FIFA 2026. Te ayudo a buscar tu asiento, locales de comida, filas en accesos y transporte. Prueba preguntar: '¿Dónde está el Acceso B?', 'Buscar comida sin gluten' o 'Horarios de trenes'.",
      thinking: "La consulta no coincide con patrones específicos. Redirigiendo a las instrucciones predeterminadas."
    },
    "gate": {
      reply: "Para ingresar rápido, revisa tu ticket. El Acceso A (Norte) tiene 5 min de espera; el Acceso B (Este) tiene 12 min (flujo moderado); y el Acceso C (Sur) está libre. Si tu ticket indica Acceso B, sugerimos usar las filas rápidas a la derecha.",
      thinking: "Palabra clave 'acceso' o 'entrada' detectada. Capacidad: A=10%, B=65%, C=5%."
    },
    "bathroom": {
      reply: "Los baños más cercanos están detrás de la Sección 108 (Hombres y Mujeres) y Sección 114 (Familiar/Accesible). Los de la Sección 108 tienen 2 min de fila; la Sección 114 está vacía.",
      thinking: "Buscando baños cercanos a la Sección 108 con estados de espera actualizados."
    },
    "food": {
      reply: "¡Hay opciones geniales! 'Kickoff Tacos' detrás de la Sec 112 (comida sin gluten, 4 min de fila). 'Stadium Grill' detrás de la Sec 105 (comida Halal, 8 min de fila). El quiosco express del Acceso B no tiene espera.",
      thinking: "Palabra clave 'comida', 'sin gluten' o 'restaurante' detectada. Filtrando por proximidad."
    },
    "wheelchair": {
      reply: "El estadio cuenta con rutas accesibles. Para sillas de ruedas, use los ascensores en el Acceso A o C. Hay rampas de baja pendiente cerca de las secciones 105 y 122. Personal de asistencia está disponible en cada punto.",
      thinking: "Reconocimiento de términos de accesibilidad. Extrayendo ubicaciones de ascensores adaptados."
    },
    "transit": {
      reply: "El Shuttle Express del Mundial sale de la Zona 2 (Acceso C) cada 8 min. La estación del metro está a 6 min a pie por el paso peatonal elevado. Taxis y Uber están en el Lote E.",
      thinking: "Buscando datos de transporte y tiempos de traslado."
    }
  },
  fr: {
    "default": {
      reply: "Je suis votre assistant FIFA 2026. Je peux vous aider à localiser votre siège, les points de restauration, l'état des files d'attente et les transports. Essayez de demander : 'Où est la Porte B ?' ou 'Options sans gluten'.",
      thinking: "Aucun mot-clé spécifique détecté. Affichage de la réponse par défaut."
    },
    "gate": {
      reply: "Porte A (Nord) : 5 minutes d'attente. Porte B (Est) : 12 minutes (fréquentation moyenne). Porte C (Sud) : fluide. Nous vous conseillons de privilégier les files rapides à droite de la Porte B.",
      thinking: "Mot-clé 'porte' ou 'entrée' détecté. Traitement des flux de foule par secteur."
    },
    "bathroom": {
      reply: "Les toilettes les plus proches se situent derrière la Section 108 (Hommes/Femmes) et la Section 114 (Accessibilité & Mixte). Section 108 : 2 min d'attente ; Section 114 : libre.",
      thinking: "Filtrage des blocs sanitaires par rapport à la Section 108."
    },
    "food": {
      reply: "Outils de restauration à proximité : 'Kickoff Tacos' (Section 112, sans gluten, 4 min d'attente) et 'Stadium Grill' (Section 105, Halal, 8 min d'attente). Le kiosque express Porte B est sans attente.",
      thinking: "Requête alimentaire détectée. Analyse des fiches de menus."
    },
    "wheelchair": {
      reply: "Pour les personnes en fauteuil roulant, empruntez les ascenseurs situés aux Portes A et C. Des rampes d'accès doux sont disponibles à côté des sections 105 et 122. Des stewards sont sur place.",
      thinking: "Requête d'accessibilité. Recherche d'ascenseurs et de rampes."
    },
    "transit": {
      reply: "La navette express du Mondial part de la Zone 2 (Porte C) toutes les 8 minutes. Le métro est à 6 minutes de marche par la passerelle piétonne. Zone de covoiturage au Parking E.",
      thinking: "Requête sur les transports. Calcul des temps de marche et fréquences."
    }
  },
  pt: {
    "default": {
      reply: "Olá! Sou seu Assistente FIFA 2026. Posso ajudar a encontrar seu assento, banheiros, alimentação e opções de transporte. Pergunte: 'Onde fica o Portão B?', 'Comida sem glúten' ou 'Horário dos trenes'.",
      thinking: "Nenhum padrão identificado. Mostrando instruções gerais."
    },
    "gate": {
      reply: "Para entrada rápida: Portão A (Norte) tem 5 min de espera; Portão B (Leste) tem 12 min (movimentado); Portão C (Sul) está livre. Recomendamos as filas expressas à direita no Portão B.",
      thinking: "Detecção de termos de entrada/portões. Análise das filas operacionais."
    },
    "bathroom": {
      reply: "Os banheiros mais próximos estão atrás da Seção 108 (Masculino e Feminino) e Seção 114 (Unissex e Acessível). Seção 108 tem 2 min de fila, Seção 114 livre.",
      thinking: "Mapeamento de banheiros próximos à Seção 108."
    },
    "food": {
      reply: "Temos 'Kickoff Tacos' atrás da Seção 112 (opções sem glúten, 4 min de fila) e 'Stadium Grill' atrás da Seção 105 (cardápio Halal, 8 min de fila). Quiosque expresso no Portão B está livre.",
      thinking: "Análise de opções gastronômicas."
    },
    "wheelchair": {
      reply: "Rotas acessíveis disponíveis: Utilize os elevadores nos Portões A ou C. Rampas com inclinação suave estão próximas às seções 105 e 122. Nossos voluntários estão prontos para ajudar.",
      thinking: "Acessibilidade requerida. Mapeamento de rampas e elevadores."
    },
    "transit": {
      reply: "O ônibus express departa da Zona 2 (fora do Portão C) a cada 8 min. O metrô fica a 6 min de caminhada pela passarela. Uber e táxis estão localizados no Estacionamento E.",
      thinking: "Rotas de transporte ativo."
    }
  }
};

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
        handleSendMessage(text);
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
      // Narration active alert
    }
  };

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
      // Simple routing matching
      const lowerQuery = query.toLowerCase();
      let matchKey = 'default';

      if (lowerQuery.includes('gate') || lowerQuery.includes('enter') || lowerQuery.includes('entrance') || lowerQuery.includes('acceso') || lowerQuery.includes('portão') || lowerQuery.includes('porte')) {
        matchKey = 'gate';
      } else if (lowerQuery.includes('bathroom') || lowerQuery.includes('restroom') || lowerQuery.includes('toilet') || lowerQuery.includes('baño') || lowerQuery.includes('wc') || lowerQuery.includes('banheiro')) {
        matchKey = 'bathroom';
      } else if (lowerQuery.includes('food') || lowerQuery.includes('eat') || lowerQuery.includes('gluten') || lowerQuery.includes('comida') || lowerQuery.includes('alimento') || lowerQuery.includes('nourriture')) {
        matchKey = 'food';
      } else if (lowerQuery.includes('wheelchair') || lowerQuery.includes('access') || lowerQuery.includes('handicap') || lowerQuery.includes('rampa') || lowerQuery.includes('silla') || lowerQuery.includes('cadeira')) {
        matchKey = 'wheelchair';
      } else if (lowerQuery.includes('transit') || lowerQuery.includes('bus') || lowerQuery.includes('metro') || lowerQuery.includes('train') || lowerQuery.includes('shuttle') || lowerQuery.includes('uber') || lowerQuery.includes('transporte') || lowerQuery.includes('tren') || lowerQuery.includes('trem')) {
        matchKey = 'transit';
      }

      // Add details if a ticket is scanned
      let finalReply = RESPONSES[lang][matchKey].reply;
      if (scannedTicket && matchKey === 'gate') {
        finalReply += ` \n\n*Note:* Since your ticket specifies **Section ${scannedTicket.section}**, you should head to **${scannedTicket.gate}** immediately for optimal seating entry.`;
      }

      const aiMsgId = (Date.now() + 1).toString();
      const newAiMsg: Message = {
        id: aiMsgId,
        sender: 'ai',
        text: finalReply,
        thinking: RESPONSES[lang][matchKey].thinking
      };

      setMessages(prev => [...prev, newAiMsg]);
      setIsThinking(false);

      // Trigger Text-to-speech if active
      if (speechSynthesisActive) {
        speak(finalReply.replace(/\*/g, ''));
      }
    }, 1500);
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
