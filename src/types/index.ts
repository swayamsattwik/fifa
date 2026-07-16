/**
 * Core types for the Smart Stadium AI application.
 */

export interface ScannedTicket {
  section: string;
  row: string;
  seat: string;
  gate: string;
  transitType: string;
}

export interface IncidentPlan {
  thought: string;
  actionPlan: string[];
  broadcastText: string;
}

export interface SustainabilityImpact {
  carbonConservationMetrics: number; // lbs of CO2 saved
  mealsRepurposed: number;
  impactSummary: string;
}

export interface AIResponse {
  reply: string;
  thinking: string;
}
