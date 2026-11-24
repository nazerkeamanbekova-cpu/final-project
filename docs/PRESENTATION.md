# Presentation guide (8–10 minutes, ≈1,250 words)

## Route through the site
| Time | Section | What to do on screen |
|---|---|---|
| 0:00–1:15 | Hero | Read headline, state the research question; let the animation loop once |
| 1:15–2:30 | 01 Problem | Click the three chart views (Index → Beisenov → share); stop on the "not every redirect is a failure" cards |
| 2:30–4:00 | 02 Follow a request | Slide transfers to 3, press Submit; switch to "With Qoldau AI" |
| 4:00–5:00 | 03 Evidence | Tab B (devices gap), then D (F1) — one sentence on limits |
| 5:00–6:15 | 04 Solution | Dashboard: sample 3 (flagged), correct it; point at "AI recommends. Humans decide." |
| 6:15–7:15 | 05 Risks | Open Language, Automation bias; tick safeguards |
| 7:15–8:15 | 06 Cost | Click Personnel row; note "planning assumption" |
| 8:15–9:30 | 07 Verdict | Six conditions, stopping rule, final quote |

## Script
**[Hero]** Imagine one citizen writing one request. In Kazakhstan that request enters eOtinish, and then a question starts: which of many institutions is responsible? My project, Qoldau AI, asks whether AI can help public institutions hear citizens faster without losing human accountability. More formally: what are the results of AI-assisted classification and routing in Kazakhstan, and which institutional, linguistic and ethical barriers could hinder it?

**[Problem]** eOtinish grew out of the "Listening State" idea. In 2025 it received more than five million applications, and over 380,000 employees across more than 26,000 organisations work on appeals. Here is the pressure point. According to the 2025 Openness Index, redirected requests rose 54.5%, from about 1.1 million to over 1.7 million. Beisenov's administrative statistics show the same direction: redirected requests were 18.1% of all requests in 2021 and 29.1% in the first ten months of 2025.

I want to be careful. A redirect is not automatically a mistake. Under Article 65 of the Administrative Procedure Code, a body without competence must transfer an appeal within three working days and inform the applicant. Sometimes another institution really has the authority. The public data cannot tell us which redirects were legitimate and which were avoidable. The one narrower indicator we have is that over 20,000 requests in the first half of 2025 were redirected outside the legal time limit. So the problem is not only volume. It is precision and speed.

**[Follow]** Take a fictional heating complaint. Each transfer can take up to three working days by law, the applicant is notified, and staff re-read and re-classify the file. With three transfers, up to nine working days can pass before substantive review begins. That is an upper bound, not an observed average. Qoldau AI proposes a different workflow: analyse the text, classify it, recommend a department, and then a human operator confirms or corrects before routing. This is a conceptual demonstration; it cannot remove legitimate transfers.

**[Evidence]** What do we actually know? First, routing workload grows with demand. Second, digital access is high, with 94.9% of households online, but only 53.8% have a computer, and rural homes lag urban homes by 13 points. That is context, not proof of exclusion. Third, Bağcılar in Istanbul and Singapore's OneService report positive results, but these are self-reported, and automated processing is not the same as accuracy. Fourth, Rakhimzhanov and colleagues tested classification on Kazakhstani municipal complaints: Macro F1 of 0.722 for text only and 0.781 for a hybrid model. Macro F1 averages precision and recall across categories, so small categories count equally. These results show feasibility. They do not predict our performance.

**[Solution]** Qoldau AI would be a module inside iKOMEK109, not another platform. Multilingual text processing, a classifier, a database of institutional responsibilities, a recommendation with a confidence level, and then the operator. The principle is: AI recommends, humans decide. Low-confidence, ambiguous or urgent cases are automatically flagged, and corrections are recorded with reasons. It would not reject appeals or decide eligibility.

**[Risks]** Risks come first from language. We have no public statistics on whether automation performs equally in Kazakh and Russian, which is why they must be evaluated separately. Dialects, spelling errors and mixed-language text were a major hurdle in Bağcılar. Automation bias is documented in other settings: Dutch police officers trusted AI advice that confirmed their own view. So human review cannot be a rubber stamp. Add privacy, local data storage and the AI Law's audit requirements. I call inequality risks hypotheses, not findings.

**[Cost]** The nine-month Astana pilot is estimated at about KZT 80.85 million: 51.98 for personnel, 6 for infrastructure, 4 for data preparation, 11.5 for integration, security and training, and 7.35 contingency. Annual maintenance is about 33.4 million. These are planning assumptions from public salary and hosting benchmarks, not quotations or an approved budget.

