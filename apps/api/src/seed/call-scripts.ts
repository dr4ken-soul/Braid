/**
 * Braid synthetic call scripts.
 *
 * Deterministic fixtures for the six demo scenarios. Every seeded case and
 * every case created through POST /api/cases is produced from one of these
 * scripts, so the transcript, evidence, tool calls, contradictions, and
 * handoffs always stay consistent with each other.
 *
 * All data is synthetic. No real claimant, insurer, or garage is referenced.
 */

import type {
  ClaimRecordPayload,
  EvidenceCategory,
  Language,
  PolicyRecordPayload,
  QueueTarget,
  RecordType,
  RepairRecordPayload,
  Scenario,
  Severity,
  SourceType,
  Speaker,
  ToolName,
  ToolOutcome,
  WorkflowNode,
} from '@braid/domain';

export interface ScriptSegment {
  speaker: Speaker;
  node: WorkflowNode;
  text: string;
  startMs: number;
  endMs: number;
}

export interface ScriptEvidence {
  category: EvidenceCategory;
  fieldKey: string;
  /** Empty string renders as Missing in the console. */
  valueText: string;
  confidence: number;
  sourceType: SourceType;
  sourceReference: string;
}

export interface ScriptToolCall {
  toolName: ToolName;
  requestPayload: Record<string, unknown>;
  responsePayload: Record<string, unknown> | null;
  outcome: ToolOutcome;
  offsetMs: number;
  latencyMs: number;
}

export interface ScriptContradiction {
  fieldKey: string;
  severity: Severity;
  leftValue: string;
  rightValue: string;
  leftSource: string;
  rightSource: string;
  leftReference: string;
  rightReference: string;
  rationale: string;
}

export interface ScriptHandoff {
  destination: QueueTarget;
  reason: string;
  createdBy: 'agent' | 'operator';
  followUpItems: string[];
  callerQuestions: string[];
}

export interface ScriptSourceRecord {
  recordType: RecordType;
  providerReference: string;
  payload: ClaimRecordPayload | PolicyRecordPayload | RepairRecordPayload;
  /** Milliseconds from conversation start when the record was observed. */
  offsetMs: number;
}

export interface ScriptAnalysis {
  summary: string;
  nextAction: string;
  decisionBoundary: string;
}

export interface CallScript {
  scenario: Scenario;
  language: Language;
  /** Deterministic case uuid used for seeded cases. */
  caseId: string;
  conversationId: string;
  externalReference: string;
  /** Fixed ISO timestamp of conversation start for seeded cases. */
  baseTimestamp: string;
  claimant: { displayName: string; phone: string };
  segments: ScriptSegment[];
  evidence: ScriptEvidence[];
  sourceRecords: ScriptSourceRecord[];
  /** Claims sandbox unavailable produces the dependency failure path. */
  claimsAvailable: boolean;
  contradiction: ScriptContradiction | null;
  handoff: ScriptHandoff;
  toolCalls: ScriptToolCall[];
  analysis: ScriptAnalysis;
}

const EN_DISCLOSURE =
  'Hello. This is Braid, an automated claims intake line. I am an AI agent, not a human adjuster. This call is recorded and transcribed for audit. I collect factual claim information only. I cannot decide coverage, liability, or payment, and you can ask for a human at any time.';

const EN_LANGUAGE_PROMPT =
  'Would you like to continue in English, or would you prefer Arabic?';

const EN_CONSENT_PROMPT =
  'Thank you. Before we begin, do you consent to Braid collecting your factual account of the incident and sharing it with the claims team for review? You can withdraw consent at any time.';

const EN_INTAKE_PROMPT =
  'Please describe what happened. Include when it happened, where, the vehicle, the other party, and any damage you noticed.';

const AR_DISCLOSURE =
  'مرحبا. هذا خط بريد لاستقبال المطالبات. أنا وكيل ذكاء اصطناعي ولست مُسوّي مطالبات. سيتم تسجيل هذه المكالمة وتفريغها نصيا لأغراض التدقيق. أجمع المعلومات الواقعية عن المطالبة فقط، ولا يمكنني اتخاذ قرار بشأن التغطية أو المسؤولية أو الدفع. يمكنك طلب التحدث مع شخص في أي وقت.';

const AR_LANGUAGE_PROMPT = 'هل تريد المتابعة بالعربية أم بالإنجليزية؟';

const AR_CONSENT_PROMPT =
  'شكرا. قبل أن نبدأ، هل توافق على جمع بياناتك الواقعية عن الحادث ومشاركتها مع فريق المطالبات للمراجعة؟ يمكنك سحب موافقتك في أي وقت.';

const AR_INTAKE_PROMPT =
  'من فضلك صف ما حدث. اذكر وقت الحادث ومكانه والسيارة والطرف الآخر وأي أضرار لاحظتها.';

const EN_BOUNDARY =
  'Braid prepares evidence only. Liability, coverage, settlement value, payment, and claim closure remain with qualified human adjusters.';

const AR_BOUNDARY =
  'يجمع بريد الأدلة فقط. تبقى المسؤولية والتغطية وقيمة التسوية والدفع وإغلاق المطالبة مع مُسوّيي المطالبات المؤهلين.';

/* ------------------------------------------------------------------ */
/* FNOL-2026-0142, English, complete account                           */
/* ------------------------------------------------------------------ */

