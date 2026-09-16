/**
 * In-memory Braid repository.
 *
 * Stores every domain entity in Maps, seeded with synthetic challenge
 * records. This is the challenge build persistence layer. The Postgres
 * schema in db/migrations is the deployment path, reached by implementing
 * the same BraidRepository interface against a real database.
 */

import type {
  BraidCase,
  CaseDetail,
  CaseSummary,
  CaseStatus,
  Conversation,
  Contradiction,
  EvidenceItem,
  Evaluation,
  Handoff,
  Language,
  PostCallAnalysis,
  RedactionEvent,
  SourceRecord,
  SystemEvent,
  ToolCall,
  TranscriptSegment,
} from '@braid/domain';

export interface ListCaseFilters {
  status?: CaseStatus;
  language?: Language;
  limit?: number;
}

export class BraidRepository {
  private casesById = new Map<string, BraidCase>();
  private casesByRef = new Map<string, string>();
  private conversations = new Map<string, Conversation>();
  private conversationsByCase = new Map<string, string[]>();
  private segments = new Map<string, TranscriptSegment[]>();
  private evidenceByCase = new Map<string, EvidenceItem[]>();
  private sourceRecordsByCase = new Map<string, SourceRecord[]>();
  private contradictionsByCase = new Map<string, Contradiction[]>();
  private handoffsByCase = new Map<string, Handoff[]>();
  private toolCallsByCase = new Map<string, ToolCall[]>();
  private analyses = new Map<string, PostCallAnalysis>();
  private redactionEvents = new Map<string, RedactionEvent[]>();
  private systemEvents = new Map<string, SystemEvent[]>();
  private evaluations: Evaluation[] = [];
  private nextCaseNumber = 148;
  private idCounter = 0;

  /** Reserve the next external reference number, FNOL style. */
  reserveExternalReference(): string {
    const number = this.nextCaseNumber;
    this.nextCaseNumber += 1;
    return `FNOL-2026-${String(number).padStart(4, '0')}`;
  }

  /** Short unique suffix for generated ids. */
  shortId(prefix: string): string {
    this.idCounter += 1;
    return `${prefix}${this.idCounter.toString(16).padStart(4, '0')}${Math.floor(Math.random() * 0xffff)
      .toString(16)
      .padStart(4, '0')}`;
  }

  saveCase(record: BraidCase): void {
    this.casesById.set(record.caseId, record);
    this.casesByRef.set(record.externalReference, record.caseId);
  }

  saveConversation(conversation: Conversation): void {
    this.conversations.set(conversation.conversationId, conversation);
    const list = this.conversationsByCase.get(conversation.caseId) ?? [];
    list.push(conversation.conversationId);
    this.conversationsByCase.set(conversation.caseId, list);
  }

  saveSegments(conversationId: string, segments: TranscriptSegment[]): void {
    this.segments.set(conversationId, segments);
  }

  saveEvidence(caseId: string, evidence: EvidenceItem[]): void {
    this.evidenceByCase.set(caseId, evidence);
  }

  saveSourceRecords(caseId: string, records: SourceRecord[]): void {
    this.sourceRecordsByCase.set(caseId, records);
  }

  saveContradictions(caseId: string, contradictions: Contradiction[]): void {
    this.contradictionsByCase.set(caseId, contradictions);
  }

  saveHandoff(caseId: string, handoff: Handoff): void {
    const list = this.handoffsByCase.get(caseId) ?? [];
    list.push(handoff);
    this.handoffsByCase.set(caseId, list);
    const record = this.casesById.get(caseId);
    if (record) record.status = 'handoff';
  }

  saveToolCall(caseId: string, call: ToolCall): void {
    const list = this.toolCallsByCase.get(caseId) ?? [];
    list.push(call);
    this.toolCallsByCase.set(caseId, list);
  }

  saveAnalysis(conversationId: string, analysis: PostCallAnalysis): void {
    this.analyses.set(conversationId, analysis);
  }

  addRedactionEvent(caseId: string, event: RedactionEvent): void {
    const list = this.redactionEvents.get(caseId) ?? [];
    list.unshift(event);
    this.redactionEvents.set(caseId, list.slice(0, 10));
  }

  addSystemEvent(caseId: string, event: SystemEvent): void {
    const list = this.systemEvents.get(caseId) ?? [];
    list.push(event);
    this.systemEvents.set(caseId, list);
  }

  saveEvaluations(evaluations: Evaluation[]): void {
    this.evaluations = evaluations;
  }

