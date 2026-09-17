# TradeGuard — TBML Detection Platform (Demo)
 
A clickable, front-end-only prototype of an enterprise banking **Trade-Based Money
Laundering (TBML) Detection Platform**. It demonstrates the full compliance
workflow — from document upload through explainable alert investigation — using
realistic mock data. Built as a single-file React application styled with
Tailwind CSS.
 
> ⚠️ **Demo only.** There is no backend, database, OCR/LLM integration, or
> persistence layer. All data is hard-coded in-memory and resets on page reload.
 
---
 
## What it demonstrates
 
```
DOCUMENT UPLOAD → IDENTIFICATION → FIELD EXTRACTION → HUMAN VERIFICATION
     → TRADE DATA CONSOLIDATION → RULE ENGINE EXECUTION
     → TBML ALERTS → ALERT INVESTIGATION
```
 
## Features
 
- **Dashboard** — case/document/alert KPIs, alerts by typology / country /
  document type, rule performance table, recent trade cases
- **Trade Cases** — searchable case list
- **Document Processing wizard** — a full guided flow, with a Back button (and
  clickable stepper) on every step so you can move freely between them:
  1. Trade case details (trade type: LC Issuance, LC Advising, Export
     Collection Bill, Import Collection Bill, Bank Guarantee) + drag-and-drop
     document upload
  2. Automated document identification (with confidence scores)
  3. Per-document field extraction — a document preview on the left and
     editable extracted fields on the right, with page/field source
     references (LC, Commercial Invoice, Bill of Lading, Cover Letter each
     have their own field schema)
  4. Verification — animated OFAC/sanctions & TBML screening (Sanctions &
     Blacklisting, PEP, Vessel, Dual-Use Goods, Embargoed/Restricted Port,
     Denied Party List Screening), then a results table before continuing to
     consolidation
  5. Trade Record consolidation — a single canonical trade object built from
     all documents, each value tagged with its source document
  6. Rule engine execution — animated processing steps, then a full results
     table (34 rules evaluated: 23 pass / 4 warnings / 7 alerts)
  7. Generated alerts, with checkboxes and bulk actions — Conclude as
     STR/SAR, Close as False Positive, Approve as True Positive
- **Rule Engine** — 14 named TBML rules (High Risk Country, Trade Value
  Threshold, Port/Country Mismatch, Partial Shipment Breach, Quantity
  Mismatch, Amount Mismatch, Country of Origin Mismatch, Product Description
  Mismatch, Customer/Product Profile Mismatch, Duplicate Invoice, Missing
  Certificate of Origin, **Over/Under-Invoicing (Price Deviation)**,
  **Vessel Screening**) with expandable descriptions, and the
  Document-Level / Cross-Document / Trade-Level rule category model
  - **Over/Under-Invoicing (TBML-R033)** compares the declared Commercial
    Invoice unit price against a reference fair-market price for the HS
    code, flagging both directions: over-invoicing (value moved out of the
    applicant's jurisdiction) and under-invoicing (value retained offshore /
    duty evasion), beyond a configurable ±15% tolerance. Demo alerts:
    `ALT-100462` (Anaya Pharma Exports, +42.7% over), `ALT-100463`
    (Suresh Metals Corp, -29.8% under), and `ALT-100486` (ABC Textiles Pvt
    Ltd, the main preloaded case, +42.9% over).
  - **Vessel Screening (TBML-R034)** screens the carrying vessel identified
    on the Bill of Lading against the OFAC Sanctioned Vessels List. Demo
    alert: `ALT-100487` (MV Zaanland Trader, IMO 9432871 — sanctioned
    vessel match).
  - **Dual-Use Goods Screening (TBML-R023)** screens the declared product's
    HS code against the EU Dual-Use Control List / Wassenaar Arrangement.
    Demo alert: `ALT-100488` (Cotton Yarn, HS 5205 — possible match,
    license not on file).
- **Alerts** — filterable alert queue with a slide-in investigation panel
  showing a model recommendation + confidence score, a plain-language "why
  was this alert generated" explanation, supporting evidence (source
  document / page / field / value), and workflow (investigate / assign) +
  disposition (mark false positive / mark true positive / conclude as
  STR-SAR) actions
- **Case Management** — cases requiring action, open investigations
- **Customers** — customer/KYC-style reference table
- **Configuration** — live rule administration: enable/disable rules and edit
  thresholds