const CASE_142_EN_COMPLETE: CallScript = {
  scenario: 'complete',
  language: 'en',
  caseId: '9f1c2a34-0142-4b0e-9c1d-a00000000142',
  conversationId: 'c0d2e1f3-0142-4c0d-8e2f-a00000000142',
  externalReference: 'FNOL-2026-0142',
  baseTimestamp: '2026-09-01T08:02:00.000Z',
  claimant: { displayName: 'Synthetic claimant EN-A', phone: '+971 50 555 0142' },
  segments: [
    { speaker: 'agent', node: 'disclosure', text: EN_DISCLOSURE, startMs: 0, endMs: 16500 },
    { speaker: 'agent', node: 'language', text: EN_LANGUAGE_PROMPT, startMs: 16600, endMs: 20800 },
    { speaker: 'claimant', node: 'language', text: 'English is fine, thank you.', startMs: 20900, endMs: 23300 },
    { speaker: 'agent', node: 'consent', text: EN_CONSENT_PROMPT, startMs: 23400, endMs: 29600 },
    { speaker: 'claimant', node: 'consent', text: 'Yes, I consent to that.', startMs: 29700, endMs: 31600 },
    { speaker: 'agent', node: 'intake', text: EN_INTAKE_PROMPT, startMs: 31700, endMs: 36800 },
    {
      speaker: 'claimant',
      node: 'intake',
      text: 'It was Sunday evening, around five forty, on Al Reem Street near the corniche. I was slowing for a red light by the marina entrance when a delivery van hit my car from behind. My car is a white sedan, plate Abu Dhabi 12345. The van driver stopped, we exchanged numbers, and he apologised.',
      startMs: 36900,
      endMs: 49700,
    },
    {
      speaker: 'claimant',
      node: 'intake',
      text: 'The rear bumper is cracked and the boot does not close properly. My neck was a little sore the next morning, so I went to a clinic. The police attended and gave me a report number.',
      startMs: 49800,
      endMs: 57600,
    },
    {
      speaker: 'agent',
      node: 'clarification',
      text: 'Thank you. Two details are still missing from the record: the exact incident date, and the police report number. Can you provide them?',
      startMs: 57700,
      endMs: 63900,
    },
    {
      speaker: 'claimant',
      node: 'clarification',
      text: 'The accident was on the thirtieth of August. The police report number is PO 2026 88 413.',
      startMs: 64000,
      endMs: 70700,
    },
    {
      speaker: 'agent',
      node: 'tool-retrieval',
      text: 'Thank you. I will now check the claims and policy records, then the repair record. This takes a moment.',
      startMs: 70800,
      endMs: 75300,
    },
    {
      speaker: 'agent',
      node: 'comparison',
      text: 'The claims record matches your account on the incident date, the location, and the vehicle. The policy requires a police report, a driving licence copy, and a repair estimate. The police report is on file, the repair estimate is on file, and the driving licence copy is still missing. The repair record lists the rear bumper and the tailgate, which matches your description.',
      startMs: 78200,
      endMs: 89600,
    },
    {
      speaker: 'agent',
      node: 'handoff',
      text: 'Your case is ready for a human adjuster. I am sending a packet with the transcript, the extracted facts, the policy and repair records, and one open item: the injury follow-up. I cannot confirm coverage or predict the outcome. An adjuster will contact you within one business day. Is there anything you want added to the record?',
      startMs: 89700,
      endMs: 100400,
    },
    { speaker: 'claimant', node: 'handoff', text: 'No, that is everything. Thank you.', startMs: 100500, endMs: 102400 },
    {
      speaker: 'agent',
      node: 'close',
      text: 'Thank you. This call has been recorded for audit. Every decision on this claim stays with a human adjuster. Goodbye.',
      startMs: 102500,
      endMs: 108200,
    },
  ],
  evidence: [
    { category: 'incident', fieldKey: 'incident_date', valueText: '2026-08-30', confidence: 0.97, sourceType: 'claimant', sourceReference: 'segment:10' },
    { category: 'incident', fieldKey: 'incident_time', valueText: 'approximately 17:40', confidence: 0.93, sourceType: 'claimant', sourceReference: 'segment:7' },
    { category: 'incident', fieldKey: 'incident_location', valueText: 'Al Reem Street near the corniche, by the marina entrance', confidence: 0.95, sourceType: 'claimant', sourceReference: 'segment:7' },
    { category: 'identity', fieldKey: 'vehicle_description', valueText: 'white sedan', confidence: 0.99, sourceType: 'claimant', sourceReference: 'segment:7' },
    { category: 'identity', fieldKey: 'vehicle_plate', valueText: 'Abu Dhabi 12345', confidence: 0.99, sourceType: 'claimant', sourceReference: 'segment:7' },
    { category: 'incident', fieldKey: 'other_party', valueText: 'delivery van, rear impact, details exchanged', confidence: 0.96, sourceType: 'claimant', sourceReference: 'segment:7' },
    { category: 'damage', fieldKey: 'damage_description', valueText: 'cracked rear bumper, boot does not close properly', confidence: 0.98, sourceType: 'claimant', sourceReference: 'segment:8' },
    { category: 'timeline', fieldKey: 'injuries_reported', valueText: 'neck soreness the next morning, clinic visit', confidence: 0.94, sourceType: 'claimant', sourceReference: 'segment:8' },
    { category: 'contact', fieldKey: 'police_report_reference', valueText: 'PO 2026 88 413', confidence: 0.99, sourceType: 'claimant', sourceReference: 'segment:10' },
    { category: 'policy', fieldKey: 'policy_number', valueText: 'POL-TR-55-0021', confidence: 1, sourceType: 'policy-record', sourceReference: 'record:CLM-2026-8841' },
    { category: 'policy', fieldKey: 'document_driving_licence', valueText: '', confidence: 0, sourceType: 'policy-record', sourceReference: 'record:POL-TR-55-0021' },
    { category: 'damage', fieldKey: 'repair_assessment', valueText: 'rear bumper cracked, tailgate misaligned', confidence: 1, sourceType: 'repair-record', sourceReference: 'record:RPR-3327' },
  ],
  sourceRecords: [
    {
      recordType: 'claim',
      providerReference: 'claims-sandbox:CLM-2026-8841',
      offsetMs: 75800,
      payload: {
        kind: 'claim-record',
        claimNumber: 'CLM-2026-8841',
        policyNumber: 'POL-TR-55-0021',
        incidentDateOnFile: '2026-08-30',
        vehiclePlateOnFile: 'Abu Dhabi 12345',
        damageOnFile: 'rear bumper and tailgate',
        registeredAt: '2026-08-30T19:05:00.000Z',
        status: 'first-notice-of-loss',
      } satisfies ClaimRecordPayload,
    },
    {
      recordType: 'policy',
      providerReference: 'claims-sandbox:POL-TR-55-0021',
      offsetMs: 75900,
      payload: {
        kind: 'policy-record',
        policyNumber: 'POL-TR-55-0021',
        product: 'motor comprehensive sandbox',
        policyholder: 'Synthetic claimant EN-A',
        status: 'active',
        requiredDocuments: [
          { key: 'police-report', label: 'Police report', state: 'on-file' },
          { key: 'repair-estimate', label: 'Repair estimate', state: 'on-file' },
          { key: 'driving-licence', label: 'Driving licence copy', state: 'missing' },
        ],
      } satisfies PolicyRecordPayload,
    },
    {
      recordType: 'repair',
      providerReference: 'repair-sandbox:RPR-3327',
      offsetMs: 77200,
      payload: {
        kind: 'repair-record',
        repairOrder: 'RPR-3327',
        vehiclePlate: 'Abu Dhabi 12345',
        damageAssessment: 'rear bumper cracked, tailgate misaligned',
        repairedParts: ['rear bumper', 'tailgate'],
        assessmentDate: '2026-08-31',
        garage: 'Sandbox repair network unit 4',
      } satisfies RepairRecordPayload,
    },
  ],
  claimsAvailable: true,
  contradiction: null,
  handoff: {
    destination: 'adjuster-queue',
    reason: 'Intake complete. Injury follow-up and one missing document require human review.',
    createdBy: 'agent',
    followUpItems: [
      'Injury documentation from the clinic visit',
      'Driving licence copy for the policy file',
    ],
    callerQuestions: [],
  },
  toolCalls: [
    {
      toolName: 'claims-record',
      requestPayload: { caseRef: 'FNOL-2026-0142', tool: 'claims-record' },
      responsePayload: { claimNumber: 'CLM-2026-8841', policyNumber: 'POL-TR-55-0021', verified: true },
      outcome: 'allowed',
      offsetMs: 75800,
      latencyMs: 420,
    },
    {
      toolName: 'repair-record',
      requestPayload: { caseRef: 'FNOL-2026-0142', tool: 'repair-record' },
      responsePayload: { repairOrder: 'RPR-3327', verified: true },
      outcome: 'allowed',
      offsetMs: 77200,
      latencyMs: 380,
    },
    {
      toolName: 'adjuster-handoff',
      requestPayload: { caseRef: 'FNOL-2026-0142', destination: 'adjuster-queue', reason: 'Intake complete. Injury follow-up and one missing document require human review.' },
      responsePayload: { handoffId: 'ho-0142-01', queue: 'adjuster-queue', state: 'accepted' },
      outcome: 'allowed',
      offsetMs: 96100,
      latencyMs: 610,
    },
  ],
  analysis: {
    summary:
      'English intake completed. Nine claimant facts extracted with source spans. Claims, policy, and repair records retrieved and matched on date, location, vehicle, and damage. No contradictions detected. Injury follow-up and one missing document routed to the adjuster queue.',
    nextAction: 'An adjuster reviews the packet and contacts the claimant within one business day.',
    decisionBoundary: EN_BOUNDARY,
  },
};

/* ------------------------------------------------------------------ */
/* FNOL-2026-0143, Arabic, complete account                            */
/* ------------------------------------------------------------------ */

