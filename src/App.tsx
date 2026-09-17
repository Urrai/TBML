import React, { useState, useMemo, useEffect } from "react";
import {
  LayoutDashboard,
  Briefcase,
  FileStack,
  GitBranch,
  AlertTriangle,
  ClipboardList,
  Users,
  SlidersHorizontal,
  History,
  ChevronRight,
  ChevronDown,
  Upload,
  X,
  Check,
  FileText,
  Search,
  Bell,
  ChevronLeft,
  Loader2,
  CircleCheck,
  CircleAlert,
  TriangleAlert,
  Circle,
  Pencil,
  ArrowRight,
  Building2,
  Ship,
  ScrollText,
  PackageSearch,
  Landmark,
  FileCheck2,
  Clock,
  UserCheck,
  Flag,
  Play,
  BarChart3,
  Settings,
  LogOut,
  CalendarDays,
  Home,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

/* =========================================================================
   MOCK DATA
   ========================================================================= */

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "cases", label: "Trade Cases", icon: Briefcase },
  { id: "documents", label: "Document Processing", icon: FileStack },
  { id: "rules", label: "Rule Engine", icon: GitBranch },
  { id: "alerts", label: "Alerts", icon: AlertTriangle },
  { id: "casemgmt", label: "Case Management", icon: ClipboardList },
  { id: "customers", label: "Customers", icon: Users },
  { id: "config", label: "Configuration", icon: SlidersHorizontal },
  { id: "audit", label: "Audit Trail", icon: History },
];

const PAGE_TITLES = {
  dashboard: "Dashboard",
  cases: "Trade Cases",
  documents: "Document Processing",
  rules: "Rule Engine",
  alerts: "Alerts",
  casemgmt: "Case Management",
  customers: "Customers",
  config: "Configuration",
  audit: "Audit Trail",
};

const TRADE_CASES = [
  {
    id: "TRD-2026-000182",
    applicant: "ABC Textiles Pvt Ltd",
    beneficiary: "Global Trading LLC",
    value: "USD 2,500,000",
    docs: 4,
    risk: "Critical",
    alerts: 4,
    status: "Alerts Open",
    created: "16-Aug-2026",
  },
  {
    id: "TRD-2026-000181",
    applicant: "Nile Delta Foods Ltd",
    beneficiary: "Med Commodities SA",
    value: "USD 840,000",
    docs: 5,
    risk: "Low",
    alerts: 0,
    status: "Cleared",
    created: "15-Aug-2026",
  },
  {
    id: "TRD-2026-000180",
    applicant: "Suresh Metals Corp",
    beneficiary: "Falcon Steel Trading FZE",
    value: "USD 1,180,000",
    docs: 3,
    risk: "High",
    alerts: 2,
    status: "Investigating",
    created: "15-Aug-2026",
  },
  {
    id: "TRD-2026-000179",
    applicant: "Anaya Pharma Exports",
    beneficiary: "Meridian Health DMCC",
    value: "USD 3,120,000",
    docs: 6,
    risk: "High",
    alerts: 3,
    status: "Investigating",
    created: "14-Aug-2026",
  },
  {
    id: "TRD-2026-000178",
    applicant: "Coastal Rubber Co",
    beneficiary: "Orion Polymers Ltd",
    value: "USD 410,000",
    docs: 4,
    risk: "Low",
    alerts: 0,
    status: "Cleared",
    created: "13-Aug-2026",
  },
  {
    id: "TRD-2026-000177",
    applicant: "Vertex Auto Parts",
    beneficiary: "Continental Motors GmbH",
    value: "USD 960,000",
    docs: 5,
    risk: "Medium",
    alerts: 1,
    status: "Under Review",
    created: "12-Aug-2026",
  },
  {
    id: "TRD-2026-000176",
    applicant: "Saffron Spice Traders",
    beneficiary: "Al Waha General Trading",
    value: "USD 275,000",
    docs: 4,
    risk: "Low",
    alerts: 0,
    status: "Cleared",
    created: "11-Aug-2026",
  },
  {
    id: "TRD-2026-000175",
    applicant: "Deccan Leather Works",
    beneficiary: "Havelock Imports Ltd",
    value: "USD 1,860,000",
    docs: 4,
    risk: "High",
    alerts: 3,
    status: "Escalated",
    created: "10-Aug-2026",
  },
];

const CUSTOMERS = [
  {
    id: "CUST-10042",
    name: "ABC Textiles Pvt Ltd",
    segment: "Corporate — Textiles",
    account: "004512098231",
    riskRating: "Medium",
    cases: 14,
    country: "India",
  },
  {
    id: "CUST-10088",
    name: "Nile Delta Foods Ltd",
    segment: "Corporate — Agri Trade",
    account: "004512077410",
    riskRating: "Low",
    cases: 6,
    country: "Egypt",
  },
  {
    id: "CUST-10121",
    name: "Suresh Metals Corp",
    segment: "Corporate — Metals",
    account: "004512055982",
    riskRating: "Medium",
    cases: 9,
    country: "India",
  },
  {
    id: "CUST-10133",
    name: "Anaya Pharma Exports",
    segment: "Corporate — Pharma",
    account: "004512033761",
    riskRating: "High",
    cases: 4,
    country: "India",
  },
  {
    id: "CUST-10156",
    name: "Vertex Auto Parts",
    segment: "Corporate — Automotive",
    account: "004512021845",
    riskRating: "Low",
    cases: 11,
    country: "India",
  },
  {
    id: "CUST-10177",
    name: "Deccan Leather Works",
    segment: "Corporate — Leather Goods",
    account: "004512099120",
    riskRating: "High",
    cases: 5,
    country: "India",
  },
];

// ---- Demo Trade Case documents & extraction schema ----

const DOC_TYPES = {
  LC: "Letter of Credit",
  INVOICE: "Commercial Invoice",
  BL: "Bill of Lading",
  COVER: "Cover Letter",
};

const INITIAL_UPLOAD_FILES = [
  { id: "d1", filename: "LC_00982.pdf", size: "412 KB", docType: null },
  { id: "d2", filename: "Invoice_123.pdf", size: "198 KB", docType: null },
  { id: "d3", filename: "BL_8872.pdf", size: "266 KB", docType: null },
  { id: "d4", filename: "CoverLetter.pdf", size: "84 KB", docType: null },
];

const IDENTIFICATION_RESULTS = {
  d1: { docType: "Letter of Credit", confidence: 98.7 },
  d2: { docType: "Commercial Invoice", confidence: 99.2 },
  d3: { docType: "Bill of Lading", confidence: 97.8 },
  d4: { docType: "Cover Letter", confidence: 96.4 },
};

const FIELD_SCHEMAS = {
  d1: {
    label: "Letter of Credit",
    icon: Landmark,
    fields: [
      {
        key: "lcNumber",
        name: "LC Number",
        value: "LC-2026-00982-IN",
        confidence: 99.1,
        page: "Page 1 · Field 02",
      },
      {
        key: "applicant",
        name: "Applicant",
        value: "ABC Textiles Pvt Ltd",
        confidence: 98.5,
        page: "Page 1 · Field 05",
      },
      {
        key: "beneficiary",
        name: "Beneficiary",
        value: "Global Trading LLC",
        confidence: 99.0,
        page: "Page 1 · Field 06",
      },
      {
        key: "issuingBank",
        name: "Issuing Bank",
        value: "State Bank of India",
        confidence: 97.2,
        page: "Page 1 · Field 08",
      },
      {
        key: "advisingBank",
        name: "Advising Bank",
        value: "Emirates NBD",
        confidence: 96.8,
        page: "Page 1 · Field 09",
      },
      {
        key: "amount",
        name: "Amount",
        value: "2,500,000",
        confidence: 99.4,
        page: "Page 1 · Field 12",
      },
      {
        key: "currency",
        name: "Currency",
        value: "USD",
        confidence: 99.9,
        page: "Page 1 · Field 13",
      },
      {
        key: "expiryDate",
        name: "Expiry Date",
        value: "30-Sep-2026",
        confidence: 95.0,
        page: "Page 1 · Field 15",
      },
      {
        key: "shipmentDate",
        name: "Shipment Date",
        value: "20-Aug-2026",
        confidence: 94.2,
        page: "Page 1 · Field 16",
      },
      {
        key: "product",
        name: "Product",
        value: "Cotton Yarn",
        confidence: 97.6,
        page: "Page 2 · Field 22",
      },
      {
        key: "quantity",
        name: "Quantity",
        value: "10,000 KG",
        confidence: 96.1,
        page: "Page 2 · Field 23",
      },
      {
        key: "hsCode",
        name: "HS Code",
        value: "5205",
        confidence: 98.0,
        page: "Page 2 · Field 24",
      },
      {
        key: "countryOfOrigin",
        name: "Country of Origin",
        value: "India",
        confidence: 98.8,
        page: "Page 2 · Field 26",
      },
      {
        key: "portOfLoading",
        name: "Port of Loading",
        value: "Mundra",
        confidence: 95.5,
        page: "Page 2 · Field 28",
      },
      {
        key: "dischargeCountry",
        name: "Discharge Country",
        value: "India",
        confidence: 95.8,
        page: "Page 2 · Field 50",
      },
      {
        key: "partialShipment",
        name: "Partial Shipment Allowed",
        value: "Not Allowed",
        confidence: 94.0,
        page: "Page 2 · Field 31",
      },
      {
        key: "transshipment",
        name: "Transshipment Allowed",
        value: "Not Allowed",
        confidence: 93.5,
        page: "Page 2 · Field 32",
      },
      {
        key: "incoterms",
        name: "Incoterms",
        value: "CIF",
        confidence: 96.0,
        page: "Page 2 · Field 33",
      },
    ],
  },
  d2: {
    label: "Commercial Invoice",
    icon: ScrollText,
    fields: [
      {
        key: "invoiceNumber",
        name: "Invoice Number",
        value: "INV-2026-00982",
        confidence: 99.8,
        page: "Page 1 · Field 01",
      },
      {
        key: "invoiceDate",
        name: "Invoice Date",
        value: "15-Aug-2026",
        confidence: 98.0,
        page: "Page 1 · Field 02",
      },
      {
        key: "seller",
        name: "Seller",
        value: "Global Trading LLC",
        confidence: 99.5,
        page: "Page 1 · Field 03",
      },
      {
        key: "buyer",
        name: "Buyer",
        value: "ABC Textiles Pvt Ltd",
        confidence: 99.3,
        page: "Page 1 · Field 04",
      },
      {
        key: "product",
        name: "Product",
        value: "Cotton Yarn",
        confidence: 97.9,
        page: "Page 1 · Field 08",
      },
      {
        key: "hsCode",
        name: "HS Code",
        value: "5205",
        confidence: 98.5,
        page: "Page 1 · Field 09",
      },
      {
        key: "quantity",
        name: "Quantity",
        value: "10,000 KG",
        confidence: 99.0,
        page: "Page 1 · Field 10",
      },
      {
        key: "unitPrice",
        name: "Unit Price",
        value: "250 USD",
        confidence: 98.2,
        page: "Page 1 · Field 11",
      },
      {
        key: "totalAmount",
        name: "Total Amount",
        value: "2,500,000 USD",
        confidence: 99.1,
        page: "Page 1 · Field 12",
      },
      {
        key: "countryOfOrigin",
        name: "Country of Origin",
        value: "India",
        confidence: 98.6,
        page: "Page 1 · Field 14",
      },
      {
        key: "destination",
        name: "Country of Destination",
        value: "UAE",
        confidence: 97.0,
        page: "Page 1 · Field 15",
      },
      {
        key: "portOfLoading",
        name: "Port of Loading",
        value: "Mundra",
        confidence: 95.0,
        page: "Page 1 · Field 16",
      },
      {
        key: "portOfDischarge",
        name: "Port of Discharge",
        value: "Jebel Ali",
        confidence: 96.5,
        page: "Page 1 · Field 17",
      },
      {
        key: "incoterms",
        name: "Incoterms",
        value: "CIF",
        confidence: 96.2,
        page: "Page 1 · Field 18",
      },
    ],
  },
  d3: {
    label: "Bill of Lading",
    icon: Ship,
    fields: [
      {
        key: "blNumber",
        name: "B/L Number",
        value: "MSCU-BL-887245",
        confidence: 98.9,
        page: "Page 1 · Field 01",
      },
      {
        key: "shipper",
        name: "Shipper",
        value: "Global Trading LLC",
        confidence: 98.0,
        page: "Page 1 · Field 03",
      },
      {
        key: "consignee",
        name: "Consignee",
        value: "ABC Textiles Pvt Ltd",
        confidence: 97.5,
        page: "Page 1 · Field 04",
      },
      {
        key: "notifyParty",
        name: "Notify Party",
        value: "ABC Textiles Pvt Ltd",
        confidence: 95.0,
        page: "Page 1 · Field 05",
      },
      {
        key: "vesselName",
        name: "Vessel Name",
        value: "MSC ISTANBUL",
        confidence: 94.5,
        page: "Page 1 · Field 07",
      },
      {
        key: "voyageNumber",
        name: "Voyage Number",
        value: "226W",
        confidence: 93.0,
        page: "Page 1 · Field 08",
      },
      {
        key: "portOfLoading",
        name: "Port of Loading",
        value: "Mundra",
        confidence: 96.8,
        page: "Page 1 · Field 10",
      },
      {
        key: "portOfDischarge",
        name: "Port of Discharge",
        value: "Jebel Ali",
        confidence: 97.9,
        page: "Page 1 · Field 11",
      },
      {
        key: "placeOfReceipt",
        name: "Place of Receipt",
        value: "Mundra ICD",
        confidence: 92.0,
        page: "Page 1 · Field 12",
      },
      {
        key: "placeOfDelivery",
        name: "Place of Delivery",
        value: "Jebel Ali",
        confidence: 93.4,
        page: "Page 1 · Field 13",
      },
      {
        key: "cargoDescription",
        name: "Cargo Description",
        value: "Cotton Yarn, Grade A",
        confidence: 96.0,
        page: "Page 1 · Field 15",
      },
      {
        key: "quantity",
        name: "Quantity",
        value: "7,500 KG",
        confidence: 95.5,
        page: "Page 1 · Field 16",
      },
      {
        key: "grossWeight",
        name: "Gross Weight",
        value: "7,650 KG",
        confidence: 94.0,
        page: "Page 1 · Field 17",
      },
      {
        key: "containerNumber",
        name: "Container Number",
        value: "MSCU7712345",
        confidence: 93.8,
        page: "Page 1 · Field 18",
      },
      {
        key: "shipmentDate",
        name: "Shipment Date",
        value: "21-Aug-2026",
        confidence: 94.2,
        page: "Page 1 · Field 19",
      },
      {
        key: "partialShipment",
        name: "Partial Shipment",
        value: "Yes",
        confidence: 91.0,
        page: "Page 1 · Field 20",
      },
    ],
  },
  d4: {
    label: "Cover Letter",
    icon: FileText,
    fields: [
      {
        key: "applicant",
        name: "Applicant",
        value: "ABC Textiles Pvt Ltd",
        confidence: 96.0,
        page: "Page 1 · Field 01",
      },
      {
        key: "beneficiary",
        name: "Beneficiary",
        value: "Global Trading LLC",
        confidence: 95.5,
        page: "Page 1 · Field 02",
      },
      {
        key: "tradeReference",
        name: "Trade Reference",
        value: "TRD-2026-000182",
        confidence: 97.0,
        page: "Page 1 · Field 03",
      },
      {
        key: "documentRefs",
        name: "Document References",
        value: "LC-2026-00982-IN, INV-2026-00982, MSCU-BL-887245",
        confidence: 90.0,
        page: "Page 1 · Field 04",
      },
      {
        key: "amount",
        name: "Amount",
        value: "2,500,000 USD",
        confidence: 95.0,
        page: "Page 1 · Field 05",
      },
      {
        key: "purpose",
        name: "Purpose",
        value: "Payment against shipment of Cotton Yarn",
        confidence: 89.0,
        page: "Page 1 · Field 06",
      },
      {
        key: "instructions",
        name: "Instructions",
        value: "Documents to be forwarded to advising bank upon negotiation",
        confidence: 88.0,
        page: "Page 1 · Field 07",
      },
    ],
  },
};