- **Audit Trail** — action log (uploads, edits, verifications, rule runs,
  alert status changes)
### Preloaded demo case: `TRD-2026-000182`
 
ABC Textiles Pvt Ltd (Applicant) / Global Trading LLC (Beneficiary), Cotton
Yarn, HS Code 5205. This case is intentionally constructed to trigger seven
alerts:
 
| Rule | Issue |
|---|---|
| TBML-R002 | Trade value (USD 2,500,000) exceeds the USD 2,000,000 threshold |
| TBML-R003 | Port of Discharge (Jebel Ali, UAE) vs. declared Discharge Country (India) on the LC |
| TBML-R004 | LC prohibits partial shipment; B/L indicates partial shipment |
| TBML-R005 | Invoice quantity (10,000 KG) vs. B/L quantity (7,500 KG) — 25% variance vs. 10% tolerance |
| TBML-R033 | Declared unit price (USD 250.00) vs. reference benchmark (USD 175.00) — 42.9% over vs. ±15% tolerance (Over-Invoicing) |
| TBML-R034 | Carrying vessel MV Zaanland Trader (IMO 9432871) matched the OFAC Sanctioned Vessels List |
| TBML-R023 | Cotton Yarn (HS 5205) sub-classification matched the EU Dual-Use Control List; no export license on file |
 
---
 
## Tech stack
 
| Layer | Choice |
|---|---|
| UI library | React (function components, `useState` / `useMemo`) |
| Styling | Tailwind CSS (core utility classes only) |
| Icons | [lucide-react](https://lucide.dev/) |
| Build tool | Vite |
| State | Local component state only — no Redux/Zustand/Context |
| Data | Static mock JS objects/arrays — no API calls, no backend |
| Charts | Hand-built horizontal bar components (no charting library) |
 
## Project structure
 
```
├── src/
│   ├── App.tsx          # entire application (all pages, components, mock data)
│   ├── main.tsx          # React entry point
│   └── index.css         # Tailwind directives
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── index.html
└── package.json
```
 
Everything — mock data, UI primitives (`Badge`, `SectionCard`, `StatCard`,
etc.), and all page components — lives in one file for easy portability
between sandboxes.
 
## Running locally
 
Requires [Node.js](https://nodejs.org) (LTS) and npm.
 
```bash
npm install
npm run dev
```
 
Then open the local URL Vite prints (typically `http://localhost:5173`).
 
### Dependencies to install if starting from a blank Vite + React template
 
```bash
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer
```
 
`tailwind.config.js`:
```js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};
```
 
`src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
 
## Deploying (free)
 
**Vercel (recommended)**
1. Push this project to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) → sign in with GitHub.
3. **Add New → Project** → import the repo.
4. Framework preset: **Vite** (auto-detected). Build command `vite build`,
   output directory `dist`.
5. Deploy — you'll get a permanent `https://your-project.vercel.app` URL.
**Netlify** works the same way as an alternative.
 
## Customizing
 
- **Mock data** — edit the constants near the top of `App.tsx`
  (`TRADE_CASES`, `CUSTOMERS`, `FIELD_SCHEMAS`, `RULE_DEFINITIONS`,
  `RULE_EXECUTION_RESULTS`, `DEMO_ALERTS`, `INITIAL_AUDIT_LOG`, etc.)
- **Analyst name/avatar** — in the sidebar footer at the bottom of the `App`
  component (search for `Surajkumar Rai` / `PN`)
- **Rules** — add or edit entries in `RULE_DEFINITIONS` (shown on the Rule
  Engine and Configuration pages) and `RULE_EXECUTION_RESULTS` (shown after
  running TBML checks)
- **Color/severity conventions** — `severityTone`, `riskTone`, `statusTone`,
  and `resultTone` helper functions map values to Tailwind color badges
  (green = pass/low, amber = warning/medium, orange = high, red =
  critical/alert)
## Known limitations (by design, as a demo)
 
- No real OCR/LLM document parsing — extraction values are pre-scripted
- No persistence — all edits (field verification, alert status changes, rule
  config changes) reset on refresh
- Only the one full demo trade case has real extracted document data; other
  cases exist only as summary rows for table/list realism
- Document preview panel is a placeholder (no real PDF rendering)
---
 
Built as an internal demo prototype. Not for production use with real
customer or trade data.
 