const CASE_143_AR_COMPLETE: CallScript = {
  scenario: 'complete',
  language: 'ar',
  caseId: '9f1c2a34-0143-4b0e-9c1d-a00000000143',
  conversationId: 'c0d2e1f3-0143-4c0d-8e2f-a00000000143',
  externalReference: 'FNOL-2026-0143',
  baseTimestamp: '2026-09-01T10:15:00.000Z',
  claimant: { displayName: 'Synthetic claimant AR-A', phone: '+971 50 555 0143' },
  segments: [
    { speaker: 'agent', node: 'disclosure', text: AR_DISCLOSURE, startMs: 0, endMs: 17200 },
    { speaker: 'agent', node: 'language', text: AR_LANGUAGE_PROMPT, startMs: 17300, endMs: 20500 },
    { speaker: 'claimant', node: 'language', text: 'بالعربية من فضلك.', startMs: 20600, endMs: 22400 },
    { speaker: 'agent', node: 'consent', text: AR_CONSENT_PROMPT, startMs: 22500, endMs: 28700 },
    { speaker: 'claimant', node: 'consent', text: 'نعم أوافق.', startMs: 28800, endMs: 30100 },
    { speaker: 'agent', node: 'intake', text: AR_INTAKE_PROMPT, startMs: 30200, endMs: 34900 },
    {
      speaker: 'claimant',
      node: 'intake',
      text: 'كان ذلك مساء الثلاثاء حوالي السادسة والنصف على طريق المطار قرب الجسر. توقفت عند الإشارة الحمراء فاصطدمت بي سيارة نقل صغيرة من الخلف. سيارتي سيدان زرقاء واللوحة أبوظبي 22314. توقف السائق وتبادلنا الأرقام واعتذر.',
      startMs: 35000,
      endMs: 47300,
    },
    {
      speaker: 'claimant',
      node: 'intake',
      text: 'المصد الخلفي مكسور وصندوق الأمتعة لا يغلق بشكل صحيح. شعرت بألم بسيط في رقبتي صباح اليوم التالي فذهبت إلى عيادة. حضرت الشرطة وأعطوني رقم محضر.',
      startMs: 47400,
      endMs: 54800,
    },
    {
      speaker: 'agent',
      node: 'clarification',
      text: 'شكرا. تنقصني تفصيلتان: التاريخ الدقيق للحادث ورقم محضر الشرطة. هل يمكنك تزويدي بهما؟',
      startMs: 54900,
      endMs: 60100,
    },
    {
      speaker: 'claimant',
      node: 'clarification',
      text: 'كان الحادث في الأول من سبتمبر. رقم المحضر 2026/88/417.',
      startMs: 60200,
      endMs: 65400,
    },
    {
      speaker: 'agent',
      node: 'tool-retrieval',
      text: 'شكرا. سأتحقق الآن من سجلات المطالبة والوثيقة ثم سجل الإصلاح.',
      startMs: 65500,
      endMs: 69400,
    },
    {
      speaker: 'agent',
      node: 'comparison',
      text: 'سجل المطالبة يطابق روايتك في تاريخ الحادث والموقع والسيارة. تتطلب الوثيقة محضر شرطة ونسخة رخصة القيادة وتقرير الإصلاح. المحضر وتقرير الإصلاح موجودان في الملف ونسخة رخصة القيادة ناقصة. سجل الإصلاح يذكر المصد الخلفي وباب صندوق الأمتعة وهذا يطابق وصفك.',
      startMs: 72100,
      endMs: 84200,
    },
    {
      speaker: 'agent',
      node: 'handoff',
      text: 'ملفك جاهز لمراجعة مُسوّي مطالبات. سأرسل حزمة تتضمن التفريغ النصي والحقائق المستخرجة وسجلات الوثيقة والإصلاح وبندا مفتوحا وهو متابعة الإصابة. لا يمكنني تأكيد التغطية أو توقع النتيجة. سيتواصل معك مُسوّي المطالبات خلال يوم عمل واحد. هل تريد إضافة أي شيء إلى الملف؟',
      startMs: 84300,
      endMs: 96000,
    },
    { speaker: 'claimant', node: 'handoff', text: 'لا، هذا كل شيء. شكرا.', startMs: 96100, endMs: 97900 },
    {
      speaker: 'agent',
      node: 'close',
      text: 'شكرا. سُجلت هذه المكالمة لأغراض التدقيق. كل قرار في هذه المطالبة يبقى مع مُسوّي مطالبات. إلى اللقاء.',
      startMs: 98000,
      endMs: 103700,
    },
  ],
  evidence: [
    { category: 'incident', fieldKey: 'incident_date', valueText: '2026-09-01', confidence: 0.97, sourceType: 'claimant', sourceReference: 'segment:10' },
    { category: 'incident', fieldKey: 'incident_time', valueText: 'حوالي الساعة 18:30', confidence: 0.93, sourceType: 'claimant', sourceReference: 'segment:7' },
    { category: 'incident', fieldKey: 'incident_location', valueText: 'طريق المطار قرب الجسر', confidence: 0.95, sourceType: 'claimant', sourceReference: 'segment:7' },
    { category: 'identity', fieldKey: 'vehicle_description', valueText: 'سيدان زرقاء', confidence: 0.99, sourceType: 'claimant', sourceReference: 'segment:7' },
    { category: 'identity', fieldKey: 'vehicle_plate', valueText: 'أبوظبي 22314', confidence: 0.99, sourceType: 'claimant', sourceReference: 'segment:7' },
    { category: 'incident', fieldKey: 'other_party', valueText: 'سيارة نقل صغيرة اصطدمت من الخلف وتبادلنا الأرقام', confidence: 0.96, sourceType: 'claimant', sourceReference: 'segment:7' },
    { category: 'damage', fieldKey: 'damage_description', valueText: 'المصد الخلفي مكسور وصندوق الأمتعة لا يغلق بشكل صحيح', confidence: 0.98, sourceType: 'claimant', sourceReference: 'segment:8' },
    { category: 'timeline', fieldKey: 'injuries_reported', valueText: 'ألم بسيط في الرقبة صباح اليوم التالي وزيارة عيادة', confidence: 0.94, sourceType: 'claimant', sourceReference: 'segment:8' },
    { category: 'contact', fieldKey: 'police_report_reference', valueText: '2026/88/417', confidence: 0.99, sourceType: 'claimant', sourceReference: 'segment:10' },
    { category: 'policy', fieldKey: 'policy_number', valueText: 'POL-TR-55-0022', confidence: 1, sourceType: 'policy-record', sourceReference: 'record:CLM-2026-8842' },
    { category: 'policy', fieldKey: 'document_driving_licence', valueText: '', confidence: 0, sourceType: 'policy-record', sourceReference: 'record:POL-TR-55-0022' },
    { category: 'damage', fieldKey: 'repair_assessment', valueText: 'استبدال المصد الخلفي وضبط باب صندوق الأمتعة', confidence: 1, sourceType: 'repair-record', sourceReference: 'record:RPR-3328' },
  ],
  sourceRecords: [
    {
      recordType: 'claim',
      providerReference: 'claims-sandbox:CLM-2026-8842',
      offsetMs: 69900,
      payload: {
        kind: 'claim-record',
        claimNumber: 'CLM-2026-8842',
        policyNumber: 'POL-TR-55-0022',
        incidentDateOnFile: '2026-09-01',
        vehiclePlateOnFile: 'أبوظبي 22314',
        damageOnFile: 'المصد الخلفي وصندوق الأمتعة',
        registeredAt: '2026-09-01T17:10:00.000Z',
        status: 'first-notice-of-loss',
      } satisfies ClaimRecordPayload,
    },
    {
      recordType: 'policy',
      providerReference: 'claims-sandbox:POL-TR-55-0022',
      offsetMs: 70000,
      payload: {
        kind: 'policy-record',
        policyNumber: 'POL-TR-55-0022',
        product: 'motor comprehensive sandbox',
        policyholder: 'Synthetic claimant AR-A',
        status: 'active',
        requiredDocuments: [
          { key: 'police-report', label: 'محضر الشرطة', state: 'on-file' },
          { key: 'repair-estimate', label: 'تقرير الإصلاح', state: 'on-file' },
          { key: 'driving-licence', label: 'نسخة رخصة القيادة', state: 'missing' },
        ],
      } satisfies PolicyRecordPayload,
    },
    {
      recordType: 'repair',
      providerReference: 'repair-sandbox:RPR-3328',
      offsetMs: 71300,
      payload: {
        kind: 'repair-record',
        repairOrder: 'RPR-3328',
        vehiclePlate: 'أبوظبي 22314',
        damageAssessment: 'المصد الخلفي مكسور وباب صندوق الأمتعة غير محاذى',
        repairedParts: ['المصد الخلفي', 'باب صندوق الأمتعة'],
        assessmentDate: '2026-09-02',
        garage: 'Sandbox repair network unit 4',
      } satisfies RepairRecordPayload,
    },
  ],
  claimsAvailable: true,
  contradiction: null,
  handoff: {
    destination: 'adjuster-queue',
    reason: 'اكتمل الاستقبال. متابعة الإصابة ووثيقة ناقصة تتطلبان مراجعة بشرية.',
    createdBy: 'agent',
    followUpItems: [
      'مستندات الإصابة من زيارة العيادة',
      'نسخة رخصة القيادة لملف الوثيقة',
    ],
    callerQuestions: [],
  },
  toolCalls: [
    {
      toolName: 'claims-record',
      requestPayload: { caseRef: 'FNOL-2026-0143', tool: 'claims-record' },
      responsePayload: { claimNumber: 'CLM-2026-8842', policyNumber: 'POL-TR-55-0022', verified: true },
      outcome: 'allowed',
      offsetMs: 69900,
      latencyMs: 435,
    },
    {
      toolName: 'repair-record',
      requestPayload: { caseRef: 'FNOL-2026-0143', tool: 'repair-record' },
      responsePayload: { repairOrder: 'RPR-3328', verified: true },
      outcome: 'allowed',
      offsetMs: 71300,
      latencyMs: 390,
    },
    {
      toolName: 'adjuster-handoff',
      requestPayload: { caseRef: 'FNOL-2026-0143', destination: 'adjuster-queue', reason: 'اكتمل الاستقبال. متابعة الإصابة ووثيقة ناقصة تتطلبان مراجعة بشرية.' },
      responsePayload: { handoffId: 'ho-0143-01', queue: 'adjuster-queue', state: 'accepted' },
      outcome: 'allowed',
      offsetMs: 90500,
      latencyMs: 595,
    },
  ],
  analysis: {
    summary:
      'اكتمل الاستقبال بالعربية. استخرجت تسع حقائق من رواية صاحب المطالبة مع مراجع مصادرها. استُرجعت سجلات المطالبة والوثيقة والإصلاح وطابقت الرواية في التاريخ والموقع والسيارة والضرر. لم تُرصد تعارضات. متابعة الإصابة ووثيقة ناقصة حُولتا إلى قائمة المُسوين.',
    nextAction: 'يراجع مُسوّي المطالبات الحزمة ويتواصل مع صاحب المطالبة خلال يوم عمل واحد.',
    decisionBoundary: AR_BOUNDARY,
  },
};

