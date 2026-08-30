// SAP RAR Module - Sections & Concepts
// 13 Tabs: Days 1-7 (rotation) + Tabs 10-13 (reference)
// Following SD/FICO architecture pattern

export const RAR_SECTIONS = [
  {
    id: 'rar_day1',
    title: 'Day 1',
    subtitle: 'IFRS 15 Fundamentals + Constraint Assessment + Multi-GAAP',
    concepts: [
      {
        name: 'IFRS 15 Five-Step Model',
        text: 'Step 1: Identify contract. Step 2: Identify performance obligations. Step 3: Determine transaction price. Step 4: Allocate price to POs. Step 5: Recognize revenue when control transfers. Each step determines timing of revenue recognition.'
      },
      {
        name: 'Revenue Recognition Problem RAR Solves',
        text: 'SD invoices (billed) ≠ IFRS 15 revenue recognition (earned control). Subscription billed upfront but revenue recognized monthly. Fixed-price project revenue spreads per completion %. RAR bridges this timing gap.'
      },
      {
        name: 'IFRS 15 Step 3: Constraint Assessment',
        text: 'Probable collectibility: Must assess before recognizing revenue. If collectible amount uncertain, defer revenue until constraint removed. Example: Customer credit-risky → recognize 50% upfront, defer 50% until payment.'
      },
      {
        name: 'Multi-GAAP Reporting',
        text: 'IFRS 15 (global) vs. US-GAAP ASC 606 (subtle differences) vs. local GAAP variations. Revenue timing may differ by geography. Configuration: RAR supports both IFRS & US-GAAP simultaneous recognition rules.'
      },
      {
        name: 'Performance Obligation (PO)',
        text: 'Distinct good or service promised to customer. Contract may have 1 PO (simple) or multiple POs (bundled: device + support + data). Identification determines revenue allocation method (by SSP).'
      },
      {
        name: 'Standalone Selling Price (SSP)',
        text: 'Price at which customer would purchase PO separately. Estimated via: observed price (market check), adjusted market approach (competitive analysis), cost-plus approach. Used for revenue allocation when bundled.'
      },
      {
        name: 'Revenue Timing & Fulfillment',
        text: 'Control transfer point determines timing. Event-based (Goods Issue, invoice, acceptance date). Time-based (monthly for SaaS). Percentage-of-completion (project milestone). Deferral spreads revenue across periods.'
      },
      {
        name: 'RAR Module Position in S/4HANA',
        text: 'Independent from SD. Receives RAI (Revenue Accounting Items) from SD invoices via ARDC interface. Creates contracts, POs, revenue GL postings. Month-end reconciles RAR ↔ FI GL accounts.'
      },
      {
        name: 'Key RAR Tables (Overview)',
        text: 'ARAR_RAI (raw revenue items), ARAR_C (contracts), ARAR_POB (performance obligations), ARAR_REV (revenue posting results), ACDOCA (universal journal). All linked via contract ID.'
      },
      {
        name: 'Contract Liability vs. Contract Asset',
        text: 'Liability (BS): Customer paid, revenue deferred (negative margin recognition). Asset (BS): Revenue recognized, customer not yet billed (receivable exists). Both flow through deferral GL accounts.'
      }
    ],
    junior: [
      {
        q: 'IFRS 15 Step 3 (Determine Transaction Price) focuses on?',
        opts: ['Contract amount', 'Collectibility assessment + variable considerations', 'Customer credit rating only', 'Invoice date'],
        ans: 1,
        exp: 'Step 3: Determine transaction price = identified amount - variable considerations (discounts, refunds) constrained by probability of collectibility.'
      },
      {
        q: 'Constraint Assessment means?',
        opts: ['Customer contract signed', 'Probable collectibility confirmed', 'All POs identified', 'Invoice issued'],
        ans: 1,
        exp: 'Constraint: Assessing whether collectible amount is probable. If uncertain, defer revenue until confirmed.'
      },
      {
        q: 'Multi-GAAP reporting difference: Subscription $1200 with 30-day return right. IFRS: defer 5% return. US-GAAP: may defer 10%. Why?',
        opts: ['GAAP stricter', 'Different return probability models', 'No difference', 'IFRS more conservative'],
        ans: 1,
        exp: 'Each GAAP jurisdiction has different probability models for variable returns. Configuration reflects local guidance.'
      },
      {
        q: 'Performance Obligation definition?',
        opts: ['Customer account', 'Distinct good or service promised', 'Sales order line item', 'Invoice'],
        ans: 1,
        exp: 'PO: distinct promise. Bundle (device + support + data) = 3 POs if each is separately beneficial to customer.'
      },
      {
        q: 'SSP estimation method NOT listed in IFRS 15?',
        opts: ['Observed price', 'Adjusted market approach', 'Cost-minus approach', 'Cost-plus approach'],
        ans: 2,
        exp: 'IFRS 15 recognizes: observed, adjusted market, cost-plus. Cost-MINUS (below cost) is not a valid method.'
      },
      {
        q: 'RAI (Revenue Accounting Item) comes from which SD module process?',
        opts: ['VA01 Sales Order', 'VF01 Invoice', 'ARDC Interface', 'VL01 Delivery'],
        ans: 2,
        exp: 'SD invoices → ARDC interface → RAI created. RAI is the raw input to RAR contract processing.'
      },
      {
        q: 'Contract liability GL means?',
        opts: ['Customer owes us', 'We owe customer (deferred revenue)', 'Advance payment received', 'Contract signed'],
        ans: 1,
        exp: 'Liability: customer paid upfront, revenue deferred. Recognized when revenue condition met. Flows through GL reconciliation.'
      },
      {
        q: 'Which RAR table stores actual revenue posting results?',
        opts: ['ARAR_C', 'ARAR_RAI', 'ARAR_REV', 'ARAR_POB'],
        ans: 2,
        exp: 'ARAR_REV: revenue posting results. Links contract → GL account → amount → posting date.'
      }
    ],
    senior: [
      {
        q: 'Constraint Assessment fails (collectible amount uncertain). Company recognizes 100% revenue anyway. Audit finding?',
        opts: ['Error: violates constraint', 'OK: no accounting impact', 'Depends on customer credit', 'Depends on contract language'],
        ans: 0,
        exp: 'IFRS 15 Step 3: constrain transaction price by collectibility. Ignoring constraint = non-compliance.'
      },
      {
        q: 'Multi-GAAP system posts revenue to GL account 4100000 (IFRS) and 4110000 (US-GAAP) simultaneously. GL reconciliation shows $2M difference. Root cause?',
        opts: ['System error', 'Variable consideration % differs by GAAP', 'Timing (IFRS defers, US-GAAP recognizes)', 'All of above possible'],
        ans: 3,
        exp: 'Multi-GAAP differences: transaction price (variables), PO identification, fulfillment timing, constraint assessment all vary by jurisdiction.'
      },
      {
        q: 'Contract bundled: Product $10k SSP + Support $4k SSP + Data $3k SSP. Customer pays $10k total. Allocation?',
        opts: ['Product $5k, Support $3k, Data $2k', 'Product $6.67k, Support $2.22k, Data $1.11k', 'Negotiate per PO', 'Product gets full $10k'],
        ans: 1,
        exp: 'Relative SSP allocation: $10k ÷ ($10k+$4k+$3k) × each SSP = Product 66.7%, Support 26.7%, Data 10%.'
      },
      {
        q: 'Fixed-price project: Estimated cost $400k, revenue $500k, margin $100k. Month 1: actual cost $150k (vs $100k estimate), margin now $350k (vs $400k estimated remaining). BRF+ should?',
        opts: ['Ignore; recognize full $500k', 'Flag overrun risk; monitor margin real-time', 'Reverse $50k revenue', 'Wait until project complete'],
        ans: 1,
        exp: 'BRF+ flags margin variance: estimated vs actual. Cost overrun visible in real-time; escalate to PM for scope/price negotiation.'
      },
      {
        q: 'Intercompany transaction: Seller posts GI (revenue $100k) day 1; Buyer posts GR (inventory received) day 5. GL reconciliation day 1?',
        opts: ['Balanced', 'Seller A/R $100k unmatched', 'No issue until consolidation', 'Post reconciliation entry immediately'],
        ans: 1,
        exp: 'Intercompany timing gap: GL unbalanced days 1-4. Month-end reconciliation matches seller A/R ↔ buyer A/P by entity.'
      }
    ]
  },

  {
    id: 'rar_day2',
    title: 'Day 2',
    subtitle: 'Revenue Accounting Items & Inbound Processing',
    concepts: [
      {
        name: 'RAI (Revenue Accounting Item) Lifecycle',
        text: 'Raw (new from ARDC) → Processable (validated, ready) → Processed (transferred to contract). Status determines visibility & next action. BRF+ rules run at each transition.'
      },
      {
        name: 'RAI Class Configuration',
        text: 'Master data for RAI inbound. Defines which SD invoice fields map to RAI (customer, amount, invoice date). Assigns RAI class to order type (OR → RAI class "STD"). Multiple classes support different revenue models.'
      },
      {
        name: 'ARDC Interface (SD → RAR)',
        text: 'Automatic: SD invoice posted → ARDC fires → RAI created nightly. Carries forward: invoice number, customer, amount, invoice date, item details. Errors block RAI creation; must fix & re-run.'
      },
      {
        name: 'RAI to Sender Reconciliation',
        text: 'RAI count must match SD invoice count for same date range. Reconciliation T-code compares totals. Gap indicates: lost RAI, duplicate RAI, or ARDC error. Must clear before revenue posting.'
      },
      {
        name: 'BRF+ Functions During RAI Processing',
        text: 'Quantity determination (planned invoice qty). Planned invoice creation (auto-generate billing schedule). PO creation (identify what will be billed). All configurable; run nightly or on-demand.'
      },
      {
        name: 'Raw vs. Processable Status',
        text: 'Raw: initial ARDC creation; may have errors. Processable: validated, BRF+ rules executed, ready for contract transfer. Processable RAIs are visible to revenue team for review/approval.'
      },
      {
        name: 'Error Handling in RAI Inbound',
        text: 'Errors block progression: missing customer, wrong invoice date, amount zero. Raw data can be manually edited before marking processable. Once processable, changes must reverse & re-create.'
      },
      {
        name: 'RAI Class Assignment to Order Type',
        text: 'Configuration: Order Type OR → RAI Class "STANDARD". Consignment OR → RAI Class "CONSIGNMENT". Different classes trigger different BRF+ logic; enables tailored revenue handling by business model.'
      },
      {
        name: 'Data Flow: SD Order → RAI → Contract → GL',
        text: 'VA01 (order) → VF01 (invoice) → ARDC → RAI (day 1) → BRF+ processing → Processable (day 1) → Transfer to contract (day 2) → Revenue posting (month-end) → GL reconciliation.'
      },
      {
        name: 'SE16N Query: RAI Status Check',
        text: 'Table ARAR_RAI; filter by invoice date, customer, status. View: invoice number, RAI amount, status (Raw/Processable/Processed), error message. Daily ops for troubleshooting stuck RAIs.'
      }
    ],
    junior: [
      {
        q: 'RAI status sequence is?',
        opts: ['Processed → Processable → Raw', 'Raw → Processable → Processed', 'Processable → Raw → Processed', 'Raw → Processed → Deleted'],
        ans: 1,
        exp: 'RAI lifecycle: Raw (new from ARDC) → Processable (validated, ready) → Processed (transferred to contract).'
      },
      {
        q: 'ARDC interface triggers when?',
        opts: ['Sales order created (VA01)', 'Invoice posted (VF01)', 'Delivery created (VL01)', 'Goods Issue (VL02N)'],
        ans: 1,
        exp: 'ARDC: Automatic transaction & reconciliation delivery. Fires on SD invoice posting (VF01).'
      },
      {
        q: 'RAI class configuration maps which field to RAI?',
        opts: ['Payment terms', 'Invoice number & amount', 'Delivery address', 'Material serial number'],
        ans: 1,
        exp: 'RAI class: maps SD invoice fields (invoice #, customer, amount, date) to RAI structure. Configurable per business model.'
      },
      {
        q: 'RAI to Sender Reconciliation checks what?',
        opts: ['Customer credit limits', 'Total RAI count = total invoice count', 'Material availability', 'Shipping addresses'],
        ans: 1,
        exp: 'Reconciliation: RAI count must equal SD invoice count for date range. Gap = data loss or ARDC error.'
      },
      {
        q: 'Raw RAI data can be edited when?',
        opts: ['Never', 'Before marking Processable', 'After Processable only', 'Only by admin'],
        ans: 1,
        exp: 'Raw status allows manual edit (fix invoice date, correct amount). Once Processable, must reverse & re-create.'
      },
      {
        q: 'BRF+ function during RAI inbound determines?',
        opts: ['Customer credit check', 'Planned invoice quantity & schedule', 'Warehouse location', 'Tax jurisdiction'],
        ans: 1,
        exp: 'BRF+ RAI processing: quantity determination, planned invoice generation, PO creation. All configurable by business model.'
      },
      {
        q: 'SE16N query for RAI status uses which table?',
        opts: ['ARAR_C', 'ARAR_RAI', 'ARAR_REV', 'ACDOCA'],
        ans: 1,
        exp: 'ARAR_RAI: raw RAI data. Filter by status (Raw, Processable, Processed), date, customer for troubleshooting.'
      },
      {
        q: 'RAI Class assignment to Order Type controls?',
        opts: ['Price calculation', 'Revenue handling by business model', 'Inventory location', 'Tax code'],
        ans: 1,
        exp: 'Config: OR → RAI Class STANDARD; Consignment OR → RAI Class CONSIGNMENT. Different classes = different BRF+ logic.'
      }
    ],
    senior: [
      {
        q: '1000 invoices posted; ARDC created 999 RAIs. Reconciliation shows one missing. Troubleshooting approach?',
        opts: ['Repost invoice', 'Check ARDC logs for error', 'Manually create RAI', 'All of above in sequence'],
        ans: 2,
        exp: 'ARDC logs show error reason (missing customer, duplicate, amount zero). Fix source, re-run ARDC, verify reconciliation matches.'
      },
      {
        q: 'RAI stuck in Raw status for 3 days. No error message. Most likely cause?',
        opts: ['BRF+ processing failed silently', 'Manual block by user', 'ARDC not configured for this order type', 'Processable status auto-triggered but UI lag'],
        ans: 2,
        exp: 'Order type not assigned to RAI class → ARDC creates RAI but no BRF+ processing rule exists → stuck in Raw. Check FARA_IMG config.'
      },
      {
        q: 'BRF+ quantity determination returns 0 for valid invoice. Revenue team cannot transfer RAI. Root cause?',
        opts: ['Material master incomplete', 'BRF+ rule formula error', 'Customer blocked', 'Order type configuration'],
        ans: 1,
        exp: 'BRF+ rule evaluates: IF invoice qty > 0 THEN planned qty = qty ELSE 0. Formula bug → zero output → cannot proceed. Trace rule logic.'
      },
      {
        q: 'Intercompany invoice (seller → buyer entity) creates RAI only on seller side. Expected?',
        opts: ['Error: buyer should also have RAI', 'Correct: only seller recognizes revenue', 'Both should have RAIs', 'Depends on configuration'],
        ans: 1,
        exp: 'Intercompany: only seller company code posts invoice (within group) → only seller ARDC fires → only seller RAI. Buyer invoice is internal PO receipt (no ARDC).'
      },
      {
        q: 'RAI processing batch runs nightly 22:00. Month-end close 18:00. Expected RAI status?',
        opts: ['Processed', 'Processable', 'Raw', 'Depends on invoice time'],
        ans: 1,
        exp: 'Close at 18:00: invoices posted before 22:00 batch will still be Raw/Processable. Post-close invoices may not process until next day. Plan close timing around batch.'
      }
    ]
  },

  {
    id: 'rar_day3',
    title: 'Day 3',
    subtitle: 'Contract Accounting & Management',
    concepts: [
      {
        name: 'Contract Creation Methods',
        text: 'Manual (FARA_C T-code): create contract header, add PO line items. Automatic (from RAI): BRF+ transfer rule creates contract on processed RAI approval. Mixed: auto-create, then edit.'
      },
      {
        name: 'Contract Master Data',
        text: 'Header: customer, contract dates (start, end), currency, amount. Line items: PO ID, quantity, unit price. Control data: status (draft/active/closed), approval gates, change logs.'
      },
      {
        name: 'Contract Combining Rules',
        text: 'Configuration: combine multiple related contracts into one revenue transaction. Example: customer orders device + support separately (2 contracts) → combine into 1 for unified allocation. GL impact: single revenue GL posting vs. two.'
      },
      {
        name: 'Contract Status Management',
        text: 'Draft (editable, no revenue). Pending Review (sent to approver). Active (revenue posting enabled). Closed (no further changes). Status workflow controls which operations are allowed.'
      },
      {
        name: 'Contract Hierarchies',
        text: 'Parent-child relationships: master contract contains detail contracts. Example: annual subscription (parent) with monthly billing contracts (children). Useful for consolidated reporting & hierarchical revenue splits.'
      },
      {
        name: 'BRF+ Contract Determination',
        text: 'Rules determine: which RAI transfers to which contract, contract combining logic, status progression, approval gates. All configurable by revenue model (subscription, project, product).'
      },
      {
        name: 'Contract Change Workflow',
        text: 'Amendment process: create change, evaluate impact (cost, revenue), approve, post GL entries. Retrospective (prior periods) vs. prospective (current forward). Triggering: scope reduction, price increase, early termination.'
      },
      {
        name: 'Contract Linking to Operational Documents',
        text: 'Contract links back to: original SD order (VA01), invoice (VF01), delivery (VL01). Document flow shows relationship. Useful for audit trail & cost reconciliation.'
      },
      {
        name: 'Contract Validation Rules (BRF+)',
        text: 'Checks performed: customer exists, contract amount > 0, at least 1 PO defined, contract dates valid, SSP allocation sums to 100%. Failures block contract activation.'
      },
      {
        name: 'Contract Amendments & Approval Gates',
        text: 'Amendment creates change record; flows through approval workflow (revenue manager, CFO per amount). Approved amendment posts GL reconciliation entries; rejected amendments have no GL impact.'
      }
    ],
    junior: [
      {
        q: 'Contract creation automatic path comes from?',
        opts: ['Manual FARA_C entry', 'Processed RAI transferred by BRF+', 'Sales order VA01', 'Invoice VF01'],
        ans: 1,
        exp: 'Auto-creation: Processed RAI → BRF+ transfer rule → contract created. Manual: FARA_C T-code entry. Mixed: auto + edit.'
      },
      {
        q: 'Contract combining benefits when?',
        opts: ['Multiple customers', 'Same customer, related contracts', 'Different materials only', 'Large contracts only'],
        ans: 1,
        exp: 'Combining: consolidates related contracts (device + support) into one revenue recognition transaction. Simplifies GL, unifies allocation logic.'
      },
      {
        q: 'Contract status Draft means?',
        opts: ['Approved & posting revenue', 'Editable; no revenue recognition', 'Closed; no changes', 'Pending approval only'],
        ans: 1,
        exp: 'Draft: editable, no revenue GL posting. Pending Review: sent to approver. Active: revenue posts. Closed: locked.'
      },
      {
        q: 'Contract hierarchy (parent-child) used for?',
        opts: ['Organizing master data only', 'Consolidated reporting & hierarchical revenue', 'Customer classification', 'Material grouping'],
        ans: 1,
        exp: 'Hierarchy: master contract (annual SaaS) contains child contracts (monthly billing). Enables hierarchical reporting & revenue splits.'
      },
      {
        q: 'BRF+ contract determination rule decides?',
        opts: ['Customer credit limit', 'Which RAI goes to which contract; combining logic; approval gates', 'Invoice date', 'Material type'],
        ans: 1,
        exp: 'BRF+ determines: RAI → contract routing, contract combining, status progression, validation rules. All configurable.'
      },
      {
        q: 'Contract amendment (scope reduction, price cut) is?',
        opts: ['Automatic posting', 'Manual change record requiring approval', 'Requires new contract', 'Not allowed in RAR'],
        ans: 1,
        exp: 'Amendment: create change record → evaluate GL impact → approve → post reconciliation entries. Rejected = no GL posting.'
      },
      {
        q: 'Contract validation checks what?',
        opts: ['Customer exists & valid', 'Amount > 0, PO defined, dates valid, SSP = 100%', 'Tax compliance', 'All of above'],
        ans: 1,
        exp: 'Validation: customer, amount, PO count, date logic, SSP sum. Failures block activation. Trigger before status change to Active.'
      },
      {
        q: 'Contract linking to SD order via?',
        opts: ['Hard reference', 'Document flow (VA01 → VF01 → contract)', 'Customer number match only', 'GL account mapping'],
        ans: 1,
        exp: 'Document flow: traces SD order → invoice → RAI → contract → GL. Audit trail for reconciliation.'
      }
    ],
    senior: [
      {
        q: 'Contract combining triggers GL consolidation rule. Two contracts: revenue $300k (allocated 60/40) + $200k (allocated 50/50). Combined revenue GL posting?',
        opts: ['$300k only', '$500k with new SSP allocation', '$300k + $200k separate postings', 'Depends on combining config'],
        ans: 1,
        exp: 'Combining: merges contracts into single revenue transaction. Re-runs SSP allocation across all combined POs. New allocation ≠ original 60/40 or 50/50.'
      },
      {
        q: 'Customer has 12 monthly billing contracts (SaaS). Reported revenue differs: parent (annual) shows $12k, sum of children shows $11.8k. Root cause?',
        opts: ['Math error', 'Child contract GLs posted, parent GL not yet posted', 'Contract combining delta', 'Rounding in SSP allocation'],
        ans: 2,
        exp: 'Hierarchy: child GL postings may be out-of-sync with parent. Reconciliation entry needed to match sums. Check GL posting status per contract.'
      },
      {
        q: 'Contract amendment: scope cut $100k revenue, cost estimate increases $50k. GL impact?',
        opts: ['Reverse $100k revenue only', 'Reverse $100k, accrue $50k cost loss', 'Reverse $100k, reserve $50k margin risk', 'Wait for actual cost'],
        ans: 1,
        exp: 'Revenue-focused GL: reverse allocated revenue $100k. Cost accrual (WIP) happens separately; margin loss surfaces in real-time cost tracking.'
      },
      {
        q: 'BRF+ contract determination rule: "IF customer segment = Enterprise AND contract amount > $1M THEN route to CEO approval." Approval blocks revenue posting. Timing risk?',
        opts: ['None; prevents errors', 'Month-end close delays if approval pending', 'Revenue must be recognized by period-end', 'Both B & C'],
        ans: 2,
        exp: 'Timing risk: if $2M enterprise contract awaits CEO approval on day 30 of month, revenue posting delayed. Config must balance control vs. timeliness.'
      },
      {
        q: 'Contract hierarchy: parent has $12k annual amount; 12 children have $1k each. One child amended to $0.5k. Reallocation impact on parent?',
        opts: ['Parent unchanged', 'Parent recalculates to $11.5k', 'Consolidation adjustment GL entry', 'Depends on revenue model'],
        ans: 2,
        exp: 'Hierarchy consolidation: child GL changes must reconcile to parent GL. Amendment triggers recon entry to keep parent = sum of children.'
      }
    ]
  },

  {
    id: 'rar_day4',
    title: 'Day 4',
    subtitle: 'Performance Obligations & SSP Allocation',
    concepts: [
      {
        name: 'Performance Obligation (PO) Identification',
        text: 'IFRS 15 Step 1: Identify distinct goods/services. Bundle (device $10k + support $4k + data $3k) = 3 POs if each is separately beneficial & customer controls individually. Configuration: PO table stores this logic.'
      },
      {
        name: 'Distinctness Testing (IFRS 15)',
        text: 'PO is distinct if: (1) customer can benefit alone (resell/use independently), (2) promise is separately identifiable (not intertwined with other POs). Example: device distinct; support distinct. Together still 2 distinct.'
      },
      {
        name: 'PO Hierarchies & Linked POs',
        text: 'Parent PO (bundled subscription) contains child POs (base service, overage, support). Hierarchy controls: fulfillment cascades, revenue allocation splits. Example: parent deferral method applies to children.'
      },
      {
        name: 'Negative POs & Cancellations',
        text: 'Negative PO: refund obligation (rights of return, discounts). GL: negative revenue (reduces contract revenue). Cancellation: entire PO deleted, cost GL reversal. Both trigger reconciliation entries.'
      },
      {
        name: 'Manual PO Creation',
        text: 'BRF+ auto-creates POs from contract; if logic fails, revenue team manually creates in FARA_POB. Requires: contract ID, material/description, qty, unit price, fulfillment type, deferral method.'
      },
      {
        name: 'Standalone Selling Price (SSP) Estimation',
        text: 'Three IFRS 15 methods: (1) Observed Price (market transaction), (2) Adjusted Market Approach (comparable products), (3) Cost-Plus Approach (cost + appropriate margin). Best-estimate method is prescribed.'
      },
      {
        name: 'SSP Allocation Formula',
        text: 'Allocated Revenue = (SSP of PO / Sum of all SSP) × Contract Price. Example: $10k + $4k + $3k bundle = $17k sum. Device allocation = ($10k/$17k) × $10k = $5.88k.'
      },
      {
        name: 'Allocation Methods (Relative, Residual, Customized)',
        text: 'Relative SSP (most common): proportional allocation. Residual: allocate observable PO first, remainder to unobservable. Customized: per contract terms (e.g., customer negotiates different split).'
      },
      {
        name: 'Rights of Return GL Accounts',
        text: 'Refund Liability (BS): estimate of returns; flows through contra-revenue GL. Return Asset (BS): cost of goods expected to return; flows to inventory. Both created as negative POs.'
      },
      {
        name: 'SSP Tolerance & Validation (BRF+)',
        text: 'Configuration: SSP variance tolerance (e.g., ±10%). BRF+ flags SSP estimates outside tolerance for review. Example: estimated SSP $5k vs. observed $6k (20% variance) → escalate to pricing manager.'
      },
      {
        name: 'Variable Considerations & Constraint',
        text: 'Variable (discount, refund, incentive) reduces transaction price. Constraint: limit by probability of receipt. Example: 30% estimated return → reduce revenue by 30%, update as actuals confirmed.'
      },
      {
        name: 'Cost Recognition & Allocation (NEW)',
        text: 'Similar to revenue SSP allocation. Cost categories: direct (labor, material), indirect (overhead). Allocation methods: by labor hours, units, revenue proportion, cost drivers. Margin = allocated revenue - allocated cost.'
      }
    ],
    junior: [
      {
        q: 'Bundle: Device $10k SSP + Support $4k SSP + Data $3k SSP. Customer pays $10k total. Device allocated revenue?',
        opts: ['$5.88k', '$6.67k', '$5k', '$10k'],
        ans: 0,
        exp: 'SSP allocation: ($10k/$17k) × $10k = $5,882. Same formula for all three POs; total = $10k.'
      },
      {
        q: 'PO is distinct if?',
        opts: ['High price only', 'Customer can benefit alone + promise separately identifiable', 'Long contract term', 'Enterprise customer'],
        ans: 1,
        exp: 'Distinctness: (1) benefits alone, (2) separately identifiable. Both required; either missing = not distinct.'
      },
      {
        q: 'SSP estimation method: competitor sells device for $12k; company estimates $10k SSP. Best approach?',
        opts: ['Use $12k', 'Use $10k; cost-plus justified', 'Use $11k average', 'Adjusted market approach: analyze $12k, justify variance'],
        ans: 2,
        exp: 'Adjusted market approach: start with observable $12k, adjust for differences (features, customer segment, volume). Document variance rationale.'
      },
      {
        q: 'Refund Liability GL (BS) represents?',
        opts: ['Money owed to vendor', 'Estimate of future returns', 'Invoice unpaid', 'Warehouse inventory'],
        ans: 1,
        exp: 'Refund liability: accrual for expected returns. Created as negative PO in RAR contract. Reverses when return actually occurs.'
      },
      {
        q: 'Rights of return (30-day guarantee) treated in SSP as?',
        opts: ['Ignore; recognize full revenue', 'Variable consideration; reduce revenue 5% estimated return', 'Separate PO for refund obligation', 'Both B & C'],
        ans: 3,
        exp: 'Rights of return: reduce revenue by return % (variable consideration constraint) + create refund liability GL + refund asset GL.'
      },
      {
        q: 'PO hierarchy (parent subscription with child overages) enables?',
        opts: ['Duplicate data only', 'Fulfillment cascade + consolidated revenue reporting', 'Tax calculation only', 'Customer blocking only'],
        ans: 1,
        exp: 'Hierarchy: parent deferral method applies to children. Revenue recognition syncs across hierarchy. Reporting consolidates parent + children.'
      },
      {
        q: 'SSP tolerance configured 10%. Estimated $5k SSP vs. observed $6k. Action?',
        opts: ['Approve', 'Escalate to pricing manager for $1k (20%) variance', 'Reverse to $5k', 'Split $5.5k'],
        ans: 1,
        exp: 'Tolerance 10%: 20% variance = outside range. Escalate for review & rationale before proceeding.'
      },
      {
        q: 'Negative PO (refund obligation) GL posting?',
        opts: ['Credit revenue only', 'Debit refund liability, credit contra-revenue GL', 'No GL impact until return occurs', 'Reverses weekly'],
        ans: 1,
        exp: 'Negative PO: creates GL entries immediately upon contract creation. Refund liability = negative revenue PO amount.'
      }
    ],
    senior: [
      {
        q: 'Bundle SSP: Device $10k (SSP $10k observed), Support $4k (SSP $8k estimated via cost-plus, but competitor charges $6k). SSP variance = 33%. Override to $6k?',
        opts: ['Yes; market check beats cost-plus', 'No; cost-plus justified if documented', 'Use $7k compromise', 'Escalate; document either path'],
        ans: 3,
        exp: 'SSP conflict: observed (competitor $6k) vs. cost-plus ($8k). Both methods valid; choose best-estimate per IFRS guidance & document rationale. Audit will challenge; be prepared.'
      },
      {
        q: 'Contract rights of return: estimated 5% return rate. At month-end actual returns = 2%. GL adjustment?',
        opts: ['Reverse excess refund liability', 'Keep accrual; adjust actual cost GL', 'Both A & B', 'Ignore variance'],
        ans: 2,
        exp: 'Month-end: compare estimated (5%) vs. actual (2%). Refund liability excess reverses to revenue. Return asset (cost) adjusts per actual goods returned.'
      },
      {
        q: 'PO hierarchy: Parent revenue $12k (children: $5k base + $7k overage). Base child amended to $4k. Parent revenue allocation?',
        opts: ['Parent recalculates $11k', 'Parent unchanged; orphaned variance', 'Consolidation GL entry reconciles', 'Base child blocked from amendment'],
        ans: 2,
        exp: 'Hierarchy amendment: child change posts GL entry; parent-child reconciliation entry maintains balance. Parent ≠ $11k unless re-aggregated.'
      },
      {
        q: 'Allocated cost: Device revenue $5.88k allocated, estimated cost $4k. Mid-project actual cost $4.5k (12.5% overrun). Margin now $1.38k (down from $1.88k). BRF+ cost variance trigger?',
        opts: ['No; cost management is separate', 'Yes; margin variance flags for project escalation', 'Only if >20% variance', 'Only for contracts > $10k'],
        ans: 1,
        exp: 'Cost overrun visible real-time. BRF+ flags: estimated margin $1.88k, actual $1.38k. PM investigates cause (labor, material, scope).'
      },
      {
        q: 'Intercompany bundle: Seller allocates SSP to buyer entity in RAR. Buyer then re-allocates to external customer. Double-counting risk?',
        opts: ['None; each entity has own allocation', 'Consolidation eliminates intercompany POs', 'Risk of profit overstatement', 'Requires transfer price validation'],
        ans: 3,
        exp: 'Intercompany SSP: must align seller SSP ↔ buyer cost allocation to avoid transfer pricing variance. Tax authorities scrutinize alignment.'
      }
    ]
  },

  {
    id: 'rar_day5',
    title: 'Day 5',
    subtitle: 'Fulfillment Methods, Deferral & Cost Recognition',
    concepts: [
      {
        name: '11 Fulfillment Event Types',
        text: 'Quantity-based: Goods Issue (GI), Goods Receipt (GR), Consumption, Purchase Invoicing. Value-based: Customer Invoice, Manual Event, Service Acceptance Date, Proof of Delivery (POD). Special: Drop Shipping, Intercompany, Compound Structure.'
      },
      {
        name: 'Event-Based Fulfillment Timing',
        text: 'Revenue recognized when event occurs. GI: revenue at warehouse delivery. Invoice: revenue at billing. POD: revenue at customer confirmation. BRF+ routes event to correct GL account.'
      },
      {
        name: 'Time-Based Fulfillment (SaaS, Subscriptions)',
        text: 'Revenue spreads evenly over time. Subscription $1,200/12 months = $100/month recognized. Configuration: contract dates, spread method (daily, monthly). Deferral accounts manage monthly accruals.'
      },
      {
        name: 'Percentage-of-Completion Fulfillment (Projects)',
        text: 'Revenue recognized per milestone or % complete. Fixed-price $500k project with $100k spend of $400k estimated = 25% complete = $125k revenue. BRF+ calculates %; GL posts proportionally.'
      },
      {
        name: 'Deferral Methods Configuration',
        text: 'Straight-line (evenly over periods). Percentage-complete (per milestone or cost ratio). Manual spreading (custom schedule). Each method flows through deferred revenue GL accounts.'
      },
      {
        name: 'Contract Liability vs. Asset (BS)',
        text: 'Liability: customer paid, revenue deferred (negative margin initially). Asset: revenue recognized, billing deferred (receivable exists). Both reflect timing gap between cash receipt & revenue recognition.'
      },
      {
        name: 'Billed-Earlier vs. Billed-Later Scenario',
        text: 'Earlier: subscription $300 Oct-Dec, invoiced end-Oct (1 invoice, 3-month revenue). GL: Oct $100 revenue, $200 deferred liability. Nov-Dec reverse deferral, recognize $100 each. Later: recognize upfront, bill later (asset not liability).'
      },
      {
        name: 'Drop Shipping Fulfillment',
        text: 'Seller doesn\'t hold inventory. Vendor ships direct to end-customer. Revenue event: vendor GI (seller recognizes) or customer receipt (depending on risk/reward). Intercompany flow: seller recognizes revenue; buyer receives inventory.'
      },
      {
        name: 'Intercompany GIT (Goods in Transit)',
        text: 'Seller GI (revenue recognized day 1). Buyer GR (day 5). FOB Shipping Point = seller bears risk. GL unbalanced days 1-4: seller A/R ≠ buyer A/P. Month-end reconciliation matches timing.'
      },
      {
        name: 'Compound Structure Fulfillment',
        text: 'Parent PO split across child POs. Fulfillment cascades: parent GI triggers child GI. Revenue distributed per child allocation (SSP). Hierarchy simplifies multi-line bundle recognition.'
      },
      {
        name: 'Cost Allocation by Hours/Units',
        text: 'Direct allocation method. Fixed-price project: $400k estimated cost across $500k revenue. Labor hours define cost per PO: 60% to dev (product), 40% to impl (services). Margin per PO = revenue - allocated cost.'
      },
      {
        name: 'Variable Considerations in Deferral',
        text: 'Discount (10% if customer hits 100 units/month) defers revenue until milestone confirmed. GL: deferral account pending, revenue posted month-end. Accrual method + constraint assessment needed.'
      }
    ],
    junior: [
      {
        q: 'Fulfillment event Goods Issue (GI) recognizes revenue when?',
        opts: ['Sales order created', 'Invoice issued', 'Goods leave warehouse', 'Goods received by customer'],
        ans: 2,
        exp: 'GI event: revenue at warehouse delivery (seller shipped control transfers). Typical for product sales with shipped-term invoice.'
      },
      {
        q: 'SaaS subscription $1,200/12 months fulfillment type?',
        opts: ['Goods Issue', 'Service Acceptance', 'Time-based straight-line', 'Customer Invoice'],
        ans: 2,
        exp: 'Time-based: contract start date → contract end date; spread revenue over period. Subscription = $100/month accrual.'
      },
      {
        q: 'Fixed-price project revenue $500k; cost estimate $400k; actuals month 1 = $100k (25% spent). Revenue recognized?',
        opts: ['$0', '$125k (25% of $500k)', '$500k (full)', 'Depends on milestone'],
        ans: 1,
        exp: 'Percentage-of-completion: 25% spent = 25% of revenue (assuming cost % = completion %). Revenue $125k month 1.'
      },
      {
        q: 'Contract liability GL means?',
        opts: ['We owe customer', 'Customer paid upfront; revenue deferred', 'Invoice unpaid', 'Advance deposit'],
        ans: 1,
        exp: 'Liability: cash received, revenue deferred. Subscription billed Oct for Oct-Dec = $200 liability (Nov-Dec revenue not yet earned).'
      },
      {
        q: 'Billed Oct 1 for Oct-Dec subscription ($300 total). Oct GL revenue?',
        opts: ['$300 revenue, $0 liability', '$100 revenue, $200 liability', '$200 revenue, $100 liability', '$0 revenue, $300 liability'],
        ans: 1,
        exp: 'Time-based deferral: Oct = 1/3 of contract = $100 revenue recognized. $200 flows through deferred revenue liability GL.'
      },
      {
        q: 'Drop shipping means?',
        opts: ['Customer cancels order', 'Vendor ships direct to end-customer', 'Delayed shipping', 'Refund issued'],
        ans: 1,
        exp: 'Drop shipping: seller doesn\'t hold inventory. Vendor ships direct. Revenue event: seller GI (transfer to end-customer).'
      },
      {
        q: 'Goods in Transit (GIT) scenario: seller GI day 1, buyer GR day 5. GL reconciliation day 1?',
        opts: ['Balanced', 'Seller A/R unmatched', 'Buyer inventory on BS', 'No GL entry until day 5'],
        ans: 1,
        exp: 'GIT GL unbalanced day 1-4: seller posts revenue A/R; buyer posts inventory liability. Month-end reconciliation matches A/R ↔ A/P.'
      },
      {
        q: 'Variable consideration (10% discount if 100+ units) deferred revenue?',
        opts: ['Recognize full revenue upfront', 'Defer 10% until 100 units confirmed', 'No GL entry until discount earned', 'Both B & C'],
        ans: 2,
        exp: 'Variable with constraint: defer 10% revenue in deferred GL account until milestone (100 units) confirmed. Then reverse deferral, recognize revenue.'
      }
    ],
    senior: [
      {
        q: 'Drop shipping: Seller recognizes $100k revenue GI. Buyer inventory received next day. GL impact seller day 1?',
        opts: ['$100k revenue posted', '$100k A/R, $100k revenue', 'GL unbalanced until buyer GR', 'No GL until intercompany reconciliation'],
        ans: 1,
        exp: 'Drop shipping: seller GI = control transfer = revenue event. GL: debit A/R, credit revenue. Buyer GL separate.'
      },
      {
        q: 'Fixed-price project: estimated $400k, revenue $500k. Month 1 actuals $150k (vs $100k estimated). Revised estimate now $450k (overrun). Revenue recognition impact?',
        opts: ['Reduce to 150/450 = 33% of $500k = $165k', 'Keep 25% recognition; accrue $50k loss', 'Reverse prior $125k; re-post $165k', 'All of above in sequence'],
        ans: 2,
        exp: 'Cost overrun = margin erosion visible real-time. GLs: reverse prior month revenue, post corrected amount, accrue cost loss GL entry.'
      },
      {
        q: 'Compound structure (parent subscription, child overages): Parent time-based monthly; child usage-based daily. Fulfillment conflict?',
        opts: ['Impossible; must use same method', 'Parent monthly cascades to child', 'Each PO independent recognition', 'Requires BRF+ override rule'],
        ans: 2,
        exp: 'Hierarchy ≠ forced-same method. Parent uses time-based; child usage-based. GL posts separately per PO. Reconciliation ensures total = contract.'
      },
      {
        q: 'Intercompany GIT: Seller FOB Shipping Point posts GI (revenue $100k) month 1; buyer doesn\'t GR until month 2. Consolidation approach?',
        opts: ['Eliminate seller revenue month 1', 'Consolidation GL entry reverses month 1 revenue until GR', 'No elimination; each entity correct', 'Depends on consolidation method'],
        ans: 2,
        exp: 'FOB Shipping Point: control transfers at GI. Each entity GL correct per ownership timing. Consolidation ≠ elimination here (external customer not involved).'
      },
      {
        q: 'Contract deferral: time-based spread month 1-36. Cost overrun month 6 → accrue $50k loss. GL adjustment?',
        opts: ['Post $50k COGS loss GL only', 'Reverse deferred revenue per overrun; post loss', 'Keep deferral; loss recognized at close', 'Accrue to WIP, not revenue GL'],
        ans: 1,
        exp: 'Deferral method (time-based) unchanged. Cost loss accrual separate GL entry. Revenue GL continues monthly; cost GL shows margin erosion.'
      }
    ]
  },

  {
    id: 'rar_day6',
    title: 'Day 6',
    subtitle: 'Contract Modifications & Retrospective/Prospective Changes',
    concepts: [
      {
        name: 'Contract Change Types',
        text: 'Scope increase/decrease (more/less POs). Price adjustment (same scope, different price). Attribute change (dates, customer). Structure change (hierarchy modification). Each type has different GL impact.'
      },
      {
        name: 'Retrospective vs. Prospective Changes',
        text: 'Retrospective: prior periods affected (cumulative GL reversal + new calculation). Example: customer reduces scope mid-contract; revenue for months 1-3 recalculated. Prospective: forward-only (no prior reversal). Example: price increase effective month 4.'
      },
      {
        name: 'Change Type Determination (BRF+)',
        text: 'Rule evaluates: if scope change + revenue reduction = retrospective. If price increase only = prospective. If mixed = mixed. GL impact varies: retrospective = more GL entries; prospective = simpler.'
      },
      {
        name: 'Remaining Price & Remaining SSP Calculation',
        text: 'After change: calculate remaining contract amount. Example: $500k contract, customer reduces scope = $400k remaining. Recalculate SSP per remaining POs. Re-allocate remaining revenue.'
      },
      {
        name: 'GL Impact by Change Type',
        text: 'Retrospective: reverse prior revenue GL → post corrected amounts for periods 1-N → forward GL = new amounts. Prospective: forward GL = new amounts only. Month-end reconciliation verifies totals match contract.'
      },
      {
        name: 'Real Scenarios: Scope Reduction',
        text: 'Customer cancels support PO. Removes $4k SSP from bundle. Remaining: device $10k + data $3k = $13k SSP. Re-allocate revenue proportionally. GL: reverse support revenue, post adjustments.'
      },
      {
        name: 'Real Scenarios: Price Increase',
        text: 'Customer adds features; price rises $50k. Retrospective if features consumed already (cumulative adjustment). Prospective if features start month 4. GL: history stays; forward GL = higher amounts.'
      },
      {
        name: 'Early Termination Impact',
        text: 'Customer cancels contract month 6 of 12. Remaining 6-month revenue reversed. Cost GL: accruals released. Net GL impact = revenue + cost reconciliation for 6-month period.'
      },
      {
        name: 'Contract Extension',
        text: 'Customer extends subscription 6 more months (annual → 18 months). Remaining revenue recalculated. New deferral schedule created. GL: extends forward, no retroactive adjustment (prospective).'
      },
      {
        name: 'Change of Estimates (Project Cost)',
        text: 'Project cost estimate rises from $400k to $450k mid-project. Margin shrinks. GL: post variance entry (cost accrual). Revenue recognition % unchanged (still uses cost ratio).'
      }
    ],
    junior: [
      {
        q: 'Contract scope reduction (remove support PO). Months 1-3 already posted revenue. GL action?',
        opts: ['Ignore; move forward only', 'Retrospective: reverse months 1-3, re-post corrected', 'Prospective: only month 4 forward', 'Both B & C per policy'],
        ans: 1,
        exp: 'Scope reduction typically retrospective: recalculate entire contract revenue, reverse prior GL entries, post corrected amounts for all periods.'
      },
      {
        q: 'Change type determination if customer reduces price $100k but keeps all POs?',
        opts: ['Retrospective (includes all prior periods)', 'Prospective (month-forward only)', 'Mixed (partial retroactive)', 'Depends on timing'],
        ans: 0,
        exp: 'Price reduction (scope unchanged) = retroactive impact usually. GL: reverse revenue for periods already recognized, re-allocate lower amount.'
      },
      {
        q: 'Remaining price calculation: $500k contract, customer adds PO ($100k SSP new). Remaining contract value?',
        opts: ['$500k (no change)', '$600k total', 'Depends on prior SSP allocation', 'Recalculate: add $100k PO value'],
        ans: 3,
        exp: 'Addition: remaining amount = $500k + new PO value. Recalculate SSP allocation across all POs (original + new).'
      },
      {
        q: 'Early termination month 6 of 12-month contract. GL reversal?',
        opts: ['Reverse all 12 months', 'Reverse only remaining 6 months', 'No reversal; revenue recognized as planned', 'Partial reversal'],
        ans: 1,
        exp: 'Early termination: reverse revenue for unfulfilled periods (months 7-12). Months 1-6 already earned; keep posted.'
      },
      {
        q: 'Contract extension: 12-month SaaS extended to 18 months. GL impact for months 1-12?',
        opts: ['Recalculate all 18 months retroactive', 'Months 1-12 unchanged; extend months 13-18 forward', 'Void contract; create new', 'Adjust months 1-12 down'],
        ans: 1,
        exp: 'Extension = prospective. Months 1-12 already recognized (time-based calendar). Months 13-18 = new revenue schedule.'
      },
      {
        q: 'Change of estimates: project cost rises $400k → $450k. Revenue recognition %?',
        opts: ['Recalculate % using $450k', 'Keep % unchanged; accrue $50k loss', 'Reverse prior revenue; re-post with new %', 'Ignore; sunk cost'],
        ans: 1,
        exp: 'Cost overrun: GL shows margin erosion via cost accrual. Revenue % recalculates going-forward (not retroactive). Prior GL stays.'
      },
      {
        q: 'Retrospective change GL workflow?',
        opts: ['Single GL entry only', 'Reverse ALL prior periods + re-post corrected + forward adjustments', 'Only current period adjustment', 'Manual month-by-month reversal'],
        ans: 1,
        exp: 'Retrospective: if contract effective day 1, reverse day 1-N GL → recalculate all periods → post corrected totals. Audit trail = change record.'
      }
    ],
    senior: [
      {
        q: 'Contract change retrospective + prospective: scope reduced ($100k revenue) from month 3 onward. Months 1-2 full, month 3+ reduced. GL impact?',
        opts: ['Reverse months 1-2 (error)', 'Keep months 1-2; reverse month 3+ unearned portion', 'Single GL entry for delta', 'Requires CFO approval first'],
        ans: 1,
        exp: 'Mixed: months 1-2 stand (fully earned before reduction). Month 3+ reversed for unearned portion. GL = one reversal + forward GL reduced.'
      },
      {
        q: 'Early termination month 6 of 12: accrued cost liability $50k for months 7-12 (SG&A allocation). GL release?',
        opts: ['Keep accrual through month 12', 'Release $50k cost liability upon termination', 'Release per actual unwinding', 'Defer release to next year'],
        ans: 1,
        exp: 'Early termination: cost accruals for future periods released (no longer owed). GL: reverse accrual liability entry.'
      },
      {
        q: 'Contract extension: 12-month → 18 months. Customer negotiates lower rate months 13-18 ($50k instead of $100k). GL for months 1-12?',
        opts: ['Recalculate all 18 months; reverse 12 + re-post', 'Months 1-12 unchanged; extend 13-18 at new rate', 'Split difference retroactively', 'Renegotiate months 1-12 also'],
        ans: 1,
        exp: 'Extension at lower rate: months 1-12 at original rate (contract consideration already set). Months 13-18 at new rate. Prospective only.'
      },
      {
        q: 'Change of estimates: project cost $400k → $450k (month 6). Prior GL %-complete postings months 1-5. Recalculation impact?',
        opts: ['Reverse all 5 months; re-post with new % estimate', 'Keep months 1-5; recalculate months 6+ %-complete going-forward', 'Post $50k loss GL; keep revenue', 'Both B & C per IAS/IFRS view'],
        ans: 3,
        exp: 'Cost change: revenue % updates forward (not retroactive). BUT cost accrual GL (loss) posted immediately. Hybrid approach: revenue prospective, cost retrospective.'
      },
      {
        q: 'Prospective change month 4: price increase $50k, no scope change. BRF+ rule says \"assume 12-month remaining horizon\". GL recognition period?',
        opts: ['Recognize $50k all month 4', 'Spread $50k across months 4-12 (9 months remaining)', 'Recognize $50k cumulatively over original term', 'Depends on contract language'],
        ans: 1,
        exp: 'Prospective: additional revenue (price increase) recognized prospectively. If months 4-12 remain, spread $50k across 9 months = $5.5k/month increase.'
      }
    ]
  },

  {
    id: 'rar_day7',
    title: 'Day 7',
    subtitle: 'Revenue Posting, GL Integration & Month-End Close',
    concepts: [
      {
        name: '3-Step Revenue Posting Process',
        text: 'Step 1: Transfer revenue data from RAI/contracts to posting area. Step 2: Calculate contract liability/asset GL balance (deferred amount). Step 3: Distribute calculated revenue to GL accounts (revenue, liability, asset).'
      },
      {
        name: 'Contract Liability Calculation (BRF+)',
        text: 'Formula: total contract revenue - revenue already posted = remaining liability. GL: debit/credit deferred revenue GL. Example: $1,200 annual subscription, $100 recognized month 1 = $1,100 liability remaining.'
      },
      {
        name: 'Contract Asset Calculation (BRF+)',
        text: 'When revenue recognized > billed (receivable exists). GL: debit contract asset (BS), credit revenue (P&L). Example: fixed-price project recognizes $200k month 1, only billed $150k = $50k asset.'
      },
      {
        name: 'Account Determination Rules (BRF+)',
        text: 'Maps contract characteristics → GL account. Examples: contract type = subscription → GL 4130000. Customer segment = enterprise → GL 4110000. BRF+ condition table + decision table = GL account lookup.'
      },
      {
        name: 'Revenue GL Accounts',
        text: '4100000–4199999 (product revenue), 4200000–4299999 (service revenue), 4300000–4399999 (subscription revenue). Account determination rule selects specific GL per contract type/customer.'
      },
      {
        name: 'Deferred Revenue GL (BS)',
        text: '13701400–13701499: contract liability (customer paid, revenue deferred). Flows through revenue posting GL. Reconciliation: opening + revenue posted - revenue recognized = ending liability GL.'
      },
      {
        name: 'Revenue Posting Execution (FARR_REV_POSTING)',
        text: 'T-code to run 3-step posting. Can be monthly batch or on-demand. Logs posting results: GL account, amount, date. Errors block posting; must investigate & fix before re-run.'
      },
      {
        name: 'Manual Posting & Reversals',
        text: 'If automatic posting fails: manual GL entry creation via FARA_POST. GL: debit revenue GL, credit contract liability GL. Adjustment entries must reconcile contract account.'
      },
      {
        name: 'Month-End Close Timeline',
        text: 'Day 1-25: RAI inbound, contract creation, GL posting ongoing. Day 25: lock amendments (prevent new changes). Day 26-28: recalculate all contracts (cost, revenue %). Day 28: post GL, reconcile. Day 29-30: sign-off.'
      },
      {
        name: 'Recalculation Execution (FARR_REV_POSTING)',
        text: 'Full vs. partial. Full: recalculate every contract from scratch (slow, comprehensive). Partial: only changed contracts (faster). Error handling: if formula fails, partial GL may post partial amounts (must verify totals).'
      },
      {
        name: 'Reconciliation: RAR Subledger ↔ GL',
        text: 'RAR contract totals should match GL revenue account totals (by GL code). Run reconciliation report (FARA_RECON). Variance = unposted contracts or GL posting errors. Investigation required before sign-off.'
      },
      {
        name: 'Reconciliation: RAI ↔ RAR Contracts',
        text: 'Total RAI amount should match total contract amount (except adjustments/combining). Reconciliation verifies all RAIs transferred to contracts. Gap = data loss or lost RAI.'
      }
    ],
    junior: [
      {
        q: '3-step revenue posting sequence?',
        opts: ['GL posting → liability calc → transfer', 'Transfer → liability calc → GL posting', 'GL posting → transfer → liability calc', 'All simultaneous'],
        ans: 1,
        exp: 'Step 1: Transfer RAI data. Step 2: Calc liability/asset. Step 3: Distribute to GL (revenue, liability, asset).'
      },
      {
        q: 'Contract liability GL represents?',
        opts: ['Money company owes vendor', 'Customer paid, revenue deferred (BS liability)', 'Unpaid invoice', 'Warranty reserve'],
        ans: 1,
        exp: 'Liability: subscription $1,200 annual, $100 recognized month 1 = $1,100 deferred liability GL.'
      },
      {
        q: 'Revenue GL account example?',
        opts: ['13701400 (liability)', '4100000–4199999 (product revenue)', '1200000 (inventory)', '5000000 (COGS)'],
        ans: 1,
        exp: '4100000–4199999 = product revenue GL accounts. Account determination rule picks specific code per contract.'
      },
      {
        q: 'Account determination rule driven by?',
        opts: ['Manual entry', 'BRF+ condition table (contract type, customer segment) → decision table (if X then GL account)', 'Fixed GL per module', 'Accounting department choice'],
        ans: 1,
        exp: 'BRF+ account determination: evaluates contract characteristics → returns GL account. Configured per revenue model.'
      },
      {
        q: 'Contract asset GL created when?',
        opts: ['Always', 'When customer paid', 'When revenue recognized > billed', 'Never; not used in RAR'],
        ans: 2,
        exp: 'Asset: revenue recognized $200k, only billed $150k = $50k contract asset GL (receivable).'
      },
      {
        q: 'Month-end close day 25 action?',
        opts: ['Post all GL', 'Lock amendments', 'Reconcile GL', 'Sign-off'],
        ans: 1,
        exp: 'Day 25: prevent new contract changes (ensures data for recalc). Days 26-28: recalc + post + reconcile. Days 29-30: sign-off.'
      },
      {
        q: 'Reconciliation RAR subledger ↔ GL?',
        opts: ['Optional', 'Compares RAR total ≠ GL account totals; flags variance', 'GL always correct; no variance possible', 'Done yearly only'],
        ans: 1,
        exp: 'Month-end: RAR contract totals should = GL revenue account. Variance = unposted contracts or GL errors.'
      },
      {
        q: 'Revenue posting error blocks?',
        opts: ['Current GL only', 'Current + next month posting', 'Does not block; partial GL ok', 'Requires CFO override'],
        ans: 1,
        exp: 'Posting error: prevents step 3 execution. Must investigate & fix error before re-run (partial GL = reconciliation gap).'
      }
    ],
    senior: [
      {
        q: 'Revenue posting scenario: 100 contracts, BRF+ account determination fails for 15. Partial GL posting?',
        opts: ['Auto-post 85 successful', 'Block all 100 until all rules resolve', 'Admin override necessary', 'Depends on error type'],
        ans: 1,
        exp: 'Batch processing: successful contracts post; failed contracts skip. Must investigate failed rules before next run. Month-end: identify + fix 15 errors.'
      },
      {
        q: 'Contract liability reconciliation month-end: opening $500k, posted $300k revenue, should = $200k liability. Actual GL = $180k. Root cause?',
        opts: ['$20k reversal/adjustment not posted', '$20k late invoice not yet RAI', 'Revenue posting incomplete', 'All of above possible'],
        ans: 3,
        exp: 'Reconciliation variance: investigate (1) adjustment GL entries, (2) late RAI inbound, (3) posting errors. Find delta source & correct.'
      },
      {
        q: 'Month-end close: close posting day 28. Day 29 new contract amended (retroactive price cut). Policy?',
        opts: ['Ignore; period locked', 'Post adjustment GL for retroactive impact', 'Reverse prior GL + repost corrected', 'Delay close to accommodate'],
        ans: 1,
        exp: 'Close-locked period: amendments after lock date must wait until next month. Post adjustment GL next period. Or: reopen, post, re-close (risky; audit).'
      },
      {
        q: 'Full recalculation (all 1000 contracts) vs. Partial (50 changed contracts): which for month-end?',
        opts: ['Always full (safest)', 'Partial faster; sufficient if change tracking accurate', 'Depends on system load', 'Alternate full/partial months'],
        ans: 1,
        exp: 'Month-end: full recalculation best practice (catches hidden changes). Partial acceptable if change log 100% accurate & system tested.'
      },
      {
        q: 'GL reconciliation: RAR contracts $10M; GL revenue account shows $9.8M. $200k gap possible sources?',
        opts: ['Manual GL entries (adjustments) posted directly', 'Unposted contracts in RAR', 'Contract combining delta', 'All possible; investigate each'],
        ans: 3,
        exp: 'Gap analysis: (1) check FARR_REV_POSTING logs (unposted), (2) query manual GL entries (adjustments), (3) verify combining rules. Methodical approach.'
      }
    ]
  },

  // Reference Tabs (10-13)
  {
    id: 'rar_tab10',
    title: 'Tab 10',
    subtitle: 'T-Codes & Tables Reference',
    concepts: [
      { name: 'BRIM', text: 'RAR Configuration Home - Entry point for all RAR setup' },
      { name: 'FARR_IMG', text: 'Revenue Accounting Item Master - Create/maintain RAI classes' },
      { name: 'FARR_RAI', text: 'Revenue Accounting Item Monitor - View RAI status, debug inbound' },
      { name: 'FARA_C', text: 'Revenue Accounting Contract - Create/maintain contracts' },
      { name: 'FARA_POB', text: 'Performance Obligation - Create/maintain POs' },
      { name: 'FARR_REV_POSTING', text: '3-Step Revenue Posting Execution - Run monthly GL posting' },
      { name: 'FARA_RECON', text: 'Reconciliation - RAR subledger ↔ GL match' },
      { name: 'SE16N', text: 'Data Query Tool - Query ARAR tables for troubleshooting' },
      { name: 'ARAR_RAI', text: 'Raw RAI data storage - Filter by status, date, amount' },
      { name: 'ARAR_C', text: 'Contract master data - Query by customer, amount, status' },
      { name: 'ARAR_REV', text: 'Revenue posting results - GL posting details by date' },
      { name: 'ACDOCA', text: 'Universal Journal (FI table) - All GL entries for revenue accounts' }
    ],
    junior: []
  },

  {
    id: 'rar_tab11',
    title: 'Tab 11',
    subtitle: 'BRF+ Configuration & Account Determination',
    concepts: [
      {
        name: 'BRF+ Role in RAR',
        text: 'Business Rules Framework+ = if-then rules engine. Used in: RAI processing (quantity determination), contract creation (determination & combining), revenue posting (account determination), deferral (method selection).'
      },
      {
        name: 'Account Determination Workflow',
        text: 'Contract characteristics → BRF+ condition table → decision table → GL account returned. Condition table = lookup data (contract type, segment). Decision table = rules (if subscription then GL 4130000).'
      },
      {
        name: 'Condition Table Configuration',
        text: 'Columns: contract type, customer segment, profit center → GL account. Example: (Subscription, Enterprise, 1000) → 4110000. Rows added per business model.'
      },
      {
        name: 'Decision Table Configuration',
        text: 'If-then rules. Example: IF contract type = "Subscription" AND customer segment = "Enterprise" THEN GL account = 4110000. Multiple rules evaluated top-down; first match wins.'
      },
      {
        name: 'BRF+ Account Determination Flowchart',
        text: 'Contract created → BRF+ account determination rule fires → evaluates contract type + customer segment + profit center → condition table lookup → returns GL account → revenue GL posting uses GL.'
      },
      {
        name: 'BRF+ SD Integration Flow',
        text: 'SD order → GI event → ARDC interface → RAI created → BRF+ RAI processing (qty determination) → RAI processable → transferred to contract → BRF+ account determination → GL posting.'
      },
      {
        name: 'Configuration Checkpoints',
        text: 'Order type config (maps to RAI class), Item category config (determines fulfillment), ARDC interface (SD invoice → RAI mapping), BRF+ RAI processing (quantity/amount rules), Event mapping (GI → revenue event).'
      },
      {
        name: 'BRF+ Testing Environment',
        text: 'T-code SFRB_TESTENV or BRF+ workbench. Simulate rules: input contract characteristics → execute rule → verify GL account output. Test before production posting.'
      },
      {
        name: 'GL Posting via BRF+ Account Determination',
        text: 'FARR_REV_POSTING: for each contract, call BRF+ account determination → get GL account → post revenue to that account. Wrong GL = revenue posted to wrong P&L code.'
      },
      {
        name: 'Common BRF+ Errors',
        text: 'Condition table missing entry (no GL returned), decision rule formula error (wrong GL), rule conflict (multiple rules match), timeout (complex rule takes too long). Troubleshoot via logs (T-code FARA_BRF).'
      }
    ],
    junior: []
  },

  {
    id: 'rar_tab12',
    title: 'Tab 12',
    subtitle: 'Real-Time Revenue Recognition Patterns (EBRR, DIP, All Business Models)',
    concepts: [
      {
        name: 'EBRR Fundamentals',
        text: 'Event-Based Revenue Recognition. Revenue posted in real-time when events occur (GI, invoice, acceptance). Contrasts with period-end batch posting. Enables real-time GL margin visibility.'
      },
      {
        name: 'Real-Time Cost Matching',
        text: 'PS pattern proven in professional services: consultant logs 8 hours → cost posts → revenue must post simultaneously → GL balances real-time. Applies to: subscriptions (usage), telecom (overages), field service (labor+materials).'
      },
      {
        name: 'Deferral & Accrual Patterns',
        text: 'PS (fixed-price): $500k project estimated $300k cost → accrue $200k margin initially → adjust as actuals differ. PS (T&E): bill plan $5k monthly → accrue revenue 80% → adjust to final at close.'
      },
      {
        name: 'Fulfillment % Calculation',
        text: 'PS (fixed): % = actual cost / estimated cost. PS (T&E): % = time logged / planned hours. Subscription: % = days elapsed / days in period. Manufacturing: % = units produced / total units. BRF+ calculates %.'
      },
      {
        name: 'Reversal & Adjustment Logic',
        text: 'PS (cost overrun): reverse accrued revenue → recalculate margin → post adjustment. PS (scope cut): reverse allocated revenue for removed PO → recalculate remaining. All track via GL reconciliation.'
      },
      {
        name: 'Resource-Related Billing (DIP)',
        text: 'Dynamic Item Processor. Aggregates actual costs (project, labor) → manager reviews → decides what to bill → creates sales order → RAI → RAR contract → revenue recognition. Enables interactive billing (not auto-bill-all).'
      },
      {
        name: 'DIP Profile Components',
        text: 'Source (project costs), Characteristics (group by skill/cost type), Material Determination (map to invoice line), Aggregation (summary level), Item Category (sales doc category).'
      },
      {
        name: 'DIP + RAR Integration',
        text: 'DIP creates sales order → RAI created → RAR allocates by SSP (implementation vs. support) → revenue recognized per IFRS 15. Both resource-billing + revenue allocation in one flow.'
      },
      {
        name: 'Business Model: Subscriptions',
        text: 'Simple (monthly $100 = EBRR). Bundled (device + SaaS + support = RAR allocation). Usage-based (base + overage = DIP aggregation + EBRR simulation). All use time-based or event-based deferral.'
      },
      {
        name: 'Business Model: Professional Services',
        text: 'Fixed-price (%-complete revenue), T&E (EBRR real-time), Subscription support (time-based). Resource-related billing (DIP) aggregates costs. Margin tracking real-time via cost GL.'
      }
    ],
    junior: []
  },

  {
    id: 'rar_tab13',
    title: 'Tab 13',
    subtitle: 'Cost Accounting & Intercompany Transactions',
    concepts: [
      {
        name: 'Cost Categories',
        text: 'Direct: labor, material attributed to PO. Indirect: overhead, shared resources. Third-party: outsourced, subcontractor. Each category allocated by different driver.'
      },
      {
        name: 'Cost GL Accounts',
        text: '5000000–5100000 (COGS P&L), 1200000–1300000 (WIP inventory BS), 6000000–6100000 (overhead). Cost GL posting mirrors revenue GL posting; monthly reconciliation required.'
      },
      {
        name: 'Cost Allocation Methods',
        text: 'Labor hours (total cost ÷ total hours × actual hours). Units (total cost ÷ units × units per PO). Revenue proportion (cost × revenue %). Cost drivers (SAP CO-PA hierarchies).'
      },
      {
        name: 'Cost Recognition & Margin',
        text: 'Margin = allocated revenue - allocated cost per PO. Cost overrun visible real-time. Example: $500k revenue, $100k allocated cost = $400k margin initially. Overrun → margin shrinks (negative if cost > revenue).'
      },
      {
        name: 'Intercompany Definitions',
        text: 'Seller (revenue-posting entity), Buyer (receiving-entity). Legal entities within corporate group. Goods flow: seller GI → buyer GR. Revenue timing may not align (GL unbalanced interim).'
      },
      {
        name: 'Intercompany Revenue Timing',
        text: 'Seller posts GI day 1 (revenue recognized). Buyer posts GR day 5 (inventory received). GL unbalanced days 1-4 (seller AR ≠ buyer AP). Month-end reconciliation matches by date.'
      },
      {
        name: 'Profit Elimination (Consolidation)',
        text: 'Seller revenue $100k, buyer GL cost $100k (cost recovery, no markup). Consolidated: eliminate both (net = 0). Seller markup $20k profit: eliminate in consolidation (not in standalone GL).'
      },
      {
        name: 'Transfer Pricing',
        text: 'Intercompany sale price must be "arm\'s length" (independent parties would pay). Tax authorities scrutinize. RAR: transfer price drives revenue on seller side; becomes cost on buyer side. Alignment critical.'
      },
      {
        name: 'Goods in Transit (GIT)',
        text: 'Goods shipped from seller to buyer but not received. Incoterms (FOB, CIF) determine risk transfer point. RAR fulfillment event: GI (seller) or GR (buyer) depending on Incoterm.'
      },
      {
        name: 'DIP + Cost Accounting',
        text: 'DIP aggregates actual costs → manager decides what to bill → sales order created → RAI → RAR recognizes cost recovery revenue. Enables "what to bill" control for resource-based services.'
      },
      {
        name: 'Shared Service Centers (SSC)',
        text: 'Cost-only allocation (no revenue). IT allocates to business units by headcount/usage. GL: SSC cost GL charged to receiving cost objects (profit centers). When SSC meets RAR: DIP integration for billing.'
      },
      {
        name: 'Month-End Cost Close',
        text: 'Cost actual reconciliation (post all PO receipts, timesheets, vendor invoices). Run cost allocation batch (BRF+). Post variances (actual vs. estimated). WIP closing (if project complete). Intercompany A/R ↔ A/P matching.'
      }
    ],
    junior: []
  }
];

