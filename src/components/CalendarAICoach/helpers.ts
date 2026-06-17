/**
 * Helpers — Extracted from CalendarAICoach
 * Small pure-ish utilities for the AI coach.
 */

import { aiConfigService } from '../../services/aiConfigService';
import { deriveTopic } from '../../utils/oracleUtils';
import type { CoachMessage } from '../../types/oracle';

export function recordMemory(msg: CoachMessage) {
  const ctx = aiConfigService.getUserContext();
  const memory = (ctx.coachMemory || []).slice(-19);
  memory.push({
    text: msg.text.slice(0, 200),
    timestamp: Date.now(),
    type: msg.type,
    topic: deriveTopic(msg),
  });
  aiConfigService.setUserContext({
    coachMemory: memory,
    lastCoachPrompt: msg.text,
  });
}
