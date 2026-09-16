# Arabic Call Transcript

**Case reference:** FNOL-2026-0143
**Language:** Arabic
**Scenario:** complete account
**Claimant:** Synthetic claimant AR-A (+971 50 555 0143)
**Conversation start:** 2026-09-01 10:15:00 UTC
**Agent version:** braid-intake-1.4.0

---

## Transcript

| Clock time (UTC) | Offset | Speaker | Workflow node | Text |
| --- | --- | --- | --- | --- |
| 2026-09-01 10:15:00 | 00:00 | agent | disclosure | مرحبا. هذا خط بريد لاستقبال المطالبات. أنا وكيل ذكاء اصطناعي ولست مُسوّي مطالبات. سيتم تسجيل هذه المكالمة وتفريغها نصيا لأغراض التدقيق. أجمع المعلومات الواقعية عن المطالبة فقط، ولا يمكنني اتخاذ قرار بشأن التغطية أو المسؤولية أو الدفع. يمكنك طلب التحدث مع شخص في أي وقت. |
| 2026-09-01 10:15:17 | 00:17 | agent | language | هل تريد المتابعة بالعربية أم بالإنجليزية؟ |
| 2026-09-01 10:15:21 | 00:21 | claimant | language | بالعربية من فضلك. |
| 2026-09-01 10:15:22 | 00:22 | agent | consent | شكرا. قبل أن نبدأ، هل توافق على جمع بياناتك الواقعية عن الحادث ومشاركتها مع فريق المطالبات للمراجعة؟ يمكنك سحب موافقتك في أي وقت. |
| 2026-09-01 10:15:30 | 00:30 | claimant | consent | نعم أوافق. |
| 2026-09-01 10:15:32 | 00:32 | agent | intake | من فضلك صف ما حدث. اذكر وقت الحادث ومكانه والسيارة والطرف الآخر وأي أضرار لاحظتها. |
| 2026-09-01 10:15:35 | 00:35 | claimant | intake | كان ذلك مساء الثلاثاء حوالي السادسة والنصف على طريق المطار قرب الجسر. توقفت عند الإشارة الحمراء فاصطدمت بي سيارة نقل صغيرة من الخلف. سيارتي سيدان زرقاء واللوحة أبوظبي 22314. توقف السائق وتبادلنا الأرقام واعتذر. |
| 2026-09-01 10:15:47 | 00:47 | claimant | intake | المصد الخلفي مكسور وصندوق الأمتعة لا يغلق بشكل صحيح. شعرت بألم بسيط في رقبتي صباح اليوم التالي فذهبت إلى عيادة. حضرت الشرطة وأعطوني رقم محضر. |
| 2026-09-01 10:15:55 | 00:55 | agent | clarification | شكرا. تنقصني تفصيلتان: التاريخ الدقيق للحادث ورقم محضر الشرطة. هل يمكنك تزويدي بهما؟ |
| 2026-09-01 10:16:00 | 01:00 | claimant | clarification | كان الحادث في الأول من سبتمبر. رقم المحضر 2026/88/417. |
| 2026-09-01 10:16:05 | 01:05 | agent | tool-retrieval | شكرا. سأتحقق الآن من سجلات المطالبة والوثيقة ثم سجل الإصلاح. |
| 2026-09-01 10:16:12 | 01:12 | agent | comparison | سجل المطالبة يطابق روايتك في تاريخ الحادث والموقع والسيارة. تتطلب الوثيقة محضر شرطة ونسخة رخصة القيادة وتقرير الإصلاح. المحضر وتقرير الإصلاح موجودان في الملف ونسخة رخصة القيادة ناقصة. سجل الإصلاح يذكر المصد الخلفي وباب صندوق الأمتعة وهذا يطابق وصفك. |
| 2026-09-01 10:16:24 | 01:24 | agent | handoff | ملفك جاهز لمراجعة مُسوّي مطالبات. سأرسل حزمة تتضمن التفريغ النصي والحقائق المستخرجة وسجلات الوثيقة والإصلاح وبندا مفتوحا وهو متابعة الإصابة. لا يمكنني تأكيد التغطية أو توقع النتيجة. سيتواصل معك مُسوّي المطالبات خلال يوم عمل واحد. هل تريد إضافة أي شيء إلى الملف؟ |
| 2026-09-01 10:16:36 | 01:36 | claimant | handoff | لا، هذا كل شيء. شكرا. |
| 2026-09-01 10:16:38 | 01:38 | agent | close | شكرا. سُجلت هذه المكالمة لأغراض التدقيق. كل قرار في هذه المطالبة يبقى مع مُسوّي مطالبات. إلى اللقاء. |

---

## Tool Calls

| Offset | Tool | Latency | Outcome | Notes |
| --- | --- | --- | --- | --- |
| 01:10 | claims-record | 435 ms | allowed | Returned CLM-2026-8842, verified policy POL-TR-55-0022 |
| 01:11 | repair-record | 390 ms | allowed | Returned RPR-3328, verified rear bumper and tailgate |
| 01:30 | adjuster-handoff | 595 ms | allowed | Routed to adjuster-queue, accepted; handoff ID ho-0143-01 |

---

## Evidence Extracted

| Field | Value | Confidence | Source |
| --- | --- | --- | --- |
| Incident date | 2026-09-01 | 97% | claimant account (segment 10) |
| Incident time | حوالي الساعة 18:30 | 93% | claimant account (segment 7) |
| Incident location | طريق المطار قرب الجسر | 95% | claimant account (segment 7) |
| Vehicle description | سيدان زرقاء | 99% | claimant account (segment 7) |
| Vehicle plate | أبوظبي 22314 | 99% | claimant account (segment 7) |
| Other party | سيارة نقل صغيرة اصطدمت من الخلف وتبادلنا الأرقام | 96% | claimant account (segment 7) |
| Damage description | المصد الخلفي مكسور وصندوق الأمتعة لا يغلق بشكل صحيح | 98% | claimant account (segment 8) |
| Injuries reported | ألم بسيط في الرقبة صباح اليوم التالي وزيارة عيادة | 94% | claimant account (segment 8) |
| Police report reference | 2026/88/417 | 99% | claimant account (segment 10) |
| Policy number | POL-TR-55-0022 | 100% | policy record |
| Driving licence copy | (missing) | 0% | policy record |
| Repair assessment | استبدال المصد الخلفي وضبط باب صندوق الأمتعة | 100% | repair record (RPR-3328) |

---

## Post-Call Analysis

**Summary:** Arabic intake completed. Nine claimant facts extracted with source spans. Claims, policy, and repair records retrieved and matched on date, location, vehicle, and damage. No contradictions detected. Injury follow-up and one missing document routed to the adjuster queue.

**Next action:** An adjuster reviews the packet and contacts the claimant within one business day.

**Follow-up items for the adjuster:**
- Injury documentation from the clinic visit
- Driving licence copy for the policy file

**Decision boundary:** يجمع بريد الأدلة فقط. تبقى المسؤولية والتغطية وقيمة التسوية والدفع وإغلاق المطالبة مع مُسوّي المطالبات المؤهلين.