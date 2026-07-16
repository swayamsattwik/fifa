// StadiaFlow AI Automated Verification Test Suite (ESM version)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for terminal output
const green = '\x1b[32m';
const red = '\x1b[31m';
const reset = '\x1b[0m';

console.log('🏁 Starting StadiaFlow AI Automated Verification Tests (ESM)...');

async function run() {
  try {
    const logicPath = path.join(__dirname, 'dist-test', 'stadiumLogic.js');
    if (!fs.existsSync(logicPath)) {
      console.error(`${red}Error: Compiled logic not found at ${logicPath}. Please compile TypeScript files first.${reset}`);
      process.exit(1);
    }

    // Dynamic import for compiled ESM module
    const { getAIAssistantResponse, getIncidentResponsePlan, getSustainabilityOptimization } = await import('./dist-test/stadiumLogic.js');

    let passed = 0;
    let failed = 0;

    function assert(condition, message) {
      if (condition) {
        console.log(`  ✅ ${green}PASSED:${reset} ${message}`);
        passed++;
      } else {
        console.error(`  ❌ ${red}FAILED:${reset} ${message}`);
        failed++;
      }
    }

    // --- Test 1: AI Assistant Query Routing ---
    console.log('\n--- Test 1: AI Assistant Query Routing ---');
    
    const gateQueryEn = getAIAssistantResponse('How do I find my entrance gate?', 'en', null);
    assert(
      gateQueryEn.reply.includes('Gate A') && gateQueryEn.thinking.includes('Detected keyword'),
      'English gate query routes correctly to Gate response and logs thoughts.'
    );

    const bathroomQueryEs = getAIAssistantResponse('¿Dónde está el baño?', 'es', null);
    assert(
      bathroomQueryEs.reply.includes('Sección 108') && bathroomQueryEs.thinking.includes('baños cercanos'),
      'Spanish bathroom query routes correctly to Spanish response.'
    );

    const defaultQueryFr = getAIAssistantResponse('What is the weather outside?', 'en', null);
    assert(
      defaultQueryFr.reply.includes('FIFA 2026 Assistant') && defaultQueryFr.thinking.includes('default'),
      'Irrelevant query defaults gracefully to welcome assistant.'
    );

    // --- Test 2: AI Ticket Augmentation ---
    console.log('\n--- Test 2: AI Ticket Augmentation ---');
    
    const mockTicket = {
      section: '108',
      row: 'M',
      seat: '14',
      gate: 'Gate C',
      transitType: 'Metro Rail'
    };
    const ticketGateResponse = getAIAssistantResponse('Where is my gate?', 'en', mockTicket);
    assert(
      ticketGateResponse.reply.includes('Section 108') && ticketGateResponse.reply.includes('Gate C'),
      'AI appends specific gate routing instructions based on scanned ticket details.'
    );

    // --- Test 3: Incident Response Plan Generator ---
    console.log('\n--- Test 3: Incident Response Plan Generator ---');
    
    const crowdIncident = getIncidentResponsePlan('Crowd Flow');
    assert(
      crowdIncident.actionPlan.length === 3 && crowdIncident.thought.includes('Gate B sensor'),
      'Crowd Flow incident response plan builds a 3-step action layout.'
    );

    const defaultIncident = getIncidentResponsePlan('Mechanical Outage');
    assert(
      defaultIncident.actionPlan.length === 3 && defaultIncident.broadcastText.includes('operational item'),
      'Fallback mechanical incident defaults safely.'
    );

    // --- Test 4: Sustainability surplus optimization ---
    console.log('\n--- Test 4: Sustainability surplus optimization ---');
    
    const surplusOptimization = getSustainabilityOptimization(100);
    assert(
      surplusOptimization.donations[0].qty === 80 && surplusOptimization.donations[1].qty === 20,
      'Surplus food optimization divides 100 surplus meals.'
    );
    assert(
      surplusOptimization.impact.includes('Saves 100 lbs'),
      'Carbon conservation metrics count and summarize impact correctly.'
    );

    // Summary
    console.log(`\n📊 Verification Summary: ${passed} passed, ${failed} failed`);

    if (failed > 0) {
      console.error(`${red}Verification Failed!${reset}`);
      process.exit(1);
    } else {
      console.log(`${green}All Verification Tests Completed Successfully!${reset}`);
      process.exit(0);
    }

  } catch (err) {
    console.error(`${red}Execution error in tests:${reset}`, err);
    process.exit(1);
  }
}

run();