/* ------------------------------------------------------------------ */
/* FNOL-2026-0144, English, contradiction                             */
/* ------------------------------------------------------------------ */

const CASE_144_EN_CONTRADICTION: CallScript = {
  scenario: 'contradiction',
  language: 'en',
  caseId: '9f1c2a34-0144-4b0e-9c1d-a00000000144',
  conversationId: 'c0d2e1f3-0144-4c0d-8e2f-a00000000144',
  externalReference: 'FNOL-2026-0144',
  baseTimestamp: '2026-09-03T08:41:00.000Z',
  claimant: { displayName: 'Synthetic claimant EN-B', phone: '+971 50 555 0144' },
  segments: [
    { speaker: 'agent', node: 'disclosure', text: EN_DISCLOSURE, startMs: 0, endMs: 16500 },
    { speaker: 'agent', node: 'language', text: EN_LANGUAGE_PROMPT, startMs: 16600, endMs: 20800 },
    { speaker: 'claimant', node: 'language', text: 'English, please.', startMs: 20900, endMs: 22600 },
    { speaker: 'agent', node: 'consent', text: EN_CONSENT_PROMPT, startMs: 22700, endMs: 28900 },
    { speaker: 'claimant', node: 'consent', text: 'Yes, that is fine.', startMs: 29000, endMs: 30600 },
    { speaker: 'agent', node: 'intake', text: EN_INTAKE_PROMPT, startMs: 30700, endMs: 35800 },
    {
      speaker: 'claimant',
      node: 'intake',
      text: 'It was Wednesday afternoon, around four, on Hamdan Street near the electronic market. I had parked outside a shop, and when I came back my car had fresh damage. A witness saw a delivery van reverse into it while I was inside. My car is a grey hatchback, plate Abu Dhabi 41522. I called the police, and nobody was hurt.',
      startMs: 35900,
      endMs: 48700,
    },
    {
      speaker: 'claimant',
      node: 'intake',
      text: 'The rear door on the driver side is dented and the window does not open. The bumper looks fine to me. The police report number is PO 2026 91 224, and it happened on the second of September.',
      startMs: 48800,
      endMs: 57600,
    },
    {
      speaker: 'agent',
      node: 'tool-retrieval',
      text: 'Thank you. I will now check the claims and policy records, then the repair record.',
      startMs: 57700,
      endMs: 61500,
    },
    {
      speaker: 'agent',
      node: 'comparison',
      text: 'The claims record matches your account on the incident date and the vehicle. The repair record on file lists the rear bumper as replaced and the tailgate realigned, assessed on the second of September. You described a dented rear door and a jammed window, with the bumper intact. These accounts do not match. I cannot resolve this difference, and I will record it as a contradiction for a human adjuster.',
      startMs: 65200,
      endMs: 79700,
    },
    {
      speaker: 'claimant',
      node: 'contradiction',
      text: 'I see. So is the rear door covered by my policy?',
      startMs: 79800,
      endMs: 82600,
    },
    {
      speaker: 'agent',
      node: 'contradiction',
      text: 'I cannot make coverage decisions, and I do not have the authority to promise any outcome. I have noted your question in the record. A qualified adjuster will review the full packet, including the contradiction and your question, and contact you.',
      startMs: 82700,
      endMs: 89700,
    },
    {
      speaker: 'agent',
      node: 'handoff',
      text: 'Your case is being routed to the adjuster queue with the transcript, the extracted facts, the policy and repair records, the contradiction, and your coverage question. An adjuster will contact you within one business day.',
      startMs: 89800,
      endMs: 97200,
    },
    { speaker: 'claimant', node: 'handoff', text: 'Understood. Thank you.', startMs: 97300, endMs: 98900 },
    {
      speaker: 'agent',
      node: 'close',
      text: 'Thank you. This call has been recorded for audit. The decision stays with a human adjuster. Goodbye.',
      startMs: 99000,
      endMs: 103600,
    },
  ],
  evidence: [
    { category: 'incident', fieldKey: 'incident_date', valueText: '2026-09-02', confidence: 0.97, sourceType: 'claimant', sourceReference: 'segment:8' },
    { category: 'incident', fieldKey: 'incident_time', valueText: 'approximately 16:00', confidence: 0.93, sourceType: 'claimant', sourceReference: 'segment:7' },
    { category: 'incident', fieldKey: 'incident_location', valueText: 'Hamdan Street near the electronic market', confidence: 0.95, sourceType: 'claimant', sourceReference: 'segment:7' },
    { category: 'identity', fieldKey: 'vehicle_description', valueText: 'grey hatchback', confidence: 0.99, sourceType: 'claimant', sourceReference: 'segment:7' },
    { category: 'identity', fieldKey: 'vehicle_plate', valueText: 'Abu Dhabi 41522', confidence: 0.99, sourceType: 'claimant', sourceReference: 'segment:7' },
    { category: 'incident', fieldKey: 'other_party', valueText: 'delivery van reversed into parked car, witness present', confidence: 0.96, sourceType: 'claimant', sourceReference: 'segment:7' },
    { category: 'damage', fieldKey: 'damage_description', valueText: 'rear door dented, window jammed, bumper intact', confidence: 0.98, sourceType: 'claimant', sourceReference: 'segment:8' },
    { category: 'damage', fieldKey: 'repair_damage_description', valueText: 'rear bumper replaced, tailgate realigned', confidence: 1, sourceType: 'repair-record', sourceReference: 'record:RPR-3329' },
    { category: 'timeline', fieldKey: 'injuries_reported', valueText: 'none reported', confidence: 0.99, sourceType: 'claimant', sourceReference: 'segment:7' },
    { category: 'contact', fieldKey: 'police_report_reference', valueText: 'PO 2026 91 224', confidence: 0.99, sourceType: 'claimant', sourceReference: 'segment:8' },
    { category: 'policy', fieldKey: 'policy_number', valueText: 'POL-TR-55-0031', confidence: 1, sourceType: 'policy-record', sourceReference: 'record:CLM-2026-8843' },
  ],
  sourceRecords: [
    {
      recordType: 'claim',
      providerReference: 'claims-sandbox:CLM-2026-8843',
      offsetMs: 62000,
      payload: {
        kind: 'claim-record',
        claimNumber: 'CLM-2026-8843',
        policyNumber: 'POL-TR-55-0031',
        incidentDateOnFile: '2026-09-02',
        vehiclePlateOnFile: 'Abu Dhabi 41522',
        damageOnFile: 'damage reported to rear of vehicle',
        registeredAt: '2026-09-02T16:30:00.000Z',
        status: 'first-notice-of-loss',
      } satisfies ClaimRecordPayload,
    },
    {
      recordType: 'policy',
      providerReference: 'claims-sandbox:POL-TR-55-0031',
      offsetMs: 62100,
      payload: {
        kind: 'policy-record',
        policyNumber: 'POL-TR-55-0031',
        product: 'motor comprehensive sandbox',
        policyholder: 'Synthetic claimant EN-B',
        status: 'active',
        requiredDocuments: [
          { key: 'police-report', label: 'Police report', state: 'on-file' },
          { key: 'repair-estimate', label: 'Repair estimate', state: 'on-file' },
          { key: 'driving-licence', label: 'Driving licence copy', state: 'on-file' },
        ],
      } satisfies PolicyRecordPayload,
    },
    {
      recordType: 'repair',
      providerReference: 'repair-sandbox:RPR-3329',
      offsetMs: 63400,
      payload: {
        kind: 'repair-record',
        repairOrder: 'RPR-3329',
        vehiclePlate: 'Abu Dhabi 41522',
        damageAssessment: 'rear bumper impact damage, tailgate misaligned',
        repairedParts: ['rear bumper', 'tailgate'],
        assessmentDate: '2026-09-02',
        garage: 'Sandbox repair network unit 2',
      } satisfies RepairRecordPayload,
    },
  ],
  claimsAvailable: true,
  contradiction: {
    fieldKey: 'damage_location',
    severity: 'high',
    leftValue: 'rear door dented, window jammed, bumper intact',
    rightValue: 'rear bumper replaced, tailgate realigned',
    leftSource: 'claimant account',
    rightSource: 'repair record',
    leftReference: 'segment:8',
    rightReference: 'record:RPR-3329',
    rationale:
      'The claimant account and the repair record describe different damaged parts. Braid cannot resolve this contradiction because both sources are independent and neither is authoritative for the other. A physical inspection by a qualified adjuster is required.',
  },
  handoff: {
    destination: 'adjuster-queue',
    reason: 'Contradiction between claimant account and repair record on damage location. Coverage question requires a human answer.',
    createdBy: 'agent',
    followUpItems: [
      'Reconcile the damage location between the claimant account and the repair record',
      'Answer the claimant coverage question after reconciliation',
    ],
    callerQuestions: ['Is the rear door covered by my policy?'],
  },
  toolCalls: [
    {
      toolName: 'claims-record',
      requestPayload: { caseRef: 'FNOL-2026-0144', tool: 'claims-record' },
      responsePayload: { claimNumber: 'CLM-2026-8843', policyNumber: 'POL-TR-55-0031', verified: true },
      outcome: 'allowed',
      offsetMs: 62000,
      latencyMs: 405,
    },
    {
      toolName: 'repair-record',
      requestPayload: { caseRef: 'FNOL-2026-0144', tool: 'repair-record' },
      responsePayload: { repairOrder: 'RPR-3329', verified: true },
      outcome: 'allowed',
      offsetMs: 63400,
      latencyMs: 365,
    },
    {
      toolName: 'adjuster-handoff',
      requestPayload: { caseRef: 'FNOL-2026-0144', destination: 'adjuster-queue', reason: 'Contradiction between claimant account and repair record on damage location.' },
      responsePayload: { handoffId: 'ho-0144-01', queue: 'adjuster-queue', state: 'accepted' },
      outcome: 'allowed',
      offsetMs: 94000,
      latencyMs: 590,
    },
  ],
  analysis: {
    summary:
      'English intake with contradiction. Ten claimant facts extracted with source spans. Claims, policy, and repair records retrieved. Damage location conflicts between the claimant account and the repair record. Contradiction recorded and escalated. One coverage question logged for the adjuster.',
    nextAction: 'An adjuster reconciles the damage location, answers the coverage question, and contacts the claimant.',
    decisionBoundary: EN_BOUNDARY,
  },
};