**[Verdict]** So should Kazakhstan adopt it? My answer: not as an autonomous system, and not to cut staff, but yes to a limited, independently evaluated pilot in iKOMEK109 under six conditions: lawful anonymised data; separate Kazakh and Russian evaluation; meaningful human oversight; local storage and legal compliance; transparent procurement; and public reporting of errors, delays and outcomes. If the pilot cannot beat existing operator decisions, expansion is not justified. The goal is not to automate government for its own sake. It is to make existing institutions more responsive and accountable to citizens. Thank you.

---

# 10 hard questions and defensible answers

**1. Why is AI necessary? Couldn't clearer rules fix this?**
It isn't necessarily necessary; the claim is conditional. Rules (a responsibility directory) are part of the design. The AI adds value where free-text, mixed-language requests don't map neatly to categories. The pilot compares against current operator decisions, and if no measurable improvement appears, expansion isn't justified.

**2. Why are existing government systems insufficient?**
I don't claim they are broken. eOtinish and iKOMEK109 solved collection and monitoring (and already use an AI knowledge base to help operators draft answers). What the sources show is rising redirect volume and a separate indicator of late redirects. Whether classification is the cause is unknown, which is why a pilot is proposed, not a rollout.

**3. Does redirection actually mean failure?**
No, and the paper says so. Art. 65 requires transfers when competence lies elsewhere. Public totals can't separate legitimate from avoidable redirects. The evaluation needs request-level data to measure *avoidable* transfers.

**4. How would classification accuracy be measured?**
Against a gold standard: anonymised historical requests labelled by experts, plus final departments after transfer history. Report accuracy and per-category precision/recall/Macro F1, separately by language, and compare AI vs operator vs the existing outcome. Also measure transfers per request, processing time, and operator override rates. Accuracy alone isn't enough: better classification doesn't automatically mean better outcomes.

**5. Why must Kazakh and Russian be evaluated separately?**
Because an overall average can hide a weaker language. No public statistics show equal performance, and Rakhimzhanov et al. caution against assuming transfer across languages. Dialect, spelling and code-switching add risk. Equity requires per-language reporting.

**6. Why does human oversight matter, and isn't it just a formality?**
It can become one: Selten et al. found officials trust AI that confirms their view. So the design shows confidence, allows override, records reasons, flags uncertain/urgent cases, audits independently, and the Ministry's guidelines keep officials responsible for final decisions.

**7. How was the budget calculated?**
Bottom-up: role × FTE × monthly rate × months (e.g., ML engineer 1 × 2.0 M × 6 = 12 M), plus infrastructure, data, integration/security/training, then +15% staff uplift and +10% contingency. Rates are from public salary and colocation benchmarks (Antal; Net Cell), not quotes. *Be ready to admit:* two layers of padding, the 15% label inconsistency, and a 0.02 M rounding difference (80.83 vs 80.85).

**8. Why is iKOMEK109 an appropriate pilot?**
It already handles over 2.2 M appeals a year in Astana, has analytics and an AI knowledge base, and prior research used its data. A pilot inside an existing system avoids creating a new complaint channel and enables comparison with current operator work. Limit: Astana isn't representative of rural akimats.

**9. What evidence is currently missing?**
Request-level data: anonymised texts, original/final classification, assigned departments, transfer histories, processing times, outcomes, per language. Also operator behaviour with recommendations, and citizens' experience. Without these, we can't say how many redirects are avoidable.

**10. What would make the project unsuccessful?**
No measurable improvement over operators; worse performance in one language; operators rubber-stamping; more transfers or delays; privacy or compliance failures; or use as a pretext to reduce staff. These are stated stopping conditions.

### Be ready for these traps
- "Bağcılar shows 99.99%": that's automated *processing*, not accuracy; project-reported.
- "Does 94.9% internet access mean no digital divide?" No: device and skills gaps; and household not individual data.
- "Is the 5 M a cumulative number?" No — 2025 (see QC list).
- "Does Qoldau AI save money?" No evidence yet; only the pilot can show it.

**11. Is Qoldau AI cheaper than what regions pay now?**
Not comparable and I don't claim that. A 2022 ZKO tender for the iKOMEK/109 help service was KZT 240 M over three years (about 80 M a year) for a call centre. My pilot (80.85 M, one-off) and upkeep (33.4 M/year) are roughly a third and 42% of those figures, but they cover a different function, a different region, and 2026 vs 2022 prices, and Qoldau would sit on top of the service. The point is scale: the pilot is modest relative to existing spending. Savings would have to be shown by fewer transfers and shorter processing times.