const TRADE_RECORD = [
  { field: "Trade ID", value: "TRD-2026-000182", source: "Cover Letter" },
  {
    field: "Applicant",
    value: "ABC Textiles Pvt Ltd",
    source: "Letter of Credit",
  },
  {
    field: "Beneficiary",
    value: "Global Trading LLC",
    source: "Letter of Credit",
  },
  {
    field: "Seller",
    value: "Global Trading LLC",
    source: "Commercial Invoice",
  },
  {
    field: "Buyer",
    value: "ABC Textiles Pvt Ltd",
    source: "Commercial Invoice",
  },
  { field: "Product", value: "Cotton Yarn", source: "Commercial Invoice" },
  { field: "HS Code", value: "5205", source: "Commercial Invoice" },
  {
    field: "Quantity (Invoice)",
    value: "10,000 KG",
    source: "Commercial Invoice",
    flag: "Differs from B/L — see TBML-R005",
  },
  {
    field: "Quantity (B/L)",
    value: "7,500 KG",
    source: "Bill of Lading",
    flag: "Differs from Invoice — see TBML-R005",
  },
  { field: "Unit Price", value: "250 USD", source: "Commercial Invoice" },
  {
    field: "Total Value",
    value: "2,500,000 USD",
    source: "Commercial Invoice",
  },
  { field: "Currency", value: "USD", source: "Commercial Invoice" },
  { field: "Country of Origin", value: "India", source: "Commercial Invoice" },
  {
    field: "Declared Discharge Country",
    value: "India",
    source: "Letter of Credit",
    flag: "Differs from Port country — see TBML-R003",
  },
  { field: "Port of Loading", value: "Mundra", source: "Bill of Lading" },
  {
    field: "Port of Discharge",
    value: "Jebel Ali (United Arab Emirates)",
    source: "Bill of Lading",
    flag: "Differs from declared discharge country — see TBML-R003",
  },
  {
    field: "Vessel",
    value: "MSC ISTANBUL / Voy 226W",
    source: "Bill of Lading",
  },
  { field: "Shipment Date", value: "21-Aug-2026", source: "Bill of Lading" },
  { field: "Incoterms", value: "CIF", source: "Commercial Invoice" },
  {
    field: "Partial Shipment (LC Term)",
    value: "Not Allowed",
    source: "Letter of Credit",
    flag: "Breached by B/L — see TBML-R004",
  },
  {
    field: "Partial Shipment (B/L)",
    value: "Yes",
    source: "Bill of Lading",
    flag: "Breaches LC term — see TBML-R004",
  },
  { field: "Transshipment", value: "Not Allowed", source: "Letter of Credit" },
];

/* ---- Rule Engine data ---- */

const RULE_DEFINITIONS = [
  {
    id: "TBML-R001",
    name: "High Risk Country",
    description:
      "Country involved in trade is present in the configured high-risk jurisdiction list.",
    typology: "Jurisdiction Risk",
    severity: "High",
    threshold: "N/A",
    status: "Active",
    docs: "LC, Invoice, B/L",
  },
  {
    id: "TBML-R002",
    name: "Trade Value Threshold",
    description: "Trade value exceeds the configured monetary threshold.",
    typology: "Structuring",
    severity: "High",
    threshold: "USD 2,000,000",
    status: "Active",
    docs: "LC, Invoice",
  },
  {
    id: "TBML-R003",
    name: "Port / Country Mismatch",
    description:
      "Port of discharge country does not match the declared destination/discharge country.",
    typology: "Document Inconsistency",
    severity: "High",
    threshold: "N/A",
    status: "Active",
    docs: "LC, B/L",
  },
  {
    id: "TBML-R004",
    name: "Partial Shipment Not Allowed",
    description:
      "Shipment indicates partial shipment while LC terms prohibit it.",
    typology: "Trade Term Breach",
    severity: "High",
    threshold: "N/A",
    status: "Active",
    docs: "LC, B/L",
  },
  {
    id: "TBML-R005",
    name: "Quantity Mismatch",
    description:
      "Invoice quantity differs from B/L quantity beyond the configured tolerance.",
    typology: "Document Inconsistency",
    severity: "Medium",
    threshold: "10%",
    status: "Active",
    docs: "Invoice, B/L",
  },
  {
    id: "TBML-R006",
    name: "Amount Mismatch",
    description:
      "Invoice value differs from LC value beyond the configured tolerance.",
    typology: "Document Inconsistency",
    severity: "High",
    threshold: "5%",
    status: "Active",
    docs: "LC, Invoice",
  },
  {
    id: "TBML-R007",
    name: "Country of Origin Mismatch",
    description: "Country of origin differs across documents.",
    typology: "Document Inconsistency",
    severity: "High",
    threshold: "N/A",
    status: "Active",
    docs: "LC, Invoice, Certificate of Origin",
  },
  {
    id: "TBML-R008",
    name: "Product Description Mismatch",
    description: "Product description differs materially across documents.",
    typology: "Document Inconsistency",
    severity: "Medium",
    threshold: "N/A",
    status: "Active",
    docs: "Invoice, B/L, Packing List",
  },
  {
    id: "TBML-R009",
    name: "Customer / Product Profile Mismatch",
    description:
      "Product is inconsistent with the customer's known business profile.",
    typology: "Behavioural Anomaly",
    severity: "Medium",
    threshold: "N/A",
    status: "Active",
    docs: "Invoice",
  },
  {
    id: "TBML-R010",
    name: "Duplicate Invoice",
    description: "Same invoice appears in multiple trade / payment records.",
    typology: "Duplicate Financing",
    severity: "Critical",
    threshold: "N/A",
    status: "Active",
    docs: "Invoice",
  },
  {
    id: "TBML-R011",
    name: "Missing Certificate of Origin",
    description:
      "Certificate of Origin not submitted where required by product / country pairing.",
    typology: "Document Completeness",
    severity: "Low",
    threshold: "N/A",
    status: "Active",
    docs: "Certificate of Origin",
  },
  {
    id: "TBML-R033",
    name: "Over / Under-Invoicing (Price Deviation)",
    description:
      "Declared unit price on the Commercial Invoice deviates materially — above (over-invoicing) or below (under-invoicing) — from the reference fair-market price for the commodity's HS code. Over-invoicing is commonly used to move value out of a jurisdiction disguised as trade proceeds; under-invoicing is commonly used to retain value offshore or understate goods value for duty/tax purposes.",
    typology: "Trade Mispricing",
    severity: "High",
    threshold: "±15% of reference price",
    status: "Active",
    docs: "Invoice, Reference Price Database",
  },
  {
    id: "TBML-R034",
    name: "Vessel Screening",
    description:
      "The carrying vessel identified on the Bill of Lading is screened against the OFAC Sanctioned Vessels List. A match indicates the goods are being carried on a vessel subject to sanctions, which can signal an attempt to move goods or funds through a sanctioned network and requires mandatory compliance review before the trade is processed further.",
    typology: "Sanctions Exposure",
    severity: "Critical",
    threshold: "N/A — binary match / no match",
    status: "Active",
    docs: "Bill of Lading, OFAC Sanctioned Vessels List",
  },
];

const CATEGORY_MAP = {
  "TBML-R002": "Trade-Level",
  "TBML-R009": "Trade-Level",
  "TBML-R019": "Trade-Level",
  "TBML-R020": "Trade-Level",
  "TBML-R021": "Trade-Level",
  "TBML-R022": "Trade-Level",
  "TBML-R026": "Trade-Level",
  "TBML-R030": "Trade-Level",
  "TBML-R033": "Trade-Level",
  "TBML-R034": "Trade-Level",
  "TBML-R001": "Trade-Level",
  "TBML-R003": "Cross-Document",
  "TBML-R005": "Cross-Document",
  "TBML-R008": "Cross-Document",
  "TBML-R014": "Cross-Document",
  "TBML-R015": "Cross-Document",
  "TBML-R016": "Cross-Document",
  "TBML-R025": "Cross-Document",
  "TBML-R028": "Cross-Document",
  "TBML-R032": "Cross-Document",
};

const RULE_EXECUTION_RESULTS = [
  {
    ruleId: "TBML-R002",
    ruleName: "Trade Value Threshold",
    category: "Trade-Level",
    result: "ALERT",
    severity: "High",
    details:
      "Trade value USD 2,500,000 exceeds configured threshold of USD 2,000,000.",
  },
  {
    ruleId: "TBML-R003",
    ruleName: "Port / Country Mismatch",
    category: "Cross-Document",
    result: "ALERT",
    severity: "High",
    details:
      "Port of Discharge (Jebel Ali, UAE) does not match declared discharge country (India) on the LC.",
  },
  {
    ruleId: "TBML-R004",
    ruleName: "Partial Shipment Not Allowed",
    category: "Cross-Document",
    result: "ALERT",
    severity: "High",
    details:
      "B/L indicates partial shipment while the LC prohibits partial shipment.",
  },
  {
    ruleId: "TBML-R005",
    ruleName: "Quantity Mismatch",
    category: "Cross-Document",
    result: "ALERT",
    severity: "Medium",
    details:
      "Invoice quantity (10,000 KG) vs. B/L quantity (7,500 KG) — 25% variance exceeds the 10% tolerance.",
  },
  {
    ruleId: "TBML-R033",
    ruleName: "Over / Under-Invoicing (Price Deviation)",
    category: "Trade-Level",
    result: "ALERT",
    severity: "High",
    details:
      "Declared unit price of USD 250.00/unit (Cotton Yarn, HS 5205) is 42.9% above the reference fair-market benchmark price of USD 175.00/unit, exceeding the configured ±15% tolerance (Over-Invoicing).",
  },
  {
    ruleId: "TBML-R034",
    ruleName: "Vessel Screening",
    category: "Trade-Level",
    result: "ALERT",
    severity: "Critical",
    details:
      "Carrying vessel MV Zaanland Trader (IMO 9432871), extracted from the Bill of Lading, matched an entry on the OFAC Sanctioned Vessels List.",
  },
  {
    ruleId: "TBML-R001",
    ruleName: "High Risk Country",
    category: "Trade-Level",
    result: "WARNING",
    severity: "Medium",
    details:
      "Beneficiary jurisdiction is on the elevated-monitoring list; below the high-risk threshold.",
  },
  {
    ruleId: "TBML-R008",
    ruleName: "Product Description Mismatch",
    category: "Cross-Document",
    result: "WARNING",
    severity: "Medium",
    details:
      'Invoice lists "Cotton Yarn"; B/L lists "Cotton Yarn, Grade A" — minor wording variance.',
  },
  {
    ruleId: "TBML-R009",
    ruleName: "Customer / Product Profile Mismatch",
    category: "Trade-Level",
    result: "WARNING",
    severity: "Medium",
    details:
      "Trade volume exceeds the customer's average historical trade size for this product.",
  },
  {
    ruleId: "TBML-R011",
    ruleName: "Missing Certificate of Origin",
    category: "Document-Level",
    result: "WARNING",
    severity: "Low",
    details: "Certificate of Origin not submitted with this trade case.",
  },
  {
    ruleId: "TBML-R006",
    ruleName: "Amount Mismatch",
    category: "Cross-Document",
    result: "PASS",
    severity: "High",
    details: "Invoice value matches LC value within the 5% tolerance.",
  },
  {
    ruleId: "TBML-R007",
    ruleName: "Country of Origin Mismatch",
    category: "Cross-Document",
    result: "PASS",
    severity: "High",
    details: "Country of origin consistent across LC and Invoice.",
  },
  {
    ruleId: "TBML-R010",
    ruleName: "Duplicate Invoice",
    category: "Trade-Level",
    result: "PASS",
    severity: "Critical",
    details:
      "No duplicate invoice number found across trade or payment records.",
  },
  {
    ruleId: "TBML-R012",
    ruleName: "Invoice Arithmetic Check",
    category: "Document-Level",
    result: "PASS",
    severity: "Low",
    details: "Invoice total equals quantity × unit price.",
  },
  {
    ruleId: "TBML-R013",
    ruleName: "Mandatory Field Completeness",
    category: "Document-Level",
    result: "PASS",
    severity: "Low",
    details: "All mandatory fields present on submitted documents.",
  },
  {
    ruleId: "TBML-R014",
    ruleName: "Document Date Sequence",
    category: "Cross-Document",
    result: "PASS",
    severity: "Low",
    details: "Document dates follow the expected chronological sequence.",
  },
  {
    ruleId: "TBML-R015",
    ruleName: "Currency Consistency",
    category: "Cross-Document",
    result: "PASS",
    severity: "Medium",
    details: "Currency consistent across LC and Invoice.",
  },
  {
    ruleId: "TBML-R016",
    ruleName: "Incoterm Consistency",
    category: "Cross-Document",
    result: "PASS",
    severity: "Low",
    details: "Incoterms consistent across LC and Invoice.",
  },
  {
    ruleId: "TBML-R017",
    ruleName: "HS Code Validity",
    category: "Document-Level",
    result: "PASS",
    severity: "Medium",
    details: "HS Code 5205 is valid for the declared product category.",
  },
  {
    ruleId: "TBML-R018",
    ruleName: "Vessel Identification",
    category: "Document-Level",
    result: "PASS",
    severity: "Low",
    details: "Vessel name and voyage number present and correctly formatted.",
  },
  {
    ruleId: "TBML-R019",
    ruleName: "Applicant Sanctions Screening",
    category: "Trade-Level",
    result: "PASS",
    severity: "Critical",
    details: "Applicant not present on configured sanctions lists.",
  },
  {
    ruleId: "TBML-R020",
    ruleName: "Beneficiary Sanctions Screening",
    category: "Trade-Level",
    result: "PASS",
    severity: "Critical",
    details: "Beneficiary not present on configured sanctions lists.",
  },
  {
    ruleId: "TBML-R021",
    ruleName: "Applicant PEP Screening",
    category: "Trade-Level",
    result: "PASS",
    severity: "Medium",
    details: "No PEP association identified for the applicant.",
  },
  {
    ruleId: "TBML-R022",
    ruleName: "Beneficiary PEP Screening",
    category: "Trade-Level",
    result: "PASS",
    severity: "Medium",
    details: "No PEP association identified for the beneficiary.",
  },
  {
    ruleId: "TBML-R023",
    ruleName: "Dual-Use Goods Screening",
    category: "Document-Level",
    result: "ALERT",
    severity: "High",
    details:
      "HS Code 5205 sub-classification matched an entry on the EU Dual-Use Control List (Wassenaar Arrangement, Category 1 — Special Materials); no valid Dual-Use Export License found on file for this shipment.",
  },
  {
    ruleId: "TBML-R024",
    ruleName: "Embargoed Goods Screening",
    category: "Document-Level",
    result: "PASS",
    severity: "High",
    details: "Product not subject to embargo restrictions.",
  },
  {
    ruleId: "TBML-R025",
    ruleName: "Prohibited Port Screening",
    category: "Cross-Document",
    result: "PASS",
    severity: "High",
    details:
      "Ports of loading and discharge are not on the restricted port list.",
  },
  {
    ruleId: "TBML-R026",
    ruleName: "Shell Company Indicator",
    category: "Trade-Level",
    result: "PASS",
    severity: "Medium",
    details: "No shell company indicators identified for either counterparty.",
  },
  {
    ruleId: "TBML-R027",
    ruleName: "Bank BIC Validation",
    category: "Document-Level",
    result: "PASS",
    severity: "Low",
    details: "Issuing and advising bank BIC codes are valid.",
  },
  {
    ruleId: "TBML-R028",
    ruleName: "Freight Forwarder Consistency",
    category: "Cross-Document",
    result: "PASS",
    severity: "Low",
    details: "Named parties consistent between B/L and Cover Letter.",
  },
  {
    ruleId: "TBML-R029",
    ruleName: "Weight Plausibility Check",
    category: "Document-Level",
    result: "PASS",
    severity: "Low",
    details: "Gross weight is consistent with the declared commodity type.",
  },
  {
    ruleId: "TBML-R030",
    ruleName: "Price Reasonableness Check",
    category: "Trade-Level",
    result: "PASS",
    severity: "Medium",
    details:
      "Unit price is within the expected market range for the commodity.",
  },
  {
    ruleId: "TBML-R031",
    ruleName: "Container Number Format Check",
    category: "Document-Level",
    result: "PASS",
    severity: "Low",
    details: "Container number matches ISO 6346 format.",
  },
  {
    ruleId: "TBML-R032",
    ruleName: "Route Plausibility Check",
    category: "Cross-Document",
    result: "PASS",
    severity: "Low",
    details: "Shipping route between declared ports is commercially plausible.",
  },
];

