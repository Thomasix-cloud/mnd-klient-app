// ============================================================
// MND Klient App — Type Definitions (aligned with Flare CRM)
// ============================================================

export type EnergyType = "ELECTRICITY" | "GAS";
export type SupplyPointStatus = "ACTIVE" | "INACTIVE" | "PENDING";
export type ContractStatus = "ACTIVE" | "PENDING" | "TERMINATED";
export type FixationType = "FIXED" | "DECLINING" | "NONE";
export type InvoiceType = "ADVANCE" | "SETTLEMENT";
export type InvoiceStatus = "PAID" | "UNPAID" | "OVERDUE";
export type AdvanceStatus = "OPTIMAL" | "TOO_LOW" | "TOO_HIGH";
export type NotificationType =
  | "INVOICE"
  | "PAYMENT"
  | "PRICE_CHANGE"
  | "CONTRACT"
  | "INFO"
  | "OVERDUE_WARNING";
export type CustomerStatus = "BONITNI" | "AKTIVNI" | "NOVY";

export interface Address {
  street: string;
  city: string;
  postalCode: string;
}

export interface User {
  id: string;
  customerNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  address: Address;
  avatarUrl?: string;
  status: CustomerStatus;
}

export interface SupplyPoint {
  id: string;
  type: EnergyType;
  status: SupplyPointStatus;
  identifier: string; // EAN for electricity, EIC for gas
  contractNumber: string;
  address: Address;
  linkedContractId: string;
}

export interface Fixation {
  active: boolean;
  type: FixationType;
  validUntil?: string;
  pricePerMWh: number;
}

export interface Contract {
  id: string;
  supplyPointId: string;
  type: EnergyType;
  pricePlan: string;
  fixation: Fixation;
  status: ContractStatus;
  startDate: string;
  endDate?: string;
  businessOpportunities: string[];
}

export interface InvoiceBreakdown {
  regulatedComponent: number;
  unregulatedComponent: number;
  tax: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  supplyPointId: string;
  type: InvoiceType;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  issuedDate: string;
  dueDate: string;
  paidDate?: string;
  period: { from: string; to: string };
  breakdown?: InvoiceBreakdown;
  qrPaymentData?: string;
}

export interface ConsumptionRecord {
  date: string;
  value: number;
  unit: "kWh" | "m3" | "MWh";
}

export interface ConsumptionData {
  supplyPointId: string;
  daily: ConsumptionRecord[];
  monthly: ConsumptionRecord[];
}

export interface AdvancePaymentMonth {
  month: string;
  amount: number;
  paid: boolean;
}

export interface AdvancePayment {
  supplyPointId: string;
  monthlyAdvance: number;
  recommendedAdvance: number;
  status: AdvanceStatus;
  history: AdvancePaymentMonth[];
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  read: boolean;
  actionUrl?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

export interface QuickQuestion {
  id: string;
  label: string;
  query: string;
}
