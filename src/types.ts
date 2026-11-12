export type EquipmentType =
  | 'Dry Van'
  | 'Reefer'
  | 'Flatbed'
  | 'Step Deck'
  | 'Power Only'
  | 'Hotshot'
  | 'Box Truck'
  | 'Sprinter Van';

export type LoadStatus =
  | 'Available'
  | 'Negotiating'
  | 'Booked'
  | 'Dispatched'
  | 'Loading'
  | 'In Transit'
  | 'Delivered'
  | 'Completed'
  | 'Cancelled';

export type InvoiceStatus = 'Not Invoiced' | 'Invoice Sent' | 'Pending Payment' | 'Cleared / Paid';

export type PaymentStatus = 'Pending' | 'Paid' | 'Processing';

export type CarrierStatus = 'Active' | 'Pending Review' | 'On Hold' | 'Inactive';

export interface Carrier {
  id: string;
  companyName: string;
  ownerName: string;
  email: string;
  phone: string;
  mcNumber: string;
  dotNumber: string;
  vinNumber?: string;
  driversLicense?: string;
  equipmentType: EquipmentType;
  truckCount: number;
  currentZip: string;
  preferredLanes: string[];
  preferredRPM: number;
  maxDeadhead: number;
  availableDate: string;
  insuranceStatus: 'Active ($1M / $100K)' | 'Active ($750K)' | 'Pending Verification';
  insuranceExpiry?: string;
  assignedDispatcher?: string;
  assignedOwner?: 'David Cross' | 'Alvin';
  notes?: string;
  status: CarrierStatus;
  createdAt: string;
  documents: {
    w9: boolean;
    coi: boolean;
    mcAuthority: boolean;
    noa: boolean;
    driversLicense?: boolean;
  };
}

export interface CarrierApplication {
  id: string;
  applicationNumber: number; // #1, #2, #3, ...
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  mcNumber: string;
  dotNumber: string;
  vinNumber: string;
  driversLicense: string;
  equipmentType: EquipmentType;
  truckCount: number;
  currentZip: string;
  preferredLanes: string;
  preferredRPM: number;
  maxDeadhead: number;
  availableDate: string;
  insuranceStatus: string;
  additionalRequirements: string;
  assignedOwner: 'David Cross' | 'Alvin';
  submittedAt: string;
  status: 'Pending' | 'Approved' | 'Declined';
  uploadedFiles: string[];
  documents: {
    w9: boolean;
    coi: boolean;
    mcAuthority: boolean;
    driversLicense: boolean;
    noaOrVoidedCheck: boolean;
  };
}

export interface LoadItem {
  id: string;
  loadNumber: string;
  carrierId?: string;
  carrierName: string;
  carrierPhone?: string;
  driverName?: string;
  driverPhone?: string;
  dispatcherName?: string;
  dispatcherPhone?: string;
  mcNumber: string;
  equipmentType: EquipmentType;
  originCity: string;
  originState: string;
  puAddress?: string;
  puTime?: string;
  destinationCity: string;
  destinationState: string;
  delAddress?: string;
  delTime?: string;
  pickupDate: string;
  deliveryDate: string;
  brokerName: string;
  brokerageMc?: string;
  brokerPhone: string;
  brokerageEmail?: string;
  rate: number; // Dispatched Amount / Gross Rate
  loadedMiles: number;
  deadheadMiles: number;
  rpm: number;
  status: LoadStatus;
  dispatchFeePercent: number; // Configurable per load (e.g. 5, 6, 7, 8, 10, or custom)
  dispatchFeeAmount: number;
  paymentStatus: PaymentStatus;
  invoiceStatus?: InvoiceStatus;
  invoiceClearedAt?: string;
  invoiceNumber?: string;
  bolNumber?: string;
  proNumber?: string;
  poNumber?: string;
  weightLbs?: number;
  pieceCount?: number;
  sealNumber?: string;
  trailerNumber?: string;
  shipperName?: string;
  consigneeName?: string;
  ocrScanned?: boolean;
  ocrConfidence?: number;
  bolDocumentName?: string;
  bolDocumentContent?: string;
  rcDocumentName?: string;
  rcDocumentContent?: string;
  notes?: string;
  commodity?: string;
  loadDocuments?: LoadDocumentItem[];
  createdAt: string;
  updatedAt: string;
}

export interface LoadDocumentItem {
  id: string;
  name: string;
  type: 'RC' | 'BOL' | 'POD' | 'Lumper' | 'Scale Ticket' | 'Other';
  fileUrl: string;
  uploadedAt: string;
}

export interface ExtractedBolData {
  bolNumber: string;
  proNumber?: string;
  poNumber?: string;
  pickupDate: string;
  pickupTime?: string;
  shipperName: string;
  shipperAddress: string;
  originCity: string;
  originState: string;
  originZip?: string;
  deliveryDate: string;
  deliveryTime?: string;
  consigneeName: string;
  consigneeAddress: string;
  destinationCity: string;
  destinationState: string;
  destinationZip?: string;
  carrierName?: string;
  trailerNumber?: string;
  sealNumber?: string;
  commodity: string;
  weightLbs: number;
  pieceCount: number;
  packageType?: string;
  specialInstructions?: string;
  confidenceScore: number;
  extractedSummary?: string;
  thumbnailUrl?: string;
}

export interface CarrierDocumentItem {
  id?: string;
  name: string;
  type: 'MC Authority' | 'W-9' | 'COI' | 'NOA' | 'Driver License' | 'Truck Picture' | 'Voided Check' | 'Other' | string;
  fileUrl?: string;
  fileContent?: string;
  uploadedAt?: string;
  uploadDate?: string;
  fileSize?: string;
  status?: string;
}