const DEMO_ALERTS = [
  {
    id: "ALT-100482",
    modelRecommendation: "Likely True Positive",
    confidenceScore: 91,
    ruleId: "TBML-R002",
    ruleName: "Trade Value Threshold",
    tradeId: "TRD-2026-000182",
    applicant: "ABC Textiles Pvt Ltd",
    typology: "Structuring",
    severity: "High",
    status: "Open",
    created: "16-Aug-2026 09:42",
    assignedTo: "Unassigned",
    why: "The consolidated trade value for this case is USD 2,500,000. The Rule Engine compares every trade value against the configured monetary threshold of USD 2,000,000. Because the trade value exceeds that threshold by USD 500,000, the rule condition is met and this alert was generated.",
    evidence: [
      {
        doc: "Commercial Invoice",
        page: "Page 1",
        field: "Total Amount",
        value: "2,500,000 USD",
      },
      {
        doc: "Letter of Credit",
        page: "Page 1",
        field: "Amount",
        value: "2,500,000 USD",
      },
    ],
    metrics: [
      { label: "Trade Value", value: "USD 2,500,000" },
      { label: "Configured Threshold", value: "USD 2,000,000" },
      { label: "Difference", value: "USD 500,000" },
    ],
  },
  {
    id: "ALT-100483",
    modelRecommendation: "Likely True Positive",
    confidenceScore: 88,
    ruleId: "TBML-R003",
    ruleName: "Port / Country Mismatch",
    tradeId: "TRD-2026-000182",
    applicant: "ABC Textiles Pvt Ltd",
    typology: "Document Inconsistency",
    severity: "High",
    status: "Open",
    created: "16-Aug-2026 09:42",
    assignedTo: "Unassigned",
    why: "The Port of Discharge extracted from the Bill of Lading is Jebel Ali. Jebel Ali is located in the United Arab Emirates. However, the declared discharge country extracted from the Letter of Credit is India. Because the physical discharge location and the declared discharge country belong to different jurisdictions, the values do not match and this alert was generated.",
    evidence: [
      {
        doc: "Bill of Lading",
        page: "Page 1",
        field: "Port of Discharge",
        value: "Jebel Ali",
      },
      {
        doc: "Letter of Credit",
        page: "Page 2",
        field: "Discharge Country",
        value: "India",
      },
    ],
    metrics: [
      { label: "Port of Discharge", value: "Jebel Ali" },
      { label: "Port Country", value: "United Arab Emirates" },
      { label: "Declared Discharge Country", value: "India" },
      { label: "Result", value: "Mismatch" },
    ],
  },
  {
    id: "ALT-100484",
    modelRecommendation: "Likely True Positive",
    confidenceScore: 84,
    ruleId: "TBML-R004",
    ruleName: "Partial Shipment Not Allowed",
    tradeId: "TRD-2026-000182",
    applicant: "ABC Textiles Pvt Ltd",
    typology: "Trade Term Breach",
    severity: "High",
    status: "Open",
    created: "16-Aug-2026 09:42",
    assignedTo: "Unassigned",
    why: "The Letter of Credit explicitly states that partial shipment is not allowed. The Bill of Lading, however, indicates that the shipment was made as a partial shipment. Because the shipment document contradicts the binding LC term, this represents a breach of the trade instrument and this alert was generated.",
    evidence: [
      {
        doc: "Letter of Credit",
        page: "Page 2",
        field: "Partial Shipment Allowed",
        value: "Not Allowed",
      },
      {
        doc: "Bill of Lading",
        page: "Page 1",
        field: "Partial Shipment",
        value: "Yes",
      },
    ],
    metrics: [
      { label: "LC Term", value: "Partial Shipment = Not Allowed" },
      { label: "Shipment Document", value: "Partial Shipment = Yes" },
      { label: "Result", value: "Breach" },
    ],
  },
  {
    id: "ALT-100485",
    modelRecommendation: "Needs Review",
    confidenceScore: 62,
    ruleId: "TBML-R005",
    ruleName: "Quantity Mismatch",
    tradeId: "TRD-2026-000182",
    applicant: "ABC Textiles Pvt Ltd",
    typology: "Document Inconsistency",
    severity: "Medium",
    status: "Open",
    created: "16-Aug-2026 09:42",
    assignedTo: "Unassigned",
    why: "The Commercial Invoice declares a shipped quantity of 10,000 KG, while the Bill of Lading — the document evidencing what was actually loaded onto the vessel — records only 7,500 KG. This 25% variance exceeds the configured 10% tolerance, suggesting the goods physically shipped may not match what was invoiced, a common indicator of over- or under-invoicing.",
    evidence: [
      {
        doc: "Commercial Invoice",
        page: "Page 1",
        field: "Quantity",
        value: "10,000 KG",
      },
      {
        doc: "Bill of Lading",
        page: "Page 1",
        field: "Quantity",
        value: "7,500 KG",
      },
    ],
    metrics: [
      { label: "Invoice Quantity", value: "10,000 KG" },
      { label: "B/L Quantity", value: "7,500 KG" },
      { label: "Variance", value: "25%" },
      { label: "Configured Tolerance", value: "10%" },
    ],
  },
  {
    id: "ALT-100486",
    modelRecommendation: "Likely True Positive",
    confidenceScore: 89,
    ruleId: "TBML-R033",
    ruleName: "Over / Under-Invoicing (Price Deviation)",
    tradeId: "TRD-2026-000182",
    applicant: "ABC Textiles Pvt Ltd",
    typology: "Trade Mispricing",
    severity: "High",
    status: "Open",
    created: "16-Aug-2026 09:43",
    assignedTo: "Unassigned",
    why: "The Commercial Invoice declares a unit price of USD 250.00 per unit for the exported Cotton Yarn (HS Code 5205). The Rule Engine compares this against the reference fair-market price sourced from the configured commodity benchmark for the same HS code, USD 175.00 per unit. The declared price is 42.9% above the reference price, exceeding the configured ±15% tolerance. Systematic over-invoicing of exports is a recognized TBML technique used to move value out of the applicant's jurisdiction disguised as trade proceeds.",
    evidence: [
      {
        doc: "Commercial Invoice",
        page: "Page 1",
        field: "Unit Price",
        value: "250.00 USD",
      },
      {
        doc: "Reference Price Database",
        page: "HS 5205",
        field: "Benchmark Unit Price",
        value: "175.00 USD",
      },
    ],
    metrics: [
      { label: "Declared Unit Price", value: "USD 250.00" },
      { label: "Reference Benchmark Price", value: "USD 175.00" },
      { label: "Deviation", value: "+42.9%" },
      { label: "Configured Tolerance", value: "±15%" },
      { label: "Direction", value: "Over-Invoicing" },
    ],
  },
  {
    id: "ALT-100487",
    modelRecommendation: "Likely True Positive",
    confidenceScore: 96,
    ruleId: "TBML-R034",
    ruleName: "Vessel Screening",
    tradeId: "TRD-2026-000182",
    applicant: "ABC Textiles Pvt Ltd",
    typology: "Sanctions Exposure",
    severity: "Critical",
    status: "Open",
    created: "16-Aug-2026 09:43",
    assignedTo: "Unassigned",
    why: "The Bill of Lading identifies the carrying vessel as MV Zaanland Trader (IMO 9432871). During automated Verification, this vessel was screened against the OFAC Sanctioned Vessels List and returned a match. Shipments carried on a sanctioned vessel can indicate an attempt to move goods or funds through a jurisdiction or network under sanctions, and this alert was generated for mandatory compliance review before the trade instrument is processed further.",
    evidence: [
      {
        doc: "Bill of Lading",
        page: "Page 1",
        field: "Vessel Name / IMO",
        value: "MV Zaanland Trader / IMO 9432871",
      },
      {
        doc: "OFAC Sanctioned Vessels List",
        page: "—",
        field: "Screening Result",
        value: "Match Found",
      },
    ],
    metrics: [
      { label: "Vessel", value: "MV Zaanland Trader" },
      { label: "IMO Number", value: "9432871" },
      { label: "Screening Source", value: "OFAC Sanctioned Vessels List" },
      { label: "Result", value: "Hit" },
    ],
  },
  {
    id: "ALT-100488",
    modelRecommendation: "Needs Review",
    confidenceScore: 74,
    ruleId: "TBML-R023",
    ruleName: "Dual-Use Goods Screening",
    tradeId: "TRD-2026-000182",
    applicant: "ABC Textiles Pvt Ltd",
    typology: "Export Control Risk",
    severity: "High",
    status: "Open",
    created: "16-Aug-2026 09:43",
    assignedTo: "Unassigned",
    why: "The declared product, Cotton Yarn, Grade A (HS Code 5205), was screened against the EU Dual-Use Control List and the Wassenaar Arrangement during Verification. The sub-classification matched a controlled entry under Category 1 (Special Materials), and no valid Dual-Use Export License was found on file for this shipment. Exporting dual-use or controlled goods without the required licensing is a regulatory and export-control risk and requires manual compliance review before release.",
    evidence: [
      {
        doc: "Commercial Invoice",
        page: "Page 1",
        field: "Product / HS Code",
        value: "Cotton Yarn, Grade A / HS 5205",
      },
      {
        doc: "EU Dual-Use Control List",
        page: "Category 1",
        field: "Screening Result",
        value: "Possible Match",
      },
    ],
    metrics: [
      { label: "Product", value: "Cotton Yarn, Grade A (HS 5205)" },
      { label: "Screening Source", value: "EU Dual-Use Control List, Wassenaar Arrangement" },
      { label: "License on File", value: "Not Found" },
      { label: "Result", value: "Flagged for Review" },
    ],
  },
];

const OTHER_ALERTS = [
  {
    id: "ALT-100411",
    modelRecommendation: "Likely True Positive",
    confidenceScore: 93,
    ruleId: "TBML-R001",
    ruleName: "High Risk Country",
    tradeId: "TRD-2026-000175",
    applicant: "Deccan Leather Works",
    typology: "Jurisdiction Risk",
    severity: "Critical",
    status: "Investigating",
    created: "10-Aug-2026 14:10",
    assignedTo: "R. Kapoor",
  },
  {
    id: "ALT-100420",
    modelRecommendation: "Likely True Positive",
    confidenceScore: 79,
    ruleId: "TBML-R006",
    ruleName: "Amount Mismatch",
    tradeId: "TRD-2026-000175",
    applicant: "Deccan Leather Works",
    typology: "Document Inconsistency",
    severity: "High",
    status: "Investigating",
    created: "10-Aug-2026 14:11",
    assignedTo: "R. Kapoor",
  },
  {
    id: "ALT-100428",
    modelRecommendation: "Likely True Positive",
    confidenceScore: 95,
    ruleId: "TBML-R010",
    ruleName: "Duplicate Invoice",
    tradeId: "TRD-2026-000175",
    applicant: "Deccan Leather Works",
    typology: "Duplicate Financing",
    severity: "Critical",
    status: "Escalated",
    created: "10-Aug-2026 14:12",
    assignedTo: "M. Fernandes",
  },
  {
    id: "ALT-100435",
    modelRecommendation: "Needs Review",
    confidenceScore: 58,
    ruleId: "TBML-R007",
    ruleName: "Country of Origin Mismatch",
    tradeId: "TRD-2026-000179",
    applicant: "Anaya Pharma Exports",
    typology: "Document Inconsistency",
    severity: "High",
    status: "Open",
    created: "14-Aug-2026 11:05",
    assignedTo: "Unassigned",
  },
  {
    id: "ALT-100441",
    modelRecommendation: "Likely False Positive",
    confidenceScore: 41,
    ruleId: "TBML-R009",
    ruleName: "Customer / Product Profile Mismatch",
    tradeId: "TRD-2026-000179",
    applicant: "Anaya Pharma Exports",
    typology: "Behavioural Anomaly",
    severity: "Medium",
    status: "Open",
    created: "14-Aug-2026 11:06",
    assignedTo: "Unassigned",
  },
  {
    id: "ALT-100448",
    modelRecommendation: "Likely False Positive",
    confidenceScore: 35,
    ruleId: "TBML-R003",
    ruleName: "Port / Country Mismatch",
    tradeId: "TRD-2026-000180",
    applicant: "Suresh Metals Corp",
    typology: "Document Inconsistency",
    severity: "High",
    status: "Resolved",
    created: "15-Aug-2026 08:20",
    assignedTo: "S. Iyer",
  },
  {
    id: "ALT-100455",
    modelRecommendation: "Likely False Positive",
    confidenceScore: 38,
    ruleId: "TBML-R008",
    ruleName: "Product Description Mismatch",
    tradeId: "TRD-2026-000177",
    applicant: "Vertex Auto Parts",
    typology: "Document Inconsistency",
    severity: "Medium",
    status: "Resolved",
    created: "12-Aug-2026 16:40",
    assignedTo: "S. Iyer",
  },
  {
    id: "ALT-100462",
    modelRecommendation: "Likely True Positive",
    confidenceScore: 86,
    ruleId: "TBML-R033",
    ruleName: "Over / Under-Invoicing (Price Deviation)",
    tradeId: "TRD-2026-000179",
    applicant: "Anaya Pharma Exports",
    typology: "Trade Mispricing",
    severity: "High",
    status: "Investigating",
    created: "14-Aug-2026 11:08",
    assignedTo: "Unassigned",
    why: "The Commercial Invoice declares a unit price of USD 26.40 per unit for the exported active pharmaceutical ingredient (HS Code 2941). The Rule Engine compares this against the reference fair-market price sourced from the configured commodity benchmark for the same HS code, USD 18.50 per unit. The declared price is 42.7% above the reference price, exceeding the configured ±15% tolerance. Systematic over-invoicing of exports is a recognized TBML technique used to move value out of the applicant's jurisdiction disguised as trade proceeds.",
    evidence: [
      {
        doc: "Commercial Invoice",
        page: "Page 1",
        field: "Unit Price",
        value: "USD 26.40 / unit",
      },
      {
        doc: "Reference Price Database",
        page: "—",
        field: "Benchmark Unit Price (HS 2941)",
        value: "USD 18.50 / unit",
      },
    ],
    metrics: [
      { label: "Declared Unit Price", value: "USD 26.40" },
      { label: "Reference Unit Price", value: "USD 18.50" },
      { label: "Deviation", value: "+42.7%" },
      { label: "Configured Tolerance", value: "±15%" },
      { label: "Direction", value: "Over-Invoicing" },
    ],
  },
  {
    id: "ALT-100463",
    modelRecommendation: "Likely True Positive",
    confidenceScore: 82,
    ruleId: "TBML-R033",
    ruleName: "Over / Under-Invoicing (Price Deviation)",
    tradeId: "TRD-2026-000180",
    applicant: "Suresh Metals Corp",
    typology: "Trade Mispricing",
    severity: "High",
    status: "Open",
    created: "15-Aug-2026 09:10",
    assignedTo: "Unassigned",
    why: "The Commercial Invoice declares a unit price of USD 3.65 per KG for the exported steel product (HS Code 7213). The reference fair-market price sourced from the configured commodity benchmark for the same HS code is USD 5.20 per KG. The declared price is 29.8% below the reference price, exceeding the configured ±15% tolerance. Systematic under-invoicing of exports is a recognized TBML technique used to retain value offshore or understate goods value for duty/tax purposes.",
    evidence: [
      {
        doc: "Commercial Invoice",
        page: "Page 1",
        field: "Unit Price",
        value: "USD 3.65 / KG",
      },
      {
        doc: "Reference Price Database",
        page: "—",
        field: "Benchmark Unit Price (HS 7213)",
        value: "USD 5.20 / KG",
      },
    ],
    metrics: [
      { label: "Declared Unit Price", value: "USD 3.65" },
      { label: "Reference Unit Price", value: "USD 5.20" },
      { label: "Deviation", value: "-29.8%" },
      { label: "Configured Tolerance", value: "±15%" },
      { label: "Direction", value: "Under-Invoicing" },
    ],
  },
];

