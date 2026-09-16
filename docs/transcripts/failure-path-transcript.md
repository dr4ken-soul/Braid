# Failure Path Transcript

Two cases demonstrate the dependency failure path: one in English and one in Arabic. Both have the claims-sandbox returning DEPENDENCY_UNAVAILABLE. The repair record succeeds. The agent states that verification cannot be completed, makes no claim decision, and routes to the human-follow-up queue.

---

## Part 1: English Dependency Failure (FNOL-2026-0146)

**Case reference:** FNOL-2026-0146
**Language:** English
**Scenario:** dependency-failure (claims system unavailable)
**Claimant:** Synthetic claimant EN-C (+971 50 555 0146)
**Conversation start:** 2026-09-07 09:40:00 UTC
**Agent version:** braid-intake-1.4.0

### Transcript

| Clock time (UTC) | Offset | Speaker | Workflow node | Text |
| --- | --- | --- | --- | --- |
| 2026-09-07 09:40:00 | 00:00 | agent | disclosure | Hello. This is Braid, an automated claims intake line. I am an AI agent, not a human adjuster. This call is recorded and transcribed for audit. I collect factual claim information only. I cannot decide coverage, liability, or payment, and you can ask for a human at any time. |
| 2026-09-07 09:40:17 | 00:17 | agent | language | Would you like to continue in English, or would you prefer Arabic? |
| 2026-09-07 09:40:21 | 00:21 | claimant | language | English is fine. |
| 2026-09-07 09:40:23 | 00:23 | agent | consent | Thank you. Before we begin, do you consent to Braid collecting your factual account of the incident and sharing it with the claims team for review? You can withdraw consent at any time. |
| 2026-09-07 09:40:29 | 00:29 | claimant | consent | Yes, I consent. |
| 2026-09-07 09:40:30 | 00:30 | agent | intake | Please describe what happened. Include when it happened, where, the vehicle, the other party, and any damage you noticed. |
| 2026-09-07 09:40:36 | 00:36 | claimant | intake | It was Monday morning, around eight, on Al Salam Street. I stopped at a red light and a pickup truck rolled into the back of my car. My car is a silver SUV, plate Abu Dhabi 31007. The driver stopped and gave me his details. Nobody was hurt. |
| 2026-09-07 09:40:48 | 00:48 | claimant | intake | The rear bumper is scuffed and the reverse camera is broken. The police report number is PO 2026 77 118, and the date was the seventh of September. |
| 2026-09-07 09:40:56 | 00:56 | agent | tool-retrieval | Thank you. I will now check the claims and policy records. |
| 2026-09-07 09:41:04 | 01:04 | agent | failure | I could not reach the claims system just now, so I cannot verify your policy details at this moment. I will not guess, and I will not treat unverified details as confirmed. Your account is recorded, and I am marking the case for a human to complete the verification. |
| 2026-09-07 09:41:12 | 01:12 | agent | comparison | The repair record is available and lists the rear bumper and the reverse camera. The policy and claim records could not be retrieved, so the policy requirements remain unverified. The case needs a human to complete that check. |
| 2026-09-07 09:41:20 | 01:20 | agent | handoff | Your case is being routed to a human queue with the transcript, your account, and the repair record. An adjuster will verify the policy details and contact you. Is there anything you want added to the record? |
| 2026-09-07 09:41:28 | 01:28 | claimant | handoff | No, that is fine. Thank you. |
| 2026-09-07 09:41:30 | 01:30 | agent | close | Thank you. This call has been recorded for audit. A human will complete the verification. Goodbye. |

### Tool Calls

| Offset | Tool | Latency | Outcome | Notes |
| --- | --- | --- | --- | --- |
| 01:00 | claims-record | 3200 ms | failed | DEPENDENCY_UNAVAILABLE; claims-sandbox unreachable |
| 01:12 | repair-record | 380 ms | allowed | Returned RPR-3331, verified rear bumper scuffed and reverse camera damaged |
| 01:26 | adjuster-handoff | 540 ms | allowed | Routed to human-follow-up-queue (not adjuster-queue); handoff ID ho-0146-01 |

### Post-Call Analysis

**Summary:** English intake with dependency failure. Nine claimant facts extracted with source spans. The claims sandbox was unavailable, so the claim and policy records could not be verified. The repair record was retrieved and matches the account. The case was routed to human follow-up without any unverified claim being treated as confirmed.

**Next action:** A human completes policy verification and contacts the claimant.

**Follow-up items for the human follow-up queue:**
- Complete policy verification once the claims system is available
- Confirm required documents with the claimant

**System event:** claims-sandbox returned DEPENDENCY_UNAVAILABLE at 01:00. Repair record succeeded at 01:12. Handoff routed to human-follow-up-queue at 01:26.

**Decision boundary:** Braid prepares evidence only. Liability, coverage, settlement value, payment, and claim closure remain with qualified human adjusters.

---

## Part 2: Arabic Dependency Failure (FNOL-2026-0147)

**Case reference:** FNOL-2026-0147
**Language:** Arabic
**Scenario:** dependency-failure (claims system unavailable)
**Claimant:** Synthetic claimant AR-C (+971 50 555 0147)
**Conversation start:** 2026-09-07 11:20:00 UTC
**Agent version:** braid-intake-1.4.0

### Transcript

