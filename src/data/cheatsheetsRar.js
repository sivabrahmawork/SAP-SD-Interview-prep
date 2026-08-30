// cheatsheetsRar.js — RAR cheatsheets rewritten as HTML infographics.
// Matches the SD/FICO format: cs-bar / cs-flow / cs-node / cs-arrow /
// cs-section / cs-table / cs-trap / cs-tip.
// Replaces the plain-text RAR_CHEATSHEETS previously exported from sectionsRar.js.

const RAR_CHEATSHEETS = {

  rar_day1: `<div class="cs-bar">IFRS 15 — The Five-Step Model</div>
<div class="cs-flow"><span class="cs-node">1 CONTRACT</span><span class="cs-arrow">&#9658;</span><span class="cs-node">2 PERFORMANCE OBLIGATIONS</span><span class="cs-arrow">&#9658;</span><span class="cs-node green">3 TRANSACTION PRICE</span><span class="cs-arrow">&#9658;</span><span class="cs-node">4 ALLOCATE</span><span class="cs-arrow">&#9658;</span><span class="cs-node amber">5 RECOGNISE</span></div>
<div class="cs-section"><p><b>Step 1</b> tests approval, identifiable rights, payment terms, commercial substance and <b>collectibility</b>. <b>Step 2</b> splits the contract into distinct promises. <b>Step 3</b> sets the price and constrains variable consideration. <b>Step 4</b> allocates on relative SSP. <b>Step 5</b> recognises when control transfers.</p></div>
<table class="cs-table"><tr><th>Concept</th><th>What it actually means</th></tr><tr><td>Distinct</td><td>Customer can benefit alone AND the promise is separately identifiable in the contract</td></tr><tr><td>Constraint</td><td>Recognise only the amount highly probable not to reverse</td></tr><tr><td>Control transfer</td><td>Ability to direct use and obtain substantially all remaining benefits</td></tr></table>
<div class="cs-bar green">Worked Allocation</div>
<div class="cs-section"><p>Device SSP 10,000 + Support 4,000 + Data 3,000 = 17,000 total SSP. Contract price 10,000. Device gets 10/17 &times; 10,000 = <b>5,882</b>; Support 2,353; Data 1,765. <b>Invoiced amount never drives recognition</b> — SSP ratio does.</p></div>
<div class="cs-bar amber">Multi-GAAP</div>
<div class="cs-section"><p>RAR carries an <b>accounting principle</b> per ledger. IFRS and US-GAAP can hold different SSPs, different constraint thresholds and different deferral methods on the same contract. Divergent revenue across ledgers is by design, not an error.</p></div>
<div class="cs-trap"><h4>Interview Traps</h4><p>&bull; <b>"Assess customer credit rating" is not a step.</b> Collectibility sits inside Step 1 and constrains Step 3.</p><p>&bull; <b>Invoicing is not recognition.</b> The single most common conceptual failure.</p><p>&bull; <b>Cost-minus is not an SSP method.</b> Valid: adjusted market assessment, expected cost plus margin, residual (restricted).</p><p>&bull; <b>Constraint is forward-looking</b> — it stops further recognition, it does not automatically reverse prior revenue.</p></div>
<div class="cs-tip"><h4>30-Second Recall</h4><p>&bull; Contract &#8594; POs &#8594; Price &#8594; Allocate &#8594; Recognise.</p><p>&bull; Allocation is by relative SSP, always.</p><p>&bull; Variable consideration is constrained, and the constrained part is a refund liability.</p><p>&bull; One contract, many accounting principles.</p></div>`,

  rar_day2: `<div class="cs-bar">Revenue Accounting Items — The Inbound Pipeline</div>
<div class="cs-flow"><span class="cs-node">SD / EXTERNAL</span><span class="cs-arrow">&#9658;</span><span class="cs-node">RAW RAI</span><span class="cs-arrow">&#9658;</span><span class="cs-node green">PROCESSABLE RAI</span><span class="cs-arrow">&#9658;</span><span class="cs-node amber">PROCESSED &#8594; CONTRACT + POB</span></div>
<div class="cs-section"><p>RAR is a <b>sub-ledger</b>. Nothing enters it except through an RAI. Corrections also enter as RAIs — never by editing or deleting a contract directly.</p></div>
<table class="cs-table"><tr><th>RAI Class</th><th>Source</th><th>Effect</th></tr><tr><td>Order Item</td><td>VA01 sales order</td><td>Creates contract and performance obligations</td></tr><tr><td>Fulfilment</td><td>Delivery / goods issue / acceptance</td><td>Triggers revenue recognition for event-based POs</td></tr><tr><td>Invoice</td><td>VF01 billing</td><td>Drives billing-side entries and contract asset/liability movement</td></tr></table>
<div class="cs-bar green">Status Troubleshooting</div>
<div class="cs-section"><p><b>Stuck at raw:</b> mandatory field missing for the RAI class, or the class itself is misconfigured. <b>Stuck at processable:</b> BRF+ decision table returned no result, or the contract could not be determined. <b>Processed but no revenue:</b> the PO is event-based and no fulfilment RAI has arrived.</p></div>
<div class="cs-trap"><h4>Interview Traps</h4><p>&bull; <b>Account determination is irrelevant at the raw stage.</b> It only matters at the posting run.</p><p>&bull; <b>An open sales order is normal</b> — it does not block RAI processing or posting.</p><p>&bull; <b>Deleting an SD document does not delete the RAR contract.</b> Send a reversal RAI.</p></div>
<div class="cs-tip"><h4>30-Second Recall</h4><p>&bull; Three classes: order item, fulfilment, invoice.</p><p>&bull; Three statuses: raw &#8594; processable &#8594; processed.</p><p>&bull; FARR_RAI_MON is the first screen you open in any RAR incident.</p></div>`,

  rar_day3: `<div class="cs-bar">Revenue Contract Structure</div>
<div class="cs-flow"><span class="cs-node">REVENUE CONTRACT</span><span class="cs-arrow">&#9658;</span><span class="cs-node green">PERFORMANCE OBLIGATIONS</span><span class="cs-arrow">&#9658;</span><span class="cs-node amber">DEFERRAL ITEMS</span></div>
<div class="cs-section"><p>The RAR contract is an accounting construct, not the SD document. One SD order can produce one contract; several orders can be <b>combined</b> into one contract when the configured commercial-objective criteria are met.</p></div>
<table class="cs-table"><tr><th>Balance</th><th>Meaning</th><th>Direction</th></tr><tr><td>Contract Asset</td><td>Revenue recognised ahead of the right to bill</td><td>Unbilled receivable</td></tr><tr><td>Contract Liability</td><td>Invoiced or paid ahead of performance</td><td>Deferred revenue</td></tr><tr><td>Receivable</td><td>Unconditional right to payment</td><td>AR sub-ledger</td></tr></table>
<div class="cs-bar green">Netting Rule</div>
<div class="cs-section"><p>Individual POs may sit in opposite directions. IFRS 15 requires a <b>single net contract position</b> per contract for balance sheet presentation — asset and liability are netted at contract level, not shown gross.</p></div>
<div class="cs-trap"><h4>Interview Traps</h4><p>&bull; <b>Contract asset &#8800; receivable.</b> A receivable needs an unconditional right to payment; a contract asset does not have one yet.</p><p>&bull; <b>Contract combination needs more than a shared customer</b> — the criteria implement the IFRS 15 tests.</p><p>&bull; <b>Asset and liability on one contract is valid</b>, and must be netted.</p></div>
<div class="cs-tip"><h4>30-Second Recall</h4><p>&bull; Liability = they paid first. Asset = we performed first.</p><p>&bull; FARR_D_CONTRACT / FARR_D_POB are the two tables to know.</p><p>&bull; Net per contract, not per PO.</p></div>`,

  rar_day4: `<div class="cs-bar">Performance Obligations &amp; SSP Allocation</div>
<div class="cs-flow"><span class="cs-node">IDENTIFY POs</span><span class="cs-arrow">&#9658;</span><span class="cs-node">DETERMINE SSP</span><span class="cs-arrow">&#9658;</span><span class="cs-node green">RELATIVE SSP RATIO</span><span class="cs-arrow">&#9658;</span><span class="cs-node amber">ALLOCATED PRICE PER PO</span></div>
<div class="cs-section"><p>A PO is <b>distinct</b> only if the customer can benefit from it on its own <i>and</i> it is separately identifiable within the contract. A bundle that is heavily integrated may be one PO despite containing several deliverables.</p></div>
<table class="cs-table"><tr><th>SSP Method</th><th>When used</th></tr><tr><td>Observable price</td><td>The item is actually sold separately — preferred</td></tr><tr><td>Adjusted market assessment</td><td>Competitor pricing adjusted for entity-specific factors</td></tr><tr><td>Expected cost plus margin</td><td>Cost base plus an appropriate margin</td></tr><tr><td>Residual</td><td>Highly variable or uncertain pricing only — restricted use</td></tr></table>
<div class="cs-bar green">Discount Allocation</div>
<div class="cs-section"><p>A contract-level discount is allocated <b>proportionately across all POs</b> unless there is observable evidence the discount relates to specific POs only. Assigning the whole discount to one PO without evidence is a misstatement.</p></div>
<div class="cs-trap"><h4>Interview Traps</h4><p>&bull; <b>Residual approach is not a free choice.</b> It requires highly variable or uncertain standalone pricing.</p><p>&bull; <b>Cost-minus-margin does not exist</b> as an IFRS 15 method.</p><p>&bull; <b>Free-of-charge items are still POs</b> if distinct — they receive an SSP allocation.</p></div>
<div class="cs-tip"><h4>30-Second Recall</h4><p>&bull; Distinct = benefit alone + separately identifiable. Both tests.</p><p>&bull; Allocate on relative SSP, not on invoice value.</p><p>&bull; Discounts spread proportionately by default.</p></div>`,

  rar_day5: `<div class="cs-bar">Fulfilment Types Drive Timing</div>
<div class="cs-flow"><span class="cs-node">EVENT-BASED</span><span class="cs-arrow">&#9658;</span><span class="cs-node green">RECOGNISE AT FULFILMENT RAI</span></div>
<div class="cs-flow"><span class="cs-node amber">TIME-BASED</span><span class="cs-arrow">&#9658;</span><span class="cs-node">STRAIGHT-LINE OVER PO DURATION</span></div>
<div class="cs-section"><p>Allocation decides <b>how much</b>. Fulfilment type decides <b>when</b>. The two are configured independently and are frequently confused in interviews.</p></div>
<table class="cs-table"><tr><th>Type</th><th>Typical PO</th><th>Trigger</th></tr><tr><td>Event-based</td><td>Hardware, licence, one-off delivery</td><td>Goods issue / acceptance RAI</td></tr><tr><td>Time-based</td><td>Subscription, support, hosting</td><td>Period elapse, no event needed</td></tr><tr><td>Percentage of completion</td><td>Long-term services / projects</td><td>Measured cost or effort progress</td></tr></table>
<div class="cs-bar green">Cost Recognition</div>
<div class="cs-section"><p>Costs follow the linked PO's revenue pattern so that <b>period margin is meaningful</b>. A cost posted at goods issue for a time-based PO would otherwise distort month-one margin badly.</p></div>
<div class="cs-trap"><h4>Interview Traps</h4><p>&bull; <b>"Revenue missing on one PO"</b> is usually an event-based PO with no fulfilment RAI — not a system error.</p><p>&bull; <b>Deferral method and fulfilment type are separate settings.</b></p><p>&bull; <b>Cost is not recognised at FI posting date</b> — it is matched to revenue.</p></div>
<div class="cs-tip"><h4>30-Second Recall</h4><p>&bull; Event = wait for the trigger. Time = spread it. POC = measure progress.</p><p>&bull; Cost matches revenue, always.</p></div>`,

  rar_day6: `<div class="cs-bar">Contract Modifications — Two Treatments</div>
<div class="cs-flow"><span class="cs-node green">PROSPECTIVE</span><span class="cs-arrow">&#9658;</span><span class="cs-node">REALLOCATE REMAINING PRICE OVER REMAINING POs</span></div>
<div class="cs-flow"><span class="cs-node amber">RETROSPECTIVE</span><span class="cs-arrow">&#9658;</span><span class="cs-node red">CUMULATIVE CATCH-UP IN THE PERIOD OF CHANGE</span></div>
<div class="cs-section"><p>A modification that adds <b>distinct</b> goods or services at their standalone selling price is treated as a <b>separate contract</b> — no reallocation of the original at all. Only when it is not distinct or not at SSP does prospective or retrospective treatment apply.</p></div>
<table class="cs-table"><tr><th>Situation</th><th>Treatment</th></tr><tr><td>Added distinct goods at SSP</td><td>Separate contract</td></tr><tr><td>Added distinct goods, not at SSP</td><td>Prospective — terminate old, create new</td></tr><tr><td>Remaining goods not distinct</td><td>Retrospective — cumulative catch-up</td></tr><tr><td>Price change (credit memo, rebate)</td><td>Change in transaction price &#8594; reallocate</td></tr></table>
<div class="cs-bar amber">Why the Big Swing</div>
<div class="cs-section"><p>A retrospective adjustment restates cumulative revenue to what it would have been under the revised allocation. The whole correction lands in <b>one period</b>. That one-time swing is the expected behaviour, not a defect.</p></div>
<div class="cs-trap"><h4>Interview Traps</h4><p>&bull; <b>Not every change is a modification.</b> Distinct goods at SSP = separate contract.</p><p>&bull; <b>A credit memo is a transaction price change</b>, triggering reallocation and a negative adjustment.</p><p>&bull; <b>Prospective produces no catch-up.</b> If you see one, the treatment was retrospective.</p></div>
<div class="cs-tip"><h4>30-Second Recall</h4><p>&bull; Distinct + at SSP &#8594; separate contract.</p><p>&bull; Prospective = forward only. Retrospective = catch-up now.</p></div>`,

  rar_day7: `<div class="cs-bar">The Three-Step Posting Run</div>
<div class="cs-flow"><span class="cs-node">1 CALCULATE</span><span class="cs-arrow">&#9658;</span><span class="cs-node green">2 TRANSFER</span><span class="cs-arrow">&#9658;</span><span class="cs-node amber">3 POST &#8594; FI DOCUMENT</span></div>
<div class="cs-section"><p>The steps are deliberately separate so results can be reviewed and reconciled before anything hits the General Ledger. Output lands in <b>ACDOCA</b> via standard FI documents (BKPF/BSEG).</p></div>
<table class="cs-table"><tr><th>Symptom</th><th>Check</th></tr><tr><td>No FI document created</td><td>Transfer step incomplete, RAR period closed, or account determination gap</td></tr><tr><td>Sub-ledger vs G/L difference</td><td>Manual journal posted directly to a RAR-owned deferral/revenue account</td></tr><tr><td>Period close blocked</td><td>Unprocessed RAIs still in the monitor</td></tr></table>
<div class="cs-bar green">Month-End Sequence</div>
<div class="cs-section"><p>Clear the RAI monitor &#8594; run contract consistency check &#8594; calculate liabilities &#8594; three-step posting run &#8594; reconcile sub-ledger to G/L &#8594; close the RAR period. Order matters; skipping the RAI clear-down misstates the period.</p></div>
<div class="cs-trap"><h4>Interview Traps</h4><p>&bull; <b>Manual postings to RAR-managed accounts are the #1 reconciliation break.</b> Lock them.</p><p>&bull; <b>RAR period close is separate from the FI period close.</b> Both must be managed.</p><p>&bull; <b>Posting run failure is rarely a "revenue" problem</b> — it is usually configuration or period status.</p></div>
<div class="cs-tip"><h4>30-Second Recall</h4><p>&bull; Calculate, transfer, post. Three steps, one FI document.</p><p>&bull; RAR is a sub-ledger — it must reconcile to the G/L.</p><p>&bull; Clean RAI monitor is a precondition for close.</p></div>`,

  rar_tab10: `<div class="cs-bar">RAR Transaction Codes</div>
<table class="cs-table"><tr><th>T-Code</th><th>What it does</th><th>When you use it</th></tr>
<tr><td>FARR_IMG</td><td>RAR Implementation Guide — the configuration entry point</td><td>All RAR setup: RAI classes, accounting principles, account determination</td></tr>
<tr><td>FARR_RAI_MON</td><td>Revenue Accounting Item monitor</td><td>First screen in any RAR incident — shows raw / processable / processed status</td></tr>
<tr><td>FARR_REV_TRANSFER</td><td>Transfer revenue to the posting layer</td><td>Step 2 of the posting run, after calculation</td></tr>
<tr><td>FARR_LIABILITY_CAL</td><td>Contract asset / contract liability calculation</td><td>Period-end, before the posting run</td></tr>
<tr><td>FARR_REV_POSTING</td><td>Post revenue — generates the FI document</td><td>Step 3 of the posting run</td></tr>
<tr><td>FS00</td><td>G/L account master maintenance</td><td>Creating and checking the revenue, deferred revenue and contract asset/liability accounts RAR posts to</td></tr>
<tr><td>SM36</td><td>Define a background job</td><td>Scheduling RAI processing and posting runs — RAR is batch-driven in production</td></tr>
<tr><td>SM37</td><td>Monitor background jobs</td><td>Checking whether last night's RAI transfer or posting run actually completed</td></tr>
<tr><td>SE93</td><td>Transaction code maintenance / lookup</td><td>Finding the program behind an unfamiliar FARR_* transaction</td></tr>
<tr><td>BRF+ (BRFPLUS)</td><td>Business Rule Framework workbench</td><td>PO derivation, SSP determination and deferral method decision tables</td></tr>
</table>
<div class="cs-bar green">RAR Tables</div>
<table class="cs-table"><tr><th>Table</th><th>Content</th><th>Why it matters</th></tr>
<tr><td>FARR_D_POB</td><td>Performance obligations</td><td>Allocated amount, fulfilment type and recognition status per PO — the table that explains why revenue did or did not post</td></tr>
<tr><td>FARR_D_CONTRACT</td><td>Revenue accounting contract header</td><td>Links the RAR contract back to the source SD document; carries accounting principle</td></tr>
<tr><td>FARR_D_POSTING</td><td>Posting run results</td><td>What the run actually generated — the bridge between sub-ledger and G/L</td></tr>
<tr><td>ACDOCA</td><td>Universal Journal line items</td><td>Where posted revenue finally lands. Reconciling FARR_D_POSTING to ACDOCA is the standard month-end check</td></tr>
</table>
<div class="cs-bar amber">Batch Reality</div>
<div class="cs-section"><p>In a live system RAI processing and the posting run are <b>scheduled jobs</b>, not manual transactions. That is why <b>SM36/SM37</b> sit in this list alongside the FARR_* codes — "revenue is missing" is very often "the job failed last night", not a configuration defect.</p></div>
<div class="cs-trap"><h4>Interview Traps</h4><p>&bull; <b>Naming tables separates real experience from course knowledge.</b> FARR_D_POB and FARR_D_CONTRACT are the two you must know cold.</p><p>&bull; <b>FARR_D_* is the sub-ledger; ACDOCA is the ledger.</b> Reconciliation runs between them.</p><p>&bull; <b>BRF+ is not a RAR transaction</b> — it is a generic SAP rule engine that RAR happens to call. Interviewers probe whether you know the difference.</p><p>&bull; <b>Check SM37 before blaming configuration.</b> The most common real-world RAR "bug".</p></div>
<div class="cs-tip"><h4>30-Second Recall</h4><p>&bull; FARR_IMG configures, FARR_RAI_MON diagnoses, TRANSFER → LIABILITY_CAL → REV_POSTING executes.</p><p>&bull; FARR_D_CONTRACT → FARR_D_POB → FARR_D_POSTING → ACDOCA is the data chain.</p><p>&bull; SM36 schedules it, SM37 tells you if it ran.</p></div>`,

  rar_tab11: `<div class="cs-bar">BRF+ — The Rule Engine Behind RAR</div>
<div class="cs-flow"><span class="cs-node">RAI ATTRIBUTES</span><span class="cs-arrow">&#9658;</span><span class="cs-node green">BRF+ DECISION TABLE</span><span class="cs-arrow">&#9658;</span><span class="cs-node amber">PO TYPE / SSP / DEFERRAL METHOD</span></div>
<div class="cs-section"><p>BRF+ turns raw operational data into revenue accounting structure. It decides <b>which PO type</b> to create, <b>which SSP</b> to apply, and <b>which deferral method</b> governs timing. A gap in the decision table stops processing rather than silently defaulting.</p></div>
<table class="cs-table"><tr><th>Object</th><th>Role</th></tr><tr><td>Function</td><td>The callable rule entry point RAR invokes</td></tr><tr><td>Decision table</td><td>Condition columns &#8594; result columns</td></tr><tr><td>Ruleset</td><td>Groups rules under a function</td></tr><tr><td>Application</td><td>Container for the whole rule model</td></tr></table>
<div class="cs-bar green">Account Determination</div>
<div class="cs-section"><p>Separate from BRF+. Maps revenue, deferred revenue, contract asset, contract liability and adjustment accounts per accounting principle and company code. A gap here surfaces only at <b>posting</b>, never at RAI processing.</p></div>
<div class="cs-trap"><h4>Interview Traps</h4><p>&bull; <b>BRF+ gap fails processing; account determination gap fails posting.</b> Different symptoms, different stage.</p><p>&bull; <b>Activate after change.</b> An edited but unactivated BRF+ object behaves as the old version.</p><p>&bull; <b>Account determination is per accounting principle</b> — multi-GAAP needs multiple sets.</p></div>
<div class="cs-tip"><h4>30-Second Recall</h4><p>&bull; BRF+ = structure. Account determination = posting.</p><p>&bull; No decision table hit &#8594; RAI stalls at processable.</p></div>`,

  rar_tab12: `<div class="cs-bar">Event-Based Revenue Recognition (EBRR) vs Classic RAR</div>
<div class="cs-flow"><span class="cs-node">CLASSIC RAR</span><span class="cs-arrow">&#9658;</span><span class="cs-node green">PERIODIC POSTING RUN</span></div>
<div class="cs-flow"><span class="cs-node amber">EBRR</span><span class="cs-arrow">&#9658;</span><span class="cs-node red">REAL-TIME AT THE TRIGGERING EVENT</span></div>
<div class="cs-section"><p><b>EBRR</b> recognises revenue and cost as the event posts, removing much of the period-end run. It is the S/4 direction for service and project scenarios; classic RAR remains the answer for complex multi-element IFRS 15 contracts.</p></div>
<table class="cs-table"><tr><th>Business Model</th><th>Typical Pattern</th></tr><tr><td>Product sale</td><td>Event-based at goods issue</td></tr><tr><td>Subscription / SaaS</td><td>Time-based straight-line</td></tr><tr><td>Professional services</td><td>Percentage of completion or EBRR on time confirmation</td></tr><tr><td>Bundle (device + service)</td><td>Split POs, mixed event and time-based</td></tr><tr><td>Project (DIP)</td><td>Dynamic Item Processor builds billable items from actual costs</td></tr></table>
<div class="cs-bar green">DIP in One Line</div>
<div class="cs-section"><p><b>Dynamic Item Processor</b> converts posted actual costs and effort into billable resource-related items. It drives <i>billing</i>; RAR still decides <i>recognition</i>. The two are frequently conflated.</p></div>
<div class="cs-trap"><h4>Interview Traps</h4><p>&bull; <b>EBRR does not replace RAR.</b> Complex IFRS 15 allocation still needs RAR.</p><p>&bull; <b>DIP is a billing mechanism, not a recognition mechanism.</b></p><p>&bull; <b>"Real-time" still requires period-end reconciliation</b> — it reduces the run, it does not remove the close.</p></div>
<div class="cs-tip"><h4>30-Second Recall</h4><p>&bull; EBRR = recognise at the event. RAR = allocate then run.</p><p>&bull; Match the pattern to the business model, not to a favourite tool.</p></div>`,

  rar_tab13: `<div class="cs-bar">Cost Recognition Follows Revenue</div>
<div class="cs-flow"><span class="cs-node">COST INCURRED</span><span class="cs-arrow">&#9658;</span><span class="cs-node green">LINKED TO PO</span><span class="cs-arrow">&#9658;</span><span class="cs-node amber">RECOGNISED ON THE PO'S REVENUE PATTERN</span></div>
<div class="cs-section"><p>Recognising cost at the FI posting date while spreading revenue over 36 months destroys period margin. RAR defers cost alongside its PO so that <b>margin is meaningful in every period</b>.</p></div>
<table class="cs-table"><tr><th>Cost Category</th><th>Treatment</th></tr><tr><td>Cost to fulfil</td><td>Capitalised and amortised over the PO if it meets the criteria</td></tr><tr><td>Cost to obtain (e.g. sales commission)</td><td>Capitalised if incremental and recoverable; practical expedient allows expensing when the amortisation period is one year or less</td></tr><tr><td>Cost of goods sold</td><td>Matched to the related event-based PO</td></tr></table>
<div class="cs-bar green">Intercompany Revenue</div>
<div class="cs-section"><p>Each legal entity runs its own revenue contract under its own accounting principle. Group reporting then <b>eliminates the intercompany portion</b> via trading partner. RAR does not perform the elimination — Group Reporting does.</p></div>
<div class="cs-trap"><h4>Interview Traps</h4><p>&bull; <b>Sales commissions are often capitalised, not expensed.</b> Know the incremental-and-recoverable test and the one-year expedient.</p><p>&bull; <b>RAR does not eliminate intercompany revenue.</b> Consolidation does.</p><p>&bull; <b>Transfer pricing differences between entities are legitimate</b> — separate costing views and principles.</p></div>
<div class="cs-tip"><h4>30-Second Recall</h4><p>&bull; Cost to fulfil and cost to obtain are both potentially capitalised.</p><p>&bull; Cost timing mirrors revenue timing, never the posting date.</p><p>&bull; Elimination is a Group Reporting job.</p></div>`,

};

export default RAR_CHEATSHEETS;
export { RAR_CHEATSHEETS };