/* ------------------------------------------------------------------ */
/* FNOL-2026-0145, Arabic, contradiction                               */
/* ------------------------------------------------------------------ */

const CASE_145_AR_CONTRADICTION: CallScript = {
  scenario: 'contradiction',
  language: 'ar',
  caseId: '9f1c2a34-0145-4b0e-9c1d-a00000000145',
  conversationId: 'c0d2e1f3-0145-4c0d-8e2f-a00000000145',
  externalReference: 'FNOL-2026-0145',
  baseTimestamp: '2026-09-04T10:05:00.000Z',
  claimant: { displayName: 'Synthetic claimant AR-B', phone: '+971 50 555 0145' },
  segments: [
    { speaker: 'agent', node: 'disclosure', text: AR_DISCLOSURE, startMs: 0, endMs: 17200 },
    { speaker: 'agent', node: 'language', text: AR_LANGUAGE_PROMPT, startMs: 17300, endMs: 20500 },
    { speaker: 'claimant', node: 'language', text: 'بالعربية من فضلك.', startMs: 20600, endMs: 22400 },
    { speaker: 'agent', node: 'consent', text: AR_CONSENT_PROMPT, startMs: 22500, endMs: 28700 },
    { speaker: 'claimant', node: 'consent', text: 'نعم أوافق.', startMs: 28800, endMs: 30100 },
    { speaker: 'agent', node: 'intake', text: AR_INTAKE_PROMPT, startMs: 30200, endMs: 34900 },
    {
      speaker: 'claimant',
      node: 'intake',
      text: 'كان ذلك صباح الخميس حوالي التاسعة في سوق الفحص قرب المحطة. كنت متوقفا أمام متجر ولما عدت وجدت ضررا جديدا على سيارتي. أخبرني صاحب المتجر أنه رأى شاحنة توصيل ترتد إلى الوراء فتصطدم بسيارتي وأنا في الداخل. سيارتي هاتشباك رمادية واللوحة أبوظبي 41533. اتصلت بالشرطة ولم يصب أحد بأذى.',
      startMs: 35000,
      endMs: 48900,
    },
    {
      speaker: 'claimant',
      node: 'intake',
      text: 'الباب الخلفي على جانب السائق منبعج والنافذة لا تفتح والمصد يبدو سليما. رقم المحضر 2026/91/225 والحادث كان في الثالث من سبتمبر.',
      startMs: 49000,
      endMs: 57200,
    },
    {
      speaker: 'agent',
      node: 'tool-retrieval',
      text: 'شكرا. سأتحقق الآن من سجلات المطالبة والوثيقة ثم سجل الإصلاح.',
      startMs: 57300,
      endMs: 61100,
    },
    {
      speaker: 'agent',
      node: 'comparison',
      text: 'سجل المطالبة يطابق روايتك في تاريخ الحادث والسيارة. سجل الإصلاح في الملف يذكر استبدال المصد الخلفي وضبط باب صندوق الأمتعة بتاريخ الثالث من سبتمبر. أنت وصفت بابا خلفيا منبعجا ونافذة لا تفتح مع مصد سليم. الروايتان لا تتطابقان. لا أستطيع حسم هذا الاختلاف وسأسجله كتعارض ليقرره مُسوّي مطالبات.',
      startMs: 64800,
      endMs: 80300,
    },
    {
      speaker: 'claimant',
      node: 'contradiction',
      text: 'أفهم. هل الباب الخلفي مشمول بوثيقتي؟',
      startMs: 80400,
      endMs: 82900 },
    {
      speaker: 'agent',
      node: 'contradiction',
      text: 'لا أستطيع اتخاذ قرارات التغطية وليس لي صلاحية الوعد بأي نتيجة. سجلت سؤالك في الملف. سيراجع مُسوّي مطالبات مؤهل الحزمة كاملة بما فيها التعارض وسؤالك ثم يتواصل معك.',
      startMs: 83000,
      endMs: 90200,
    },
    {
      speaker: 'agent',
      node: 'handoff',
      text: 'سيتم تحويل ملفك إلى قائمة المُسوين مع التفريغ النصي والحقائق المستخرجة وسجلات الوثيقة والإصلاح والتعارض وسؤالك عن التغطية. سيتواصل معك مُسوّي خلال يوم عمل واحد.',
      startMs: 90300,
      endMs: 97700,
    },
    { speaker: 'claimant', node: 'handoff', text: 'مفهوم. شكرا.', startMs: 97800, endMs: 99100 },
    {
      speaker: 'agent',
      node: 'close',
      text: 'شكرا. سُجلت هذه المكالمة لأغراض التدقيق. يبقى القرار مع مُسوّي مطالبات. إلى اللقاء.',
      startMs: 99200,
      endMs: 103700,
    },
  ],
  evidence: [
    { category: 'incident', fieldKey: 'incident_date', valueText: '2026-09-03', confidence: 0.97, sourceType: 'claimant', sourceReference: 'segment:8' },
    { category: 'incident', fieldKey: 'incident_time', valueText: 'حوالي الساعة 09:00', confidence: 0.93, sourceType: 'claimant', sourceReference: 'segment:7' },
    { category: 'incident', fieldKey: 'incident_location', valueText: 'سوق الفحص قرب المحطة', confidence: 0.95, sourceType: 'claimant', sourceReference: 'segment:7' },
    { category: 'identity', fieldKey: 'vehicle_description', valueText: 'هاتشباك رمادية', confidence: 0.99, sourceType: 'claimant', sourceReference: 'segment:7' },
    { category: 'identity', fieldKey: 'vehicle_plate', valueText: 'أبوظبي 41533', confidence: 0.99, sourceType: 'claimant', sourceReference: 'segment:7' },
    { category: 'incident', fieldKey: 'other_party', valueText: 'شاحنة توصيل ارتدت إلى الوراء واصطدمت بالسيارة المتوقفة مع وجود شاهد', confidence: 0.96, sourceType: 'claimant', sourceReference: 'segment:7' },
    { category: 'damage', fieldKey: 'damage_description', valueText: 'الباب الخلفي منبعج والنافذة لا تفتح والمصد سليم', confidence: 0.98, sourceType: 'claimant', sourceReference: 'segment:8' },
    { category: 'damage', fieldKey: 'repair_damage_description', valueText: 'استبدال المصد الخلفي وضبط باب صندوق الأمتعة', confidence: 1, sourceType: 'repair-record', sourceReference: 'record:RPR-3330' },
    { category: 'timeline', fieldKey: 'injuries_reported', valueText: 'لم تُرصد إصابات', confidence: 0.99, sourceType: 'claimant', sourceReference: 'segment:7' },
    { category: 'contact', fieldKey: 'police_report_reference', valueText: '2026/91/225', confidence: 0.99, sourceType: 'claimant', sourceReference: 'segment:8' },
    { category: 'policy', fieldKey: 'policy_number', valueText: 'POL-TR-55-0032', confidence: 1, sourceType: 'policy-record', sourceReference: 'record:CLM-2026-8844' },
  ],
  sourceRecords: [
    {
      recordType: 'claim',
      providerReference: 'claims-sandbox:CLM-2026-8844',
      offsetMs: 61600,
      payload: {
        kind: 'claim-record',
        claimNumber: 'CLM-2026-8844',
        policyNumber: 'POL-TR-55-0032',
        incidentDateOnFile: '2026-09-03',
        vehiclePlateOnFile: 'أبوظبي 41533',
        damageOnFile: 'ضرر في مؤخرة المركبة',
        registeredAt: '2026-09-03T12:30:00.000Z',
        status: 'first-notice-of-loss',
      } satisfies ClaimRecordPayload,
    },
    {
      recordType: 'policy',
      providerReference: 'claims-sandbox:POL-TR-55-0032',
      offsetMs: 61700,
      payload: {
        kind: 'policy-record',
        policyNumber: 'POL-TR-55-0032',
        product: 'motor comprehensive sandbox',
        policyholder: 'Synthetic claimant AR-B',
        status: 'active',
        requiredDocuments: [
          { key: 'police-report', label: 'محضر الشرطة', state: 'on-file' },
          { key: 'repair-estimate', label: 'تقرير الإصلاح', state: 'on-file' },
          { key: 'driving-licence', label: 'نسخة رخصة القيادة', state: 'on-file' },
        ],
      } satisfies PolicyRecordPayload,
    },
    {
      recordType: 'repair',
      providerReference: 'repair-sandbox:RPR-3330',
      offsetMs: 63000,
      payload: {
        kind: 'repair-record',
        repairOrder: 'RPR-3330',
        vehiclePlate: 'أبوظبي 41533',
        damageAssessment: 'ضرر في المصد الخلفي وعدم محاذاة باب صندوق الأمتعة',
        repairedParts: ['المصد الخلفي', 'باب صندوق الأمتعة'],
        assessmentDate: '2026-09-03',
        garage: 'Sandbox repair network unit 2',
      } satisfies RepairRecordPayload,
    },
  ],
  claimsAvailable: true,
  contradiction: {
    fieldKey: 'damage_location',
    severity: 'high',
    leftValue: 'الباب الخلفي منبعج والنافذة لا تفتح والمصد سليم',
    rightValue: 'استبدال المصد الخلفي وضبط باب صندوق الأمتعة',
    leftSource: 'رواية صاحب المطالبة',
    rightSource: 'سجل الإصلاح',
    leftReference: 'segment:8',
    rightReference: 'record:RPR-3330',
    rationale:
      'وصف صاحب المطالبة وسجل الإصلاح يشيران إلى أجزاء مختلفة متضررة. لا يستطيع بريد حسم هذا التعارض لأن المصدرين مستقلان ولا يُعد أي منهما مرجعا للآخر. يلزم فحص عملي من مُسوّي مؤهل.',
  },
  handoff: {
    destination: 'adjuster-queue',
    reason: 'تعارض بين رواية صاحب المطالبة وسجل الإصلاح في موقع الضرر. سؤال التغطية يتطلب إجابة بشرية.',
    createdBy: 'agent',
    followUpItems: [
      'مطابقة موقع الضرر بين رواية صاحب المطالبة وسجل الإصلاح',
      'الإجابة عن سؤال صاحب المطالبة بعد المطابقة',
    ],
    callerQuestions: ['هل الباب الخلفي مشمول بوثيقتي؟'],
  },
  toolCalls: [
    {
      toolName: 'claims-record',
      requestPayload: { caseRef: 'FNOL-2026-0145', tool: 'claims-record' },
      responsePayload: { claimNumber: 'CLM-2026-8844', policyNumber: 'POL-TR-55-0032', verified: true },
      outcome: 'allowed',
      offsetMs: 61600,
      latencyMs: 410,
    },
    {
      toolName: 'repair-record',
      requestPayload: { caseRef: 'FNOL-2026-0145', tool: 'repair-record' },
      responsePayload: { repairOrder: 'RPR-3330', verified: true },
      outcome: 'allowed',
      offsetMs: 63000,
      latencyMs: 370,
    },
    {
      toolName: 'adjuster-handoff',
      requestPayload: { caseRef: 'FNOL-2026-0145', destination: 'adjuster-queue', reason: 'تعارض بين رواية صاحب المطالبة وسجل الإصلاح في موقع الضرر.' },
      responsePayload: { handoffId: 'ho-0145-01', queue: 'adjuster-queue', state: 'accepted' },
      outcome: 'allowed',
      offsetMs: 94500,
      latencyMs: 600,
    },
  ],
  analysis: {
    summary:
      'استقبال بالعربية مع تعارض. استُخرجت عشر حقائق من رواية صاحب المطالبة مع مراجع مصادرها. استُرجعت سجلات المطالبة والوثيقة والإصلاح. يتعارض موقع الضرر بين الرواية وسجل الإصلاح. سُجل التعارض وحُول للتصعيد. سُجل سؤال واحد عن التغطية للمُسوّي.',
    nextAction: 'يطابق مُسوّي المطالبات موقع الضرر ويجيب عن سؤال التغطية ويتواصل مع صاحب المطالبة.',
    decisionBoundary: AR_BOUNDARY,
  },
};