| Clock time (UTC) | Offset | Speaker | Workflow node | Text |
| --- | --- | --- | --- | --- |
| 2026-09-07 11:20:00 | 00:00 | agent | disclosure | مرحبا. هذا خط بريد لاستقبال المطالبات. أنا وكيل ذكاء اصطناعي ولست مُسوّي مطالبات. سيتم تسجيل هذه المكالمة وتفريغها نصيا لأغراض التدقيق. أجمع المعلومات الواقعية عن المطالبة فقط، ولا يمكنني اتخاذ قرار بشأن التغطية أو المسؤولية أو الدفع. يمكنك طلب التحدث مع شخص في أي وقت. |
| 2026-09-07 11:20:17 | 00:17 | agent | language | هل تريد المتابعة بالعربية أم بالإنجليزية؟ |
| 2026-09-07 11:20:21 | 00:21 | claimant | language | بالعربية من فضلك. |
| 2026-09-07 11:20:22 | 00:22 | agent | consent | شكرا. قبل أن نبدأ، هل توافق على جمع بياناتك الواقعية عن الحادث ومشاركتها مع فريق المطالبات للمراجعة؟ يمكنك سحب موافقتك في أي وقت. |
| 2026-09-07 11:20:30 | 00:30 | claimant | consent | نعم أوافق. |
| 2026-09-07 11:20:32 | 00:32 | agent | intake | من فضلك صف ما حدث. اذكر وقت الحادث ومكانه والسيارة والطرف الآخر وأي أضرار لاحظتها. |
| 2026-09-07 11:20:35 | 00:35 | claimant | intake | كان ذلك صباح الاثنين حوالي الثامنة على شارع السلام. توقفت عند الإشارة الحمراء فاصطدمت بي شاحنة صغيرة من الخلف. سيارتي رياضية متعددة الأغراض فضية واللوحة أبوظبي 31008. توقف السائق وأعطاني بياناته ولم يصب أحد بأذى. |
| 2026-09-07 11:20:47 | 00:47 | claimant | intake | المصد الخلفي مخدوش وكاميرا الرجوع معطلة. رقم المحضر 2026/77/119 والحادث كان في السابع من سبتمبر. |
| 2026-09-07 11:20:55 | 00:55 | agent | tool-retrieval | شكرا. سأتحقق الآن من سجلات المطالبة والوثيقة. |
| 2026-09-07 11:21:03 | 01:03 | agent | failure | لم أتمكن من الوصول إلى نظام المطالبات الآن لذا لا أستطيع التحقق من تفاصيل وثيقتك في هذه اللحظة. لن أخمن ولن أعتبر التفاصيل غير المتحقق منها مؤكدة. سجلت روايتك وسأعلّم الملف لمتابعة بشرية لإكمال التحقق. |
| 2026-09-07 11:21:12 | 01:12 | agent | comparison | سجل الإصلاح متاح ويذكر المصد الخلفي وكاميرا الرجوع. لم نتمكن من استرجاع سجلي المطالبة والوثيقة لذا تبقى متطلبات الوثيقة غير متحقق منها. يحتاج الملف إلى شخص لإكمال هذا التحقق. |
| 2026-09-07 11:21:20 | 01:20 | agent | handoff | سيتم تحويل ملفك إلى قائمة المتابعة البشرية مع التفريغ النصي وروايتك وسجل الإصلاح. سيتحقق مُسوّي من تفاصيل الوثيقة ويتواصل معك. هل تريد إضافة أي شيء إلى الملف؟ |
| 2026-09-07 11:21:28 | 01:28 | claimant | handoff | لا، هذا مناسب. شكرا. |
| 2026-09-07 11:21:30 | 01:30 | agent | close | شكرا. سُجلت هذه المكالمة لأغراض التدقيق. سيكمل شخص التحقق. إلى اللقاء. |

### Tool Calls

| Offset | Tool | Latency | Outcome | Notes |
| --- | --- | --- | --- | --- |
| 00:59 | claims-record | 3200 ms | failed | DEPENDENCY_UNAVAILABLE; claims-sandbox unreachable |
| 01:12 | repair-record | 385 ms | allowed | Returned RPR-3332, verified rear bumper scuffed and reverse camera damaged |
| 01:26 | adjuster-handoff | 545 ms | allowed | Routed to human-follow-up-queue (not adjuster-queue); handoff ID ho-0147-01 |

### Post-Call Analysis

**Summary:** Arabic intake with dependency failure. Nine claimant facts extracted with source spans. The claims sandbox was unavailable, so the claim and policy records could not be verified. The repair record was retrieved and matches the account. The case was routed to human follow-up without any unverified claim being treated as confirmed.

**Next action:** A human completes policy verification and contacts the claimant.

**Follow-up items for the human follow-up queue:**
- إكمال التحقق من الوثيقة عند توفر نظام المطالبات
- تأكيد المستندات المطلوبة مع صاحب المطالبة

**System event:** claims-sandbox returned DEPENDENCY_UNAVAILABLE at 00:59. Repair record succeeded at 01:12. Handoff routed to human-follow-up-queue at 01:26.

**Decision boundary:** يجمع بريد الأدلة فقط. تبقى المسؤولية والتغطية وقيمة التسوية والدفع وإغلاق المطالبة مع مُسوّي المطالبات المؤهلين.