  findCaseId(idOrRef: string): string | null {
    if (this.casesById.has(idOrRef)) return idOrRef;
    const byRef = this.casesByRef.get(idOrRef);
    return byRef ?? null;
  }

  getCase(caseId: string): BraidCase | null {
    return this.casesById.get(caseId) ?? null;
  }

  getConversation(conversationId: string): Conversation | null {
    return this.conversations.get(conversationId) ?? null;
  }

  updateCaseStatus(caseId: string, status: CaseStatus): void {
    const record = this.casesById.get(caseId);
    if (record) {
      record.status = status;
      record.updatedAt = new Date().toISOString();
    }
  }

  listCases(filters: ListCaseFilters = {}): CaseSummary[] {
    const all = [...this.casesById.values()];
    const filtered = all.filter((record) => {
      if (filters.status && record.status !== filters.status) return false;
      if (filters.language && record.language !== filters.language) return false;
      return true;
    });
    filtered.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    const limited = filters.limit ? filtered.slice(0, filters.limit) : filtered;
    return limited.map((record) => this.toSummary(record));
  }

  toSummary(record: BraidCase): CaseSummary {
    const contradictions = this.contradictionsByCase.get(record.caseId) ?? [];
    const openContradictions = contradictions.filter(
      (item) => item.status === 'open' || item.status === 'escalated',
    ).length;
    const handoffs = this.handoffsByCase.get(record.caseId) ?? [];
    const latest = handoffs[handoffs.length - 1];
    const handoffState: CaseSummary['handoffState'] = !latest
      ? 'none'
      : latest.queueAcceptance?.state === 'accepted'
        ? 'accepted'
        : 'pending';
    const conversationIds = this.conversationsByCase.get(record.caseId) ?? [];
    const segmentCount = conversationIds.reduce(
      (total, id) => total + (this.segments.get(id)?.length ?? 0),
      0,
    );
    return {
      caseId: record.caseId,
      externalReference: record.externalReference,
      language: record.language,
      status: record.status,
      scenario: record.scenario,
      claimantDisplayName: record.claimant.displayName,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      evidenceCount: this.evidenceByCase.get(record.caseId)?.length ?? 0,
      openContradictions,
      handoffState,
      transcriptSegments: segmentCount,
    };
  }

  getCaseDetail(idOrRef: string): CaseDetail | null {
    const caseId = this.findCaseId(idOrRef);
    if (!caseId) return null;
    const record = this.casesById.get(caseId);
    if (!record) return null;
    const conversationIds = this.conversationsByCase.get(caseId) ?? [];
    const conversations = conversationIds
      .map((id) => this.conversations.get(id))
      .filter((item): item is Conversation => item !== undefined);
    const transcript = conversationIds
      .flatMap((id) => this.segments.get(id) ?? [])
      .sort((a, b) => a.sequence - b.sequence);
    const handoffs = [...(this.handoffsByCase.get(caseId) ?? [])].sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : -1,
    );
    const toolCalls = [...(this.toolCallsByCase.get(caseId) ?? [])].sort((a, b) =>
      a.offsetMs - b.offsetMs,
    );
    const primaryConversation = conversations[0];
    const postCall = primaryConversation ? this.analyses.get(primaryConversation.conversationId) ?? null : null;
    return {
      caseId: record.caseId,
      externalReference: record.externalReference,
      status: record.status,
      language: record.language,
      scenario: record.scenario,
      claimant: record.claimant,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      conversations,
      transcript,
      evidence: this.evidenceByCase.get(caseId) ?? [],
      sourceRecords: this.sourceRecordsByCase.get(caseId) ?? [],
      contradictions: this.contradictionsByCase.get(caseId) ?? [],
      handoffs,
      toolCalls,
      analysis: {
        postCall,
        redactionEvents: this.redactionEvents.get(caseId) ?? [],
        systemEvents: this.systemEvents.get(caseId) ?? [],
      },
    };
  }

  getEvaluations(): Evaluation[] {
    return this.evaluations;
  }

  latestClaimRecordTime(): string | null {
    let latest: string | null = null;
    for (const records of this.sourceRecordsByCase.values()) {
      for (const record of records) {
        if (record.recordType !== 'claim' && record.recordType !== 'policy') continue;
        if (!latest || record.retrievedAt > latest) latest = record.retrievedAt;
      }
    }
    return latest;
  }

  latestRepairRecordTime(): string | null {
    let latest: string | null = null;
    for (const records of this.sourceRecordsByCase.values()) {
      for (const record of records) {
        if (record.recordType !== 'repair') continue;
        if (!latest || record.retrievedAt > latest) latest = record.retrievedAt;
      }
    }
    return latest;
  }
}