/* ------------------------------------------------------------------ */
/* FNOL-2026-0146, English, dependency failure                        */
/* ------------------------------------------------------------------ */

const CASE_146_EN_FAILURE: CallScript = {
  scenario: 'dependency-failure',
  language: 'en',
  caseId: '9f1c2a34-0146-4b0e-9c1d-a00000000146',
  conversationId: 'c0d2e1f3-0146-4c0d-8e2f-a00000000146',
  externalReference: 'FNOL-2026-0146',
  baseTimestamp: '2026-09-07T09:40:00.000Z',
  claimant: { displayName: 'Synthetic claimant EN-C', phone: '+971 50 555 0146' },
  segments: [
    { speaker: 'agent', node: 'disclosure', text: EN_DISCLOSURE, startMs: 0, endMs: 16500 },
    { speaker: 'agent', node: 'language', text: EN_LANGUAGE_PROMPT, startMs: 16600, endMs: 20800 },
    { speaker: 'claimant', node: 'language', text: 'English is fine.', startMs: 20900, endMs: 22500 },
    { speaker: 'agent', node: 'consent', text: EN_CONSENT_PROMPT, startMs: 22600, endMs: 28800 },
    { speaker: 'claimant', node: 'consent', text: 'Yes, I consent.', startMs: 28900, endMs: 30300 },
    { speaker: 'agent', node: 'intake', text: EN_INTAKE_PROMPT, startMs: 30400, endMs: 35500 },
    {
      speaker: 'claimant',
      node: 'intake',
      text: 'It was Monday morning, around eight, on Al Salam Street. I stopped at a red light and a pickup truck rolled into the back of my car. My car is a silver SUV, plate Abu Dhabi 31007. The driver stopped and gave me his details. Nobody was hurt.',
      startMs: 35600,
      endMs: 47900,
    },
    {
      speaker: 'claimant',
      node: 'intake',
      text: 'The rear bumper is scuffed and the reverse camera is broken. The police report number is PO 2026 77 118, and the date was the seventh of September.',
      startMs: 48000,
      endMs: 55600,
    },
    {
      speaker: 'agent',
      node: 'tool-retrieval',
      text: 'Thank you. I will now check the claims and policy records.',
      startMs: 55700,
      endMs: 59000,
    },
    {
      speaker: 'agent',
      node: 'failure',
      text: 'I could not reach the claims system just now, so I cannot verify your policy details at this moment. I will not guess, and I will not treat unverified details as confirmed. Your account is recorded, and I am marking the case for a human to complete the verification.',
      startMs: 63700,
      endMs: 72300,
    },
    {
      speaker: 'agent',
      node: 'comparison',
      text: 'The repair record is available and lists the rear bumper and the reverse camera. The policy and claim records could not be retrieved, so the policy requirements remain unverified. The case needs a human to complete that check.',
      startMs: 72400,
      endMs: 80300,
    },
    {
      speaker: 'agent',
      node: 'handoff',
      text: 'Your case is being routed to a human queue with the transcript, your account, and the repair record. An adjuster will verify the policy details and contact you. Is there anything you want added to the record?',
      startMs: 80400,
      endMs: 88100,
    },
    { speaker: 'claimant', node: 'handoff', text: 'No, that is fine. Thank you.', startMs: 88200, endMs: 89900 },
    {
      speaker: 'agent',
      node: 'close',
      text: 'Thank you. This call has been recorded for audit. A human will complete the verification. Goodbye.',
      startMs: 90000,
      endMs: 94900,
    },
  ],
  evidence: [
    { category: 'incident', fieldKey: 'incident_date', valueText: '2026-09-07', confidence: 0.97, sourceType: 'claimant', sourceReference: 'segment:8' },
    { category: 'incident', fieldKey: 'incident_time', valueText: 'approximately 08:00', confidence: 0.93, sourceType: 'claimant', sourceReference: 'segment:7' },
    { category: 'incident', fieldKey: 'incident_location', valueText: 'Al Salam Street', confidence: 0.95, sourceType: 'claimant', sourceReference: 'segment:7' },
    { category: 'identity', fieldKey: 'vehicle_description', valueText: 'silver SUV', confidence: 0.99, sourceType: 'claimant', sourceReference: 'segment:7' },
    { category: 'identity', fieldKey: 'vehicle_plate', valueText: 'Abu Dhabi 31007', confidence: 0.99, sourceType: 'claimant', sourceReference: 'segment:7' },
    { category: 'incident', fieldKey: 'other_party', valueText: 'pickup truck rolled into the rear at a red light', confidence: 0.96, sourceType: 'claimant', sourceReference: 'segment:7' },
    { category: 'damage', fieldKey: 'damage_description', valueText: 'scuffed rear bumper, broken reverse camera', confidence: 0.98, sourceType: 'claimant', sourceReference: 'segment:8' },
    { category: 'timeline', fieldKey: 'injuries_reported', valueText: 'none reported', confidence: 0.99, sourceType: 'claimant', sourceReference: 'segment:7' },
    { category: 'contact', fieldKey: 'police_report_reference', valueText: 'PO 2026 77 118', confidence: 0.99, sourceType: 'claimant', sourceReference: 'segment:8' },
    { category: 'policy', fieldKey: 'policy_number', valueText: '', confidence: 0, sourceType: 'policy-record', sourceReference: 'claims-sandbox:unavailable' },
    { category: 'damage', fieldKey: 'repair_assessment', valueText: 'rear bumper scuffed, reverse camera housing damaged', confidence: 1, sourceType: 'repair-record', sourceReference: 'record:RPR-3331' },
  ],
  sourceRecords: [
    {
      recordType: 'repair',
      providerReference: 'repair-sandbox:RPR-3331',
      offsetMs: 72400,
      payload: {
        kind: 'repair-record',
        repairOrder: 'RPR-3331',
        vehiclePlate: 'Abu Dhabi 31007',
        damageAssessment: 'rear bumper scuffed, reverse camera housing damaged',
        repairedParts: ['rear bumper cover', 'reverse camera'],
        assessmentDate: '2026-09-07',
        garage: 'Sandbox repair network unit 4',
      } satisfies RepairRecordPayload,
    },
  ],
  claimsAvailable: false,
  contradiction: null,
  handoff: {
    destination: 'human-follow-up-queue',
    reason: 'Claims system unavailable during intake. Policy verification must be completed by a human.',
    createdBy: 'agent',
    followUpItems: [
      'Complete policy verification once the claims system is available',
      'Confirm required documents with the claimant',
    ],
    callerQuestions: [],
  },
  toolCalls: [
    {
      toolName: 'claims-record',
      requestPayload: { caseRef: 'FNOL-2026-0146', tool: 'claims-record' },
      responsePayload: { error: 'DEPENDENCY_UNAVAILABLE', dependency: 'claims-sandbox', message: 'The claims system cannot be reached right now.' },
      outcome: 'failed',
      offsetMs: 59500,
      latencyMs: 3200,
    },
    {
      toolName: 'repair-record',
      requestPayload: { caseRef: 'FNOL-2026-0146', tool: 'repair-record' },
      responsePayload: { repairOrder: 'RPR-3331', verified: true },
      outcome: 'allowed',
      offsetMs: 72400,
      latencyMs: 380,
    },
    {
      toolName: 'adjuster-handoff',
      requestPayload: { caseRef: 'FNOL-2026-0146', destination: 'human-follow-up-queue', reason: 'Claims system unavailable during intake. Policy verification must be completed by a human.' },
      responsePayload: { handoffId: 'ho-0146-01', queue: 'human-follow-up-queue', state: 'accepted' },
      outcome: 'allowed',
      offsetMs: 86000,
      latencyMs: 540,
    },
  ],
  analysis: {
    summary:
      'English intake with dependency failure. Nine claimant facts extracted with source spans. The claims sandbox was unavailable, so the claim and policy records could not be verified. The repair record was retrieved and matches the account. The case was routed to human follow-up without any unverified claim being treated as confirmed.',
    nextAction: 'A human completes policy verification and contacts the claimant.',
    decisionBoundary: EN_BOUNDARY,
  },
};

