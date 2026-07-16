# StadiaFlow AI 🏟️🤖
### FIFA World Cup 2026™ Smart Stadium Operations & Multilingual Fan Portal

StadiaFlow AI is a high-fidelity, GenAI-powered smart stadium operations and fan experience portal designed for the **FIFA World Cup 2026™**. Built using React, TypeScript, Vite, and Tailwind CSS v4, this responsive application enhances crowd management, ticket scanning, navigation, accessibility, real-time emergency routing, and operational resource dispatch.

---

## 🌟 Key Features

### 🎫 Fan Experience Portal
* **Multilingual AI Assistant**: Interactive chat interface supporting English, Spanish, French, and Portuguese. Integrates **Web Speech API** for speech-to-text input and natural text-to-speech voice narration.
* **Wayfinder Map & Concessions**: Dynamic SVG stadium map showing interactive sections, entry gates, custom walking paths, and a live queue tracker with wait times. Includes a **step-free routing mode** for accessibility.
* **AR HUD Simulator**: Virtual mobile camera viewport displaying real-time floating AR navigation indicators (concessions, restrooms, exits, medical hubs) with smooth CSS micro-animations.
* **Transit Hub & Smart Tickets**: Live departure board for Metrorail, Shuttles, and Rideshares. Features a functional Ticket Scanner Simulator that scans match tickets and automatically loads gate/section instructions across the UI.

### 🚨 Operations Command Center
* **Live Incident Feed**: High-priority operations board displaying simulated security, crowd, and safety events. Operators can log custom incidents manually or trigger complex scenarios like *"Block Gate B"* or *"Heavy Rain"*.
* **GenAI Response Planner**: Instant simulator detailing automated emergency dispatch reasoning (Chain-of-Thought logs), step-by-step action plans, and localized PA broadcast templates.
* **Crowd Flow Heatmap**: Interactive density tracker linked to stadium gates. Operators can adjust inflow/congestion rates to preview traffic bottlenecks, complete with real-time AI Commentary.
* **Smart Volunteer Dispatcher**: Smart volunteer matcher algorithm that scans volunteer skills, status, and stadium distance to match them automatically to unresolved incidents.
* **Sustainability & Food Optimizer**: Live tracking of solar generation and recycling targets. Features a GenAI Surplus Optimizer that maps local charity distribution routes for excess concession meals.

---

## 💻 Tech Stack

* **Framework**: React 19 (TypeScript)
* **Build System**: Vite 6 + `@tailwindcss/vite`
* **Styling**: Tailwind CSS v4 (Glassmorphism, custom CSS variables, custom animations)
* **Icons**: Lucide React
* **Testing**: Local ESM dynamic unit test suite

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install all dependencies:
```bash
git clone <your-repository-url>
cd promptwar
npm install
```

### 2. Run Development Server
Start the local server at `http://localhost:5173`:
```bash
npm run dev
```

### 3. Run Automated Test Suite
Execute the 8 unit verification tests covering AI routing, ticket parser, dispatch matching, and carbon computations:
```bash
npm test
```

### 4. Build for Production
Bundle the app into the optimized static production folder (`dist/`):
```bash
npm run build
```

---

## 🧪 Verification & Security Focus

* **Zero Backend Dependency**: Runs entirely in the browser for high performance and fast loads.
* **Secure AI Processing**: Implements word-boundary matching inside the AI routing logic to guarantee safety and avoid keyword collision.
* **TypeScript Integrity**: Type-only imports used alongside strict type verification (`tsc -b`).
* **Accessibility**: Screen-reader voice narration, explicit ARIA tags, color contrasts conforming to WCAG, and custom keyboard styles.