const INITIAL_AUDIT_LOG = [
  {
    ts: "16-Aug-2026 09:35:02",
    user: "Mr. Suarajkumar Rai",
    action: "Trade Case Created",
    object: "TRD-2026-000182",
    oldValue: "—",
    newValue: "Case opened",
  },
  {
    ts: "16-Aug-2026 09:35:48",
    user: "Mr. Surajkumar Rai",
    action: "Document Uploaded",
    object: "LC_00982.pdf",
    oldValue: "—",
    newValue: "Uploaded",
  },
  {
    ts: "16-Aug-2026 09:35:49",
    user: "Mr. Surajkumar Rai",
    action: "Document Uploaded",
    object: "Invoice_123.pdf",
    oldValue: "—",
    newValue: "Uploaded",
  },
  {
    ts: "16-Aug-2026 09:35:50",
    user: "Mr. Surajkumar Rai",
    action: "Document Uploaded",
    object: "BL_8872.pdf",
    oldValue: "—",
    newValue: "Uploaded",
  },
  {
    ts: "16-Aug-2026 09:35:51",
    user: "Mr. Surajkumar Rai",
    action: "Document Uploaded",
    object: "CoverLetter.pdf",
    oldValue: "—",
    newValue: "Uploaded",
  },
  {
    ts: "15-Aug-2026 17:02:11",
    user: "S. Iyer",
    action: "Alert Status Changed",
    object: "ALT-100448",
    oldValue: "Investigating",
    newValue: "Resolved",
  },
  {
    ts: "15-Aug-2026 08:22:40",
    user: "System",
    action: "Alert Generated",
    object: "ALT-100448",
    oldValue: "—",
    newValue: "Open",
  },
  {
    ts: "14-Aug-2026 11:07:03",
    user: "System",
    action: "Rules Executed",
    object: "TRD-2026-000179",
    oldValue: "—",
    newValue: "32 rules evaluated",
  },
  {
    ts: "12-Aug-2026 16:41:55",
    user: "S. Iyer",
    action: "Alert Assigned",
    object: "ALT-100455",
    oldValue: "Unassigned",
    newValue: "S. Iyer",
  },
  {
    ts: "10-Aug-2026 14:12:30",
    user: "M. Fernandes",
    action: "Alert Status Changed",
    object: "ALT-100428",
    oldValue: "Investigating",
    newValue: "Escalated",
  },
  {
    ts: "14-Aug-2026 11:08:15",
    user: "System",
    action: "Alert Generated",
    object: "ALT-100462",
    oldValue: "—",
    newValue: "Open (Over-Invoicing, +42.7% vs. reference price)",
  },
  {
    ts: "15-Aug-2026 09:10:02",
    user: "System",
    action: "Alert Generated",
    object: "ALT-100463",
    oldValue: "—",
    newValue: "Open (Under-Invoicing, -29.8% vs. reference price)",
  },
];

const RUN_ENGINE_STEPS = [
  "Initializing Rule Engine",
  "Loading Trade Record",
  "Evaluating Document Rules",
  "Evaluating Cross-Document Rules",
  "Evaluating Country Rules",
  "Evaluating Threshold Rules",
  "Generating Alerts",
];

const IDENTIFY_STEPS = [
  "Reading document structure",
  "Classifying document type",
  "Matching field templates",
];

const TRADE_TYPES = [
  "LC Issuance",
  "LC Advising",
  "Export Collection Bill",
  "Import Collection Bill",
  "Bank Guarantee",
];

const SCREENING_STEPS = [
  "Sanctions & Blacklisting Screening",
  "PEP Screening",
  "Vessel Screening",
  "Dual-Use Goods Screening",
  "Embargoed / Restricted Port Screening",
  "Denied Party List Screening",
];

const SCREENING_RESULTS = [
  {
    check: "Sanctions & Blacklisting Screening",
    entity: "Applicant — ABC Textiles Pvt Ltd",
    source: "OFAC SDN, UN Consolidated, EU, UK HMT",
    result: "Clear",
  },
  {
    check: "Sanctions & Blacklisting Screening",
    entity: "Beneficiary — Al Rashid Trading LLC",
    source: "OFAC SDN, UN Consolidated, EU, UK HMT",
    result: "Clear",
  },
  {
    check: "PEP Screening",
    entity: "Applicant — Authorized Signatory",
    source: "World-Check PEP Database",
    result: "Clear",
  },
  {
    check: "PEP Screening",
    entity: "Beneficiary — Director, Al Rashid Trading LLC",
    source: "World-Check PEP Database",
    result: "Possible Match — Reviewed & Cleared",
  },
  {
    check: "Vessel Screening",
    entity: "MV Zaanland Trader (IMO 9432871)",
    source: "OFAC Sanctioned Vessels List",
    result: "Hit — Sanctioned Vessel Match",
  },
  {
    check: "Dual-Use Goods Screening",
    entity: "Cotton Yarn, Grade A (HS 5205)",
    source: "EU Dual-Use Control List, Wassenaar Arrangement",
    result: "Possible Match — Requires License Verification",
  },
  {
    check: "Embargoed / Restricted Port Screening",
    entity: "Port of Discharge — Jebel Ali, UAE",
    source: "Restricted Port List",
    result: "Clear",
  },
  {
    check: "Embargoed / Restricted Port Screening",
    entity: "Port of Loading — Nhava Sheva, India",
    source: "Restricted Port List",
    result: "Clear",
  },
  {
    check: "Denied Party List Screening",
    entity: "Applicant, Beneficiary, Issuing Bank, Advising Bank",
    source: "BIS Denied Persons List, Entity List",
    result: "Clear",
  },
];

function screeningTone(result) {
  const s = (result || "").toLowerCase();
  if (s.startsWith("clear")) return "green";
  if (s.includes("possible match")) return "amber";
  if (s.includes("hit") || s.includes("confirmed")) return "red";
  return "slate";
}

/* =========================================================================
   SMALL UI PRIMITIVES
   ========================================================================= */