/* ------------------------------------------------------------------ */
/* FNOL-2026-0147, Arabic, dependency failure                           */
/* ------------------------------------------------------------------ */

const CASE_147_AR_FAILURE: CallScript = {
  scenario: 'dependency-failure',
  language: 'ar',
  caseId: '9f1c2a34-0147-4b0e-9c1d-a00000000147',
  conversationId: 'c0d2e1f3-0147-4c0d-8e2f-a00000000147',
  externalReference: 'FNOL-2026-0147',
  baseTimestamp: '2026-09-07T11:20:00.000Z',
  claimant: { displayName: 'Synthetic claimant AR-C', phone: '+971 50 555 0147' },
  segments: [
    { speaker: 'agent', node: 'disclosure', text: AR_DISCLOSURE, startMs: 0, endMs: 17200 },
    { speaker: 'agent', node: 'language', text: AR_LANGUAGE_PROMPT, startMs: 17300, endMs: 20500 },
    { speaker: 'claimant', node: 'language', text: 'بالعربية من فضلك.', startMs: 20600, endMs: 22400 },
    { speaker: 'agent', node: 'consent', text: AR_CONSENT_PROMPT, startMs: 22500, endMs: 28700 },
    { speaker: 'claimant', node: 'consent', text: 'نعم أوافق.', startMs: 28800, endMs: 30100 },
    { speaker: 'agent', node: 'intake', text: AR_INTAKE_PROMPT, startMs: 30200, endMs: 34900 },
    {
      speaker: 'claimant',
      node: 'intake',
      text: 'كان ذلك صباح الاثنين حوالي الثامنة على شارع السلام. توقفت عند الإشارة الحمراء فاصطدمت بي شاحنة صغيرة من الخلف. سيارتي رياضية متعددة الأغراض فضية واللوحة أبوظبي 31008. توقف السائق وأعطاني بياناته ولم يصب أحد بأذى.',
      startMs: 35000,
      endMs: 47200,
    },
    {
      speaker: 'claimant',
      node: 'intake',
      text: 'المصد الخلفي مخدوش وكاميرا الرجوع معطلة. رقم المحضر 2026/77/119 والحادث كان في السابع من سبتمبر.',
      startMs: 47300,
      endMs: 54900,
    },
    {
      speaker: 'agent',
      node: 'tool-retrieval',
      text: 'شكرا. سأتحقق الآن من سجلات المطالبة والوثيقة.',
      startMs: 55000,
      endMs: 58200,
    },
    {
      speaker: 'agent',
      node: 'failure',
      text: 'لم أتمكن من الوصول إلى نظام المطالبات الآن لذا لا أستطيع التحقق من تفاصيل وثيقتك في هذه اللحظة. لن أخمن ولن أعتبر التفاصيل غير المتحقق منها مؤكدة. سجلت روايتك وسأعلّم الملف لمتابعة بشرية لإكمال التحقق.',
      startMs: 62900,
      endMs: 71800,
    },
    {
      speaker: 'agent',
      node: 'comparison',
      text: 'سجل الإصلاح متاح ويذكر المصد الخلفي وكاميرا الرجوع. لم نتمكن من استرجاع سجلي المطالبة والوثيقة لذا تبقى متطلبات الوثيقة غير متحقق منها. يحتاج الملف إلى شخص لإكمال هذا التحقق.',
      startMs: 71900,
      endMs: 79900,
    },
    {
      speaker: 'agent',
      node: 'handoff',
      text: 'سيتم تحويل ملفك إلى قائمة المتابعة البشرية مع التفريغ النصي وروايتك وسجل الإصلاح. سيتحقق مُسوّي من تفاصيل الوثيقة ويتواصل معك. هل تريد إضافة أي شيء إلى الملف؟',
      startMs: 80000,
      endMs: 88000,
    },
    { speaker: 'claimant', node: 'handoff', text: 'لا، هذا مناسب. شكرا.', startMs: 88100, endMs: 89900 },
    {
      speaker: 'agent',
      node: 'close',
      text: 'شكرا. سُجلت هذه المكالمة لأغراض التدقيق. سيكمل شخص التحقق. إلى اللقاء.',
      startMs: 90000,
      endMs: 94700,
    },
  ],
  evidence: [
    { category: 'incident', fieldKey: 'incident_date', valueText: '2026-09-07', confidence: 0.97, sourceType: 'claimant', sourceReference: 'segment:8' },
    { category: 'incident', fieldKey: 'incident_time', valueText: 'حوالي الساعة 08:00', confidence: 0.93, sourceType: 'claimant', sourceReference: 'segment:7' },
    { category: 'incident', fieldKey: 'incident_location', valueText: 'شارع السلام', confidence: 0.95, sourceType: 'claimant', sourceReference: 'segment:7' },
    { category: 'identity', fieldKey: 'vehicle_description', valueText: 'رياضية متعددة الأغراض فضية', confidence: 0.99, sourceType: 'claimant', sourceReference: 'segment:7' },
    { category: 'identity', fieldKey: 'vehicle_plate', valueText: 'أبوظبي 31008', confidence: 0.99, sourceType: 'claimant', sourceReference: 'segment:7' },
    { category: 'incident', fieldKey: 'other_party', valueText: 'شاحنة صغيرة اصطدمت من الخلف عند إشارة حمراء', confidence: 0.96, sourceType: 'claimant', sourceReference: 'segment:7' },
    { category: 'damage', fieldKey: 'damage_description', valueText: 'المصد الخلفي مخدوش وكاميرا الرجوع معطلة', confidence: 0.98, sourceType: 'claimant', sourceReference: 'segment:8' },
    { category: 'timeline', fieldKey: 'injuries_reported', valueText: 'لم تُرصد إصابات', confidence: 0.99, sourceType: 'claimant', sourceReference: 'segment:7' },
    { category: 'contact', fieldKey: 'police_report_reference', valueText: '2026/77/119', confidence: 0.99, sourceType: 'claimant', sourceReference: 'segment:8' },
    { category: 'policy', fieldKey: 'policy_number', valueText: '', confidence: 0, sourceType: 'policy-record', sourceReference: 'claims-sandbox:unavailable' },
    { category: 'damage', fieldKey: 'repair_assessment', valueText: 'خدوش في المصد الخلفي وتعطل كاميرا الرجوع', confidence: 1, sourceType: 'repair-record', sourceReference: 'record:RPR-3332' },
  ],
  sourceRecords: [
    {
      recordType: 'repair',
      providerReference: 'repair-sandbox:RPR-3332',
      offsetMs: 71900,
      payload: {
        kind: 'repair-record',
        repairOrder: 'RPR-3332',
        vehiclePlate: 'أبوظبي 31008',
        damageAssessment: 'خدوش في المصد الخلفي وتعطل كاميرا الرجوع',
        repairedParts: ['المصد الخلفي', 'كاميرا الرجوع'],
        assessmentDate: '2026-09-07',
        garage: 'Sandbox repair network unit 4',
      } satisfies RepairRecordPayload,
    },
  ],
  claimsAvailable: false,
  contradiction: null,
  handoff: {
    destination: 'human-follow-up-queue',
    reason: 'نظام المطالبات غير متاح أثناء الاستقبال. يجب أن يكمل شخص التحقق من الوثيقة.',
    createdBy: 'agent',
    followUpItems: [
      'إكمال التحقق من الوثيقة عند توفر نظام المطالبات',
      'تأكيد المستندات المطلوبة مع صاحب المطالبة',
    ],
    callerQuestions: [],
  },
  toolCalls: [
    {
      toolName: 'claims-record',
      requestPayload: { caseRef: 'FNOL-2026-0147', tool: 'claims-record' },
      responsePayload: { error: 'DEPENDENCY_UNAVAILABLE', dependency: 'claims-sandbox', message: 'لا يمكن الوصول إلى نظام المطالبات الآن.' },
      outcome: 'failed',
      offsetMs: 58700,
      latencyMs: 3200,
    },
    {
      toolName: 'repair-record',
      requestPayload: { caseRef: 'FNOL-2026-0147', tool: 'repair-record' },
      responsePayload: { repairOrder: 'RPR-3332', verified: true },
      outcome: 'allowed',
      offsetMs: 71900,
      latencyMs: 385,
    },
    {
      toolName: 'adjuster-handoff',
      requestPayload: { caseRef: 'FNOL-2026-0147', destination: 'human-follow-up-queue', reason: 'نظام المطالبات غير متاح أثناء الاستقبال. يجب أن يكمل شخص التحقق من الوثيقة.' },
      responsePayload: { handoffId: 'ho-0147-01', queue: 'human-follow-up-queue', state: 'accepted' },
      outcome: 'allowed',
      offsetMs: 85500,
      latencyMs: 545,
    },
  ],
  analysis: {
    summary:
      'استقبال بالعربية مع فشل في التبعية. استُخرجت تسع حقائق من رواية صاحب المطالبة مع مراجع مصادرها. كان صندوق المطالبات الرملي غير متاح لذا لم يمكن التحقق من سجلي المطالبة والوثيقة. استُرجع سجل الإصلاح وطابق الرواية. حُول الملف إلى متابعة بشرية دون اعتبار أي تفصيل غير متحقق منه مؤكدا.',
    nextAction: 'يكمل شخص التحقق من الوثيقة ويتواصل مع صاحب المطالبة.',
    decisionBoundary: AR_BOUNDARY,
  },
};

/* ------------------------------------------------------------------ */
/* Exports                                                            */
/* ------------------------------------------------------------------ */

/** All six demo scripts, in case number order. */
export const CALL_SCRIPTS: CallScript[] = [
  CASE_142_EN_COMPLETE,
  CASE_143_AR_COMPLETE,
  CASE_144_EN_CONTRADICTION,
  CASE_145_AR_CONTRADICTION,
  CASE_146_EN_FAILURE,
  CASE_147_AR_FAILURE,
];

/** Look up a script by scenario and language. */
export function findScript(scenario: Scenario, language: Language): CallScript {
  const script = CALL_SCRIPTS.find(
    (entry) => entry.scenario === scenario && entry.language === language,
  );
  if (!script) {
    throw new Error(`No call script for scenario ${scenario} and language ${language}`);
  }
  return script;
}

/** Look up a seeded script by its external case reference. */
export function findScriptByReference(externalReference: string): CallScript {
  const script = CALL_SCRIPTS.find(
    (entry) => entry.externalReference === externalReference,
  );
  if (!script) {
    throw new Error(`No call script for reference ${externalReference}`);
  }
  return script;
}
