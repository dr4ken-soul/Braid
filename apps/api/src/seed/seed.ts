/**
 * Repository seeding.
 *
 * Runs the six synthetic call scripts through the pipeline and maps the
 * ten Agent Testing scenarios into evaluation records. Called once at
 * server startup.
 */

import { AGENT_VERSION } from '@braid/domain';
import type { BraidRepository } from '../adapters/repository';
import { CALL_SCRIPTS } from './call-scripts';
import { runSeedPipeline } from './pipeline';
import { EVALUATION_LAST_RUN_AT, EVALUATION_SCENARIOS } from './evaluation-scenarios';
import type { Evaluation } from '@braid/domain';

/** Seed the repository with the synthetic challenge records. */
export function seedRepository(repository: BraidRepository): void {
  for (const script of CALL_SCRIPTS) {
    runSeedPipeline(script, repository);
  }

  const evaluations: Evaluation[] = EVALUATION_SCENARIOS.map((scenario) => ({
    evaluationId: `ev-${scenario.scenarioId.toLowerCase()}`,
    scenarioId: scenario.scenarioId,
    name: scenario.name,
    language: scenario.language,
    category: scenario.category,
    agentVersion: AGENT_VERSION,
    runs: scenario.runs.map((run) => ({
      run: run.run,
      passed: run.passed,
      reason: run.reason,
      toolCalls: run.toolCalls,
    })),
    passRate: scenario.runs.filter((run) => run.passed).length / scenario.runs.length,
    lastRunAt: EVALUATION_LAST_RUN_AT,
    transcriptRef: scenario.transcriptRef,
  }));
  repository.saveEvaluations(evaluations);
}