function Badge({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    red: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function severityTone(sev) {
  const s = (sev || "").toLowerCase();
  if (s === "critical") return "red";
  if (s === "high") return "orange";
  if (s === "medium") return "amber";
  return "slate";
}

function riskTone(risk) {
  const s = (risk || "").toLowerCase();
  if (s === "critical") return "red";
  if (s === "high") return "orange";
  if (s === "medium") return "amber";
  return "green";
}

function statusTone(status) {
  const s = (status || "").toLowerCase();
  if (["open", "escalated"].includes(s)) return "red";
  if (["investigating", "under review", "alerts open"].includes(s))
    return "amber";
  if (["resolved", "cleared", "verified"].includes(s)) return "green";
  return "slate";
}

function resultTone(result) {
  if (result === "PASS") return "green";
  if (result === "WARNING") return "amber";
  if (result === "ALERT") return "red";
  return "slate";
}

/* Short, human-readable clause per rule, used to auto-draft STR/SAR
   narrative summaries. Falls back to a generic clause for any rule not
   listed here. */
const RULE_NARRATIVE_CLAUSES = {
  "TBML-R002":
    "the declared trade value exceeded the configured monetary threshold",
  "TBML-R003":
    "the port of discharge did not match the declared discharge country",
  "TBML-R004":
    "the shipment was made as a partial shipment despite the Letter of Credit prohibiting it",
  "TBML-R005":
    "the invoiced quantity differed materially from the quantity recorded on the Bill of Lading",
  "TBML-R033":
    "the declared unit price deviated materially from the reference fair-market price, consistent with over/under-invoicing",
  "TBML-R034":
    "the carrying vessel matched an entry on the OFAC Sanctioned Vessels List",
  "TBML-R023":
    "the declared goods matched a controlled entry on the EU Dual-Use Control List with no valid export license on file",
};

function narrativeClauseFor(alert) {
  return (
    RULE_NARRATIVE_CLAUSES[alert.ruleId] ||
    `a violation of the "${alert.ruleName}" rule was identified`
  );
}

function generateSTRNarrative(alerts, tradeId, applicant, beneficiary) {
  if (!alerts || alerts.length === 0) return "";
  const clauses = alerts.map(narrativeClauseFor).join("; ");
  return `This report concerns trade case ${tradeId} between applicant ${applicant} and beneficiary ${beneficiary}. The Rule Engine raised ${alerts.length} alert(s) on this trade selected for this filing: ${clauses}. Taken together, these inconsistencies indicate a pattern consistent with potential trade-based money laundering and are being escalated for regulatory filing.`;
}

/* Full-page STR/SAR filing review screen shown before an escalation is
   confirmed. Reused by both the Document Processing wizard and the Alerts
   page so the filing experience is identical wherever it's triggered from. */
function STRFilingScreen({
  alerts,
  tradeId,
  applicant,
  beneficiary,
  onSubmit,
  onSaveDraft,
  onBack,
}) {
  const [narrative, setNarrative] = useState(() =>
    generateSTRNarrative(alerts, tradeId, applicant, beneficiary)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          <ChevronLeft size={14} /> Back
        </button>
        <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
          STR / SAR Filing — {tradeId}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SectionCard title="Subject (Applicant)">
          <div className="text-base font-semibold text-slate-800">
            {applicant}
          </div>
        </SectionCard>
        <SectionCard title="Counterparty (Beneficiary)">
          <div className="text-base font-semibold text-slate-800">
            {beneficiary}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Alerts Referenced">
        <div className="divide-y divide-slate-100">
          {alerts.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between gap-3 py-2.5"
            >
              <span className="font-mono text-xs text-slate-400">{a.id}</span>
              <span className="flex-1 text-sm text-slate-700">
                {a.ruleName}
              </span>
              <Badge tone={severityTone(a.severity)}>{a.severity}</Badge>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Narrative Summary (auto-generated, editable before filing)">
        <textarea
          value={narrative}
          onChange={(e) => setNarrative(e.target.value)}
          rows={6}
          className="w-full resize-y rounded-md border border-slate-300 p-3 text-sm leading-relaxed text-slate-700 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
        />
      </SectionCard>

      <div className="flex gap-2">
        <button
          onClick={() => onSubmit(narrative)}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Submit STR / SAR to FIU
        </button>
        <button
          onClick={() => onSaveDraft(narrative)}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Save as Draft
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub = null, tone = "slate" }) {
  const toneText = {
    slate: "text-slate-900",
    red: "text-red-700",
    orange: "text-orange-700",
    amber: "text-amber-700",
    green: "text-green-700",
    blue: "text-blue-700",
  };
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className={`mt-1.5 text-2xl font-semibold ${toneText[tone]}`}>
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

function SectionCard({ title, right = null, children, className = "" }) {
  return (
    <div className={`rounded-lg border border-slate-200 bg-white ${className}`}>
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        {right}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

/* Real document preview: renders an uploaded PDF page-by-page with zoom and
   text search, or an image file directly. Falls back to a placeholder when
   no real file was uploaded for this document slot (e.g. preloaded demo
   data with no actual local file). */
function DocumentPreview({ file, filename }) {
  const canvasRef = React.useRef(null);
  const containerRef = React.useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [pageInput, setPageInput] = useState("1");
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [matchPages, setMatchPages] = useState([]);
  const [matchIndex, setMatchIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);

  const isPdf =
    !!file && (file.type === "application/pdf" || /\.pdf$/i.test(file.name));
  const isImage = !!file && file.type.startsWith("image/");

  useEffect(() => {
    setPdfDoc(null);
    setPageNum(1);
    setPageInput("1");
    setNumPages(0);
    setScale(1.1);
    setError(false);
    setSearchOpen(false);
    setSearchTerm("");
    setMatchPages([]);
    setMatchIndex(0);
    setImageUrl(null);

    if (!file) return;

    if (isImage) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }

    if (isPdf) {
      let cancelled = false;
      setLoading(true);
      file.arrayBuffer().then((buf) => {
        pdfjsLib
          .getDocument({ data: buf })
          .promise.then((doc) => {
            if (cancelled) return;
            setPdfDoc(doc);
            setNumPages(doc.numPages);
            setLoading(false);
          })
          .catch(() => {
            if (!cancelled) {
              setError(true);
              setLoading(false);
            }
          });
      });
      return () => {
        cancelled = true;
      };
    }
  }, [file]);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;
    let cancelled = false;
    pdfDoc.getPage(pageNum).then((page) => {
      if (cancelled) return;
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      page.render({ canvasContext: ctx, viewport });
    });
    return () => {
      cancelled = true;
    };
  }, [pdfDoc, pageNum, scale]);

  function goToPage(n) {
    const clamped = Math.min(Math.max(1, n), numPages || 1);
    setPageNum(clamped);
    setPageInput(String(clamped));
  }

  function commitPageInput() {
    const n = parseInt(pageInput, 10);
    if (!isNaN(n)) goToPage(n);
    else setPageInput(String(pageNum));
  }

  async function runSearch(term) {
    if (!pdfDoc || !term.trim()) {
      setMatchPages([]);
      return;
    }
    const needle = term.trim().toLowerCase();
    const hits = [];
    for (let p = 1; p <= numPages; p++) {
      const page = await pdfDoc.getPage(p);
      const content = await page.getTextContent();
      const text = content.items.map((it) => it.str).join(" ").toLowerCase();
      if (text.includes(needle)) hits.push(p);
    }
    setMatchPages(hits);
    setMatchIndex(0);
    if (hits.length > 0) goToPage(hits[0]);
  }

  function jumpMatch(dir) {
    if (matchPages.length === 0) return;
    const next =
      (matchIndex + dir + matchPages.length) % matchPages.length;
    setMatchIndex(next);
    goToPage(matchPages[next]);
  }

  if (!file) {
    return (
      <div className="flex h-[460px] flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 text-slate-400">
        <FileText size={40} strokeWidth={1.2} />
        <div className="mt-2 text-xs">{filename}</div>
        <div className="mt-0.5 text-[11px] text-slate-400">
          Preview rendering unavailable in demo mode
        </div>
      </div>
    );
  }

  if (isImage) {
    return (
      <div className="flex h-[460px] flex-col overflow-hidden rounded-md border border-slate-300 bg-slate-100">
        <div className="flex-1 overflow-auto p-2">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={filename}
              className="mx-auto max-w-full"
              style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}
            />
          )}
        </div>
        <div className="flex items-center justify-center gap-2 border-t border-slate-200 bg-white px-3 py-1.5">
          <button
            onClick={() => setScale((s) => Math.max(0.4, s - 0.15))}
            className="rounded p-1 text-slate-500 hover:bg-slate-100"
          >
            <ZoomOut size={14} />
          </button>
          <span className="text-[11px] text-slate-500">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale((s) => Math.min(3, s + 0.15))}
            className="rounded p-1 text-slate-500 hover:bg-slate-100"
          >
            <ZoomIn size={14} />
          </button>
        </div>
      </div>
    );
  }

  if (isPdf) {
    return (
      <div className="flex h-[460px] flex-col overflow-hidden rounded-md border border-slate-300 bg-slate-100">
        <div className="flex items-center gap-2 border-b border-slate-200 bg-white px-2 py-1.5">
          <button
            onClick={() => setScale((s) => Math.max(0.4, s - 0.15))}
            className="rounded p-1 text-slate-500 hover:bg-slate-100"
            title="Zoom out"
          >
            <ZoomOut size={14} />
          </button>
          <button
            onClick={() => setScale((s) => Math.min(3, s + 0.15))}
            className="rounded p-1 text-slate-500 hover:bg-slate-100"
            title="Zoom in"
          >
            <ZoomIn size={14} />
          </button>
          <div className="mx-1 h-4 w-px bg-slate-200" />
          <button
            onClick={() => goToPage(pageNum - 1)}
            disabled={pageNum <= 1}
            className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
          >
            <ChevronLeft size={14} />
          </button>
          <input
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            onBlur={commitPageInput}
            onKeyDown={(e) => e.key === "Enter" && commitPageInput()}
            className="w-9 rounded border border-slate-300 px-1 py-0.5 text-center text-[11px]"
          />
          <span className="text-[11px] text-slate-500">of {numPages || "…"}</span>
          <button
            onClick={() => goToPage(pageNum + 1)}
            disabled={pageNum >= numPages}
            className="rounded p-1 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
          >
            <ChevronRight size={14} />
          </button>
          <div className="mx-1 h-4 w-px bg-slate-200" />
          <button
            onClick={() => setSearchOpen((s) => !s)}
            className={`rounded p-1 hover:bg-slate-100 ${
              searchOpen ? "bg-blue-50 text-blue-600" : "text-slate-500"
            }`}
            title="Search text"
          >
            <Search size={14} />
          </button>
          {searchOpen && (
            <div className="flex flex-1 items-center gap-1">
              <input
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runSearch(searchTerm)}
                placeholder="Find in document…"
                className="w-full min-w-0 rounded border border-slate-300 px-1.5 py-0.5 text-[11px] outline-none focus:border-blue-400"
              />
              {matchPages.length > 0 && (
                <>
                  <span className="shrink-0 text-[10px] text-slate-400">
                    {matchIndex + 1}/{matchPages.length}
                  </span>
                  <button
                    onClick={() => jumpMatch(-1)}
                    className="shrink-0 rounded p-0.5 text-slate-500 hover:bg-slate-100"
                  >
                    <ChevronLeft size={12} />
                  </button>
                  <button
                    onClick={() => jumpMatch(1)}
                    className="shrink-0 rounded p-0.5 text-slate-500 hover:bg-slate-100"
                  >
                    <ChevronRight size={12} />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
        <div ref={containerRef} className="flex-1 overflow-auto p-3">
          {loading && (
            <div className="flex h-full items-center justify-center text-xs text-slate-400">
              <Loader2 size={16} className="mr-2 animate-spin" /> Loading document…
            </div>
          )}
          {error && (
            <div className="flex h-full flex-col items-center justify-center text-slate-400">
              <FileText size={32} strokeWidth={1.2} />
              <div className="mt-2 text-xs">Could not render this file</div>
            </div>
          )}
          {!loading && !error && (
            <canvas ref={canvasRef} className="mx-auto shadow-sm" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[460px] flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 text-slate-400">
      <FileText size={40} strokeWidth={1.2} />
      <div className="mt-2 text-xs">{filename}</div>
      <div className="mt-0.5 text-[11px] text-slate-400">
        Preview not available for this file type
      </div>
    </div>
  );
}


function Breadcrumbs({ items }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-slate-500">
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <ChevronRight size={12} className="text-slate-300" />}
          <span
            className={
              i === items.length - 1 ? "font-medium text-slate-700" : ""
            }
          >
            {it}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

function HBar({ label, value, max, tone = "bg-blue-600" }) {
  const pct = Math.max(4, Math.round((value / max) * 100));
  return (
    <div className="flex items-center gap-3 py-1.5">
      <div className="w-32 shrink-0 text-xs text-slate-600">{label}</div>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full ${tone}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="w-8 shrink-0 text-right text-xs font-medium text-slate-700">
        {value}
      </div>
    </div>
  );
}

/* =========================================================================
   DASHBOARD
   ========================================================================= */

function DashboardPage({ goTo }) {
  const typologyData = [
    { label: "Structuring", value: 34 },
    { label: "Doc. Inconsistency", value: 51 },
    { label: "Jurisdiction Risk", value: 22 },
    { label: "Trade Mispricing", value: 19 },
    { label: "Trade Term Breach", value: 12 },
    { label: "Duplicate Financing", value: 7 },
  ];
  const countryData = [
    { label: "United Arab Emirates", value: 38 },
    { label: "India", value: 29 },
    { label: "Hong Kong", value: 18 },
    { label: "Panama", value: 14 },
    { label: "Nigeria", value: 9 },
  ];
  const docTypeData = [
    { label: "Commercial Invoice", value: 1842 },
    { label: "Bill of Lading", value: 1390 },
    { label: "Letter of Credit", value: 1104 },
    { label: "Cover Letter", value: 812 },
    { label: "Packing List", value: 694 },
  ];
  const rulePerf = [
    { rule: "TBML-R003 Port/Country Mismatch", fired: 41, precision: "88%" },
    { rule: "TBML-R002 Trade Value Threshold", fired: 34, precision: "95%" },
    { rule: "TBML-R005 Quantity Mismatch", fired: 29, precision: "76%" },
    { rule: "TBML-R001 High Risk Country", fired: 22, precision: "91%" },
    { rule: "TBML-R033 Over/Under-Invoicing", fired: 19, precision: "83%" },
    { rule: "TBML-R004 Partial Shipment", fired: 12, precision: "97%" },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
        <StatCard label="Trade Cases" value="1,284" />
        <StatCard label="Documents Processed" value="5,842" />
        <StatCard label="Pending Verification" value="37" tone="amber" />
        <StatCard label="Rules Executed Today" value="18,420" />
        <StatCard label="Open Alerts" value="126" tone="orange" />
        <StatCard label="High Risk" value="42" tone="orange" />
        <StatCard label="Critical" value="11" tone="red" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard title="Alerts by Typology">
          {typologyData.map((d) => (
            <HBar
              key={d.label}
              label={d.label}
              value={d.value}
              max={51}
              tone="bg-blue-600"
            />
          ))}
        </SectionCard>
        <SectionCard title="Alerts by Country">
          {countryData.map((d) => (
            <HBar
              key={d.label}
              label={d.label}
              value={d.value}
              max={38}
              tone="bg-orange-500"
            />
          ))}
        </SectionCard>
        <SectionCard title="Alerts by Document Type">
          {docTypeData.map((d) => (
            <HBar
              key={d.label}
              label={d.label}
              value={d.value}
              max={1842}
              tone="bg-slate-500"
            />
          ))}
        </SectionCard>
        <SectionCard title="Rule Performance (last 30 days)">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="pb-2 font-medium">Rule</th>
                <th className="pb-2 font-medium">Fired</th>
                <th className="pb-2 font-medium">Precision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rulePerf.map((r) => (
                <tr key={r.rule}>
                  <td className="py-2 pr-2 text-slate-700">{r.rule}</td>
                  <td className="py-2 pr-2 text-slate-600">{r.fired}</td>
                  <td className="py-2 text-slate-600">{r.precision}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      </div>

      <SectionCard
        title="Recent Trade Cases"
        right={
          <button
            onClick={() => goTo("cases")}
            className="text-xs font-medium text-blue-700 hover:underline"
          >
            View all
          </button>
        }
      >
        <TradeCaseTable
          rows={TRADE_CASES.slice(0, 5)}
          onOpen={() => goTo("documents")}
        />
      </SectionCard>
    </div>
  );
}

function TradeCaseTable({ rows, onOpen }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
            <th className="py-2 pr-3 font-medium">Case ID</th>
            <th className="py-2 pr-3 font-medium">Applicant</th>
            <th className="py-2 pr-3 font-medium">Beneficiary</th>
            <th className="py-2 pr-3 font-medium">Trade Value</th>
            <th className="py-2 pr-3 font-medium">Docs</th>
            <th className="py-2 pr-3 font-medium">Risk</th>
            <th className="py-2 pr-3 font-medium">Alerts</th>
            <th className="py-2 pr-3 font-medium">Status</th>
            <th className="py-2 pr-3 font-medium">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((r) => (
            <tr
              key={r.id}
              className="cursor-pointer hover:bg-slate-50"
              onClick={onOpen}
            >
              <td className="py-2.5 pr-3 font-mono text-xs text-blue-700">
                {r.id}
              </td>
              <td className="py-2.5 pr-3 text-slate-700">{r.applicant}</td>
              <td className="py-2.5 pr-3 text-slate-700">{r.beneficiary}</td>
              <td className="py-2.5 pr-3 text-slate-700">{r.value}</td>
              <td className="py-2.5 pr-3 text-slate-600">{r.docs}</td>
              <td className="py-2.5 pr-3">
                <Badge tone={riskTone(r.risk)}>{r.risk}</Badge>
              </td>
              <td className="py-2.5 pr-3 text-slate-700">{r.alerts}</td>
              <td className="py-2.5 pr-3">
                <Badge tone={statusTone(r.status)}>{r.status}</Badge>
              </td>
              <td className="py-2.5 pr-3 text-slate-500">{r.created}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* =========================================================================
   TRADE CASES PAGE
   ========================================================================= */

function TradeCasesPage({ goTo }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search
            size={14}
            className="pointer-events-none absolute left-2.5 top-2.5 text-slate-400"
          />
          <input
            placeholder="Search case ID, applicant, beneficiary…"
            className="w-full rounded-md border border-slate-300 py-1.5 pl-8 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => goTo("documents")}
          className="rounded-md bg-blue-700 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-blue-800"
        >
          + Create Trade Case
        </button>
      </div>
      <SectionCard title={`All Trade Cases (${TRADE_CASES.length})`}>
        <TradeCaseTable rows={TRADE_CASES} onOpen={() => goTo("documents")} />
      </SectionCard>
    </div>
  );
}

/* =========================================================================
   DOCUMENT PROCESSING WIZARD
   ========================================================================= */

const WIZARD_STEPS = [
  "Trade Case",
  "Identification",
  "Extraction",
  "Verification",
  "Consolidation",
  "Rule Execution",
  "Alerts",
];

function Stepper({ step, onJump }) {
  return (
    <div className="mb-5 flex items-center overflow-x-auto rounded-lg border border-slate-200 bg-white px-4 py-3">
      {WIZARD_STEPS.map((label, i) => {
        const idx = i + 1;
        const state = idx < step ? "done" : idx === step ? "active" : "todo";
        const clickable = state === "done" && onJump;
        return (
          <React.Fragment key={label}>
            <button
              type="button"
              disabled={!clickable}
              onClick={() => clickable && onJump(idx)}
              className={`flex shrink-0 items-center gap-2 ${
                clickable ? "cursor-pointer" : "cursor-default"
              }`}
            >
              <div
                className={
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold " +
                  (state === "done"
                    ? "bg-blue-700 text-white"
                    : state === "active"
                    ? "border-2 border-blue-700 text-blue-700"
                    : "border border-slate-300 text-slate-400")
                }
              >
                {state === "done" ? <Check size={13} /> : idx}
              </div>
              <span
                className={
                  "text-xs font-medium " +
                  (state === "todo" ? "text-slate-400" : "text-slate-700") +
                  (clickable ? " hover:underline" : "")
                }
              >
                {label}
              </span>
            </button>
            {i < WIZARD_STEPS.length - 1 && (
              <div className="mx-3 h-px w-8 shrink-0 bg-slate-200" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function DocumentProcessingPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    applicant: "ABC Textiles Pvt Ltd",
    customerId: "CUST-10042",
    account: "004512098231",
    tradeRef: "TRD-2026-000182",
    tradeType: "LC Issuance",
  });
  const [files, setFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = React.useRef(null);
  const DOC_SLOT_IDS = ["d1", "d2", "d3", "d4"];

  function formatFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function addLocalFiles(fileList) {
    const incoming: any[] = Array.from(fileList || []);
    if (incoming.length === 0) return;
    setFiles((prev) => {
      const usedSlots = new Set(prev.map((f) => f.id));
      const freeSlots = DOC_SLOT_IDS.filter((id) => !usedSlots.has(id));
      const additions = incoming.slice(0, freeSlots.length).map((file, i) => ({
        id: freeSlots[i],
        filename: file.name,
        size: formatFileSize(file.size),
        docType: null,
        file,
      }));
      return [...prev, ...additions];
    });
  }

  function handleFileInputChange(e) {
    addLocalFiles(e.target.files);
    e.target.value = "";
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragOver(false);
    addLocalFiles(e.dataTransfer.files);
  }

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setIsDragOver(false);
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  const [identifying, setIdentifying] = useState(false);
  const [identified, setIdentified] = useState(false);
  const [activeDoc, setActiveDoc] = useState("d1");
  const [fieldState, setFieldState] = useState(() => {
    const initial = {};
    Object.entries(FIELD_SCHEMAS).forEach(([docId, schema]) => {
      initial[docId] = {};
      schema.fields.forEach((f) => {
        initial[docId][f.key] = { value: f.value, status: "unverified" };
      });
    });
    return initial;
  });
  const [running, setRunning] = useState(false);
  const [runProgress, setRunProgress] = useState(0);
  const [rulesRun, setRulesRun] = useState(false);
  const [screeningRunning, setScreeningRunning] = useState(false);
  const [screeningProgress, setScreeningProgress] = useState(0);
  const [screeningDone, setScreeningDone] = useState(false);
  const [wizardAlerts, setWizardAlerts] = useState(() =>
    DEMO_ALERTS.map((a) => ({ ...a }))
  );
  const [selectedAlertIds, setSelectedAlertIds] = useState([]);
  const [selectedWizardAlert, setSelectedWizardAlert] = useState(null);
  const [filingAlertIds, setFilingAlertIds] = useState(null);

  function runIdentification() {
    setIdentifying(true);
    setTimeout(() => {
      setIdentifying(false);
      setIdentified(true);
      setStep(2);
    }, 1400);
  }

  function setField(docId, key, patch) {
    setFieldState((prev) => ({
      ...prev,
      [docId]: { ...prev[docId], [key]: { ...prev[docId][key], ...patch } },
    }));
  }

  const totals = useMemo(() => {
    let total = 0,
      verified = 0;
    Object.values(fieldState).forEach((doc) =>
      Object.values(doc).forEach((f) => {
        total++;
        if (f.status === "verified") verified++;
      })
    );
    return { total, verified, review: total - verified };
  }, [fieldState]);

  function runScreening() {
    setScreeningRunning(true);
    setScreeningProgress(0);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setScreeningProgress(i);
      if (i >= SCREENING_STEPS.length) {
        clearInterval(iv);
        setTimeout(() => {
          setScreeningRunning(false);
          setScreeningDone(true);
        }, 500);
      }
    }, 420);
  }

  function runRuleEngine() {
    setStep(6);
    setRunning(true);
    setRunProgress(0);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setRunProgress(i);
      if (i >= RUN_ENGINE_STEPS.length) {
        clearInterval(iv);
        setTimeout(() => {
          setRunning(false);
          setRulesRun(true);
        }, 500);
      }
    }, 480);
  }

  function toggleAlertSelected(id) {
    setSelectedAlertIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function updateWizardAlert(id, patch) {
    setWizardAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...patch } : a))
    );
    setSelectedWizardAlert((s) => (s && s.id === id ? { ...s, ...patch } : s));
  }

  function toggleSelectAllAlerts() {
    setSelectedAlertIds((prev) =>
      prev.length === wizardAlerts.length ? [] : wizardAlerts.map((a) => a.id)
    );
  }

  function bulkDispose(disposition, status) {
    setWizardAlerts((prev) =>
      prev.map((a) =>
        selectedAlertIds.includes(a.id) ? { ...a, disposition, status } : a
      )
    );
    setSelectedAlertIds([]);
  }

  function confirmSTRFiling(narrative) {
    setWizardAlerts((prev) =>
      prev.map((a) =>
        filingAlertIds.includes(a.id)
          ? { ...a, disposition: "STR/SAR Filed", status: "Escalated", strNarrative: narrative }
          : a
      )
    );
    setFilingAlertIds(null);
    setSelectedAlertIds([]);
  }

  function saveSTRDraft(narrative) {
    setWizardAlerts((prev) =>
      prev.map((a) =>
        filingAlertIds.includes(a.id)
          ? { ...a, disposition: "STR/SAR Draft", strNarrative: narrative }
          : a
      )
    );
    setFilingAlertIds(null);
    setSelectedAlertIds([]);
  }

  function goBack() {
    setStep((s) => Math.max(1, s - 1));
  }

  return (
    <div>
      <Stepper step={step} onJump={(idx) => setStep(idx)} />

      {step === 1 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <SectionCard title="Trade Case Details" className="lg:col-span-1">
            <div className="space-y-3">
              {[
                ["Applicant", "applicant"],
                ["Customer ID", "customerId"],
                ["Account Number", "account"],
                ["Trade Reference", "tradeRef"],
              ].map(([label, key]) => (
                <div key={key}>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    {label}
                  </label>
                  <input
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Trade Type
                </label>
                <select
                  value={form.tradeType}
                  onChange={(e) =>
                    setForm({ ...form, tradeType: e.target.value })
                  }
                  className="w-full rounded-md border border-slate-300 px-2.5 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  {TRADE_TYPES.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Upload Trade Documents" className="lg:col-span-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileInputChange}
              className="hidden"
            />
            {files.length === 0 ? (
              <button
                onClick={openFilePicker}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed py-14 text-slate-500 ${
                  isDragOver
                    ? "border-blue-500 bg-blue-50/60"
                    : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/40"
                }`}
              >
                <Upload size={22} />
                <div className="text-sm font-medium text-slate-600">
                  Drag and drop files, or click to browse
                </div>
                <div className="text-xs text-slate-400">
                  PDF, JPG, PNG · up to 20MB each
                </div>
              </button>
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={
                  isDragOver
                    ? "rounded-lg ring-2 ring-blue-400 ring-offset-2"
                    : ""
                }
              >
                <div className="space-y-2">
                  {files.map((f) => (
                    <div
                      key={f.id}
                      className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText size={16} className="text-slate-400" />
                        <div>
                          <div className="text-sm font-medium text-slate-700">
                            {f.filename}
                          </div>
                          <div className="text-xs text-slate-400">{f.size}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-slate-500">
                          {f.docType || "Not classified"}
                        </span>
                        <Badge tone="blue">Uploaded</Badge>
                        <button
                          onClick={() =>
                            setFiles(files.filter((x) => x.id !== f.id))
                          }
                          className="text-slate-400 hover:text-red-600"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {files.length < 4 && (
                  <button
                    onClick={openFilePicker}
                    className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-slate-300 py-2 text-xs font-medium text-slate-500 hover:border-blue-400 hover:bg-blue-50/40 hover:text-blue-700"
                  >
                    <Upload size={12} /> Add more files
                  </button>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    {files.length} file(s) ready
                  </span>
                  <button
                    onClick={runIdentification}
                    disabled={identifying}
                    className="flex items-center gap-1.5 rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-60"
                  >
                    {identifying ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />{" "}
                        Identifying documents…
                      </>
                    ) : (
                      <>
                        Identify Documents <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </SectionCard>
        </div>
      )}

      {step === 2 && identified && (
        <div className="space-y-4">
          <SectionCard title="Document Identification Results">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-2 pr-3 font-medium">Filename</th>
                  <th className="py-2 pr-3 font-medium">
                    Detected Document Type
                  </th>
                  <th className="py-2 pr-3 font-medium">Confidence</th>
                  <th className="py-2 pr-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {files.map((f) => {
                  const r = IDENTIFICATION_RESULTS[f.id];
                  return (
                    <tr key={f.id}>
                      <td className="py-2.5 pr-3 text-slate-700">
                        {f.filename}
                      </td>
                      <td className="py-2.5 pr-3 text-slate-700">
                        {r.docType}
                      </td>
                      <td className="py-2.5 pr-3 text-slate-600">
                        {r.confidence}%
                      </td>
                      <td className="py-2.5 pr-3">
                        <Badge tone="green">
                          <CircleCheck size={12} /> Identified
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </SectionCard>
          <div className="flex items-center justify-between">
            <button
              onClick={goBack}
              className="flex items-center gap-1.5 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <ChevronLeft size={14} /> Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-1.5 rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
            >
              Proceed to Field Extraction <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div className="flex gap-2 overflow-x-auto">
            {Object.entries(FIELD_SCHEMAS).map(([docId, schema]) => {
              const Icon = schema.icon;
              return (
                <button
                  key={docId}
                  onClick={() => setActiveDoc(docId)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium ${
                    activeDoc === docId
                      ? "border-blue-600 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={13} /> {schema.label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <SectionCard
              title={`Document Preview — ${FIELD_SCHEMAS[activeDoc].label}`}
            >
              <DocumentPreview
                file={files.find((f) => f.id === activeDoc)?.file || null}
                filename={files.find((f) => f.id === activeDoc)?.filename}
              />
            </SectionCard>

            <SectionCard title="Extracted Fields">
              <div className="max-h-[460px] space-y-2 overflow-y-auto pr-1">
                {FIELD_SCHEMAS[activeDoc].fields.map((f) => {
                  const st = fieldState[activeDoc][f.key];
                  return (
                    <div
                      key={f.key}
                      className="rounded-md border border-slate-200 p-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-slate-500">
                            {f.name}
                          </div>
                          {st.status === "editing" ? (
                            <input
                              autoFocus
                              value={st.value}
                              onChange={(e) =>
                                setField(activeDoc, f.key, {
                                  value: e.target.value,
                                })
                              }
                              onBlur={() =>
                                setField(activeDoc, f.key, {
                                  status: "unverified",
                                })
                              }
                              className="mt-1 w-full rounded border border-blue-400 px-1.5 py-1 text-sm outline-none"
                            />
                          ) : (
                            <div className="mt-0.5 truncate text-sm font-medium text-slate-800">
                              {st.value}
                            </div>
                          )}
                          <div className="mt-0.5 text-[11px] text-slate-400">
                            {f.page} · Confidence {f.confidence}%
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1">
                          <Badge
                            tone={
                              st.status === "verified"
                                ? "green"
                                : st.status === "needs_review"
                                ? "amber"
                                : "slate"
                            }
                          >
                            {st.status === "verified"
                              ? "Verified"
                              : st.status === "needs_review"
                              ? "Requires Review"
                              : "Unverified"}
                          </Badge>
                          <div className="flex gap-1">
                            <button
                              onClick={() =>
                                setField(activeDoc, f.key, {
                                  status: "editing",
                                })
                              }
                              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            >
                              <Pencil size={12} />
                            </button>
                            <button
                              onClick={() =>
                                setField(activeDoc, f.key, {
                                  status: "verified",
                                })
                              }
                              className="rounded p-1 text-slate-400 hover:bg-green-50 hover:text-green-700"
                            >
                              <Check size={12} />
                            </button>
                            <button
                              onClick={() =>
                                setField(activeDoc, f.key, {
                                  status: "needs_review",
                                })
                              }
                              className="rounded p-1 text-slate-400 hover:bg-amber-50 hover:text-amber-700"
                            >
                              <Flag size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={goBack}
              className="flex items-center gap-1.5 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <ChevronLeft size={14} /> Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="flex items-center gap-1.5 rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
            >
              Continue to Verification <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <SectionCard title="Review Extracted Information">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard label="Documents" value="4" />
              <StatCard label="Fields Extracted" value={totals.total} />
              <StatCard label="Verified" value={totals.verified} tone="green" />
              <StatCard
                label="Requires Review"
                value={totals.review}
                tone="amber"
              />
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Confirm that extracted fields are accurate before running
              sanctions and TBML screening. Any field left unverified will be
              evaluated using its current extracted value.
            </p>
          </SectionCard>

          {!screeningRunning && !screeningDone && (
            <div className="flex items-center justify-between">
              <button
                onClick={goBack}
                className="flex items-center gap-1.5 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <ChevronLeft size={14} /> Back
              </button>
              <button
                onClick={runScreening}
                className="flex items-center gap-1.5 rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
              >
                <Play size={14} /> Run Sanctions &amp; TBML Screening
              </button>
            </div>
          )}

          {screeningRunning && (
            <SectionCard title="Running OFAC / Sanctions / TBML Screening">
              <div className="space-y-3 py-4">
                {SCREENING_STEPS.map((label, i) => {
                  const idx = i + 1;
                  const done =
                    idx < screeningProgress ||
                    (idx === screeningProgress && !screeningRunning);
                  const active = idx === screeningProgress && screeningRunning;
                  return (
                    <div
                      key={label}
                      className="flex items-center gap-2.5 text-sm"
                    >
                      {done ? (
                        <CircleCheck size={16} className="text-green-600" />
                      ) : active ? (
                        <Loader2
                          size={16}
                          className="animate-spin text-blue-600"
                        />
                      ) : (
                        <Circle size={16} className="text-slate-300" />
                      )}
                      <span
                        className={
                          done
                            ? "text-slate-700"
                            : active
                            ? "font-medium text-slate-800"
                            : "text-slate-400"
                        }
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          )}

          {screeningDone && (
            <>
              <SectionCard title="Screening Summary">
                <div className="grid grid-cols-3 gap-3">
                  <StatCard label="Checks Performed" value={SCREENING_RESULTS.length} />
                  <StatCard
                    label="Clear"
                    value={
                      SCREENING_RESULTS.filter((r) => r.result === "Clear")
                        .length
                    }
                    tone="green"
                  />
                  <StatCard
                    label="Reviewed & Cleared"
                    value={
                      SCREENING_RESULTS.filter((r) =>
                        r.result.includes("Possible Match")
                      ).length
                    }
                    tone="amber"
                  />
                </div>
              </SectionCard>
              <SectionCard title="Screening Results">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                        <th className="py-2 pr-3 font-medium">Check</th>
                        <th className="py-2 pr-3 font-medium">Entity</th>
                        <th className="py-2 pr-3 font-medium">Source Lists</th>
                        <th className="py-2 pr-3 font-medium">Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {SCREENING_RESULTS.map((r, i) => (
                        <tr key={i}>
                          <td className="py-2 pr-3 text-slate-700">
                            {r.check}
                          </td>
                          <td className="py-2 pr-3 text-slate-600">
                            {r.entity}
                          </td>
                          <td className="py-2 pr-3 text-xs text-slate-500">
                            {r.source}
                          </td>
                          <td className="py-2 pr-3">
                            <Badge tone={screeningTone(r.result)}>
                              {r.result}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SectionCard>
              <div className="flex items-center justify-between">
                <button
                  onClick={goBack}
                  className="flex items-center gap-1.5 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <ChevronLeft size={14} /> Back
                </button>
                <button
                  onClick={() => setStep(5)}
                  className="flex items-center gap-1.5 rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800"
                >
                  <CircleCheck size={14} /> Consolidation Looks Good — Continue{" "}
                  <ArrowRight size={14} />
                </button>
              </div>
            </>
          )}
        </div>
      )}


      {step === 5 && (
        <div className="space-y-4">
          <SectionCard title="Trade Summary — Unified Trade Record">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-2 pr-3 font-medium">Field</th>
                  <th className="py-2 pr-3 font-medium">Value</th>
                  <th className="py-2 pr-3 font-medium">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {TRADE_RECORD.map((r) => (
                  <tr key={r.field} className={r.flag ? "bg-amber-50/60" : ""}>
                    <td className="py-2 pr-3 text-slate-500">{r.field}</td>
                    <td className="py-2 pr-3 font-medium text-slate-800">
                      {r.value}
                      {r.flag && (
                        <div className="mt-0.5 flex items-center gap-1 text-[11px] font-normal text-amber-700">
                          <TriangleAlert size={11} /> {r.flag}
                        </div>
                      )}
                    </td>
                    <td className="py-2 pr-3">
                      <Badge tone="blue">{r.source}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>
          <div className="flex items-center justify-between">
            <button
              onClick={goBack}
              className="flex items-center gap-1.5 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <ChevronLeft size={14} /> Back
            </button>
            <button
              onClick={runRuleEngine}
              className="flex items-center gap-1.5 rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
            >
              <Play size={14} /> Run Rule Engine
            </button>
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="space-y-4">
          {running ? (
            <SectionCard title="Running TBML Rule Engine">
              <div className="space-y-3 py-4">
                {RUN_ENGINE_STEPS.map((label, i) => {
                  const idx = i + 1;
                  const done =
                    idx < runProgress || (idx === runProgress && !running);
                  const active = idx === runProgress && running;
                  return (
                    <div
                      key={label}
                      className="flex items-center gap-2.5 text-sm"
                    >
                      {done ? (
                        <CircleCheck size={16} className="text-green-600" />
                      ) : active ? (
                        <Loader2
                          size={16}
                          className="animate-spin text-blue-600"
                        />
                      ) : (
                        <Circle size={16} className="text-slate-300" />
                      )}
                      <span
                        className={
                          done
                            ? "text-slate-700"
                            : active
                            ? "font-medium text-slate-800"
                            : "text-slate-400"
                        }
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          ) : (
            <>
              <SectionCard title="Rule Execution Summary">
                <div className="grid grid-cols-3 gap-3">
                  <StatCard label="Rules Evaluated" value="34" />
                  <StatCard label="Passed" value="23" tone="green" />
                  <StatCard label="Warnings" value="4" tone="amber" />
                </div>
                <div className="mt-3">
                  <StatCard label="Alerts" value="7" tone="red" />
                </div>
              </SectionCard>
              <SectionCard title="Rule Results">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                        <th className="py-2 pr-3 font-medium">Rule ID</th>
                        <th className="py-2 pr-3 font-medium">Rule</th>
                        <th className="py-2 pr-3 font-medium">Category</th>
                        <th className="py-2 pr-3 font-medium">Result</th>
                        <th className="py-2 pr-3 font-medium">Severity</th>
                        <th className="py-2 pr-3 font-medium">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {RULE_EXECUTION_RESULTS.map((r) => (
                        <tr key={r.ruleId}>
                          <td className="py-2 pr-3 font-mono text-xs text-slate-500">
                            {r.ruleId}
                          </td>
                          <td className="py-2 pr-3 text-slate-700">
                            {r.ruleName}
                          </td>
                          <td className="py-2 pr-3 text-slate-500">
                            {r.category}
                          </td>
                          <td className="py-2 pr-3">
                            <Badge tone={resultTone(r.result)}>
                              {r.result}
                            </Badge>
                          </td>
                          <td className="py-2 pr-3">
                            <Badge tone={severityTone(r.severity)}>
                              {r.severity}
                            </Badge>
                          </td>
                          <td className="py-2 pr-3 text-xs text-slate-500">
                            {r.details}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SectionCard>
              <div className="flex items-center justify-between">
                <button
                  onClick={goBack}
                  className="flex items-center gap-1.5 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <ChevronLeft size={14} /> Back
                </button>
                <button
                  onClick={() => setStep(7)}
                  className="flex items-center gap-1.5 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  View 7 Generated Alerts <ArrowRight size={14} />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {step === 7 && filingAlertIds && (
        <STRFilingScreen
          alerts={wizardAlerts.filter((a) => filingAlertIds.includes(a.id))}
          tradeId={form.tradeRef}
          applicant={form.applicant}
          beneficiary={
            TRADE_CASES.find((c) => c.id === form.tradeRef)?.beneficiary ||
            "—"
          }
          onSubmit={confirmSTRFiling}
          onSaveDraft={saveSTRDraft}
          onBack={() => setFilingAlertIds(null)}
        />
      )}

      {step === 7 && !filingAlertIds && (
        <div className="space-y-4">
          <SectionCard
            title="TBML Alerts — TRD-2026-000182"
            right={
              <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <input
                  type="checkbox"
                  checked={
                    selectedAlertIds.length === wizardAlerts.length &&
                    wizardAlerts.length > 0
                  }
                  onChange={toggleSelectAllAlerts}
                  className="h-3.5 w-3.5 rounded border-slate-300"
                />
                Select all
              </label>
            }
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {wizardAlerts.map((a: any) => {
                const checked = selectedAlertIds.includes(a.id);
                return (
                  <div
                    key={a.id}
                    onClick={() => setSelectedWizardAlert(a)}
                    className={`cursor-pointer rounded-lg border p-3.5 transition hover:border-blue-300 hover:bg-blue-50/20 ${
                      checked
                        ? "border-blue-400 bg-blue-50/40"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2.5">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleAlertSelected(a.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-1 h-3.5 w-3.5 shrink-0 rounded border-slate-300"
                        />
                        <div>
                          <div className="font-mono text-xs text-slate-400">
                            {a.id}
                          </div>
                          <div className="mt-0.5 text-sm font-semibold text-slate-800">
                            {a.ruleName}
                          </div>
                          <div className="text-xs text-slate-400">
                            {a.ruleId}
                          </div>
                        </div>
                      </div>
                      <Badge tone={severityTone(a.severity)}>
                        {a.severity}
                      </Badge>
                    </div>
                    <p className="mt-2 line-clamp-3 text-xs text-slate-500">
                      {a.why}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedWizardAlert(a);
                        }}
                        className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs font-medium hover:opacity-80 ${
                          {
                            slate: "bg-slate-100 text-slate-700 border-slate-200",
                            blue: "bg-blue-50 text-blue-700 border-blue-200",
                            green: "bg-green-50 text-green-700 border-green-200",
                            amber: "bg-amber-50 text-amber-800 border-amber-200",
                            orange: "bg-orange-50 text-orange-700 border-orange-200",
                            red: "bg-red-50 text-red-700 border-red-200",
                          }[statusTone(a.status)]
                        }`}
                      >
                        {a.status}
                      </button>
                      {a.disposition && (
                        <span className="text-[11px] font-medium text-blue-700">
                          {a.disposition}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {selectedWizardAlert && (
            <AlertDetailPanel
              alert={selectedWizardAlert}
              onClose={() => setSelectedWizardAlert(null)}
              onUpdate={updateWizardAlert}
              onFileSTR={(id) => {
                setSelectedWizardAlert(null);
                setFilingAlertIds([id]);
              }}
            />
          )}

          {selectedAlertIds.length > 0 && (
            <SectionCard
              title={`Bulk Action — ${selectedAlertIds.length} alert(s) selected`}
            >
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilingAlertIds([...selectedAlertIds])}
                  className="rounded-md border border-red-300 bg-red-50 px-3.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                >
                  Conclude as STR/SAR
                </button>
                <button
                  onClick={() => bulkDispose("False Positive", "Resolved")}
                  className="rounded-md border border-slate-300 bg-slate-50 px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                  Close as False Positive
                </button>
                <button
                  onClick={() =>
                    bulkDispose("True Positive", "Investigating")
                  }
                  className="rounded-md border border-green-300 bg-green-50 px-3.5 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100"
                >
                  Approve as True Positive
                </button>
              </div>
            </SectionCard>
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={goBack}
              className="flex items-center gap-1.5 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              <ChevronLeft size={14} /> Back
            </button>
            <p className="text-center text-xs text-slate-400">
              Open the Alerts page from the top navigation to investigate,
              assign, or resolve each alert in full detail.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   RULE ENGINE PAGE
   ========================================================================= */

function RuleEnginePage() {
  const [expanded, setExpanded] = useState(null);
  return (
    <div className="space-y-4">
      <SectionCard
        title="Configured TBML Rules"
        right={
          <Badge tone="blue">
            {RULE_DEFINITIONS.length} rules · rule engine v3.2
          </Badge>
        }
      >
        <div className="divide-y divide-slate-100">
          {RULE_DEFINITIONS.map((r) => (
            <div key={r.id}>
              <button
                onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                className="flex w-full items-center justify-between py-3 text-left"
              >
                <div className="flex items-center gap-3">
                  <ChevronDown
                    size={14}
                    className={`text-slate-400 transition-transform ${
                      expanded === r.id ? "" : "-rotate-90"
                    }`}
                  />
                  <span className="font-mono text-xs text-slate-400">
                    {r.id}
                  </span>
                  <span className="text-sm font-medium text-slate-800">
                    {r.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge tone="slate">{r.typology}</Badge>
                  <Badge tone={severityTone(r.severity)}>{r.severity}</Badge>
                  <Badge tone="green">{r.status}</Badge>
                </div>
              </button>
              {expanded === r.id && (
                <div className="grid grid-cols-1 gap-3 rounded-md bg-slate-50 p-4 text-xs sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <div className="text-slate-400">Description</div>
                    <div className="mt-0.5 text-slate-700">{r.description}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Threshold</div>
                    <div className="mt-0.5 text-slate-700">{r.threshold}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Applicable Documents</div>
                    <div className="mt-0.5 text-slate-700">{r.docs}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Action</div>
                    <div className="mt-0.5 text-slate-700">
                      Generate alert and route to Alert Investigation queue
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Rule Category Model">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              title: "Document-Level",
              desc: "Validated within a single document — e.g. invoice total equals quantity × unit price.",
              icon: FileCheck2,
            },
            {
              title: "Cross-Document",
              desc: "Validated across two or more documents in the same trade case — e.g. invoice quantity vs. B/L quantity.",
              icon: GitBranch,
            },
            {
              title: "Trade-Level",
              desc: "Validated against the consolidated Trade Record and reference data — e.g. trade value exceeds threshold.",
              icon: PackageSearch,
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-md border border-slate-200 p-3.5"
            >
              <c.icon size={18} className="text-blue-700" />
              <div className="mt-2 text-sm font-semibold text-slate-800">
                {c.title}
              </div>
              <div className="mt-1 text-xs text-slate-500">{c.desc}</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

/* =========================================================================
   ALERTS PAGE + DETAIL PANEL
   ========================================================================= */

function AlertsPage() {
  const [allAlerts, setAllAlerts] = useState([...DEMO_ALERTS, ...OTHER_ALERTS]);
  const [selected, setSelected] = useState(null);
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [checkedIds, setCheckedIds] = useState([]);
  const [filingAlertIds, setFilingAlertIds] = useState(null);

  const filtered = allAlerts.filter(
    (a) =>
      (severityFilter === "All" || a.severity === severityFilter) &&
      (statusFilter === "All" || a.status === statusFilter)
  );

  function updateAlert(id, patch) {
    setAllAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...patch } : a))
    );
    setSelected((s) => (s && s.id === id ? { ...s, ...patch } : s));
  }

  function toggleChecked(id) {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function toggleCheckAll() {
    setCheckedIds((prev) =>
      prev.length === filtered.length ? [] : filtered.map((a) => a.id)
    );
  }

  function bulkUpdate(disposition, status) {
    setAllAlerts((prev) =>
      prev.map((a) =>
        checkedIds.includes(a.id) ? { ...a, disposition, status } : a
      )
    );
    setCheckedIds([]);
  }

  function confirmSTRFiling(narrative) {
    setAllAlerts((prev) =>
      prev.map((a) =>
        filingAlertIds.includes(a.id)
          ? {
              ...a,
              disposition: "STR/SAR Filed",
              status: "Escalated",
              strNarrative: narrative,
            }
          : a
      )
    );
    setSelected((s) =>
      s && filingAlertIds.includes(s.id)
        ? { ...s, disposition: "STR/SAR Filed", status: "Escalated" }
        : s
    );
    setFilingAlertIds(null);
    setCheckedIds([]);
  }

  function saveSTRDraft(narrative) {
    setAllAlerts((prev) =>
      prev.map((a) =>
        filingAlertIds.includes(a.id)
          ? { ...a, disposition: "STR/SAR Draft", strNarrative: narrative }
          : a
      )
    );
    setFilingAlertIds(null);
    setCheckedIds([]);
  }

  if (filingAlertIds) {
    const filingAlerts = allAlerts.filter((a) =>
      filingAlertIds.includes(a.id)
    );
    const tradeId = filingAlerts[0]?.tradeId || "";
    const applicant = filingAlerts[0]?.applicant || "";
    const beneficiary =
      TRADE_CASES.find((c) => c.id === tradeId)?.beneficiary || "—";
    return (
      <STRFilingScreen
        alerts={filingAlerts}
        tradeId={tradeId}
        applicant={applicant}
        beneficiary={beneficiary}
        onSubmit={confirmSTRFiling}
        onSaveDraft={saveSTRDraft}
        onBack={() => setFilingAlertIds(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs"
        >
          <option>All</option>
          <option>Critical</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs"
        >
          <option>All</option>
          <option>Open</option>
          <option>Investigating</option>
          <option>Escalated</option>
          <option>Resolved</option>
        </select>
        <select className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs text-slate-400">
          <option>Typology: All</option>
        </select>
        <select className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs text-slate-400">
          <option>Country: All</option>
        </select>
        <select className="rounded-md border border-slate-300 px-2.5 py-1.5 text-xs text-slate-400">
          <option>Document Type: All</option>
        </select>
        <span className="ml-auto text-xs text-slate-400">
          {filtered.length} alerts
        </span>
      </div>

      <SectionCard title="Alert Queue">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="w-8 py-2 pr-2">
                  <input
                    type="checkbox"
                    checked={
                      checkedIds.length === filtered.length &&
                      filtered.length > 0
                    }
                    onChange={toggleCheckAll}
                    onClick={(e) => e.stopPropagation()}
                    className="h-3.5 w-3.5 rounded border-slate-300"
                  />
                </th>
                <th className="py-2 pr-3 font-medium">Alert ID</th>
                <th className="py-2 pr-3 font-medium">Trade ID</th>
                <th className="py-2 pr-3 font-medium">Applicant</th>
                <th className="py-2 pr-3 font-medium">Rule</th>
                <th className="py-2 pr-3 font-medium">Typology</th>
                <th className="py-2 pr-3 font-medium">Severity</th>
                <th className="py-2 pr-3 font-medium">Status</th>
                <th className="py-2 pr-3 font-medium">Created</th>
                <th className="py-2 pr-3 font-medium">Assigned To</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((a) => (
                <tr
                  key={a.id}
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => setSelected(a)}
                >
                  <td className="py-2.5 pr-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={checkedIds.includes(a.id)}
                      onChange={() => toggleChecked(a.id)}
                      className="h-3.5 w-3.5 rounded border-slate-300"
                    />
                  </td>
                  <td className="py-2.5 pr-3 font-mono text-xs text-blue-700">
                    {a.id}
                  </td>
                  <td className="py-2.5 pr-3 font-mono text-xs text-slate-500">
                    {a.tradeId}
                  </td>
                  <td className="py-2.5 pr-3 text-slate-700">{a.applicant}</td>
                  <td className="py-2.5 pr-3 text-slate-600">{a.ruleId}</td>
                  <td className="py-2.5 pr-3 text-slate-500">{a.typology}</td>
                  <td className="py-2.5 pr-3">
                    <Badge tone={severityTone(a.severity)}>{a.severity}</Badge>
                  </td>
                  <td className="py-2.5 pr-3">
                    <Badge tone={statusTone(a.status)}>{a.status}</Badge>
                  </td>
                  <td className="py-2.5 pr-3 text-slate-500">{a.created}</td>
                  <td className="py-2.5 pr-3 text-slate-500">{a.assignedTo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {checkedIds.length > 0 && (
        <SectionCard title={`Bulk Action — ${checkedIds.length} alert(s) selected`}>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilingAlertIds([...checkedIds])}
              className="rounded-md border border-red-300 bg-red-50 px-3.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
            >
              Conclude as STR/SAR
            </button>
            <button
              onClick={() => bulkUpdate("False Positive", "Resolved")}
              className="rounded-md border border-slate-300 bg-slate-50 px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              Close as False Positive
            </button>
            <button
              onClick={() => bulkUpdate("True Positive", "Investigating")}
              className="rounded-md border border-green-300 bg-green-50 px-3.5 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100"
            >
              Approve as True Positive
            </button>
          </div>
        </SectionCard>
      )}

      {selected && (
        <AlertDetailPanel
          alert={selected}
          onClose={() => setSelected(null)}
          onUpdate={updateAlert}
          onFileSTR={(id) => setFilingAlertIds([id])}
        />
      )}
    </div>
  );
}

function AlertDetailPanel({ alert, onClose, onUpdate, onFileSTR }) {
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/40"
      onClick={onClose}
    >
      <div
        className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <div className="font-mono text-xs text-slate-400">{alert.id}</div>
            <div className="text-base font-semibold text-slate-900">
              {alert.ruleName}
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div>
              <div className="text-xs text-slate-400">Rule ID</div>
              <div className="font-medium text-slate-700">{alert.ruleId}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Severity</div>
              <Badge tone={severityTone(alert.severity)}>
                {alert.severity}
              </Badge>
            </div>
            <div>
              <div className="text-xs text-slate-400">Status</div>
              <Badge tone={statusTone(alert.status)}>{alert.status}</Badge>
            </div>
            <div>
              <div className="text-xs text-slate-400">Created</div>
              <div className="font-medium text-slate-700">{alert.created}</div>
            </div>
          </div>

          {alert.disposition && (
            <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-medium text-blue-800">
              Disposition: {alert.disposition}
            </div>
          )}

          {alert.modelRecommendation && (
            <div className="rounded-md border border-slate-200 p-3.5">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Model Recommendation
                </div>
                <Badge
                  tone={
                    alert.modelRecommendation === "Likely True Positive"
                      ? "red"
                      : alert.modelRecommendation === "Likely False Positive"
                      ? "green"
                      : "amber"
                  }
                >
                  {alert.modelRecommendation}
                </Badge>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${
                      alert.confidenceScore >= 75
                        ? "bg-red-500"
                        : alert.confidenceScore >= 50
                        ? "bg-amber-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${alert.confidenceScore}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-slate-800">
                  {alert.confidenceScore}%
                </span>
              </div>
              <div className="mt-1 text-[11px] text-slate-400">
                Confidence score reflects the model's assessment based on
                historical disposition patterns for this rule and typology —
                use it as a starting point, not a final decision.
              </div>
            </div>
          )}

          {alert.why && (
            <div>
              <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Why was this alert generated?
              </div>
              <p className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
                {alert.why}
              </p>
            </div>
          )}

          {alert.metrics && (
            <div className="grid grid-cols-2 gap-2">
              {alert.metrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-md border border-slate-200 p-2.5"
                >
                  <div className="text-[11px] text-slate-400">{m.label}</div>
                  <div className="text-sm font-medium text-slate-800">
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {alert.evidence && (
            <div>
              <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Supporting Evidence
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-400">
                    <th className="py-1.5 pr-2 font-medium">Source Document</th>
                    <th className="py-1.5 pr-2 font-medium">Page</th>
                    <th className="py-1.5 pr-2 font-medium">Field</th>
                    <th className="py-1.5 pr-2 font-medium">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {alert.evidence.map((e, i) => (
                    <tr key={i}>
                      <td className="py-1.5 pr-2 text-slate-700">{e.doc}</td>
                      <td className="py-1.5 pr-2 text-slate-500">{e.page}</td>
                      <td className="py-1.5 pr-2 text-slate-500">{e.field}</td>
                      <td className="py-1.5 pr-2 font-medium text-slate-800">
                        {e.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div>
            <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Workflow
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onUpdate(alert.id, { status: "Investigating" })}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Investigate
              </button>
              <button
                onClick={() => onUpdate(alert.id, { assignedTo: "You" })}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Assign to me
              </button>
            </div>
          </div>

          <div>
            <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Disposition
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() =>
                  onUpdate(alert.id, {
                    status: "Resolved",
                    disposition: "False Positive",
                  })
                }
                className="rounded-md border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                Mark False Positive
              </button>
              <button
                onClick={() =>
                  onUpdate(alert.id, {
                    disposition: "True Positive",
                  })
                }
                className="rounded-md border border-green-300 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100"
              >
                Mark True Positive
              </button>
              <button
                onClick={() => onFileSTR(alert.id)}
                className="rounded-md border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
              >
                Conclude as STR/SAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   CASE MANAGEMENT / CUSTOMERS / CONFIGURATION / AUDIT
   ========================================================================= */

function CaseManagementPage({ goTo }) {
  const investigations = TRADE_CASES.filter((c) => c.alerts > 0);
  return (
    <div className="space-y-4">
      <SectionCard title="Cases Requiring Action">
        <TradeCaseTable rows={investigations} onOpen={() => goTo("alerts")} />
      </SectionCard>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Open Investigations"
          value={investigations.length}
          tone="orange"
        />
        <StatCard label="Escalated to FIU" value="2" tone="red" />
        <StatCard label="Avg. Time to Resolution" value="3.4 days" />
      </div>
    </div>
  );
}

function CustomersPage() {
  return (
    <SectionCard title="Customers">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
            <th className="py-2 pr-3 font-medium">Customer ID</th>
            <th className="py-2 pr-3 font-medium">Name</th>
            <th className="py-2 pr-3 font-medium">Segment</th>
            <th className="py-2 pr-3 font-medium">Account Number</th>
            <th className="py-2 pr-3 font-medium">Country</th>
            <th className="py-2 pr-3 font-medium">Risk Rating</th>
            <th className="py-2 pr-3 font-medium">Trade Cases</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {CUSTOMERS.map((c) => (
            <tr key={c.id} className="hover:bg-slate-50">
              <td className="py-2.5 pr-3 font-mono text-xs text-blue-700">
                {c.id}
              </td>
              <td className="py-2.5 pr-3 text-slate-700">{c.name}</td>
              <td className="py-2.5 pr-3 text-slate-500">{c.segment}</td>
              <td className="py-2.5 pr-3 font-mono text-xs text-slate-500">
                {c.account}
              </td>
              <td className="py-2.5 pr-3 text-slate-500">{c.country}</td>
              <td className="py-2.5 pr-3">
                <Badge tone={riskTone(c.riskRating)}>{c.riskRating}</Badge>
              </td>
              <td className="py-2.5 pr-3 text-slate-600">{c.cases}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionCard>
  );
}

function ConfigurationPage() {
  const [rules, setRules] = useState(
    RULE_DEFINITIONS.map((r) => ({ ...r, lastUpdated: "01-Aug-2026" }))
  );

  function toggle(id) {
    setRules((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: r.status === "Active" ? "Disabled" : "Active",
              lastUpdated: "Today",
            }
          : r
      )
    );
  }
  function changeThreshold(id, value) {
    setRules((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, threshold: value, lastUpdated: "Today" } : r
      )
    );
  }

  return (
    <SectionCard
      title="Rule Configuration"
      right={
        <span className="text-xs text-slate-400">
          Changes apply to the next rule execution
        </span>
      }
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
            <th className="py-2 pr-3 font-medium">Rule ID</th>
            <th className="py-2 pr-3 font-medium">Name</th>
            <th className="py-2 pr-3 font-medium">Typology</th>
            <th className="py-2 pr-3 font-medium">Severity</th>
            <th className="py-2 pr-3 font-medium">Threshold</th>
            <th className="py-2 pr-3 font-medium">Status</th>
            <th className="py-2 pr-3 font-medium">Last Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rules.map((r) => (
            <tr key={r.id}>
              <td className="py-2.5 pr-3 font-mono text-xs text-slate-500">
                {r.id}
              </td>
              <td className="py-2.5 pr-3 text-slate-700">{r.name}</td>
              <td className="py-2.5 pr-3 text-slate-500">{r.typology}</td>
              <td className="py-2.5 pr-3">
                <Badge tone={severityTone(r.severity)}>{r.severity}</Badge>
              </td>
              <td className="py-2.5 pr-3">
                {r.threshold === "N/A" ? (
                  <span className="text-slate-400">N/A</span>
                ) : (
                  <input
                    value={r.threshold}
                    onChange={(e) => changeThreshold(r.id, e.target.value)}
                    className="w-28 rounded border border-slate-300 px-1.5 py-1 text-xs outline-none focus:border-blue-500"
                  />
                )}
              </td>
              <td className="py-2.5 pr-3">
                <button
                  onClick={() => toggle(r.id)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                    r.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {r.status}
                </button>
              </td>
              <td className="py-2.5 pr-3 text-slate-400">{r.lastUpdated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionCard>
  );
}

function AuditTrailPage() {
  return (
    <SectionCard title="Audit Trail">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-left text-xs uppercase tracking-wide text-slate-500">
            <th className="py-2 pr-3 font-medium">Timestamp</th>
            <th className="py-2 pr-3 font-medium">User</th>
            <th className="py-2 pr-3 font-medium">Action</th>
            <th className="py-2 pr-3 font-medium">Object</th>
            <th className="py-2 pr-3 font-medium">Old Value</th>
            <th className="py-2 pr-3 font-medium">New Value</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {INITIAL_AUDIT_LOG.map((e, i) => (
            <tr key={i}>
              <td className="py-2.5 pr-3 font-mono text-xs text-slate-500">
                {e.ts}
              </td>
              <td className="py-2.5 pr-3 text-slate-700">{e.user}</td>
              <td className="py-2.5 pr-3 text-slate-600">{e.action}</td>
              <td className="py-2.5 pr-3 font-mono text-xs text-blue-700">
                {e.object}
              </td>
              <td className="py-2.5 pr-3 text-slate-400">{e.oldValue}</td>
              <td className="py-2.5 pr-3 text-slate-700">{e.newValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </SectionCard>
  );
}

/* =========================================================================
   APP SHELL
   ========================================================================= */

/* =========================================================================
   TOP NAV SHELL (CrossFraud-style)
   ========================================================================= */

const SUITE_MENUS = [
  { id: "case", label: "Case Management", icon: Users, kind: "placeholder" },
  { id: "reports", label: "Reports", icon: BarChart3, kind: "placeholder" },
  {
    id: "model",
    label: "Model Management",
    icon: SlidersHorizontal,
    kind: "placeholder",
  },
  {
    id: "bi",
    label: "BI Dashboard",
    icon: LayoutDashboard,
    kind: "placeholder",
  },
  { id: "kyc", label: "KYC", icon: UserCheck, kind: "placeholder" },
  { id: "tbml", label: "TBML", icon: Ship, kind: "tbml" },
  { id: "config", label: "Configuration", icon: Settings, kind: "placeholder" },
];

const HOME_TILES = [
  { id: "case", label: "Case Management", icon: Users },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tbml", label: "TBML", icon: Ship, live: true },
  { id: "kyc", label: "KYC", icon: UserCheck },
  { id: "model", label: "Model Management", icon: SlidersHorizontal },
  { id: "config", label: "Configuration", icon: Settings },
];

function useLiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

function TopNav({ openMenu, setOpenMenu, activeModule, goHome, goTbml }) {
  const now = useLiveClock();
  const dateStr = now.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <header className="relative z-30 flex flex-wrap items-center justify-between gap-y-2 bg-gradient-to-r from-[#122845] to-[#2c5680] px-5 py-2.5 shadow-md">
      {openMenu && (
        <div className="fixed inset-0 z-20" onClick={() => setOpenMenu(null)} />
      )}

      <div className="relative z-30 flex items-center gap-6">
        <button
          onClick={goHome}
          className="flex shrink-0 items-baseline gap-0.5"
        >
          <span className="text-xl font-light tracking-wide text-slate-200">
            CROSS
          </span>
          <span className="text-xl font-extrabold tracking-wide text-white">
            FRAUD
          </span>
        </button>

        <nav className="flex flex-wrap items-center gap-0.5">
          {SUITE_MENUS.map((m) => {
            const Icon = m.icon;
            const isTbml = m.kind === "tbml";
            const open = openMenu === m.id;
            const highlighted = (isTbml && activeModule === "tbml") || open;
            return (
              <div key={m.id} className="relative">
                <button
                  onClick={() => setOpenMenu(open ? null : m.id)}
                  className={`flex items-center gap-1.5 rounded px-3 py-1.5 text-[13px] font-medium transition-colors ${
                    highlighted
                      ? "bg-white/15 text-white"
                      : "text-slate-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon size={15} />
                  {m.label}
                  <ChevronDown
                    size={13}
                    className={`transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {open && (
                  <div className="absolute left-0 top-full z-30 mt-1 w-64 overflow-hidden rounded-md border border-slate-200 bg-white py-1.5 shadow-xl">
                    {isTbml ? (
                      NAV_ITEMS.map((item) => {
                        const ItemIcon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => goTbml(item.id)}
                            className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-sm text-slate-700 hover:bg-[#eef4fb] hover:text-[#1f3b5c]"
                          >
                            <ItemIcon size={15} className="text-slate-400" />
                            {item.label}
                          </button>
                        );
                      })
                    ) : (
                      <div className="px-3.5 py-3 text-xs italic text-slate-400">
                        Available in the full CrossFraud suite.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      <div className="relative z-30 flex items-center gap-4">
        <div className="hidden items-center gap-3 text-[12px] text-slate-200 md:flex">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={14} />
            {dateStr}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={14} />
            {timeStr}
          </span>
        </div>
        <button className="relative rounded p-1.5 text-slate-200 hover:bg-white/10 hover:text-white">
          <Bell size={17} />
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-400" />
        </button>
        <div className="flex items-center gap-2 border-l border-white/20 pl-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#1f3b5c]">
            <Users size={16} />
          </div>
          <div className="hidden leading-tight sm:block">
            <div className="text-[12.5px] font-semibold text-white">
              Surajkumar Rai
            </div>
            <div className="text-[10.5px] text-slate-300">
              Trade Compliance Analyst
            </div>
          </div>
        </div>
        <button className="flex h-8 w-8 items-center justify-center rounded border-l border-white/20 pl-2 text-slate-200 hover:text-white">
          <LogOut size={17} />
        </button>
      </div>
    </header>
  );
}

function HomeTile({ label, icon: Icon, live, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white text-left shadow-sm transition-all ${
        onClick
          ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-lg"
          : "cursor-default opacity-90"
      }`}
    >
      <div className="flex h-28 w-full items-center justify-center bg-gradient-to-b from-[#3e6790] to-[#2c4d73] sm:h-32">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 sm:h-16 sm:w-16">
          <Icon size={28} className="text-white" strokeWidth={1.75} />
        </div>
      </div>
      <div className="flex items-center justify-center gap-1.5 py-3">
        <span className="text-[13px] font-bold tracking-wide text-[#1f3b5c] sm:text-sm">
          {label.toUpperCase()}
        </span>
        {live && (
          <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[9px] font-bold text-blue-700">
            LIVE
          </span>
        )}
      </div>
    </button>
  );
}

function HomePage({ goTbml }) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
        {HOME_TILES.map((t) => (
          <HomeTile
            key={t.id}
            label={t.label}
            icon={t.icon}
            live={t.live}
            onClick={t.id === "tbml" ? () => goTbml() : undefined}
          />
        ))}
      </div>
    </div>
  );
}

function TbmlSubNav({ page, setPage }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 bg-white px-4 py-1.5">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = page === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              active
                ? "bg-[#e8f0fa] text-[#1f3b5c]"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            <Icon size={14} className={active ? "text-[#1f3b5c]" : "text-slate-400"} />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export default function App() {
  const [activeModule, setActiveModule] = useState("home"); // "home" | "tbml"
  const [page, setPage] = useState("dashboard");
  const [openMenu, setOpenMenu] = useState(null);

  function goHome() {
    setActiveModule("home");
    setOpenMenu(null);
  }

  function goTbml(targetPage) {
    setActiveModule("tbml");
    if (targetPage) setPage(targetPage);
    setOpenMenu(null);
  }

  function renderPage() {
    switch (page) {
      case "dashboard":
        return <DashboardPage goTo={setPage} />;
      case "cases":
        return <TradeCasesPage goTo={setPage} />;
      case "documents":
        return <DocumentProcessingPage />;
      case "rules":
        return <RuleEnginePage />;
      case "alerts":
        return <AlertsPage />;
      case "casemgmt":
        return <CaseManagementPage goTo={setPage} />;
      case "customers":
        return <CustomersPage />;
      case "config":
        return <ConfigurationPage />;
      case "audit":
        return <AuditTrailPage />;
      default:
        return null;
    }
  }

  return (
    <div className="flex h-screen w-full flex-col bg-slate-50 text-slate-900">
      <TopNav
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        activeModule={activeModule}
        goHome={goHome}
        goTbml={goTbml}
      />

      {activeModule === "tbml" && (
        <>
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-2">
            <Breadcrumbs items={["Home", "TBML", PAGE_TITLES[page]]} />
            <button
              onClick={goHome}
              className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-slate-600"
            >
              <Home size={13} />
              Back to Home
            </button>
          </div>
          <TbmlSubNav page={page} setPage={setPage} />
        </>
      )}

      <main
        className={`flex-1 overflow-y-auto ${
          activeModule === "home"
            ? "bg-gradient-to-b from-[#dbe7f6] to-[#eef4fb]"
            : ""
        }`}
      >
        {activeModule === "home" ? (
          <HomePage goTbml={goTbml} />
        ) : (
          <div className="p-6">{renderPage()}</div>
        )}
      </main>

      <footer className="flex items-center justify-end bg-gradient-to-r from-[#122845] to-[#2c5680] px-5 py-2 text-[11px] text-slate-300">
        © {new Date().getFullYear()} CrossFraud. All rights reserved.
      </footer>
    </div>
  );
}
