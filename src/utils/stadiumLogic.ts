// StadiaFlow AI Core Logic Utilities

export interface ScannedTicket {
  section: string;
  row: string;
  seat: string;
  gate: string;
  transitType: string;
}
export interface Incident {
  id: string;
  title: string;
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  time: string;
  status: 'active' | 'generating' | 'resolved';
  category: string;
  aiResponse?: {
    thought: string;
    actionPlan: string[];
    broadcastText: string;
  };
}

export interface Volunteer {
  id: string;
  name: string;
  role: string;
  location: string;
  status: 'idle' | 'busy' | 'offline';
  skills: string[];
}

export const UI_TEXTS: Record<string, any> = {
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

export const RESPONSES: Record<string, Record<string, { reply: string; thinking: string }>> = {
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
      reply: "El Shuttle Express del Mundial sale de la Zona 2 (Acceso C) cada 8 min. La estação do metro está a 6 min a pé por el paso peatonal elevado. Taxis y Uber están en el Lote E.",
      thinking: "Buscando dados de transporte y tempos de deslocação."
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

// Route user queries to specific answers
export function getAIAssistantResponse(query: string, lang: string, scannedTicket: ScannedTicket | null) {
  const lowerQuery = query.toLowerCase();
  let matchKey = 'default';
  const responses = RESPONSES[lang] || RESPONSES['en'];

  const matches = (keywords: string[]) => {
    return keywords.some(keyword => {
      if (keyword.length <= 4) {
        return new RegExp(`\\b${keyword}\\b`, 'i').test(lowerQuery);
      }
      return lowerQuery.includes(keyword);
    });
  };

  if (matches(['gate', 'enter', 'entrance', 'acceso', 'portão', 'porte'])) {
    matchKey = 'gate';
  } else if (matches(['bathroom', 'restroom', 'toilet', 'baño', 'wc', 'banheiro', 'toilettes'])) {
    matchKey = 'bathroom';
  } else if (matches(['food', 'eat', 'gluten', 'comida', 'alimento', 'nourriture'])) {
    matchKey = 'food';
  } else if (matches(['wheelchair', 'access', 'handicap', 'rampa', 'silla', 'cadeira', 'fauteuil'])) {
    matchKey = 'wheelchair';
  } else if (matches(['transit', 'bus', 'metro', 'train', 'shuttle', 'uber', 'transporte', 'tren', 'trem', 'navette'])) {
    matchKey = 'transit';
  }

  const result = responses[matchKey] || responses['default'];
  let reply = result.reply;

  if (scannedTicket && matchKey === 'gate') {
    reply += ` \n\n*Note:* Since your ticket specifies **Section ${scannedTicket.section}**, you should head to **${scannedTicket.gate}** immediately for optimal seating entry.`;
  }

  return {
    reply,
    thinking: result.thinking
  };
}

export const GENAI_INCIDENT_RESPONSES: Record<string, { thought: string; actionPlan: string[]; broadcastText: string }> = {
  'Crowd Flow': {
    thought: "Gate B sensor reports 87% entrance occupancy. Bottleneck is causing line sprawl of 45 meters. Recommendation: Activate standby ticket-scanning marshals, open side accessibility lanes for general pass-through, and broadcast pedestrian detour routes.",
    actionPlan: [
      "Deploy 2 standby safety stewards to Gate B lane entrances to direct fans to express checkpoints.",
      "Open Gate C (South Side) auxiliary gates to offload 20% of inbound pedestrian traffic.",
      "Update digital street signage within 500 meters to advise incoming fans to detour away from Gate B."
    ],
    broadcastText: "⚠️ WORLD CUP ALERTS: Gate B is currently busy. For faster entry, please head to Gate A (North) or Gate C (South). Gates A & C wait times are under 4 minutes."
  },
  'Facility Accessibility': {
    thought: "Elevator 3 technical halt detected. This impacts step-free access for Sections 104-108. Standard Operating Procedure (SOP) 12: Redirect disabled/wheelchair guests to Elevator 4 (40 meters away) and dispatch safety crews.",
    actionPlan: [
      "Dispatch mechanical crew to reset Elevator 3 breaker control board.",
      "Re-route Marta Gomez (Accessibility Marshal) to Section 106 to escort guests requiring wheelchair support to Elevator 4.",
      "Display temporary elevator detour arrow indicator signals on concourse digital displays."
    ],
    broadcastText: "📢 ACCESSIBILITY ALERTS: Elevator 3 is temporarily out of service. Please use Elevator 4 near Section 109. Accessibility marshals are on site to assist you."
  },
  'Lost & Found': {
    thought: "Missing child reported. Age: 6, wearing official USA team jersey. SOP 9: Lock down immediate sector exits (Sec 114-116), alert all local stewards, check gate camera recordings, and broadcast description discreetly.",
    actionPlan: [
      "Broadcast child description to all active volunteer and staff handheld devices in Zone C.",
      "Station marshal at Exit Gate D to monitor outbound pedestrians.",
      "Coordinate with stadium CCTV operations to run facial detection scan on Sections 112 to 118 cameras."
    ],
    broadcastText: "⚽ INFO DESK: Assistance required in Section 115. Staff are looking for a lost child. If you see a boy wearing a USA jersey, please contact the nearest stadium steward."
  }
};

export function getIncidentResponsePlan(category: string) {
  return GENAI_INCIDENT_RESPONSES[category] || {
    thought: "General operations log received. Scanning parameters against FIFA Matchday safety protocols. Hazard rating low. Containment checklist active.",
    actionPlan: [
      "Notify nearby zone supervisors of the reported condition.",
      "Inspect the location for physical debris or blockages.",
      "Verify safety standards are restored within 15 minutes."
    ],
    broadcastText: "🔔 NOTICE: Stadium staff are addressing an operational item. No action is required from spectators."
  };
}

export function getSustainabilityOptimization(surplusQty: number) {
  return {
    donations: [
      { shelter: 'Rutherford Family Haven', qty: Math.floor(surplusQty * 0.8), items: 'Mixed Meals & Buns', eta: '18 mins' },
      { shelter: 'Community Table', qty: Math.floor(surplusQty * 0.2), items: 'Tortillas & Sides', eta: '32 mins' }
    ],
    impact: `Saves ${surplusQty} lbs of organic waste; redirects food surplus to local shelters.`
  };
}