export interface RosterCarrier {
  id: string;
  driverName: string;
  driverPhone: string;
  carrierName: string;
  carrierPhone: string;
  carrierEmail?: string;
  mcNumber: string;
  dotNumber?: string;
  carrierAddress?: string;
  truckType?: EquipmentType;
  equipmentType: EquipmentType;
  vinNumber?: string;
  notes?: string; // Carrier preferences, target RPM, preferred lanes, factoring, home time
  dispatcherName: string;
  dispatcherPhone: string;
  salesPersonName?: string;
  dispatchedAmount: number;
  dispatchFeePercent: number;
  invoiceStatus: InvoiceStatus;
  loadStatus: LoadStatus;
  originDestination?: string;
  documents?: CarrierDocumentItem[];
  updatedAt: string;
}

export interface SalesPerson {
  id: string;
  name: string;
  email: string;
  phone: string;
  commissionRate: number; // e.g. 3% or 5%
  status: 'Active' | 'On Leave' | 'Inactive';
  onboardedCarriersCount: number;
  totalRevenueGenerated: number;
  joinedDate: string;
  notes?: string;
  assignedCarriers?: string[];
}

export interface InvoiceLineItem {
  id: string;
  description: string;
  rate: number;
  quantity: number;
  amount: number;
}

export interface GeneratedInvoice {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  paymentTerms: string;
  poNumber?: string;
  fromName: string;
  fromEmail: string;
  fromPhone: string;
  fromAddress: string;
  billToCompany: string;
  billToContact: string;
  billToEmail: string;
  billToPhone: string;
  billToAddress: string;
  billToMc: string;
  items: InvoiceLineItem[];
  subtotal: number;
  discount?: number;
  discountType?: 'percent' | 'flat';
  tax: number;
  total: number;
  amountPaid?: number;
  balanceDue?: number;
  shipTo?: string;
  logoUrl?: string;
  notes: string;
  terms: string;
  status: 'Draft' | 'Sent' | 'Pending' | 'Cleared / Paid';
  loadReferenceId?: string;
  createdAt: string;
}

export interface Dispatcher {
  id: string;
  name: string;
  email: string;
  phone: string;
  shift?: string;
  commissionPercent?: number;
  totalDispatchedGross?: number;
  assignedCarriersCount: number;
  activeLoadsCount: number;
  status: 'Active' | 'Away';
}

export interface MessageInquiry {
  id: string;
  fullName: string;
  companyName?: string;
  email: string;
  phone: string;
  equipment?: EquipmentType | 'Other';
  subject: string;
  message: string;
  assignedOwner?: 'David Cross' | 'Alvin';
  status: 'Sent' | 'Seen' | 'Replied';
  replyText?: string;
  replyAuthor?: 'David Cross' | 'Alvin';
  replyAt?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'carrier' | 'gemini' | 'David Cross' | 'Alvin';
  senderName: string;
  carrierName?: string;
  carrierContact?: string;
  text: string;
  timestamp: string;
  status: 'Sent' | 'Seen' | 'Replied';
}

export interface PaymentRecord {
  id: string;
  invoiceNumber: string;
  loadId: string;
  carrierName: string;
  mcNumber: string;
  loadRate: number;
  dispatchFeePercent: number;
  commissionAmount: number;
  paymentStatus: PaymentStatus;
  dueDate: string;
  paidDate?: string;
  paymentMethod?: string;
}

export interface OwnerActivity {
  id: string;
  timestamp: string;
  ownerName: 'David Cross' | 'Alvin';
  action: string;
  details: string;
  category: 'Carrier' | 'Load' | 'Payment' | 'Dispatcher' | 'System' | 'Email';
}

export interface OwnerUser {
  id: string;
  name: 'David Cross' | 'Alvin';
  email: string;
  phone?: string;
  role: 'OWNER / SUPER ADMIN';
}

export interface Review {
  id: string;
  carrierName: string;
  companyName: string;
  mcNumber: string;
  equipment: EquipmentType;
  rating: number; // 1-5
  comment: string;
  date: string;
  isApproved: boolean;
  verified: boolean;
}

export interface StickyNote {
  id: string;
  title: string;
  content: string;
  ownerName: 'David Cross' | 'Alvin';
  tag?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DemoBooking {
  id: string;
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  equipmentType: EquipmentType;
  truckCount: number;
  assignedOwner: 'David Cross' | 'Alvin';
  status: 'Pending' | 'Confirmed' | 'Completed';
  createdAt: string;
}

export interface EmailNotificationRecord {
  id: string;
  to: string;
  subject: string;
  body: string;
  type: 'Carrier Registration' | 'Document Upload' | 'Demo Booking' | 'Live Inquiry';
  status: 'Delivered';
  timestamp: string;
}

export interface CarrierPerformance {
  carrierId: string;
  carrierName: string;
  mcNumber: string;
  equipmentType: EquipmentType;
  totalLoadsCompleted: number;
  onTimeDeliveries: number;
  lateDeliveries: number;
  onTimeRate: number; // Percentage e.g. 98.4
  averageDocSubmissionMinutes: number; // Average minutes to submit signed BOL
  bolFastUploadRate: number; // % uploaded in < 30 mins
  rateConReturnMinutes: number; // Average minutes to return signed rate con
  claimsCount: number;
  overallScore: number; // 0 - 100
  performanceTier: 'Elite Tier A+' | 'High Performing A' | 'Standard B' | 'Needs Review';
  status: 'Active' | 'Preferred' | 'Probationary';
  lastEvaluated: string;
  evaluatorNotes?: string;
}