export const RAR_ROTATION_TABS = [
  'rar_day1', 'rar_day2', 'rar_day3', 'rar_day4',
  'rar_day5', 'rar_day6', 'rar_day7'
];

export const RAR_CHEATSHEETS = {
  rar_day1: {
    title: 'IFRS 15 Five-Step Model & Constraint Assessment',
    content: `
    Step 1: Identify Contract
    - Written, oral, or implied agreement
    - Customer approval obtained
    - Payment terms & performance obligations clear
    
    Step 2: Identify Performance Obligations (POs)
    - Distinct goods/services (can benefit alone, separately identifiable)
    - Bundle (device + support + data) = up to 3 POs
    - Example: Device distinct, support distinct, data distinct = 3 POs
    
    Step 3: Determine Transaction Price
    - Invoice amount - variable considerations (discounts, refunds)
    - Constrained by probable collectibility (CRITICAL)
    - If collectibility uncertain → DEFER revenue
    
    Step 4: Allocate Price to POs (SSP Method)
    - Device $10k SSP + Support $4k + Data $3k = $17k total
    - Device allocation: ($10k/$17k) × contract price
    - Example: $10k contract → Device $5.88k, Support $2.35k, Data $1.76k
    
    Step 5: Recognize Revenue When Control Transfers
    - Event: Goods Issue, Invoice, Service Acceptance
    - Time: Daily for SaaS, monthly for subscriptions
    - Percentage: % complete for projects
    
    Constraint Assessment (Step 3)
    - Evaluate: Is collectible amount PROBABLE?
    - If NO → Defer revenue until constraint removed
    - If YES → Recognize per timing method
    - Example: Customer credit-risky → recognize 50%, defer 50%
    
    Contract Liability (BS)
    - Customer paid upfront, revenue deferred
    - Example: Annual SaaS $1,200 billed Oct 1
    - Oct GL: $100 revenue, $1,100 liability
    - Nov GL: $100 revenue, $100 liability reversed
    
    Multi-GAAP (IFRS 15 vs. US-GAAP ASC 606)
    - IFRS 15: stricter on constraint assessment, variable consideration
    - US-GAAP: may recognize different timing (rare differences)
    - Configuration: RAR supports both simultaneously
    `
  },
  rar_day2: {
    title: 'RAI Inbound Processing & ARDC Flow',
    content: `
    RAI Lifecycle
    Raw (new) → Processable (validated) → Processed (transferred)
    
    ARDC Interface (Automatic)
    1. SD invoice posted (VF01)
    2. ARDC fires nightly
    3. RAI created with: invoice #, customer, amount, date
    4. Status = Raw (may have errors)
    
    RAI Validation & Status
    Raw: Data exists but not validated
    - Can edit manually (fix invoice date, amount, etc.)
    - BRF+ rules NOT yet executed
    
    Processable: Validated, ready for contract transfer
    - BRF+ quantity determination completed
    - Planned invoices created
    - POs identified
    - Cannot edit; must reverse & re-create
    
    Processed: Transferred to contract
    - No longer editable in RAI
    - Flows into contract revenue GL
    - Audit trail complete
    
    BRF+ Functions During RAI Processing
    - Quantity Determination: calculates planned invoice qty
    - Planned Invoice Generation: auto-creates billing schedule
    - PO Creation: identifies what will be billed
    
    RAI to Sender Reconciliation
    Total RAI amount = Total SD invoice amount (same date range)
    Gap indicates: lost RAI, duplicate RAI, or ARDC error
    Must clear before revenue posting
    
    Data Flow
    VA01 (order) → VF01 (invoice) → ARDC → RAI (Raw)
    → BRF+ processing → RAI (Processable)
    → Transfer to contract → Revenue GL posting
    → GL reconciliation (month-end)
    
    SE16N Queries
    Table ARAR_RAI: filter by invoice date, customer, status
    View: invoice #, amount, status (Raw/Processable/Processed), errors
    Daily troubleshooting for stuck RAIs
    `
  }
};
