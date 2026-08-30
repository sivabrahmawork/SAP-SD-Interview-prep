// SAP RAR Question Bank - Days 1-7 Rotation
// ~300 Questions: junior (Level 1-2) + senior (Level 3)
// Scenario & troubleshooting focused

const QUESTION_BANK_RAR = {
  rar_day1: {
    junior: [
      { q: 'IFRS 15 Step 3 (Determine Transaction Price) focuses on?', opts: ['Contract amount', 'Collectibility assessment + variable considerations', 'Customer credit rating only', 'Invoice date'], ans: 1, type: 'concept' },
      { q: 'Constraint Assessment means?', opts: ['Customer contract signed', 'Probable collectibility confirmed', 'All POs identified', 'Invoice issued'], ans: 1, type: 'concept' },
      { q: 'Multi-GAAP reporting difference: Subscription $1200 with 30-day return right. IFRS: defer 5% return. US-GAAP: may defer 10%. Why?', opts: ['GAAP stricter', 'Different return probability models', 'No difference', 'IFRS more conservative'], ans: 1, type: 'concept' },
      { q: 'Performance Obligation definition?', opts: ['Customer account', 'Distinct good or service promised', 'Sales order line item', 'Invoice'], ans: 1, type: 'concept' },
      { q: 'SSP estimation method NOT listed in IFRS 15?', opts: ['Observed price', 'Adjusted market approach', 'Cost-minus approach', 'Cost-plus approach'], ans: 2, type: 'concept' },
      { q: 'RAI (Revenue Accounting Item) comes from which SD module process?', opts: ['VA01 Sales Order', 'VF01 Invoice', 'ARDC Interface', 'VL01 Delivery'], ans: 2, type: 'concept' },
      { q: 'Contract liability GL means?', opts: ['Customer owes us', 'We owe customer (deferred revenue)', 'Advance payment received', 'Contract signed'], ans: 1, type: 'concept' },
      { q: 'Which RAR table stores actual revenue posting results?', opts: ['ARAR_C', 'ARAR_RAI', 'ARAR_REV', 'ARAR_POB'], ans: 2, type: 'concept' },
      { q: 'Revenue Recognition problem RAR solves: SD invoices (billed) ≠ IFRS 15 revenue. Example?', opts: ['Subscription billed upfront, recognized monthly', 'Product billed, delivery later', 'Project revenue spreads per completion %', 'All of above'], ans: 3, type: 'scenario' },
      { q: 'Bundle scenario: Device $10k SSP + Support $4k SSP + Data $3k SSP. Customer pays $10k total. Device allocated revenue?', opts: ['$5.88k', '$6.67k', '$5k', '$10k'], ans: 0, type: 'scenario' },
      { q: 'Distinctness test: Can customer benefit from device alone?', opts: ['No; always bundled', 'Yes; separately beneficial', 'Only if small customer', 'Depends on contract'], ans: 1, type: 'concept' },
      { q: 'Multi-GAAP challenge: revenue recognized IFRS 15 but not US-GAAP. System support?', opts: ['Impossible', 'RAR tracks both methods separately', 'Use only IFRS', 'Post manual adjustment'], ans: 1, type: 'troubleshooting' },
      { q: 'Constraint Assessment fails (collectible uncertain). Company recognizes 100% revenue anyway. Audit finding?', opts: ['Error: violates constraint', 'OK: no accounting impact', 'Depends on customer credit', 'Depends on contract language'], ans: 0, type: 'scenario' }
    ],
    senior: [
      { q: 'Multi-GAAP system posts revenue to GL account 4100000 (IFRS) and 4110000 (US-GAAP) simultaneously. GL reconciliation shows $2M difference. Root cause?', opts: ['System error', 'Variable consideration % differs by GAAP', 'Timing (IFRS defers, US-GAAP recognizes)', 'All of above possible'], ans: 3, type: 'scenario' },
      { q: 'Contract bundled: Product $10k SSP + Support $4k SSP + Data $3k SSP. Customer pays $10k total. Allocation?', opts: ['Product $5k, Support $3k, Data $2k', 'Product $6.67k, Support $2.22k, Data $1.11k', 'Negotiate per PO', 'Product gets full $10k'], ans: 1, type: 'scenario' },
      { q: 'Fixed-price project: Estimated cost $400k, revenue $500k, margin $100k. Month 1: actual cost $150k (vs $100k estimate), margin now $350k (vs $400k estimated remaining). BRF+ should?', opts: ['Ignore; recognize full $500k', 'Flag overrun risk; monitor margin real-time', 'Reverse $50k revenue', 'Wait until project complete'], ans: 1, type: 'troubleshooting' },
      { q: 'Intercompany transaction: Seller posts GI (revenue $100k) day 1; Buyer posts GR (inventory received) day 5. GL reconciliation day 1?', opts: ['Balanced', 'Seller A/R $100k unmatched', 'No issue until consolidation', 'Post reconciliation entry immediately'], ans: 1, type: 'troubleshooting' },
      { q: 'Contract combining triggers GL consolidation rule. Two contracts: revenue $300k (allocated 60/40) + $200k (allocated 50/50). Combined revenue GL posting?', opts: ['$300k only', '$500k with new SSP allocation', '$300k + $200k separate postings', 'Depends on combining config'], ans: 1, type: 'scenario' }
    ]
  },

  rar_day2: {
    junior: [
      { q: 'RAI status sequence is?', opts: ['Processed → Processable → Raw', 'Raw → Processable → Processed', 'Processable → Raw → Processed', 'Raw → Processed → Deleted'], ans: 1, type: 'concept' },
      { q: 'ARDC interface triggers when?', opts: ['Sales order created (VA01)', 'Invoice posted (VF01)', 'Delivery created (VL01)', 'Goods Issue (VL02N)'], ans: 1, type: 'concept' },
      { q: 'RAI class configuration maps which field to RAI?', opts: ['Payment terms', 'Invoice number & amount', 'Delivery address', 'Material serial number'], ans: 1, type: 'concept' },
      { q: 'RAI to Sender Reconciliation checks what?', opts: ['Customer credit limits', 'Total RAI count = total invoice count', 'Material availability', 'Shipping addresses'], ans: 1, type: 'concept' },
      { q: 'Raw RAI data can be edited when?', opts: ['Never', 'Before marking Processable', 'After Processable only', 'Only by admin'], ans: 1, type: 'concept' },
      { q: 'BRF+ function during RAI inbound determines?', opts: ['Customer credit check', 'Planned invoice quantity & schedule', 'Warehouse location', 'Tax jurisdiction'], ans: 1, type: 'concept' },
      { q: 'SE16N query for RAI status uses which table?', opts: ['ARAR_C', 'ARAR_RAI', 'ARAR_REV', 'ACDOCA'], ans: 1, type: 'concept' },
      { q: 'RAI Class assignment to Order Type controls?', opts: ['Price calculation', 'Revenue handling by business model', 'Inventory location', 'Tax code'], ans: 1, type: 'concept' },
      { q: 'RAI inbound error: 1000 invoices posted; ARDC created 999 RAIs. Troubleshooting approach?', opts: ['Repost invoice', 'Check ARDC logs for error', 'Manually create RAI', 'All of above in sequence'], ans: 2, type: 'troubleshooting' },
      { q: 'RAI stuck in Raw status for 3 days. No error message. Most likely cause?', opts: ['BRF+ processing failed silently', 'Manual block by user', 'ARDC not configured for this order type', 'Processable status auto-triggered but UI lag'], ans: 2, type: 'troubleshooting' },
      { q: 'BRF+ quantity determination returns 0 for valid invoice. Revenue team cannot transfer RAI. Root cause?', opts: ['Material master incomplete', 'BRF+ rule formula error', 'Customer blocked', 'Order type configuration'], ans: 1, type: 'troubleshooting' },
      { q: 'Intercompany invoice (seller → buyer entity) creates RAI only on seller side. Expected?', opts: ['Error: buyer should also have RAI', 'Correct: only seller recognizes revenue', 'Both should have RAIs', 'Depends on configuration'], ans: 1, type: 'scenario' },
      { q: 'RAI processing batch runs nightly 22:00. Month-end close 18:00. Expected RAI status?', opts: ['Processed', 'Processable', 'Raw', 'Depends on invoice time'], ans: 1, type: 'troubleshooting' }
    ],
    senior: [
      { q: 'ARDC batch error recovery: 50 RAIs failed validation. Manual fix & re-run?', opts: ['Repost source invoice VF01', 'Fix data → re-run ARDC batch → verify reconciliation', 'Manual RAI entry per row', 'Requires SAP basis team'], ans: 1, type: 'troubleshooting' },
      { q: 'Contract combining logic: 50 subscriptions from same customer processed simultaneously. Combining rule evaluates?', opts: ['Contract count only', 'Customer ID + period overlap + revenue adjacency', 'Manual approval per rule', 'All automatic or blocked'], ans: 1, type: 'scenario' },
      { q: 'DIP (Dynamic Item Processor) integration: costs aggregated to $65k, project manager reviews, decides to bill only $60k. GL impact?', opts: ['Post $65k revenue, $5k deferred', 'Post $60k revenue only', 'Post $60k revenue, $5k cost reserve', 'Both B & C'], ans: 3, type: 'scenario' }
    ]
  },

  rar_day3: {
    junior: [
      { q: 'Contract creation automatic path comes from?', opts: ['Manual FARA_C entry', 'Processed RAI transferred by BRF+', 'Sales order VA01', 'Invoice VF01'], ans: 1, type: 'concept' },
      { q: 'Contract combining benefits when?', opts: ['Multiple customers', 'Same customer, related contracts', 'Different materials only', 'Large contracts only'], ans: 1, type: 'concept' },
      { q: 'Contract status Draft means?', opts: ['Approved & posting revenue', 'Editable; no revenue recognition', 'Closed; no changes', 'Pending approval only'], ans: 1, type: 'concept' },
      { q: 'Contract hierarchy (parent-child) used for?', opts: ['Organizing master data only', 'Consolidated reporting & hierarchical revenue', 'Customer classification', 'Material grouping'], ans: 1, type: 'concept' },
      { q: 'BRF+ contract determination rule decides?', opts: ['Customer credit limit', 'Which RAI goes to which contract; combining logic; approval gates', 'Invoice date', 'Material type'], ans: 1, type: 'concept' },
      { q: 'Contract amendment (scope reduction, price cut) is?', opts: ['Automatic posting', 'Manual change record requiring approval', 'Requires new contract', 'Not allowed in RAR'], ans: 1, type: 'concept' },
      { q: 'Contract validation checks what?', opts: ['Customer exists & valid', 'Amount > 0, PO defined, dates valid, SSP = 100%', 'Tax compliance', 'All of above'], ans: 1, type: 'concept' },
      { q: 'Contract linking to SD order via?', opts: ['Hard reference', 'Document flow (VA01 → VF01 → contract)', 'Customer number match only', 'GL account mapping'], ans: 1, type: 'concept' },
      { q: 'Scenario: Two contracts combined (device + support). Allocation changed. GL reconciliation shows variance?', opts: ['Expected: new allocation differs', 'Error: must match prior', 'Consolidation entry corrects', 'Revenue must be reversed'], ans: 0, type: 'scenario' },
      { q: 'Customer has 12 monthly billing contracts (SaaS). Reported revenue differs: parent shows $12k, sum of children shows $11.8k. Root cause?', opts: ['Math error', 'Child contract GLs posted, parent GL not yet posted', 'Contract combining delta', 'Rounding in SSP allocation'], ans: 2, type: 'troubleshooting' }
    ],
    senior: [
      { q: 'Contract amendment: scope cut $100k revenue, cost estimate increases $50k. GL impact?', opts: ['Reverse $100k revenue only', 'Reverse $100k, accrue $50k cost loss', 'Reverse $100k, reserve $50k margin risk', 'Wait for actual cost'], ans: 1, type: 'scenario' },
      { q: 'BRF+ contract determination: "IF customer segment = Enterprise AND contract amount > $1M THEN route to CEO approval." Approval blocks revenue posting. Timing risk?', opts: ['None; prevents errors', 'Month-end close delays if approval pending', 'Revenue must be recognized by period-end', 'Both B & C'], ans: 2, type: 'troubleshooting' },
      { q: 'Contract hierarchy amendment: parent $12k annual; 12 children $1k each. One child amended to $0.5k. Reallocation?', opts: ['Parent unchanged', 'Parent recalculates to $11.5k', 'Consolidation GL entry', 'Depends on revenue model'], ans: 2, type: 'scenario' }
    ]
  },

  rar_day4: {
    junior: [
      { q: 'Bundle scenario: Device $10k SSP + Support $4k + Data $3k. Customer pays $10k total. Device allocated revenue?', opts: ['$5.88k', '$6.67k', '$5k', '$10k'], ans: 0, type: 'scenario' },
      { q: 'PO is distinct if?', opts: ['High price only', 'Customer can benefit alone + promise separately identifiable', 'Long contract term', 'Enterprise customer'], ans: 1, type: 'concept' },
      { q: 'SSP estimation method: competitor sells device for $12k; company estimates $10k SSP. Best approach?', opts: ['Use $12k', 'Use $10k; cost-plus justified', 'Use $11k average', 'Adjusted market approach: analyze $12k, justify variance'], ans: 2, type: 'scenario' },
      { q: 'Refund Liability GL (BS) represents?', opts: ['Money owed to vendor', 'Estimate of future returns', 'Invoice unpaid', 'Warehouse inventory'], ans: 1, type: 'concept' },
      { q: 'Rights of return (30-day guarantee) treated in SSP as?', opts: ['Ignore; recognize full revenue', 'Variable consideration; reduce revenue 5% estimated return', 'Separate PO for refund obligation', 'Both B & C'], ans: 3, type: 'scenario' },
      { q: 'PO hierarchy (parent subscription with child overages) enables?', opts: ['Duplicate data only', 'Fulfillment cascade + consolidated revenue reporting', 'Tax calculation only', 'Customer blocking only'], ans: 1, type: 'concept' },
      { q: 'SSP tolerance configured 10%. Estimated $5k SSP vs. observed $6k. Action?', opts: ['Approve', 'Escalate to pricing manager for $1k (20%) variance', 'Reverse to $5k', 'Split $5.5k'], ans: 1, type: 'troubleshooting' },
      { q: 'Negative PO (refund obligation) GL posting?', opts: ['Credit revenue only', 'Debit refund liability, credit contra-revenue GL', 'No GL impact until return occurs', 'Reverses weekly'], ans: 1, type: 'concept' },
      { q: 'Scenario: Rights of return estimated 5%, actual returns 2%. Month-end GL adjustment?', opts: ['Reverse excess refund liability', 'Keep accrual; adjust cost GL', 'Both A & B', 'Ignore variance'], ans: 2, type: 'troubleshooting' },
      { q: 'Manual PO creation (BRF+ auto-create fails). Required fields?', opts: ['Contract ID, description, qty, price', 'Contract ID, qty, fulfillment type, deferral method', 'Both A & B', 'Customer & material only'], ans: 2, type: 'concept' }
    ],
    senior: [
      { q: 'SSP conflict: Device $10k (observed) vs. Support $8k estimated (cost-plus), but competitor $6k. Override decision?', opts: ['Yes; market check', 'No; cost-plus justified', 'Use $7k compromise', 'Escalate & document'], ans: 3, type: 'scenario' },
      { q: 'Allocated cost: Device revenue $5.88k, estimated cost $4k. Mid-project actual $4.5k (12.5% overrun). Margin impact?', opts: ['No; separate GL', 'Yes; margin variance flags escalation', 'Only if >20%', 'Only for >$10k contracts'], ans: 1, type: 'troubleshooting' },
      { q: 'Intercompany bundle: Seller allocates SSP to buyer. Buyer re-allocates to external customer. Double-counting risk?', opts: ['None', 'Consolidation eliminates', 'Risk of overstatement', 'Requires transfer price validation'], ans: 3, type: 'troubleshooting' }
    ]
  },

  rar_day5: {
    junior: [
      { q: 'Fulfillment event Goods Issue (GI) recognizes revenue when?', opts: ['Sales order created', 'Invoice issued', 'Goods leave warehouse', 'Goods received by customer'], ans: 2, type: 'concept' },
      { q: 'SaaS subscription $1,200/12 months fulfillment type?', opts: ['Goods Issue', 'Service Acceptance', 'Time-based straight-line', 'Customer Invoice'], ans: 2, type: 'concept' },
      { q: 'Fixed-price project revenue $500k; cost estimate $400k; month 1 actuals = $100k (25% spent). Revenue recognized?', opts: ['$0', '$125k (25% of $500k)', '$500k (full)', 'Depends on milestone'], ans: 1, type: 'scenario' },
      { q: 'Contract liability GL means?', opts: ['We owe customer', 'Customer paid upfront; revenue deferred', 'Invoice unpaid', 'Advance deposit'], ans: 1, type: 'concept' },
      { q: 'Billed Oct 1 for Oct-Dec subscription ($300 total). Oct GL revenue?', opts: ['$300 revenue, $0 liability', '$100 revenue, $200 liability', '$200 revenue, $100 liability', '$0 revenue, $300 liability'], ans: 1, type: 'scenario' },
      { q: 'Drop shipping means?', opts: ['Customer cancels', 'Vendor ships direct to end-customer', 'Delayed shipping', 'Refund issued'], ans: 1, type: 'concept' },
      { q: 'Goods in Transit: seller GI day 1, buyer GR day 5. GL reconciliation day 1?', opts: ['Balanced', 'Seller A/R unmatched', 'Buyer inventory on BS', 'No GL entry until day 5'], ans: 1, type: 'troubleshooting' },
      { q: 'Variable consideration (10% discount if 100+ units). GL treatment?', opts: ['Recognize full upfront', 'Defer 10% until 100 units', 'No GL until earned', 'Both B & C'], ans: 2, type: 'scenario' },
      { q: 'Drop shipping scenario: Seller $100k GI, buyer receives day 2. Seller GL day 1?', opts: ['No GL yet', '$100k revenue posted', '$100k A/R, $100k revenue', 'Unbalanced until buyer GR'], ans: 2, type: 'scenario' },
      { q: 'Cost overrun project: estimated $400k, month 1 actual $150k (vs $100k est). Revised estimate $450k. Revenue impact?', opts: ['Reduce to 150/450 = 33%', 'Keep 25%', 'Reverse prior', 'All of above'], ans: 3, type: 'troubleshooting' }
    ],
    senior: [
      { q: 'FOB Shipping Point intercompany: Seller GI $100k month 1; buyer GR month 2. Consolidation approach?', opts: ['Eliminate seller revenue', 'Consolidation GL entry reverses', 'No elimination', 'Depends on consolidation'], ans: 2, type: 'scenario' },
      { q: 'Contract deferral time-based 36 months. Cost overrun month 6 → accrue $50k loss. GL?', opts: ['Loss GL only', 'Reverse deferred revenue', 'Keep deferral; post loss', 'Accrue to WIP only'], ans: 1, type: 'troubleshooting' }
    ]
  },

  rar_day6: {
    junior: [
      { q: 'Contract scope reduction (remove support PO). Months 1-3 posted. GL action?', opts: ['Ignore', 'Retrospective: reverse + re-post', 'Prospective only', 'Both B & C'], ans: 1, type: 'concept' },
      { q: 'Change type if customer reduces price $100k (keeps POs)?', opts: ['Retrospective', 'Prospective', 'Mixed', 'Depends'], ans: 0, type: 'concept' },
      { q: 'Remaining price: $500k contract, customer adds $100k PO. Remaining value?', opts: ['$500k', '$600k', 'Depends on prior', 'Recalculate total'], ans: 3, type: 'scenario' },
      { q: 'Early termination month 6 of 12. GL reversal?', opts: ['Reverse all 12', 'Reverse only months 7-12', 'No reversal', 'Partial'], ans: 1, type: 'concept' },
      { q: 'Extension: 12-month SaaS extended to 18. GL for months 1-12?', opts: ['Recalculate retroactive', 'Unchanged; extend 13-18', 'Void & create new', 'Adjust down'], ans: 1, type: 'scenario' },
      { q: 'Cost overrun: project $400k → $450k. Revenue %?', opts: ['Recalculate using $450k', 'Keep % unchanged; accrue loss', 'Reverse prior', 'Ignore'], ans: 1, type: 'troubleshooting' }
    ],
    senior: [
      { q: 'Mixed change: scope reduced months 3+ but months 1-2 full. GL?', opts: ['Reverse months 1-2 (error)', 'Keep 1-2; reverse 3+ unearned', 'Single GL entry', 'CFO approval first'], ans: 1, type: 'troubleshooting' },
      { q: 'Early termination: accrued cost liability $50k for months 7-12. GL release?', opts: ['Keep accrual', 'Release $50k', 'Release per unwinding', 'Defer release'], ans: 1, type: 'troubleshooting' },
      { q: 'Extension at lower rate: new rate months 13-18. Months 1-12 GL?', opts: ['Recalculate all 18', 'Months 1-12 unchanged; 13-18 new rate', 'Split difference retroactively', 'Renegotiate all'], ans: 1, type: 'scenario' }
    ]
  },

  rar_day7: {
    junior: [
      { q: '3-step revenue posting sequence?', opts: ['GL → liability → transfer', 'Transfer → liability → GL', 'GL → transfer → liability', 'All simultaneous'], ans: 1, type: 'concept' },
      { q: 'Contract liability GL represents?', opts: ['Money owed vendor', 'Customer paid, revenue deferred (BS)', 'Unpaid invoice', 'Warranty reserve'], ans: 1, type: 'concept' },
      { q: 'Revenue GL account example?', opts: ['13701400 (liability)', '4100000–4199999 (product)', '1200000 (inventory)', '5000000 (COGS)'], ans: 1, type: 'concept' },
      { q: 'Account determination driven by?', opts: ['Manual entry', 'BRF+ condition table → decision table → GL', 'Fixed GL per module', 'Accounting choice'], ans: 1, type: 'concept' },
      { q: 'Contract asset GL created when?', opts: ['Always', 'When customer paid', 'When revenue recognized > billed', 'Never'], ans: 2, type: 'concept' },
      { q: 'Month-end close day 25 action?', opts: ['Post all GL', 'Lock amendments', 'Reconcile GL', 'Sign-off'], ans: 1, type: 'concept' },
      { q: 'Reconciliation RAR ↔ GL?', opts: ['Optional', 'Compares totals; flags variance', 'GL always correct', 'Yearly only'], ans: 1, type: 'concept' },
      { q: 'Revenue posting error blocks?', opts: ['Current GL only', 'Current + next month', 'Does not block', 'CFO override'], ans: 1, type: 'concept' },
      { q: 'GL reconciliation scenario: opening $500k, posted $300k revenue, should = $200k liability. Actual GL = $180k. Root cause?', opts: ['$20k reversal not posted', 'Late invoice', 'Posting incomplete', 'All possible'], ans: 3, type: 'troubleshooting' },
      { q: 'Month-end close: amendment after lock date (retroactive). Policy?', opts: ['Ignore', 'Post adjustment next period', 'Reverse prior GL', 'Delay close'], ans: 1, type: 'troubleshooting' }
    ],
    senior: [
      { q: 'Revenue posting: 100 contracts, BRF+ account determination fails for 15. Partial GL posting?', opts: ['Auto-post 85', 'Block all 100', 'Admin override', 'Depends on error'], ans: 0, type: 'troubleshooting' },
      { q: 'Contract liability reconciliation: opening $500k, posted $300k, should = $200k. Actual = $180k. Investigation?', opts: ['$20k reversal', '$20k late invoice', 'Posting incomplete', 'All possible'], ans: 3, type: 'troubleshooting' },
      { q: 'Full recalculation (all 1000 contracts) vs. Partial (50 changed). Month-end choice?', opts: ['Always full', 'Partial if accurate', 'Depends on load', 'Alternate'], ans: 0, type: 'troubleshooting' },
      { q: 'GL reconciliation: RAR contracts $10M; GL revenue shows $9.8M. Gap investigation?', opts: ['Manual GL entries', 'Unposted contracts', 'Combining delta', 'All methodically'], ans: 3, type: 'troubleshooting' }
    ]
  }
};

export default QUESTION_BANK_RAR;
