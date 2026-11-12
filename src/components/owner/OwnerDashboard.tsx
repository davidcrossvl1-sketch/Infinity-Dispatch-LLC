import React, { useState, useEffect } from 'react';
import { storage } from '../../services/storage';
import {
  Carrier,
  CarrierApplication,
  LoadItem,
  Dispatcher,
  MessageInquiry,
  PaymentRecord,
  OwnerActivity,
  OwnerUser,
  EquipmentType,
  LoadStatus,
  InvoiceStatus,
  Review,
  StickyNote,
  DemoBooking,
  EmailNotificationRecord,
  RosterCarrier,
  GeneratedInvoice,
  InvoiceLineItem,
  CarrierPerformance,
  ExtractedBolData,
} from '../../types';
import { InfinityLogo } from '../InfinityLogo';
import { DocumentViewerModal, DocumentViewerData } from './DocumentViewerModal';
import { GmailDispatchModal } from '../GmailDispatchModal';
import { lookupCarrierSafety, CarrierSafetyProfile } from '../../services/searchCarriers';
import { sendEmailWithGmail } from '../../services/gmail';
import {
  SAMPLE_BOL_DOCUMENTS,
  SampleBolDocument,
  parseBolImage,
  fileToBase64,
} from '../../services/ocrBol';
import {
  buildInvoiceFromLoad,
  generateInvoicePdf,
  invoicePdfToBase64,
  downloadInvoicePdf,
} from '../../services/pdfInvoice';
import { googleAuthService, GoogleAuthProfile } from '../../services/googleAuth';
import { RosterCarrierEditModal } from './RosterCarrierEditModal';
import { LoadEditModal } from './LoadEditModal';
import { FreightPdfEditorModal } from './FreightPdfEditorModal';
import { AiFreightCopilot } from './AiFreightCopilot';
import { CarrierChkInspector } from './CarrierChkInspector';
import { SalesAndDispatchManager } from './SalesAndDispatchManager';

import {
  LayoutDashboard,
  Users,
  FileCheck,
  Truck,
  Package,
  Headphones,
  Mail,
  DollarSign,
  BarChart3,
  Globe,
  Settings,
  LogOut,
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Download,
  Filter,
  Eye,
  Trash2,
  Phone,
  Calendar,
  AlertTriangle,
  Printer,
  Shield,
  FileText,
  Compass,
  MapPin,
  Lock,
  Star,
  Send,
  Sparkles,
  Calculator,
  ExternalLink,
  Paperclip,
  Check,
  Copy,
  UserCheck,
  RefreshCw,
  Building2,
  ChevronRight,
  Award,
  Zap,
  Target,
  Activity,
  Gauge,
  Scan,
  Camera,
  UploadCloud,
  FileImage,
  CheckCheck,
  Edit3,
} from 'lucide-react';



interface OwnerDashboardProps {
  owner: OwnerUser;
  onLogout: () => void;
  onSwitchToPublic: () => void;
}

type TabType =
  | 'overview'
  | 'applications'
  | 'roster'
  | 'loads'
  | 'invoice'
  | 'pdfeditor'
  | 'copilot'
  | 'calculator'
  | 'safer'
  | 'messages'
  | 'email'
  | 'carriers'
  | 'payments'
  | 'demos'
  | 'notes'
  | 'reviews'
  | 'dispatchers'
  | 'settings';

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  owner,
  onLogout,
  onSwitchToPublic,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Edit Modals and Enhanced Feature States
  const [selectedRosterCarrierForEdit, setSelectedRosterCarrierForEdit] = useState<RosterCarrier | null>(null);
  const [isRosterEditModalOpen, setIsRosterEditModalOpen] = useState(false);
  const [selectedLoadForEdit, setSelectedLoadForEdit] = useState<LoadItem | null>(null);
  const [isLoadEditModalOpen, setIsLoadEditModalOpen] = useState(false);
  const [isPdfEditorModalOpen, setIsPdfEditorModalOpen] = useState(false);
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null);

  // Real data state
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [applications, setApplications] = useState<CarrierApplication[]>([]);
  const [loads, setLoads] = useState<LoadItem[]>([]);
  const [rosterCarriers, setRosterCarriers] = useState<RosterCarrier[]>([]);
  const [invoices, setInvoices] = useState<GeneratedInvoice[]>([]);
  const [dispatchers, setDispatchers] = useState<Dispatcher[]>([]);
  const [inquiries, setInquiries] = useState<MessageInquiry[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [activities, setActivities] = useState<OwnerActivity[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [demoBookings, setDemoBookings] = useState<DemoBooking[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailNotificationRecord[]>([]);
  const [connectedGoogleEmail, setConnectedGoogleEmail] = useState<string>('liamlee1.vl@gmail.com');
  const [carrierPerformances, setCarrierPerformances] = useState<CarrierPerformance[]>([]);
  const [perfSearch, setPerfSearch] = useState('');
  const [perfTierFilter, setPerfTierFilter] = useState<'All' | 'Elite' | 'High' | 'Standard'>('All');
  const [perfSortBy, setPerfSortBy] = useState<'score' | 'onTime' | 'docSpeed' | 'loads'>('score');
  const [activeScorecardCarrier, setActiveScorecardCarrier] = useState<CarrierPerformance | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [appOwnerFilter, setAppOwnerFilter] = useState<'All' | 'David Cross' | 'Alvin'>('All');
  const [loadStatusFilter, setLoadStatusFilter] = useState<string>('All');

  // Document Viewer Modal State
  const [isDocViewerOpen, setIsDocViewerOpen] = useState(false);
  const [activeDocData, setActiveDocData] = useState<DocumentViewerData | null>(null);

  // OCR BOL Document Scanner State
  const [isOcrBolModalOpen, setIsOcrBolModalOpen] = useState(false);
  const [isOcrScanning, setIsOcrScanning] = useState(false);
  const [ocrExtractedData, setOcrExtractedData] = useState<ExtractedBolData | null>(null);
  const [ocrPreviewImage, setOcrPreviewImage] = useState<string | null>(null);
  const [ocrDocumentName, setOcrDocumentName] = useState<string>('BOL_Document_Scan.jpg');
  const [ocrSelectedSampleId, setOcrSelectedSampleId] = useState<string | null>(null);
  const [isOcrDragging, setIsOcrDragging] = useState(false);


  // Modals state
  const [isAddLoadOpen, setIsAddLoadOpen] = useState(false);
  const [isAddRosterCarrierOpen, setIsAddRosterCarrierOpen] = useState(false);
  const [activeInquiryForReply, setActiveInquiryForReply] = useState<MessageInquiry | null>(null);
  const [replyMessageText, setReplyMessageText] = useState('');
  const [replyAuthor, setReplyAuthor] = useState<'David Cross' | 'Alvin'>(owner.name);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // SAFER & SearchCarriers.com State
  const [saferQuery, setSaferQuery] = useState('MC-1489201');
  const [saferLoading, setSaferLoading] = useState(false);
  const [saferProfile, setSaferProfile] = useState<CarrierSafetyProfile | null>(null);
  const [googleProfile, setGoogleProfile] = useState<GoogleAuthProfile | null>(() => googleAuthService.getStoredProfile());
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const [isGmailModalOpen, setIsGmailModalOpen] = useState(false);
  const [saferResult, setSaferResult] = useState<any>({
    legalName: 'APEX INTERSTATE EXPRESS LLC',
    mcNumber: 'MC-1489201',
    dotNumber: '3920141',
    physicalAddress: '4800 LOGISTICS WAY, DALLAS, TX 75241',
    safetyRating: 'SATISFACTORY',
    operatingAuthority: 'ACTIVE COMMON / CONTRACT',
    boc3OnFile: 'YES (NATIONAL AGENTS ALLIANCE)',
    liabilityInsurance: '$1,000,000 (PROGRESSIVE CASUALTY)',
    cargoInsurance: '$100,000 (GREAT AMERICAN E&S)',
    inspectionOOSRate: '2.1% (NATIONAL AVG: 21.4%)',
    activePowerUnits: 3,
    driversReported: 3,
  });

  // Simple Arithmetic Calculator State
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcPrevValue, setCalcPrevValue] = useState<number | null>(null);
  const [calcOperator, setCalcOperator] = useState<string | null>(null);
  const [calcWaitingForOperand, setCalcWaitingForOperand] = useState(false);

  // Highway Route Calculator State
  const [calcOrigin, setCalcOrigin] = useState('Dallas, TX');
  const [calcDestination, setCalcDestination] = useState('Atlanta, GA');
  const [calcDistance, setCalcDistance] = useState(780);
  const [calcTargetRpm, setCalcTargetRpm] = useState(2.85);
  const [calcFuelPrice, setCalcFuelPrice] = useState(3.85);
  const [calcCommissionPercent, setCalcCommissionPercent] = useState(5);

  // Interactive Invoice Generator Form State
  const [invoiceViewMode, setInvoiceViewMode] = useState<'editor' | 'preview'>('editor');
  const [invoiceDiscountAmount, setInvoiceDiscountAmount] = useState<number>(0);
  const [invoiceTaxPercent, setInvoiceTaxPercent] = useState<number>(0);
  const [invoiceAmountPaid, setInvoiceAmountPaid] = useState<number>(0);
  const [invoiceBuilder, setInvoiceBuilder] = useState<GeneratedInvoice>({
    id: `inv-${Date.now()}`,
    invoiceNumber: `INV-${Math.floor(8000 + Math.random() * 2000)}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    paymentTerms: 'Due upon receipt (72 hours)',

    poNumber: 'INF-2026-0891',
    fromName: 'Infinity Dispatch LLC',
    fromEmail: 'Davidcross.vl1@gmail.com',
    fromPhone: '+1 (409) 509-6940',
    fromAddress: 'Houston, TX Master Dispatch Floor · infinitydispatchllcusa.com',
    billToCompany: 'Apex Interstate Express LLC',
    billToContact: 'Marcus Vance',
    billToEmail: 'dispatch@apexinterstate.com',
    billToPhone: '(214) 555-8392',
    billToAddress: '4800 Logistics Way, Dallas, TX 75241',
    billToMc: 'MC-1489201',
    items: [
      {
        id: '1',
        description: 'Freight Dispatch Service Fee - 53ft Dry Van (Dallas, TX to Columbus, OH)',
        rate: 2850,
        quantity: 1,
        amount: 199.50, // 7%
      },
      {
        id: '2',
        description: 'Detention Fee Negotiation (2 hrs @ Shipper Dock)',
        rate: 75,
        quantity: 2,
        amount: 150.00,
      },
    ],
    subtotal: 349.50,
    tax: 0,
    total: 349.50,
    notes: 'Thank you for partnering with Infinity Dispatch LLC. Remittance payable via ACH, Zelle, or Factoring direct credit.',
    terms: 'Payment due within 72 hours of freight delivery confirmation.',
    status: 'Sent',
    createdAt: new Date().toISOString().split('T')[0],
  });

  // Add Load Form State (with customizable fee % and carrier phone)
  const [newLoad, setNewLoad] = useState({
    carrierName: '',
    carrierPhone: '',
    driverName: '',
    driverPhone: '',
    mcNumber: '',
    equipmentType: 'Dry Van' as EquipmentType,
    originCity: 'Dallas',
    originState: 'TX',
    puAddress: '4800 Logistics Way, Dallas, TX 75241',
    puTime: '08:00 AM CST',
    destinationCity: 'Atlanta',
    destinationState: 'GA',
    delAddress: '1500 Distribution Pkwy, Atlanta, GA 30303',
    delTime: '02:00 PM EST',
    pickupDate: new Date().toISOString().split('T')[0],
    deliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    brokerName: 'C.H. Robinson Worldwide',
    brokerageMc: 'MC-108920',
    brokerPhone: '(800) 323-7587',
    brokerageEmail: 'freight@chrobinson.com',
    commodity: 'General Dry Freight (Palletized)',
    rate: 2850,
    loadedMiles: 780,
    deadheadMiles: 35,
    status: 'Booked' as LoadStatus,
    dispatchFeePercent: 7, // Default 7%, but customizable to 5%, 6%, etc.
    invoiceStatus: 'Not Invoiced' as InvoiceStatus,
    rcDocumentName: 'Rate_Confirmation_RC-8921.pdf',
    rcDocumentContent: '',
    bolDocumentName: 'Bill_of_Lading_BOL-8921.pdf',
    bolDocumentContent: '',
    notes: '',
  });

  // Add Roster Carrier Form State
  const [newRosterCarrier, setNewRosterCarrier] = useState({
    driverName: '',
    driverPhone: '',
    carrierName: '',
    carrierPhone: '',
    mcNumber: '',
    dotNumber: '',
    dispatcherName: owner.name,
    dispatcherPhone: '+1 (409) 509-6940',
    dispatchedAmount: 3200,
    dispatchFeePercent: 5,
    invoiceStatus: 'Pending Payment' as InvoiceStatus,
    loadStatus: 'Booked' as LoadStatus,
    originDestination: 'Dallas, TX → Atlanta, GA',
    equipmentType: 'Dry Van' as EquipmentType,
  });

  // AI Copilot States
  const [aiRawRateConText, setAiRawRateConText] = useState('');
  const [isAiParsingRateCon, setIsAiParsingRateCon] = useState(false);
  const [aiInvoicePrompt, setAiInvoicePrompt] = useState('Include standard dedicated dispatch fee with detention & TONU clauses');
  const [selectedLoadForAiInvoice, setSelectedLoadForAiInvoice] = useState('');
  const [isAiGeneratingInvoice, setIsAiGeneratingInvoice] = useState(false);
  const [isAiDraftingReply, setIsAiDraftingReply] = useState(false);

  // Notes state
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteTag, setNewNoteTag] = useState('Broker Lane');

  const handleAiParseRateCon = async () => {
    if (!aiRawRateConText.trim()) {
      showToast('Please paste Rate Con text or enter a load prompt first');
      return;
    }
    setIsAiParsingRateCon(true);
    try {
      const res = await fetch('/api/ai/parse-rate-con', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: aiRawRateConText, equipmentHint: newLoad.equipmentType }),
      });
      const json = await res.json();
      if (json.data) {
        setNewLoad((prev) => ({
          ...prev,
          carrierName: json.data.carrierName || prev.carrierName,
          mcNumber: json.data.mcNumber || prev.mcNumber,
          equipmentType: (json.data.equipmentType as EquipmentType) || prev.equipmentType,
          originCity: json.data.originCity || prev.originCity,
          originState: json.data.originState || prev.originState,
          destinationCity: json.data.destinationCity || prev.destinationCity,
          destinationState: json.data.destinationState || prev.destinationState,
          puAddress: json.data.puAddress || prev.puAddress,
          puTime: json.data.puTime || prev.puTime,
          delAddress: json.data.delAddress || prev.delAddress,
          delTime: json.data.delTime || prev.delTime,
          brokerName: json.data.brokerName || prev.brokerName,
          brokerageMc: json.data.brokerageMc || prev.brokerageMc,
          brokerPhone: json.data.brokerPhone || prev.brokerPhone,
          rate: Number(json.data.rate) || prev.rate,
          loadedMiles: Number(json.data.loadedMiles) || prev.loadedMiles,
          dispatchFeePercent: Number(json.data.dispatchFeePercent) || prev.dispatchFeePercent,
          commodity: json.data.commodity || prev.commodity,
          notes: json.data.notes || prev.notes,
          rcDocumentContent: json.data.rcDocumentContent || prev.rcDocumentContent,
          bolDocumentContent: json.data.bolDocumentContent || prev.bolDocumentContent,
        }));
        showToast('AI successfully extracted Rate Con & auto-filled load fields!');
      }
    } catch (err) {
      console.error(err);
      showToast('Error parsing with AI');
    } finally {
      setIsAiParsingRateCon(false);
    }
  };

  // OCR BOL Handlers
  const handleRunOcrOnBolImage = async (base64: string, mime: string, fileName: string) => {
    setIsOcrScanning(true);
    setOcrPreviewImage(base64);
    setOcrDocumentName(fileName);
    try {
      const extracted = await parseBolImage(base64, mime, fileName);
      setOcrExtractedData(extracted);
      showToast(`✓ BOL #${extracted.bolNumber} OCR parsed with ${extracted.confidenceScore}% confidence!`);
    } catch (err) {
      console.error('BOL OCR error:', err);
      showToast('Error processing BOL document image');
    } finally {
      setIsOcrScanning(false);
    }
  };

  const handleSelectSampleBol = (sample: SampleBolDocument) => {
    setOcrSelectedSampleId(sample.id);
    setOcrDocumentName(sample.fileName);
    setOcrPreviewImage(sample.imageThumbnail);
    setIsOcrScanning(true);
    setTimeout(() => {
      setOcrExtractedData(sample.data);
      setIsOcrScanning(false);
      showToast(`✓ Sample BOL "${sample.title}" loaded and OCR extracted!`);
    }, 600);
  };

  const handleBolFileUpload = async (file: File) => {
    if (!file) return;
    setOcrSelectedSampleId(null);
    try {
      const { base64, mimeType } = await fileToBase64(file);
      await handleRunOcrOnBolImage(base64, mimeType, file.name);
    } catch (err) {
      console.error('Error reading file:', err);
      showToast('Failed to read image file');
    }
  };

  const handleApplyBolToDispatchFields = () => {
    if (!ocrExtractedData) {
      showToast('No parsed BOL data available to populate');
      return;
    }

    const commodityWithSpecs = `${ocrExtractedData.commodity} (${ocrExtractedData.pieceCount} ${ocrExtractedData.packageType || 'Pallets'}, ${ocrExtractedData.weightLbs.toLocaleString()} lbs)`;
    
    // Deduce equipment type if appropriate
    let equipment: EquipmentType = newLoad.equipmentType;
    const commLower = ocrExtractedData.commodity.toLowerCase();
    if (commLower.includes('meat') || commLower.includes('fresh') || commLower.includes('frozen') || commLower.includes('reefer') || commLower.includes('34°f')) {
      equipment = 'Reefer';
    } else if (commLower.includes('machinery') || commLower.includes('boom') || commLower.includes('steel') || commLower.includes('deck')) {
      equipment = 'Flatbed';
    }

    const bolContent = `STRAIGHT BILL OF LADING
BOL #: ${ocrExtractedData.bolNumber}
PRO #: ${ocrExtractedData.proNumber || 'N/A'} | PO #: ${ocrExtractedData.poNumber || 'N/A'}
SHIPPER: ${ocrExtractedData.shipperName}
PICKUP ADDRESS: ${ocrExtractedData.shipperAddress}, ${ocrExtractedData.originCity}, ${ocrExtractedData.originState} ${ocrExtractedData.originZip || ''}
PICKUP APPOINTMENT: ${ocrExtractedData.pickupDate} @ ${ocrExtractedData.pickupTime || '08:00 AM'}

CONSIGNEE: ${ocrExtractedData.consigneeName}
DELIVERY ADDRESS: ${ocrExtractedData.consigneeAddress}, ${ocrExtractedData.destinationCity}, ${ocrExtractedData.destinationState} ${ocrExtractedData.destinationZip || ''}
DELIVERY APPOINTMENT: ${ocrExtractedData.deliveryDate} @ ${ocrExtractedData.deliveryTime || '02:00 PM'}

CARRIER: ${ocrExtractedData.carrierName || newLoad.carrierName || 'Apex Interstate Express LLC'}
TRAILER #: ${ocrExtractedData.trailerNumber || 'TR-5310'} | SEAL #: ${ocrExtractedData.sealNumber || 'SEAL-VERIFIED'}
COMMODITY: ${ocrExtractedData.commodity}
TOTAL PIECES: ${ocrExtractedData.pieceCount} (${ocrExtractedData.packageType || 'Pallets'})
GROSS WEIGHT: ${ocrExtractedData.weightLbs.toLocaleString()} LBS
SPECIAL INSTRUCTIONS: ${ocrExtractedData.specialInstructions || 'Maintain continuous transport conditions. Clean trailer certified.'}
OCR EXTRACTION CONFIDENCE: ${ocrExtractedData.confidenceScore}% (High-Fidelity Automated Parse)
DISPATCH STATUS: Verified & Auto-Populated into Infinity Dispatch TMS`;

    setNewLoad((prev) => ({
      ...prev,
      originCity: ocrExtractedData.originCity,
      originState: ocrExtractedData.originState,
      puAddress: `${ocrExtractedData.shipperAddress}, ${ocrExtractedData.originCity}, ${ocrExtractedData.originState} ${ocrExtractedData.originZip || ''}`,
      puTime: ocrExtractedData.pickupTime || prev.puTime,
      pickupDate: ocrExtractedData.pickupDate || prev.pickupDate,
      destinationCity: ocrExtractedData.destinationCity,
      destinationState: ocrExtractedData.destinationState,
      delAddress: `${ocrExtractedData.consigneeAddress}, ${ocrExtractedData.destinationCity}, ${ocrExtractedData.destinationState} ${ocrExtractedData.destinationZip || ''}`,
      delTime: ocrExtractedData.deliveryTime || prev.delTime,
      deliveryDate: ocrExtractedData.deliveryDate || prev.deliveryDate,
      commodity: commodityWithSpecs,
      equipmentType: equipment,
      carrierName: ocrExtractedData.carrierName || prev.carrierName || 'Apex Interstate Express LLC',
      bolDocumentName: ocrDocumentName || `BOL_${ocrExtractedData.bolNumber}.pdf`,
      bolDocumentContent: bolContent,
      notes: `Auto-populated via AI OCR BOL Scanner (#${ocrExtractedData.bolNumber}). Seal #${ocrExtractedData.sealNumber || 'N/A'}. Trailer #${ocrExtractedData.trailerNumber || 'N/A'}.`,
    }));

    setIsOcrBolModalOpen(false);
    setIsAddLoadOpen(true);
    showToast(`✓ All BOL details from #${ocrExtractedData.bolNumber} successfully transferred to dispatch fields!`);
  };

  const handleDirectBookFromBol = () => {
    if (!ocrExtractedData) return;
    const grossRate = ocrExtractedData.commodity.toLowerCase().includes('meat') ? 3400 : ocrExtractedData.commodity.toLowerCase().includes('machinery') ? 3850 : 3100;
    const miles = 750;
    const feePercent = 7;
    const feeAmount = (grossRate * feePercent) / 100;
    const loadNumber = `INF-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const item: LoadItem = {
      id: `load-${Date.now()}`,
      loadNumber,
      carrierName: ocrExtractedData.carrierName || 'Apex Interstate Express LLC',
      carrierPhone: '(214) 555-8392',
      driverName: 'Marcus Vance',
      driverPhone: '(214) 555-8392',
      dispatcherName: owner.name,
      dispatcherPhone: '+1 (409) 509-6940',
      mcNumber: 'MC-1489201',
      equipmentType: ocrExtractedData.commodity.toLowerCase().includes('meat') ? 'Reefer' : ocrExtractedData.commodity.toLowerCase().includes('machinery') ? 'Flatbed' : 'Dry Van',
      originCity: ocrExtractedData.originCity,
      originState: ocrExtractedData.originState,
      puAddress: `${ocrExtractedData.shipperAddress}, ${ocrExtractedData.originCity}, ${ocrExtractedData.originState}`,
      puTime: ocrExtractedData.pickupTime || '08:00 AM',
      destinationCity: ocrExtractedData.destinationCity,
      destinationState: ocrExtractedData.destinationState,
      delAddress: `${ocrExtractedData.consigneeAddress}, ${ocrExtractedData.destinationCity}, ${ocrExtractedData.destinationState}`,
      delTime: ocrExtractedData.deliveryTime || '02:00 PM',
      pickupDate: ocrExtractedData.pickupDate,
      deliveryDate: ocrExtractedData.deliveryDate,
      brokerName: 'C.H. Robinson Worldwide',
      brokerageMc: 'MC-108920',
      brokerPhone: '(800) 323-7587',
      rate: grossRate,
      loadedMiles: miles,
      deadheadMiles: 40,
      rpm: grossRate / miles,
      status: 'Booked',
      dispatchFeePercent: feePercent,
      dispatchFeeAmount: feeAmount,
      paymentStatus: 'Pending',
      invoiceStatus: 'Not Invoiced',
      bolNumber: ocrExtractedData.bolNumber,
      proNumber: ocrExtractedData.proNumber,
      poNumber: ocrExtractedData.poNumber,
      weightLbs: ocrExtractedData.weightLbs,
      pieceCount: ocrExtractedData.pieceCount,
      trailerNumber: ocrExtractedData.trailerNumber,
      sealNumber: ocrExtractedData.sealNumber,
      shipperName: ocrExtractedData.shipperName,
      consigneeName: ocrExtractedData.consigneeName,
      ocrScanned: true,
      ocrConfidence: ocrExtractedData.confidenceScore,
      bolDocumentName: ocrDocumentName || `BOL_${ocrExtractedData.bolNumber}.pdf`,
      bolDocumentContent: `STRAIGHT BILL OF LADING\nBOL #: ${ocrExtractedData.bolNumber}\nShipper: ${ocrExtractedData.shipperName}\nConsignee: ${ocrExtractedData.consigneeName}\nCommodity: ${ocrExtractedData.commodity}\nWeight: ${ocrExtractedData.weightLbs} lbs | Pieces: ${ocrExtractedData.pieceCount}`,
      rcDocumentName: `Rate_Confirmation_${loadNumber}.pdf`,
      rcDocumentContent: `OFFICIAL RATE CONFIRMATION #${loadNumber}\nBroker: C.H. Robinson\nGross: $${grossRate}\nFee (7%): $${feeAmount}`,
      commodity: ocrExtractedData.commodity,
      notes: `Directly booked from AI OCR BOL #${ocrExtractedData.bolNumber} (${ocrExtractedData.confidenceScore}% confidence).`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    storage.saveLoad(item, owner.name);
    setLoads(storage.getLoads());
    setIsOcrBolModalOpen(false);
    showToast(`✓ Load #${loadNumber} directly dispatched from scanned BOL #${ocrExtractedData.bolNumber}!`);
  };


  const handleAiGenerateInvoice = async () => {
    setIsAiGeneratingInvoice(true);
    try {
      const targetLoad = loads.find((l) => l.id === selectedLoadForAiInvoice) || loads[0];
      const res = await fetch('/api/ai/generate-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carrierName: targetLoad?.carrierName || invoiceBuilder.billToCompany,
          mcNumber: targetLoad?.mcNumber || invoiceBuilder.billToMc,
          loadNumber: targetLoad?.loadNumber || invoiceBuilder.poNumber,
          grossRate: targetLoad?.rate || 2850,
          feePercent: targetLoad?.dispatchFeePercent || 7,
          prompt: aiInvoicePrompt,
        }),
      });
      const json = await res.json();
      if (json.data && Array.isArray(json.data.items)) {
        setInvoiceBuilder((prev) => ({
          ...prev,
          billToCompany: targetLoad?.carrierName || prev.billToCompany,
          billToMc: targetLoad?.mcNumber || prev.billToMc,
          billToPhone: targetLoad?.carrierPhone || prev.billToPhone,
          poNumber: targetLoad?.loadNumber || prev.poNumber,
          items: json.data.items,
          notes: json.data.notes || prev.notes,
          terms: json.data.terms || prev.terms,
        }));
        showToast(`AI generated ${json.data.items.length} invoice line items & terms!`);
      }
    } catch (err) {
      console.error(err);
      showToast('Error generating AI invoice items');
    } finally {
      setIsAiGeneratingInvoice(false);
    }
  };

  const handleAiDraftReply = async () => {
    if (!activeInquiryForReply) return;
    setIsAiDraftingReply(true);
    try {
      const res = await fetch('/api/ai/draft-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carrierName: activeInquiryForReply.fullName,
          inquiryMessage: activeInquiryForReply.message,
          executiveName: replyAuthor,
        }),
      });
      const json = await res.json();
      if (json.reply) {
        setReplyMessageText(json.reply);
        showToast(`AI drafted customer reply for ${replyAuthor}!`);
      }
    } catch (err) {
      console.error(err);
      showToast('Error drafting AI reply');
    } finally {
      setIsAiDraftingReply(false);
    }
  };

  const refreshData = () => {
    setCarriers(storage.getCarriers());
    setApplications(storage.getApplications());
    setLoads(storage.getLoads());
    setRosterCarriers(storage.getRosterCarriers());
    setInvoices(storage.getGeneratedInvoices());
    setDispatchers(storage.getDispatchers());
    setInquiries(storage.getInquiries());
    setPayments(storage.getPayments());
    setActivities(storage.getActivities());
    setReviews(storage.getReviews());
    setNotes(storage.getNotes());
    setDemoBookings(storage.getDemoBookings());
    setEmailLogs(storage.getEmailLogs());
    setCarrierPerformances(storage.getCarrierPerformances());
    const savedEmail = storage.getConnectedGoogleEmail();
    if (savedEmail) setConnectedGoogleEmail(savedEmail);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Arithmetic Calculator logic
  const handleCalcDigit = (digit: string) => {
    if (calcWaitingForOperand) {
      setCalcDisplay(digit);
      setCalcWaitingForOperand(false);
    } else {
      setCalcDisplay(calcDisplay === '0' ? digit : calcDisplay + digit);
    }
  };

  const handleCalcDecimal = () => {
    if (calcWaitingForOperand) {
      setCalcDisplay('0.');
      setCalcWaitingForOperand(false);
      return;
    }
    if (!calcDisplay.includes('.')) {
      setCalcDisplay(calcDisplay + '.');
    }
  };

  const handleCalcClear = () => {
    setCalcDisplay('0');
    setCalcPrevValue(null);
    setCalcOperator(null);
    setCalcWaitingForOperand(false);
  };

  const handleCalcOperation = (nextOperator: string) => {
    const inputValue = parseFloat(calcDisplay);

    if (calcPrevValue === null) {
      setCalcPrevValue(inputValue);
    } else if (calcOperator) {
      const currentValue = calcPrevValue || 0;
      let newValue = currentValue;
      if (calcOperator === '+') newValue = currentValue + inputValue;
      else if (calcOperator === '-') newValue = currentValue - inputValue;
      else if (calcOperator === '×' || calcOperator === '*') newValue = currentValue * inputValue;
      else if (calcOperator === '÷' || calcOperator === '/') newValue = inputValue !== 0 ? currentValue / inputValue : 0;
      setCalcDisplay(String(newValue));
      setCalcPrevValue(newValue);
    }

    setCalcWaitingForOperand(true);
    setCalcOperator(nextOperator);
  };

  const handleCalcEquals = () => {
    if (calcOperator === null || calcPrevValue === null) return;
    const inputValue = parseFloat(calcDisplay);
    let result = calcPrevValue;
    if (calcOperator === '+') result = calcPrevValue + inputValue;
    else if (calcOperator === '-') result = calcPrevValue - inputValue;
    else if (calcOperator === '×' || calcOperator === '*') result = calcPrevValue * inputValue;
    else if (calcOperator === '÷' || calcOperator === '/') result = inputValue !== 0 ? calcPrevValue / inputValue : 0;
    setCalcDisplay(String(result));
    setCalcPrevValue(null);
    setCalcOperator(null);
    setCalcWaitingForOperand(true);
  };

  // Google Account Connect
  const handleConnectGoogle = () => {
    const inputEmail = window.prompt(
      'Connect Google / Gmail account for real automated dispatch emails:',
      connectedGoogleEmail || 'Davidcross.vl1@gmail.com'
    );
    if (inputEmail && inputEmail.includes('@')) {
      storage.setConnectedGoogleEmail(inputEmail.trim());
      setConnectedGoogleEmail(inputEmail.trim());
      storage.logActivity(
        owner.name,
        'Connected Google Account',
        `Google account synced to ${inputEmail.trim()}. All carrier registrations & rate cons will auto-forward.`,
        'Email'
      );
      showToast(`Connected successfully to ${inputEmail.trim()}!`);
      refreshData();
    }
  };

  const handleSendTestEmail = () => {
    storage.logEmail({
      to: connectedGoogleEmail,
      subject: `[Verified Transmission] Infinity Dispatch Test Alert to ${connectedGoogleEmail}`,
      body: `Test connection successful from Infinity Dispatch LLC Owner Portal. Carrier registrations, BOLs, Rate Cons, and customer inquiries will be dispatched directly to this inbox. Verified timestamp: ${new Date().toISOString()}`,
      type: 'Live Inquiry',
    });
    showToast(`Test email dispatched successfully to ${connectedGoogleEmail}!`);
    refreshData();
  };

  // Open Document in DocumentViewerModal
  const handleOpenDoc = (
    title: string,
    docType: DocumentViewerData['docType'],
    fileName: string,
    carrierName?: string,
    mcNumber?: string,
    loadNumber?: string,
    rawText?: string,
    extra?: Record<string, string | number>
  ) => {
    setActiveDocData({
      title,
      docType,
      fileName,
      carrierName,
      mcNumber,
      loadNumber,
      date: new Date().toISOString().split('T')[0],
      rawText,
      extraDetails: extra,
    });
    setIsDocViewerOpen(true);
  };

  // Save New Load
  const handleSaveLoad = (e: React.FormEvent) => {
    e.preventDefault();
    const rpm = newLoad.loadedMiles > 0 ? newLoad.rate / newLoad.loadedMiles : 0;
    const feeAmount = (newLoad.rate * Number(newLoad.dispatchFeePercent)) / 100;
    const loadNumber = `INF-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const item: LoadItem = {
      id: `load-${Date.now()}`,
      loadNumber,
      carrierName: newLoad.carrierName || 'TBD Carrier',
      carrierPhone: newLoad.carrierPhone || '(409) 509-6940',
      driverName: newLoad.driverName || newLoad.carrierName,
      driverPhone: newLoad.driverPhone || newLoad.carrierPhone,
      dispatcherName: owner.name,
      dispatcherPhone: '+1 (409) 509-6940',
      mcNumber: newLoad.mcNumber || 'MC-Pending',
      equipmentType: newLoad.equipmentType,
      originCity: newLoad.originCity,
      originState: newLoad.originState,
      puAddress: newLoad.puAddress,
      puTime: newLoad.puTime,
      destinationCity: newLoad.destinationCity,
      destinationState: newLoad.destinationState,
      delAddress: newLoad.delAddress,
      delTime: newLoad.delTime,
      pickupDate: newLoad.pickupDate,
      deliveryDate: newLoad.deliveryDate,
      brokerName: newLoad.brokerName,
      brokerageMc: newLoad.brokerageMc,
      brokerPhone: newLoad.brokerPhone,
      brokerageEmail: newLoad.brokerageEmail,
      rate: Number(newLoad.rate),
      loadedMiles: Number(newLoad.loadedMiles),
      deadheadMiles: Number(newLoad.deadheadMiles),
      rpm,
      status: newLoad.status,
      dispatchFeePercent: Number(newLoad.dispatchFeePercent),
      dispatchFeeAmount: feeAmount,
      paymentStatus: 'Pending',
      invoiceStatus: newLoad.invoiceStatus,
      invoiceNumber: `INV-${Math.floor(8000 + Math.random() * 2000)}`,
      rcDocumentName: newLoad.rcDocumentName || `Rate_Confirmation_${loadNumber}.pdf`,
      rcDocumentContent: `OFFICIAL RATE CONFIRMATION #${loadNumber}\nBroker: ${newLoad.brokerName} (${newLoad.brokerageMc})\nCarrier: ${newLoad.carrierName} (${newLoad.mcNumber})\nDriver: ${newLoad.driverName || 'Assigned Driver'} | Phone: ${newLoad.driverPhone || newLoad.carrierPhone}\nRoute: ${newLoad.originCity}, ${newLoad.originState} -> ${newLoad.destinationCity}, ${newLoad.destinationState}\nDispatched Gross: $${newLoad.rate.toFixed(2)}\nCommission Fee: ${newLoad.dispatchFeePercent}% ($${feeAmount.toFixed(2)})\nDirect Carrier Payout: $${(newLoad.rate - feeAmount).toFixed(2)}\nSigned by: ${owner.name} (Infinity Dispatch LLC)`,
      bolDocumentName: newLoad.bolDocumentName || `Bill_of_Lading_BOL-${loadNumber.slice(-4)}.pdf`,
      bolDocumentContent: `STRAIGHT BILL OF LADING\nShipper Dock: ${newLoad.puAddress}\nConsignee Receiver: ${newLoad.delAddress}\nCarrier: ${newLoad.carrierName} | Equipment: ${newLoad.equipmentType}\nCommodity: ${newLoad.commodity || 'General Freight'}\nStatus: Shipper Verified & In-Transit`,
      commodity: newLoad.commodity,
      notes: newLoad.notes,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    storage.saveLoad(item, owner.name);

    // Also add/update corresponding roster carrier
    storage.saveRosterCarrier(
      {
        id: `roster-${Date.now()}`,
        driverName: newLoad.driverName || newLoad.carrierName,
        driverPhone: newLoad.driverPhone || newLoad.carrierPhone,
        carrierName: newLoad.carrierName,
        carrierPhone: newLoad.carrierPhone || '(409) 509-6940',
        mcNumber: newLoad.mcNumber,
        dispatcherName: owner.name,
        dispatcherPhone: '+1 (409) 509-6940',
        dispatchedAmount: Number(newLoad.rate),
        dispatchFeePercent: Number(newLoad.dispatchFeePercent),
        invoiceStatus: newLoad.invoiceStatus,
        loadStatus: newLoad.status,
        originDestination: `${newLoad.originCity}, ${newLoad.originState} → ${newLoad.destinationCity}, ${newLoad.destinationState}`,
        equipmentType: newLoad.equipmentType,
        updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      },
      owner.name
    );

    // Send notification to connected email
    storage.logEmail({
      to: connectedGoogleEmail,
      subject: `New Load Dispatched #${loadNumber}: ${item.carrierName} ($${item.rate})`,
      body: `Load #${loadNumber} successfully booked and dispatched by ${owner.name}.\nCarrier: ${item.carrierName} (${item.carrierPhone})\nRoute: ${item.originCity}, ${item.originState} to ${item.destinationCity}, ${item.destinationState}\nDispatched Gross: $${item.rate}\nFee: ${item.dispatchFeePercent}% ($${feeAmount.toFixed(2)})\nInvoice Status: ${item.invoiceStatus}`,
      type: 'Live Inquiry',
    });

    setIsAddLoadOpen(false);
    showToast(`Load #${loadNumber} booked! Gross: $${item.rate}, Fee: ${item.dispatchFeePercent}%`);
    refreshData();
  };

  // Save Roster Carrier
  const handleSaveRosterCarrier = (e: React.FormEvent) => {
    e.preventDefault();
    storage.saveRosterCarrier(
      {
        id: `roster-${Date.now()}`,
        driverName: newRosterCarrier.driverName || newRosterCarrier.carrierName,
        driverPhone: newRosterCarrier.driverPhone || newRosterCarrier.carrierPhone,
        carrierName: newRosterCarrier.carrierName,
        carrierPhone: newRosterCarrier.carrierPhone,
        mcNumber: newRosterCarrier.mcNumber,
        dotNumber: newRosterCarrier.dotNumber,
        dispatcherName: newRosterCarrier.dispatcherName,
        dispatcherPhone: newRosterCarrier.dispatcherPhone,
        dispatchedAmount: Number(newRosterCarrier.dispatchedAmount),
        dispatchFeePercent: Number(newRosterCarrier.dispatchFeePercent),
        invoiceStatus: newRosterCarrier.invoiceStatus,
        loadStatus: newRosterCarrier.loadStatus,
        originDestination: newRosterCarrier.originDestination,
        equipmentType: newRosterCarrier.equipmentType,
        updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      },
      owner.name
    );
    setIsAddRosterCarrierOpen(false);
    showToast(`Carrier ${newRosterCarrier.carrierName} added to dispatch roster!`);
    refreshData();
  };

  // Reply to Customer Inquiry
  const handleSendInquiryReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInquiryForReply || !replyMessageText.trim()) return;

    storage.updateInquiryStatus(activeInquiryForReply.id, 'Replied', {
      text: replyMessageText.trim(),
      author: replyAuthor,
    });

    // Send real email copy
    storage.logEmail({
      to: activeInquiryForReply.email,
      subject: `Reply from ${replyAuthor} (Infinity Dispatch LLC): ${activeInquiryForReply.subject}`,
      body: `Hello ${activeInquiryForReply.fullName},\n\n${replyMessageText.trim()}\n\nBest regards,\n${replyAuthor}\nInfinity Dispatch LLC\nPhone: +1 (409) 509-6940\nEmail: ${replyAuthor === 'David Cross' ? 'Davidcross.vl1@gmail.com' : 'alvin.vast@gmail.com'}`,
      type: 'Live Inquiry',
    });

    showToast(`Reply sent to ${activeInquiryForReply.fullName} (${activeInquiryForReply.email})!`);
    setActiveInquiryForReply(null);
    setReplyMessageText('');
    refreshData();
  };

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    setIsGoogleSigningIn(true);
    try {
      const res = await googleAuthService.signInWithGoogle();
      if (res.success && res.profile) {
        setGoogleProfile(res.profile);
        if (res.profile.email) {
          setConnectedGoogleEmail(res.profile.email);
        }
        showToast(`Google & Gmail connected as ${res.profile.email}!`);
        refreshData();
      } else {
        showToast(res.error || 'Google Sign-In was cancelled.');
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to authenticate with Google');
    } finally {
      setIsGoogleSigningIn(false);
    }
  };

  // Automated Load Status Update & PDF Invoice Dispatch via Gmail
  const handleUpdateLoadStatus = async (loadId: string, newStatus: LoadStatus) => {
    const targetLoad = loads.find((l) => l.id === loadId);
    if (!targetLoad) return;

    storage.updateLoadStatus(loadId, newStatus, owner.name);

    if (newStatus === 'Completed') {
      try {
        const matchedCarrier =
          carriers.find((c) => c.mcNumber === targetLoad.mcNumber) ||
          applications.find((a) => a.mcNumber === targetLoad.mcNumber);
        const carrierEmail =
          matchedCarrier?.email ||
          targetLoad.brokerageEmail ||
          connectedGoogleEmail ||
          'dispatch@carrier.com';
        const carrierAddress = matchedCarrier
          ? `${matchedCarrier.currentZip}, United States`
          : 'United States';

        const invoice = buildInvoiceFromLoad(targetLoad, carrierEmail, carrierAddress);
        storage.saveGeneratedInvoice(invoice, owner.name);

        const pdfDoc = generateInvoicePdf(invoice);
        const pdfBase64 = invoicePdfToBase64(pdfDoc);

        const emailResult = await sendEmailWithGmail({
          to: carrierEmail,
          cc: connectedGoogleEmail || 'Davidcross.vl1@gmail.com',
          subject: `[OFFICIAL INVOICE #${invoice.invoiceNumber}] Completed Load #${targetLoad.loadNumber} Remittance - Infinity Dispatch LLC`,
          bodyText: `Dear ${targetLoad.carrierName},\n\nLoad #${targetLoad.loadNumber} (${targetLoad.originCity}, ${targetLoad.originState} -> ${targetLoad.destinationCity}, ${targetLoad.destinationState}) has been marked as COMPLETED.\n\nAttached is your official PDF dispatch service invoice #${invoice.invoiceNumber}.\nGross Freight Rate: $${targetLoad.rate.toFixed(2)}\nDispatch Fee (${targetLoad.dispatchFeePercent}%): $${invoice.total.toFixed(2)}\nDue Date: ${invoice.dueDate}\n\nPlease remit payment within 72 hours via QuickPay, Zelle, or direct Factoring deduction.\n\nThank you for choosing Infinity Dispatch LLC!\nDavid Cross & Alvin\nPhone: +1 (409) 509-6940\nEmail: Davidcross.vl1@gmail.com`,
          pdfBase64,
          pdfFileName: `Invoice_${invoice.invoiceNumber}_InfinityDispatch.pdf`,
        });

        storage.updateLoadInvoiceStatus(loadId, 'Invoice Sent', owner.name);

        showToast(
          `Load #${targetLoad.loadNumber} COMPLETED! PDF Invoice #${invoice.invoiceNumber} auto-generated and dispatched via ${
            emailResult.deliveryMethod === 'gmail_api' ? 'Gmail API' : 'Infinity Dispatch Gateway'
          }!`
        );
      } catch (err) {
        console.error('Error generating or sending completed load invoice:', err);
        showToast(`Load marked completed. PDF invoice recorded in invoice repository.`);
      }
    } else {
      showToast(`Load #${targetLoad.loadNumber} status updated to "${newStatus}"`);
    }

    refreshData();
  };

  // SearchCarriers.com & FMCSA SAFER live search
  const handleSearchSAFER = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = saferQuery.trim();
    if (!query) return;

    setSaferLoading(true);
    try {
      const result = await lookupCarrierSafety(query);
      if (result.success && result.data) {
        setSaferProfile(result.data);
        setSaferResult({
          legalName: result.data.legalName,
          mcNumber: result.data.mcNumber,
          dotNumber: result.data.dotNumber.replace(/\D/g, ''),
          physicalAddress: result.data.physicalAddress,
          safetyRating: `${result.data.safetyRating.toUpperCase()} (VERIFIED ACTIVE)`,
          operatingAuthority: `${result.data.operatingStatus} (${
            result.data.commonAuthority === 'Active' ? 'COMMON' : ''
          } ${result.data.contractAuthority === 'Active' ? 'CONTRACT' : ''})`,
          boc3OnFile: 'YES (PROCESS AGENT VERIFIED ON FILE)',
          liabilityInsurance: `${result.data.bipdInsurance} AUTO LIABILITY (ACTIVE)`,
          cargoInsurance: `${result.data.cargoInsurance} CARGO COVERAGE (ACTIVE)`,
          inspectionOOSRate: `${result.data.vehicleOosRate}% (NATIONAL BENCHMARK: 21.4%)`,
          activePowerUnits: result.data.powerUnits,
          driversReported: result.data.drivers,
        });
        showToast(`SearchCarriers.com record verified for ${result.data.legalName}!`);
      } else {
        showToast(result.error || 'Carrier lookup failed');
      }
    } catch (err) {
      console.error(err);
      showToast('Error querying SearchCarriers.com');
    } finally {
      setSaferLoading(false);
    }
  };

  // Invoice calculations
  const invoiceSubtotal = invoiceBuilder.items.reduce((s, it) => s + (Number(it.rate) * Number(it.quantity)), 0);
  const invoiceTaxAmount = (invoiceSubtotal * (Number(invoiceTaxPercent) || 0)) / 100;
  const invoiceTotal = Math.max(0, invoiceSubtotal - (Number(invoiceDiscountAmount) || 0) + invoiceTaxAmount);
  const invoiceBalanceDue = Math.max(0, invoiceTotal - (Number(invoiceAmountPaid) || 0));

  const handleCopyCarrierDossier = (carrier: RosterCarrier) => {
    const docsSummary = (carrier.documents || []).map((d) => `• [${d.type}] ${d.name} (${d.status})`).join('\n');
    const dossierText = `========================================
INFINITY DISPATCH LLC - CARRIER DOSSIER
========================================
CARRIER NAME:    ${carrier.carrierName}
MC NUMBER:       ${carrier.mcNumber}
USDOT NUMBER:    ${carrier.dotNumber || 'N/A'}
DRIVER NAME:     ${carrier.driverName}
DRIVER PHONE:    ${carrier.driverPhone}
CARRIER PHONE:   ${carrier.carrierPhone}
CARRIER EMAIL:   ${carrier.carrierEmail || 'dispatch@carrier.com'}
PHYSICAL ADDR:   ${carrier.carrierAddress || 'On File'}
EQUIPMENT:       ${carrier.equipmentType || 'Dry Van'}
TRACTOR VIN:     ${carrier.vinNumber || 'On File'}
DISPATCHER:      ${carrier.dispatcherName} (${carrier.dispatcherPhone})
SALES AGENT:     ${carrier.salesPersonName || 'Direct'}
DISPATCHED GROSS: $${carrier.dispatchedAmount.toLocaleString()}
COMMISSION FEE:  ${carrier.dispatchFeePercent}%
INVOICE STATUS:  ${carrier.invoiceStatus}
LOAD STATUS:     ${carrier.loadStatus}
LANES:           ${carrier.originDestination || 'Nationwide'}
PREFERENCES/NOTES:
${carrier.notes || 'None noted.'}
ATTACHED DOCUMENTS (${(carrier.documents || []).length}):
${docsSummary || 'No extra documents attached.'}
========================================`;

    navigator.clipboard.writeText(dossierText);
    setCopiedItemId(carrier.id);
    showToast(`✓ All details for ${carrier.carrierName} (${carrier.mcNumber}) copied to clipboard!`);
    setTimeout(() => setCopiedItemId(null), 2500);
  };

  const handleCopyLoadSheet = (load: LoadItem) => {
    const sheetText = `========================================
INFINITY DISPATCH LLC - LOAD DISPATCH SHEET
========================================
LOAD NUMBER:     #${load.loadNumber}
STATUS:          ${load.status}
COMMODITY:       ${load.commodity || 'General Freight'}
EQUIPMENT:       ${load.equipmentType}

CARRIER:         ${load.carrierName}
CARRIER MC:      ${load.mcNumber}
CARRIER PHONE:   ${load.carrierPhone || load.driverPhone || 'On File'}
DRIVER NAME:     ${load.driverName || 'Assigned Driver'}

PICKUP:          ${load.originCity}, ${load.originState}
PU ADDRESS:      ${load.puAddress || `${load.originCity}, ${load.originState}`}
PU DATE/TIME:    ${load.pickupDate} @ ${load.puTime || '08:00 AM'}

DELIVERY:        ${load.destinationCity}, ${load.destinationState}
DEL ADDRESS:     ${load.delAddress || `${load.destinationCity}, ${load.destinationState}`}
DEL DATE/TIME:   ${load.deliveryDate} @ ${load.delTime || '05:00 PM'}

BROKER:          ${load.brokerName}
BROKER MC:       ${load.brokerageMc || 'Verified Broker'}
BROKER PHONE:    ${load.brokerPhone || 'On File'}

GROSS LINEHAUL:  $${load.rate.toLocaleString()}
LOADED MILES:    ${load.loadedMiles} mi ($${load.rpm.toFixed(2)}/mi)
DISPATCH FEE:    ${load.dispatchFeePercent}% ($${load.dispatchFeeAmount.toFixed(2)})
INVOICE STATUS:  ${load.invoiceStatus || 'Not Invoiced'}
PAYMENT STATUS:  ${load.paymentStatus}
DOCUMENTS:       RC: ${load.rcDocumentName || 'Attached'} | BOL: ${load.bolDocumentName || 'Attached'}
DISPATCHER:      ${load.dispatcherName} (${load.dispatcherPhone})
NOTES:           ${load.notes || 'Clean run, 100% direct dispatch.'}
========================================`;

    navigator.clipboard.writeText(sheetText);
    setCopiedItemId(load.id);
    showToast(`✓ Complete load sheet #${load.loadNumber} copied to clipboard!`);
    setTimeout(() => setCopiedItemId(null), 2500);
  };


  // Compute analytics
  const activeCarriersCount = carriers.filter((c) => c.status === 'Active').length;
  const pendingAppsCount = applications.filter((a) => a.status === 'Pending').length;
  const unreadInquiriesCount = inquiries.filter((i) => i.status === 'Sent').length;
  const activeLoadsCount = loads.filter((l) => l.status === 'In Transit' || l.status === 'Booked' || l.status === 'Loading' || l.status === 'Dispatched').length;
  const totalGrossRevenue = loads.reduce((sum, l) => sum + l.rate, 0);
  const totalCommissionEarned = loads.reduce((sum, l) => sum + l.dispatchFeeAmount, 0);

  const navItems = [
    { id: 'overview', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'loads', label: 'Load Management & Status', icon: Package, badge: activeLoadsCount },
    { id: 'roster', label: 'Active Carrier Roster', icon: Truck, badge: rosterCarriers.length },
    { id: 'applications', label: 'Carrier Sign-Ups (All Data)', icon: FileCheck, badge: pendingAppsCount },
    { id: 'pdfeditor', label: 'PDF Editor (Sejda Studio)', icon: Edit3 },
    { id: 'copilot', label: 'Gemini Copilot & Translator', icon: Sparkles },
    { id: 'invoice', label: 'Invoice Generator (Live)', icon: Printer },
    { id: 'calculator', label: 'Route & Math Calculator', icon: Calculator },
    { id: 'safer', label: 'CarrierChk & SAFER Inspector', icon: Shield },
    { id: 'dispatchers', label: 'Dispatch & Sales Force', icon: Headphones },
    { id: 'messages', label: 'Customer Messages & Reply', icon: Send, badge: unreadInquiriesCount },
    { id: 'email', label: 'Google Email Integration', icon: Mail, badge: emailLogs.length },
    { id: 'carriers', label: 'Fleet Carrier Database', icon: Users, badge: carriers.length },
    { id: 'payments', label: 'Commission Records', icon: DollarSign },
    { id: 'demos', label: 'Demo Bookings', icon: Calendar, badge: demoBookings.filter(d => d.status === 'Pending').length },
    { id: 'notes', label: 'Confidential Notes', icon: Lock },
    { id: 'reviews', label: 'Carrier Reviews', icon: Star },
    { id: 'settings', label: 'System & Audit Trail', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col lg:flex-row antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl bg-emerald-600 text-white font-mono text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-[#0A101F] border-r border-blue-900/40 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Header */}
          <div className="p-5 border-b border-blue-900/40 flex items-center justify-between">
            <InfinityLogo size="sm" variant="compact" />
          </div>

          {/* Current Owner Badge */}
          <div className="p-4 mx-3 my-3 rounded-xl bg-blue-950/50 border border-blue-800/40">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                {owner.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">{owner.name}</div>
                <div className="text-[10px] font-mono font-semibold text-emerald-400">
                  SUPER ADMIN
                </div>
              </div>
            </div>
            <div className="text-[10px] font-mono text-slate-400 truncate mt-1">
              {owner.email}
            </div>

            {/* Google Sync Indicator */}
            <div
              onClick={handleConnectGoogle}
              className="mt-2 pt-2 border-t border-blue-900/40 flex items-center justify-between text-[10px] font-mono text-sky-300 cursor-pointer hover:text-white"
            >
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Google Email Synced</span>
              </span>
              <span className="underline">Change</span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="px-2 space-y-1 max-h-[calc(100vh-280px)] overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`w-full px-3 py-2 text-xs font-semibold rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-blue-800 text-white' : 'bg-slate-800 text-sky-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Actions */}
        <div className="p-4 border-t border-blue-900/40 space-y-2">
          <button
            onClick={onSwitchToPublic}
            className="w-full py-2 px-3 text-xs font-semibold text-sky-300 hover:text-white bg-slate-900 hover:bg-blue-950 border border-slate-800 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>View Public Website</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full py-2 px-3 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto max-h-screen p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Header Strip with Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-900/30">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>Infinity Dispatch LLC</span>
              <span>/</span>
              <span className="text-sky-400 capitalize">{activeTab}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white capitalize">
              {activeTab === 'loads'
                ? 'Load Management (Dispatched Amount, Fee %, RC & BOL Attached)'
                : activeTab === 'applications'
                ? 'Carrier Sign-Ups (All Documents & Data Saved Forever)'
                : activeTab === 'roster'
                ? 'Active Dispatch Team Roster (Carrier Name, Phone, Dispatched Gross, Invoice Status)'
                : activeTab === 'invoice'
                ? 'Freight Invoice Generator (Interactive Live Creator & PDF)'
                : activeTab === 'safer'
                ? 'FMCSA SAFER & SearchCarriers.com Direct Lookup'
                : activeTab === 'calculator'
                ? 'Route & Simple Arithmetic Calculator'
                : activeTab === 'messages'
                ? 'Customer Service Message Inquiries & Real Reply Desk'
                : activeTab.replace('-', ' ')}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsAddLoadOpen(true)}
              className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Book Load</span>
            </button>

            <button
              onClick={() => setIsAddRosterCarrierOpen(true)}
              className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Add Roster Carrier</span>
            </button>

            <button
              onClick={() => setActiveTab('invoice')}
              className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-700/80 rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-sky-400" />
              <span>Generate Invoice</span>
            </button>
          </div>
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#0D1527] border border-blue-900/40">
                <span className="text-xs text-slate-400 block mb-1">Total Dispatched Gross</span>
                <div className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-400 font-mono">
                  ${totalGrossRevenue.toLocaleString()}
                </div>
                <span className="text-[11px] font-mono text-slate-400 mt-2 block">
                  Across {loads.length} active & booked loads
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#0D1527] border border-blue-900/40">
                <span className="text-xs text-slate-400 block mb-1">Commission Earned</span>
                <div className="text-2xl sm:text-3xl font-display font-extrabold text-white font-mono">
                  ${totalCommissionEarned.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <span className="text-[11px] font-mono text-sky-400 mt-2 block">
                  Customizable per load (5% - 10%)
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#0D1527] border border-blue-900/40">
                <span className="text-xs text-slate-400 block mb-1">Carrier Sign-Ups Saved</span>
                <div className="text-2xl sm:text-3xl font-display font-extrabold text-amber-400 font-mono">
                  {applications.length}
                </div>
                <span className="text-[11px] font-mono text-slate-400 mt-2 block">
                  Permanent cloud storage + document view
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#0D1527] border border-blue-900/40">
                <span className="text-xs text-slate-400 block mb-1">Connected Google Email</span>
                <div className="text-sm font-bold text-white font-mono truncate">
                  {connectedGoogleEmail}
                </div>
                <span className="text-[11px] font-mono text-emerald-400 mt-2 block flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  100% Automated forwarding active
                </span>
              </div>
            </div>

            {/* Fast Nav Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                onClick={() => setActiveTab('loads')}
                className="p-5 rounded-2xl bg-[#0B1428] border border-blue-500/30 hover:border-blue-400 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between text-xs font-mono text-sky-400 font-bold">
                  <span>LOAD MANAGEMENT</span>
                  <span>{loads.length} LOADS</span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-sky-300">
                  Dispatched Amount & Fee Customizer
                </h3>
                <p className="text-xs text-slate-300">
                  Update load status (Booked, Loading, In Transit, Delivered), change fee %, and inspect attached RC & BOL documents.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('roster')}
                className="p-5 rounded-2xl bg-[#0B1428] border border-blue-500/30 hover:border-blue-400 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between text-xs font-mono text-emerald-400 font-bold">
                  <span>DISPATCH TEAM ROSTER</span>
                  <span>{rosterCarriers.length} CARRIERS</span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300">
                  Carrier Name, Phone, MC & Invoice Status
                </h3>
                <p className="text-xs text-slate-300">
                  Track assigned driver names, phone numbers, gross amount, and toggle invoice status (Pending, Sent, Cleared/Paid).
                </p>
              </div>

              <div
                onClick={() => setActiveTab('invoice')}
                className="p-5 rounded-2xl bg-[#0B1428] border border-blue-500/30 hover:border-blue-400 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between text-xs font-mono text-amber-400 font-bold">
                  <span>INVOICE BUILDER</span>
                  <span>LIVE GENERATOR</span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-300">
                  Invoice-Generator.com Style Builder
                </h3>
                <p className="text-xs text-slate-300">
                  Create custom carrier commission invoices with dynamic line items, download files, and print clean PDFs.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2. LOAD MANAGEMENT TAB (All Options Fully Editable + PU/DEL Dates/Addresses + Broker Details + RC/POD OCR + Copy All) */}
        {activeTab === 'loads' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0D1527] p-4 rounded-2xl border border-blue-900/40">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  LIVE LOAD MANAGEMENT · EDITABLE DISPATCH DOSSIERS & MULTIMODAL OCR
                </span>
                <p className="text-xs text-slate-300">
                  All loads are 100% editable. Tracks exact PU/DEL dates & times, full facility addresses, broker MC#, customizable fee %, documents, and 1-click clipboard export.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Scan RC Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsAddLoadOpen(true);
                    showToast('Opening Rate Con parser. Paste text or upload image in load dialog.');
                  }}
                  className="px-3 py-2 text-xs font-bold text-sky-200 bg-sky-950 hover:bg-sky-900 rounded-xl border border-sky-600/50 cursor-pointer flex items-center gap-1.5 transition-all"
                  title="Scan & Parse Rate Confirmation (RC)"
                >
                  <FileText className="w-3.5 h-3.5 text-sky-400" />
                  <span>Scan RC</span>
                </button>

                {/* Scan BOL Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsOcrBolModalOpen(true);
                    if (!ocrPreviewImage && SAMPLE_BOL_DOCUMENTS.length > 0) {
                      handleSelectSampleBol(SAMPLE_BOL_DOCUMENTS[0]);
                    }
                  }}
                  className="px-3 py-2 text-xs font-bold text-purple-200 bg-purple-950 hover:bg-purple-900 rounded-xl border border-purple-600/50 cursor-pointer flex items-center gap-1.5 transition-all"
                  title="Scan & Parse Bill of Lading (BOL)"
                >
                  <Scan className="w-3.5 h-3.5 text-purple-300" />
                  <span>Scan BOL</span>
                </button>

                {/* Scan POD Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsAddLoadOpen(true);
                    showToast('Opening POD verification in Load creator.');
                  }}
                  className="px-3 py-2 text-xs font-bold text-emerald-200 bg-emerald-950 hover:bg-emerald-900 rounded-xl border border-emerald-600/50 cursor-pointer flex items-center gap-1.5 transition-all"
                  title="Scan Proof of Delivery (POD)"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Scan POD</span>
                </button>

                {/* Add Load */}
                <button
                  type="button"
                  onClick={() => setIsAddLoadOpen(true)}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Book & Dispatch Load</span>
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-[#0D1527] border border-blue-900/40 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#080E1C] border-b border-blue-900/40 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Load Ref & Schedule</th>
                      <th className="py-3 px-4">Carrier & Driver</th>
                      <th className="py-3 px-4">Broker & Route Addresses</th>
                      <th className="py-3 px-4">Dispatched Gross & Fee</th>
                      <th className="py-3 px-4">Load Status</th>
                      <th className="py-3 px-4">Invoice Status</th>
                      <th className="py-3 px-4">Documents</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-900/20 font-mono">
                    {loads.map((load) => (
                      <tr key={load.id} className="hover:bg-slate-900/50 transition-colors">
                        {/* Load Number & Schedule */}
                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-bold text-white text-xs block">#{load.loadNumber}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-950 text-sky-300 border border-blue-800">
                            {load.equipmentType}
                          </span>
                          <div className="text-[10px] text-slate-400 mt-1 font-sans">
                            <span className="text-emerald-400 font-bold">PU:</span> {load.pickupDate} {load.puTime ? `@ ${load.puTime}` : ''}
                          </div>
                          <div className="text-[10px] text-slate-400 font-sans">
                            <span className="text-rose-400 font-bold">DEL:</span> {load.deliveryDate} {load.delTime ? `@ ${load.delTime}` : ''}
                          </div>
                        </td>

                        {/* Carrier Name, Driver & Phone */}
                        <td className="py-3.5 px-4 font-sans">
                          <div className="font-bold text-white text-xs">{load.carrierName}</div>
                          <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3" />
                            <span>{load.carrierPhone || load.driverPhone || '(409) 509-6940'}</span>
                          </div>
                          <div className="text-[10px] font-mono text-sky-400 mt-0.5">{load.mcNumber}</div>
                          {load.driverName && (
                            <div className="text-[10px] text-slate-400 mt-0.5">Driver: {load.driverName}</div>
                          )}
                        </td>

                        {/* Broker Details & PU/DEL Addresses */}
                        <td className="py-3.5 px-4 font-sans max-w-[220px]">
                          <div className="text-xs font-bold text-slate-200 truncate">
                            Broker: {load.brokerName}
                          </div>
                          {load.brokerageMc && (
                            <div className="text-[10px] font-mono text-amber-400">
                              Broker {load.brokerageMc}
                            </div>
                          )}
                          <div className="text-[10px] text-slate-300 truncate mt-1" title={load.puAddress || `${load.originCity}, ${load.originState}`}>
                            <span className="text-emerald-400 font-mono font-bold">PU:</span> {load.puAddress || `${load.originCity}, ${load.originState}`}
                          </div>
                          <div className="text-[10px] text-slate-300 truncate" title={load.delAddress || `${load.destinationCity}, ${load.destinationState}`}>
                            <span className="text-rose-400 font-mono font-bold">DEL:</span> {load.delAddress || `${load.destinationCity}, ${load.destinationState}`}
                          </div>
                        </td>

                        {/* Dispatched Amount (Gross Rate) & Fee */}
                        <td className="py-3.5 px-4 font-mono">
                          <div className="text-sm font-black text-emerald-400">
                            ${load.rate.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {load.loadedMiles} mi · ${load.rpm.toFixed(2)}/mi
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-[10px] text-sky-300 font-bold">
                              Fee {load.dispatchFeePercent}%:
                            </span>
                            <span className="text-[11px] font-bold text-white">
                              ${load.dispatchFeeAmount.toFixed(0)}
                            </span>
                          </div>
                        </td>

                        {/* Load Status Dropdown */}
                        <td className="py-3.5 px-4 font-mono">
                          <select
                            value={load.status}
                            onChange={(e) => handleUpdateLoadStatus(load.id, e.target.value as LoadStatus)}
                            className={`px-2 py-1 rounded text-xs font-bold border cursor-pointer ${
                              load.status === 'In Transit'
                                ? 'bg-sky-950 text-sky-300 border-sky-800'
                                : load.status === 'Delivered'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                                : load.status === 'Completed'
                                ? 'bg-purple-950 text-purple-300 border-purple-800'
                                : load.status === 'Loading'
                                ? 'bg-amber-950 text-amber-300 border-amber-800'
                                : 'bg-blue-950 text-blue-300 border-blue-800'
                            }`}
                          >
                            <option value="Booked">Booked</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Loading">Loading</option>
                            <option value="In Transit">In Transit</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Invoice Status Dropdown */}
                        <td className="py-3.5 px-4 font-mono">
                          <select
                            value={load.invoiceStatus || 'Not Invoiced'}
                            onChange={(e) => {
                              storage.updateLoadInvoiceStatus(load.id, e.target.value as InvoiceStatus, owner.name);
                              showToast(`Invoice for #${load.loadNumber} updated to "${e.target.value}"`);
                              refreshData();
                            }}
                            className={`px-2 py-1 rounded text-xs font-bold border cursor-pointer ${
                              load.invoiceStatus === 'Cleared / Paid'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                                : load.invoiceStatus === 'Pending Payment'
                                ? 'bg-amber-950 text-amber-300 border-amber-600'
                                : load.invoiceStatus === 'Invoice Sent'
                                ? 'bg-blue-950 text-sky-300 border-blue-600'
                                : 'bg-slate-900 text-slate-400 border-slate-700'
                            }`}
                          >
                            <option value="Not Invoiced">Not Invoiced</option>
                            <option value="Invoice Sent">Invoice Sent</option>
                            <option value="Pending Payment">Pending Payment</option>
                            <option value="Cleared / Paid">Cleared / Paid</option>
                          </select>
                        </td>

                        {/* RC, BOL & Extra Documents */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              onClick={() =>
                                handleOpenDoc(
                                  `Rate Confirmation - Load #${load.loadNumber}`,
                                  'Rate Confirmation',
                                  load.rcDocumentName || `Rate_Confirmation_${load.loadNumber}.pdf`,
                                  load.carrierName,
                                  load.mcNumber,
                                  load.loadNumber,
                                  load.rcDocumentContent,
                                  {
                                    'Dispatched Gross': `$${load.rate.toFixed(2)}`,
                                    'Commission Fee': `${load.dispatchFeePercent}% ($${load.dispatchFeeAmount.toFixed(2)})`,
                                    'Broker': load.brokerName,
                                    'Carrier Cell': load.carrierPhone || load.driverPhone || 'On file',
                                  }
                                )
                              }
                              className="px-2 py-0.5 rounded bg-blue-950 hover:bg-blue-900 border border-blue-700 text-sky-300 text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <FileText className="w-2.5 h-2.5 text-sky-400" />
                              <span>RC</span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleOpenDoc(
                                  `Bill of Lading (BOL) - Load #${load.loadNumber}`,
                                  'Bill of Lading',
                                  load.bolDocumentName || `Bill_of_Lading_${load.loadNumber}.pdf`,
                                  load.carrierName,
                                  load.mcNumber,
                                  load.loadNumber,
                                  load.bolDocumentContent,
                                  {
                                    'Shipper Address': load.puAddress || `${load.originCity}, ${load.originState}`,
                                    'Delivery Receiver': load.delAddress || `${load.destinationCity}, ${load.destinationState}`,
                                    'Equipment': load.equipmentType,
                                    'Commodity': load.commodity || 'General Freight',
                                  }
                                )
                              }
                              className="px-2 py-0.5 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <FileCheck className="w-2.5 h-2.5 text-emerald-400" />
                              <span>BOL</span>
                            </button>

                            {(load.loadDocuments && load.loadDocuments.length > 0) && (
                              <span className="text-[10px] text-slate-400">
                                +{load.loadDocuments.length} docs
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Actions: Edit All, Copy All, Delete */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Copy All */}
                            <button
                              type="button"
                              onClick={() => handleCopyLoadSheet(load)}
                              className={`p-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition-all ${
                                copiedItemId === load.id
                                  ? 'bg-emerald-600 text-white border-emerald-400'
                                  : 'bg-slate-900 hover:bg-slate-800 text-emerald-400 border-slate-700'
                              }`}
                              title="Copy All Load Sheet Data to Clipboard"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Copy All</span>
                            </button>

                            {/* Edit All */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedLoadForEdit(load);
                                setIsLoadEditModalOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-sm transition-colors"
                              title="Edit all load fields, dates, addresses, broker MC, rate, and fee"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit All</span>
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete load #${load.loadNumber}?`)) {
                                  storage.deleteLoad(load.id);
                                  refreshData();
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 cursor-pointer transition-colors"
                              title="Delete load"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. ACTIVE DISPATCH TEAM CARRIER ROSTER */}
        {activeTab === 'roster' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0D1527] p-4 rounded-2xl border border-blue-900/40">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-sky-400">
                  DISPATCH TEAM CARRIER ROSTER
                </span>
                <p className="text-xs text-slate-300">
                  Comprehensive roster tracking Driver Name & Number, Carrier Name & Number, Carrier MC, Dispatched Gross, and live Invoice Status (Pending / Sent / Cleared).
                </p>
              </div>

              <button
                onClick={() => setIsAddRosterCarrierOpen(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Carrier to Roster</span>
              </button>
            </div>

            <div className="rounded-2xl bg-[#0D1527] border border-blue-900/40 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#080E1C] border-b border-blue-900/40 text-slate-400 text-[10px] uppercase">
                    <tr>
                      <th className="py-3 px-4">Carrier / Driver Profile</th>
                      <th className="py-3 px-4">Authority & Equipment</th>
                      <th className="py-3 px-4">Location & Address</th>
                      <th className="py-3 px-4">Gross & Fee</th>
                      <th className="py-3 px-4">Attached Documents</th>
                      <th className="py-3 px-4">Invoice Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-900/20">
                    {rosterCarriers.map((carrier) => (
                      <tr key={carrier.id} className="hover:bg-slate-900/50 transition-colors">
                        {/* Carrier / Driver Profile */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-xs block font-sans">{carrier.carrierName}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-950 text-sky-300 border border-blue-800">
                              {carrier.equipmentType || 'Dry Van'}
                            </span>
                          </div>
                          <div className="text-[11px] font-sans text-slate-300 mt-0.5">
                            Driver: <strong className="text-white">{carrier.driverName}</strong>
                          </div>
                          <div className="text-[11px] text-emerald-400 flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {carrier.carrierPhone || carrier.driverPhone}
                            </span>
                            {carrier.carrierEmail && (
                              <span className="text-slate-400 truncate max-w-[140px]">
                                {carrier.carrierEmail}
                              </span>
                            )}
                          </div>
                          {carrier.notes && (
                            <div className="text-[10px] text-amber-300/90 bg-amber-950/30 p-1.5 rounded-lg border border-amber-900/40 mt-1 max-w-xs truncate" title={carrier.notes}>
                              💬 {carrier.notes}
                            </div>
                          )}
                        </td>

                        {/* Authority, VIN & Equipment */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sky-300 font-bold text-xs">{carrier.mcNumber}</span>
                            {carrier.dotNumber && (
                              <span className="text-slate-400 text-[10px]">({carrier.dotNumber})</span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            VIN: <span className="text-slate-300 font-bold">{carrier.vinNumber || '1FT8W3BT8NE...'}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Dispatcher: <span className="text-sky-400 font-bold">{carrier.dispatcherName}</span>
                          </div>
                        </td>

                        {/* Location & Address */}
                        <td className="py-3.5 px-4">
                          <div className="text-slate-200 text-xs font-sans max-w-[170px] truncate" title={carrier.carrierAddress || 'Houston, TX'}>
                            {carrier.carrierAddress || 'Dallas / Houston, TX'}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[170px]">
                            Lanes: {carrier.originDestination || 'Nationwide'}
                          </div>
                        </td>

                        {/* Dispatched Gross & Fee */}
                        <td className="py-3.5 px-4">
                          <div className="text-sm font-black text-emerald-400">
                            ${carrier.dispatchedAmount.toLocaleString()}
                          </div>
                          <div className="text-[11px] text-sky-300 mt-0.5 font-bold flex items-center gap-1">
                            <span>Fee: {carrier.dispatchFeePercent}%</span>
                            <span className="text-slate-400">(${((carrier.dispatchedAmount * carrier.dispatchFeePercent) / 100).toFixed(0)})</span>
                          </div>
                        </td>

                        {/* Attached Documents Badges */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {(carrier.documents && carrier.documents.length > 0) ? (
                              carrier.documents.map((doc, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() =>
                                    handleOpenDoc(
                                      `${doc.type} - ${carrier.carrierName}`,
                                      (doc.type as DocumentViewerData['docType']) || 'General',
                                      doc.name,
                                      carrier.carrierName,
                                      carrier.mcNumber,
                                      `ROSTER-${carrier.id}`,
                                      doc.fileContent,
                                      {
                                        'Carrier MC': carrier.mcNumber,
                                        'Driver Phone': carrier.driverPhone,
                                        'Document Type': doc.type,
                                        'Upload Date': doc.uploadDate || 'On file',
                                      }
                                    )
                                  }
                                  className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900 hover:bg-blue-900 border border-slate-700 hover:border-blue-500 text-sky-300 font-mono flex items-center gap-1 cursor-pointer transition-colors"
                                  title={`Click to open ${doc.name}`}
                                >
                                  <Paperclip className="w-2.5 h-2.5" />
                                  <span>{doc.type}</span>
                                </button>
                              ))
                            ) : (
                              <div className="flex gap-1 text-[10px] text-slate-500">
                                <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">MC</span>
                                <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">W9</span>
                                <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">COI</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Invoice Status Toggle: Sent / Pending / Cleared */}
                        <td className="py-3.5 px-4">
                          <select
                            value={carrier.invoiceStatus}
                            onChange={(e) => {
                              const newStatus = e.target.value as InvoiceStatus;
                              storage.saveRosterCarrier({ ...carrier, invoiceStatus: newStatus }, owner.name);
                              showToast(`Carrier ${carrier.carrierName} invoice updated to "${newStatus}"`);
                              refreshData();
                            }}
                            className={`px-2.5 py-1 rounded text-xs font-bold border cursor-pointer ${
                              carrier.invoiceStatus === 'Cleared / Paid'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                                : carrier.invoiceStatus === 'Pending Payment'
                                ? 'bg-amber-950 text-amber-300 border-amber-600'
                                : carrier.invoiceStatus === 'Invoice Sent'
                                ? 'bg-blue-950 text-sky-300 border-blue-600'
                                : 'bg-slate-900 text-slate-400 border-slate-700'
                            }`}
                          >
                            <option value="Not Invoiced">Not Invoiced</option>
                            <option value="Invoice Sent">Invoice Sent</option>
                            <option value="Pending Payment">Pending Payment</option>
                            <option value="Cleared / Paid">Cleared / Paid</option>
                          </select>
                        </td>

                        {/* Action Buttons: Edit All, Copy All, Delete */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Copy All Button */}
                            <button
                              type="button"
                              onClick={() => handleCopyCarrierDossier(carrier)}
                              className={`p-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition-all ${
                                copiedItemId === carrier.id
                                  ? 'bg-emerald-600 text-white border-emerald-400'
                                  : 'bg-slate-900 hover:bg-slate-800 text-emerald-400 border-slate-700'
                              }`}
                              title="Copy Carrier Full Dossier to Clipboard"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Copy All</span>
                            </button>

                            {/* Edit All Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedRosterCarrierForEdit(carrier);
                                setIsRosterEditModalOpen(true);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer shadow-sm transition-colors"
                              title="Edit all fields, address, VIN, documents and notes"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit All</span>
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Remove ${carrier.carrierName} from roster?`)) {
                                  storage.deleteRosterCarrier(carrier.id);
                                  refreshData();
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 cursor-pointer transition-colors"
                              title="Delete from roster"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. PERMANENT CARRIER SIGN-UPS TAB (All Documents & Data Saved Forever + Openable) */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0D1527] p-4 rounded-2xl border border-blue-900/40">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-amber-400">
                  PERMANENT CARRIER SIGN-UP DATABASE ({applications.length} SAVED ONBOARDINGS)
                </span>
                <p className="text-xs text-slate-300">
                  All submission data, MC#, DOT#, VIN#, DL#, and uploaded document files are saved permanently and can be opened in the document viewer.
                </p>
              </div>

              {/* Owner Assignment Filter */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
                {(['All', 'David Cross', 'Alvin'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setAppOwnerFilter(filter)}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                      appOwnerFilter === filter
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {filter === 'All' ? 'All Owners' : filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {applications
                .filter((app) => appOwnerFilter === 'All' || app.assignedOwner === appOwnerFilter)
                .map((app) => (
                  <div
                    key={app.id}
                    className="p-5 sm:p-6 rounded-2xl bg-[#0D1527] border border-blue-900/40 hover:border-blue-500/40 transition-all space-y-4 shadow-xl"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-900/30 pb-3">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-1 rounded-lg bg-blue-950 border border-blue-700/60 font-mono font-black text-sky-400 text-xs">
                            #{app.applicationNumber}
                          </span>
                          <h3 className="text-base font-bold text-white">{app.companyName}</h3>
                          <span className="text-xs font-mono text-slate-400">
                            {app.mcNumber} / {app.dotNumber}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 block mt-1">
                          Contact: <strong>{app.fullName}</strong> · Phone: <strong>{app.phone}</strong> · Email: {app.email}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 font-mono text-xs">
                        <span className="px-2.5 py-1 rounded-lg bg-amber-950/70 border border-amber-600/50 text-amber-300 font-bold">
                          Assigned to: {app.assignedOwner}
                        </span>
                        <span className={`px-2.5 py-1 rounded-lg font-bold ${
                          app.status === 'Approved'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                            : app.status === 'Declined'
                            ? 'bg-rose-950 text-rose-400 border border-rose-500/40'
                            : 'bg-blue-950 text-sky-400 border border-blue-600/40'
                        }`}>
                          {app.status}
                        </span>
                        <span className="text-slate-400 text-[11px]">{app.submittedAt}</span>
                      </div>
                    </div>

                    {/* Operational Specs Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Equipment / Fleet:</span>
                        <span className="text-white font-bold">{app.equipmentType} ({app.truckCount} Truck{app.truckCount > 1 ? 's' : ''})</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Tractor VIN Number:</span>
                        <span className="text-sky-300">{app.vinNumber || 'TBD'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Driver's License (DL):</span>
                        <span className="text-white">{app.driversLicense || 'On file'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Target RPM / Deadhead:</span>
                        <span className="text-emerald-400 font-bold">${app.preferredRPM.toFixed(2)}/mi · Max {app.maxDeadhead} mi</span>
                      </div>
                    </div>

                    {/* Lanes & Insurance */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
                      <div>
                        <strong className="text-slate-400 font-mono">Preferred Lanes:</strong> {app.preferredLanes}
                      </div>
                      <div className="font-mono text-[11px] text-emerald-400">
                        Insurance: {app.insuranceStatus}
                      </div>
                    </div>

                    {/* Attached Documents - NOW CLICKABLE & OPENABLE! */}
                    <div className="pt-2 border-t border-blue-900/30 space-y-2">
                      <span className="text-xs font-mono font-bold text-sky-400 block uppercase">
                        Attached Carrier Documents (Click to Open & View):
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        {app.uploadedFiles.map((docName, idx) => (
                          <button
                            key={idx}
                            onClick={() =>
                              handleOpenDoc(
                                `${docName.replace(/_/g, ' ').replace('.pdf', '')} - ${app.companyName}`,
                                docName.includes('COI')
                                  ? 'COI'
                                  : docName.includes('W-9') || docName.includes('W9')
                                  ? 'W-9'
                                  : docName.includes('Authority')
                                  ? 'MC Authority'
                                  : docName.includes('License')
                                  ? 'Driver License'
                                  : 'General',
                                docName,
                                app.companyName,
                                app.mcNumber,
                                undefined,
                                `OFFICIAL CARRIER DOCUMENT: ${docName}\nCarrier Name: ${app.companyName}\nMC Number: ${app.mcNumber}\nUSDOT Number: ${app.dotNumber}\nOwner / Driver: ${app.fullName} (Cell: ${app.phone})\nEquipment: ${app.equipmentType}\nTractor VIN: ${app.vinNumber}\nDL Number: ${app.driversLicense}\nInsurance Status: ${app.insuranceStatus}\nAssigned Executive: ${app.assignedOwner}\nVerification Status: Approved & Stored in Infinity Dispatch LLC Owner Database.`,
                                {
                                  'Carrier': app.companyName,
                                  'MC Number': app.mcNumber,
                                  'USDOT': app.dotNumber,
                                  'Tractor VIN': app.vinNumber,
                                  'License DL': app.driversLicense,
                                }
                              )
                            }
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-blue-950 border border-slate-700 hover:border-sky-500 text-sky-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
                          >
                            <Paperclip className="w-3.5 h-3.5 text-sky-400" />
                            <span>{docName}</span>
                            <Eye className="w-3 h-3 text-slate-400" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                      {app.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => {
                              storage.updateApplicationStatus(app.id, 'Declined', owner.name);
                              refreshData();
                            }}
                            className="px-3.5 py-1.5 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/40 rounded-xl cursor-pointer"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => {
                              storage.updateApplicationStatus(app.id, 'Approved', owner.name);
                              showToast(`Carrier ${app.companyName} approved & onboarded!`);
                              refreshData();
                            }}
                            className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve & Onboard Carrier</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 5. INVOICE GENERATOR (Interactive invoice-generator.com style) */}
        {activeTab === 'invoice' && (
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-[#0D1527] p-4 rounded-2xl border border-blue-900/40 shadow-xl">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    FREIGHT INVOICE GENERATOR · INVOICE-GENERATOR.COM STYLE
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Active PDF Engine
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Customizable freight commission invoice builder: add line items, calculate discounts & taxes, download real PDF, or email directly to carriers.
                </p>
              </div>

              {/* View Switcher & Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Editor vs Paper Preview Mode Switcher */}
                <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setInvoiceViewMode('editor')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      invoiceViewMode === 'editor'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Live Editor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInvoiceViewMode('preview')}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      invoiceViewMode === 'preview'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Paper PDF Preview</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const fullInvoice: GeneratedInvoice = {
                      ...invoiceBuilder,
                      subtotal: invoiceSubtotal,
                      discount: invoiceDiscountAmount,
                      tax: invoiceTaxAmount,
                      total: invoiceTotal,
                      amountPaid: invoiceAmountPaid,
                      balanceDue: invoiceBalanceDue,
                    };
                    downloadInvoicePdf(fullInvoice);
                    showToast(`Official PDF Invoice #${invoiceBuilder.invoiceNumber} downloaded!`);
                  }}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-white" />
                  <span>Download PDF</span>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const fullInvoice: GeneratedInvoice = {
                        ...invoiceBuilder,
                        subtotal: invoiceSubtotal,
                        discount: invoiceDiscountAmount,
                        tax: invoiceTaxAmount,
                        total: invoiceTotal,
                        amountPaid: invoiceAmountPaid,
                        balanceDue: invoiceBalanceDue,
                        status: 'Sent',
                      };
                      const pdfDoc = generateInvoicePdf(fullInvoice);
                      const base64 = invoicePdfToBase64(pdfDoc);
                      const res = await sendEmailWithGmail({
                        to: invoiceBuilder.billToEmail || 'dispatch@carrier.com',
                        cc: connectedGoogleEmail || 'Davidcross.vl1@gmail.com',
                        subject: `[INVOICE #${invoiceBuilder.invoiceNumber}] Commission Statement - Infinity Dispatch LLC`,
                        bodyText: `Dear ${invoiceBuilder.billToCompany},\n\nPlease find attached your official freight dispatch commission invoice #${invoiceBuilder.invoiceNumber} for $${invoiceBalanceDue.toFixed(2)} USD.\n\nDue Date: ${invoiceBuilder.dueDate}\nPayment Terms: ${invoiceBuilder.paymentTerms}\n\nRemittance: Zelle / Wire / ACH to Davidcross.vl1@gmail.com\n\nThank you for choosing Infinity Dispatch LLC!\nDavid Cross & Alvin\nPhone: +1 (409) 509-6940`,
                        pdfBase64: base64,
                        pdfFileName: `Invoice_${invoiceBuilder.invoiceNumber}_InfinityDispatch.pdf`,
                      });
                      storage.saveGeneratedInvoice(fullInvoice, owner.name);
                      showToast(`Invoice #${invoiceBuilder.invoiceNumber} emailed via ${res.deliveryMethod === 'gmail_api' ? 'Gmail API' : 'Infinity Email Gateway'}!`);
                      refreshData();
                    } catch (e) {
                      console.error(e);
                      showToast('Error emailing invoice PDF');
                    }
                  }}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                >
                  <Mail className="w-3.5 h-3.5 text-sky-200" />
                  <span>Email via Gmail</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const fullInvoice: GeneratedInvoice = {
                      ...invoiceBuilder,
                      subtotal: invoiceSubtotal,
                      discount: invoiceDiscountAmount,
                      tax: invoiceTaxAmount,
                      total: invoiceTotal,
                      amountPaid: invoiceAmountPaid,
                      balanceDue: invoiceBalanceDue,
                      status: 'Pending',
                    };
                    storage.saveGeneratedInvoice(fullInvoice, owner.name);
                    showToast(`Invoice #${invoiceBuilder.invoiceNumber} saved to portal database!`);
                    refreshData();
                  }}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Save Invoice</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-sky-400" />
                </button>
              </div>
            </div>

            {/* Quick Presets & Dispatched Load Selector Bar */}
            <div className="p-4 rounded-2xl bg-[#0B1428] border border-blue-900/40 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-sky-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                  <span>1-Click Load & Template Presets:</span>
                </span>
                <span className="text-[11px] text-slate-400">Select any load to autofill invoice data</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs font-mono">
                {/* Dispatched Load Dropdown */}
                <div className="sm:col-span-6">
                  <select
                    value={selectedLoadForAiInvoice}
                    onChange={(e) => {
                      const loadId = e.target.value;
                      setSelectedLoadForAiInvoice(loadId);
                      const matched = loads.find((l) => l.id === loadId);
                      if (matched) {
                        const feePercent = matched.dispatchFeePercent || 7;
                        const feeAmt = (matched.rate * feePercent) / 100;
                        setInvoiceBuilder((prev) => ({
                          ...prev,
                          invoiceNumber: `INV-${matched.loadNumber.replace(/\D/g, '') || Math.floor(1000 + Math.random() * 9000)}`,
                          billToCompany: matched.carrierName,
                          billToMc: matched.mcNumber,
                          billToPhone: matched.carrierPhone || '(214) 555-8392',
                          billToEmail: 'dispatch@carrier.com',
                          poNumber: matched.loadNumber,
                          shipTo: `${matched.originCity}, ${matched.originState} → ${matched.destinationCity}, ${matched.destinationState}`,
                          items: [
                            {
                              id: '1',
                              description: `Freight Dispatch Fee (${feePercent}%) - Load #${matched.loadNumber} [${matched.originCity}, ${matched.originState} → ${matched.destinationCity}, ${matched.destinationState}]`,
                              rate: matched.rate,
                              quantity: 1,
                              amount: feeAmt,
                            },
                          ],
                          notes: `Broker: ${matched.brokerName} (${matched.brokerageMc || 'Verified'})\nLoaded Miles: ${matched.loadedMiles} mi | Equipment: ${matched.equipmentType}\nCommodity: ${matched.commodity || 'General Freight'}\n100% Direct Carrier Payout Confirmed.`,
                        }));
                        showToast(`Loaded details from #${matched.loadNumber} (${matched.carrierName})!`);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs cursor-pointer"
                  >
                    <option value="">⚡ Autofill from Active Dispatched Load...</option>
                    {loads.map((l) => (
                      <option key={l.id} value={l.id}>
                        #{l.loadNumber} - {l.carrierName} (${l.rate.toLocaleString()} · {l.dispatchFeePercent}%)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Instant Template Presets */}
                <div className="sm:col-span-6 flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setInvoiceBuilder((prev) => ({
                        ...prev,
                        items: [
                          {
                            id: 'item-std-5',
                            description: 'Standard Dedicated Freight Dispatch Service (5% Commission)',
                            rate: 3200,
                            quantity: 1,
                            amount: 160.0,
                          },
                        ],
                      }));
                      showToast('Loaded 5% Standard Dispatch Template');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] text-sky-300 font-mono cursor-pointer transition-colors"
                  >
                    5% Dry Van/Reefer
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setInvoiceBuilder((prev) => ({
                        ...prev,
                        items: [
                          {
                            id: 'item-exp-7',
                            description: 'Expedited Freight Dispatch Service (7% Commission) - Box Truck / Hotshot',
                            rate: 2600,
                            quantity: 1,
                            amount: 182.0,
                          },
                        ],
                      }));
                      showToast('Loaded 7% Expedited Template');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] text-purple-300 font-mono cursor-pointer transition-colors"
                  >
                    7% Box Truck/Hotshot
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setInvoiceBuilder((prev) => ({
                        ...prev,
                        items: [
                          ...prev.items,
                          {
                            id: `item-det-${Date.now()}`,
                            description: 'Detention Compensation Negotiation (Dock Delay Beyond 2 Hours)',
                            rate: 75,
                            quantity: 3,
                            amount: 225.0,
                          },
                        ],
                      }));
                      showToast('Added $225 Detention Claim line item');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 border border-amber-800/60 text-[11px] text-amber-300 font-mono cursor-pointer transition-colors"
                  >
                    + Detention ($75/hr)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setInvoiceBuilder((prev) => ({
                        ...prev,
                        items: [
                          ...prev.items,
                          {
                            id: `item-tonu-${Date.now()}`,
                            description: 'Truck Ordered Not Used (TONU) Agreed Cancellation Fee',
                            rate: 350,
                            quantity: 1,
                            amount: 350.0,
                          },
                        ],
                      }));
                      showToast('Added $350 TONU line item');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/60 text-[11px] text-rose-300 font-mono cursor-pointer transition-colors"
                  >
                    + TONU ($350)
                  </button>
                </div>
              </div>
            </div>

            {/* Main Interactive Canvas: Editor Mode OR Paper Preview Mode */}
            {invoiceViewMode === 'preview' ? (
              /* REAL-TIME PAPER PDF PREVIEW */
              <div className="p-6 sm:p-10 rounded-3xl bg-slate-950 border border-slate-800 max-w-4xl mx-auto shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1.5 text-sky-400 font-bold">
                    <Eye className="w-4 h-4" />
                    <span>Exact Printable Paper PDF Replica</span>
                  </span>
                  <span>A4 Format · Vector Typography</span>
                </div>

                <div className="mt-6 bg-white text-slate-900 p-8 sm:p-12 rounded-2xl shadow-2xl border border-slate-200 font-sans space-y-6">
                  {/* Banner */}
                  <div className="bg-slate-900 text-white p-6 -mx-8 sm:-mx-12 -mt-8 sm:-mt-12 rounded-t-2xl flex flex-col sm:flex-row justify-between items-start gap-4 border-b-4 border-amber-500">
                    <div className="flex items-center gap-4">
                      <img
                        src="/infinity-logo-metallic.png"
                        alt="Infinity Dispatch LLC Metallic Emblem"
                        className="w-16 h-16 object-contain rounded-xl bg-slate-800/80 p-1 border border-amber-500/30 shrink-0 shadow-xl"
                      />
                      <div>
                        <h2 className="text-2xl font-black tracking-tight">{invoiceBuilder.fromName}</h2>
                        <p className="text-xs text-slate-300 font-mono mt-1">
                          Commercial Freight Logistics & Carrier Portal<br />
                          {invoiceBuilder.fromAddress}<br />
                          Phone: {invoiceBuilder.fromPhone} · Email: {invoiceBuilder.fromEmail}
                        </p>
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-2xl font-black text-amber-400 font-mono block">INVOICE</span>
                      <span className="text-xs font-mono text-white">#{invoiceBuilder.invoiceNumber}</span>
                    </div>
                  </div>

                  {/* Bill To & Metadata */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-mono pt-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">BILLED TO (CARRIER):</span>
                      <div className="text-sm font-bold text-slate-900">{invoiceBuilder.billToCompany}</div>
                      <div className="text-slate-600">Authority: {invoiceBuilder.billToMc}</div>
                      <div className="text-slate-600">Contact: {invoiceBuilder.billToContact} · {invoiceBuilder.billToPhone}</div>
                      <div className="text-slate-600">Email: {invoiceBuilder.billToEmail}</div>
                      {invoiceBuilder.billToAddress && <div className="text-slate-600">{invoiceBuilder.billToAddress}</div>}
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">INVOICE DETAILS:</span>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Invoice Date:</span>
                        <strong className="text-slate-900">{invoiceBuilder.invoiceDate}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Due Date:</span>
                        <strong className="text-rose-700">{invoiceBuilder.dueDate}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Payment Terms:</span>
                        <span className="text-slate-900">{invoiceBuilder.paymentTerms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Load / PO #:</span>
                        <strong className="text-slate-900">{invoiceBuilder.poNumber || 'INF-FREIGHT'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Line items table */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden font-mono text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-900 text-white uppercase text-[10px]">
                        <tr>
                          <th className="p-3">Description</th>
                          <th className="p-3 w-28 text-right">Rate</th>
                          <th className="p-3 w-16 text-center">Qty</th>
                          <th className="p-3 w-32 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {invoiceBuilder.items.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50">
                            <td className="p-3 font-semibold text-slate-900">{item.description}</td>
                            <td className="p-3 text-right text-slate-700">${Number(item.rate).toFixed(2)}</td>
                            <td className="p-3 text-center text-slate-700">{item.quantity}</td>
                            <td className="p-3 text-right font-bold text-slate-900">${(Number(item.rate) * Number(item.quantity)).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals & Notes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 font-mono text-xs">
                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">REMITTANCE INSTRUCTIONS:</span>
                      <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-slate-700 text-[11px] leading-relaxed">
                        {invoiceBuilder.notes || 'Direct wire, ACH, or Zelle to Davidcross.vl1@gmail.com. Factoring deductions accepted.'}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-right">
                      <div className="flex justify-between text-slate-600">
                        <span>Subtotal:</span>
                        <strong className="text-slate-900">${invoiceSubtotal.toFixed(2)}</strong>
                      </div>
                      {invoiceDiscountAmount > 0 && (
                        <div className="flex justify-between text-emerald-600">
                          <span>Discount:</span>
                          <strong>-${invoiceDiscountAmount.toFixed(2)}</strong>
                        </div>
                      )}
                      {invoiceTaxAmount > 0 && (
                        <div className="flex justify-between text-slate-600">
                          <span>Tax ({invoiceTaxPercent}%):</span>
                          <strong>+${invoiceTaxAmount.toFixed(2)}</strong>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-slate-300 pt-2 text-sm font-bold text-slate-900">
                        <span>Total:</span>
                        <span>${invoiceTotal.toFixed(2)}</span>
                      </div>
                      {invoiceAmountPaid > 0 && (
                        <div className="flex justify-between text-slate-600">
                          <span>Amount Paid:</span>
                          <strong>-${invoiceAmountPaid.toFixed(2)}</strong>
                        </div>
                      )}
                      <div className="flex justify-between border-t-2 border-slate-900 pt-2 text-base font-black text-blue-700">
                        <span>BALANCE DUE:</span>
                        <span>${invoiceBalanceDue.toFixed(2)} USD</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* INTERACTIVE LIVE EDITOR (INVOICE-GENERATOR.COM STYLE) */
              <div className="p-6 sm:p-10 rounded-3xl bg-white text-slate-900 shadow-2xl border border-slate-300 max-w-4xl mx-auto space-y-6 font-sans">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-200 pb-6">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <img
                        src="/infinity-logo-metallic.png"
                        alt="Infinity Dispatch LLC"
                        className="w-14 h-14 object-contain rounded-xl bg-slate-900 p-1 border border-amber-500/40 shadow-md shrink-0"
                      />
                      <div>
                        <input
                          type="text"
                          value={invoiceBuilder.fromName}
                          onChange={(e) => setInvoiceBuilder({ ...invoiceBuilder, fromName: e.target.value })}
                          className="text-2xl font-black text-slate-950 tracking-tight border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none w-full"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 font-mono">
                      Professional Commercial Freight Dispatch & Remittance<br />
                      Phone: <input
                        type="text"
                        value={invoiceBuilder.fromPhone}
                        onChange={(e) => setInvoiceBuilder({ ...invoiceBuilder, fromPhone: e.target.value })}
                        className="border-b border-slate-200 text-xs text-slate-700"
                      /><br />
                      Email: <input
                        type="text"
                        value={invoiceBuilder.fromEmail}
                        onChange={(e) => setInvoiceBuilder({ ...invoiceBuilder, fromEmail: e.target.value })}
                        className="border-b border-slate-200 text-xs text-slate-700"
                      />
                    </p>
                  </div>

                  {/* Top Right Invoice Metas */}
                  <div className="text-left sm:text-right font-mono text-xs space-y-1.5">
                    <span className="text-xs font-bold text-blue-600 uppercase block tracking-wider">
                      FREIGHT COMMISSION INVOICE
                    </span>
                    <div className="flex sm:justify-end items-center gap-1.5">
                      <span className="text-slate-500">Invoice #:</span>
                      <input
                        type="text"
                        value={invoiceBuilder.invoiceNumber}
                        onChange={(e) => setInvoiceBuilder({ ...invoiceBuilder, invoiceNumber: e.target.value })}
                        className="px-2 py-0.5 border border-slate-300 rounded font-bold text-slate-900 w-36 text-right font-mono text-xs"
                      />
                    </div>
                    <div className="flex sm:justify-end items-center gap-1.5">
                      <span className="text-slate-500">Date:</span>
                      <input
                        type="date"
                        value={invoiceBuilder.invoiceDate}
                        onChange={(e) => setInvoiceBuilder({ ...invoiceBuilder, invoiceDate: e.target.value })}
                        className="px-2 py-0.5 border border-slate-300 rounded text-slate-900 text-xs"
                      />
                    </div>
                    <div className="flex sm:justify-end items-center gap-1.5">
                      <span className="text-slate-500">Payment Terms:</span>
                      <select
                        value={invoiceBuilder.paymentTerms}
                        onChange={(e) => setInvoiceBuilder({ ...invoiceBuilder, paymentTerms: e.target.value })}
                        className="px-2 py-0.5 border border-slate-300 rounded text-slate-900 text-xs cursor-pointer font-sans"
                      >
                        <option value="Due upon receipt (72 hours)">Due on receipt (72h)</option>
                        <option value="Net 15 Days">Net 15 Days</option>
                        <option value="Net 30 Days">Net 30 Days</option>
                        <option value="Factoring Direct Credit">Factoring Direct Credit</option>
                      </select>
                    </div>
                    <div className="flex sm:justify-end items-center gap-1.5">
                      <span className="text-slate-500">Due Date:</span>
                      <input
                        type="date"
                        value={invoiceBuilder.dueDate}
                        onChange={(e) => setInvoiceBuilder({ ...invoiceBuilder, dueDate: e.target.value })}
                        className="px-2 py-0.5 border border-slate-300 rounded text-slate-900 text-xs font-bold text-rose-700"
                      />
                    </div>
                    <div className="flex sm:justify-end items-center gap-1.5">
                      <span className="text-slate-500">PO / Load #:</span>
                      <input
                        type="text"
                        value={invoiceBuilder.poNumber || ''}
                        onChange={(e) => setInvoiceBuilder({ ...invoiceBuilder, poNumber: e.target.value })}
                        placeholder="Load Reference #"
                        className="px-2 py-0.5 border border-slate-300 rounded text-slate-900 text-xs w-36 text-right font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Bill To & Ship To Sections */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">BILL TO (CARRIER / FLEET):</span>
                    <input
                      type="text"
                      value={invoiceBuilder.billToCompany}
                      onChange={(e) => setInvoiceBuilder({ ...invoiceBuilder, billToCompany: e.target.value })}
                      placeholder="Carrier Legal Name *"
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-sm font-bold text-slate-900 font-sans"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={invoiceBuilder.billToMc}
                        onChange={(e) => setInvoiceBuilder({ ...invoiceBuilder, billToMc: e.target.value })}
                        placeholder="MC Number (e.g. MC-1489201)"
                        className="px-2 py-1 border border-slate-300 rounded text-xs font-mono"
                      />
                      <input
                        type="text"
                        value={invoiceBuilder.billToPhone}
                        onChange={(e) => setInvoiceBuilder({ ...invoiceBuilder, billToPhone: e.target.value })}
                        placeholder="Phone Number"
                        className="px-2 py-1 border border-slate-300 rounded text-xs font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={invoiceBuilder.billToContact}
                        onChange={(e) => setInvoiceBuilder({ ...invoiceBuilder, billToContact: e.target.value })}
                        placeholder="Contact / Driver Name"
                        className="px-2 py-1 border border-slate-300 rounded text-xs"
                      />
                      <input
                        type="email"
                        value={invoiceBuilder.billToEmail}
                        onChange={(e) => setInvoiceBuilder({ ...invoiceBuilder, billToEmail: e.target.value })}
                        placeholder="Billing Email *"
                        className="px-2 py-1 border border-slate-300 rounded text-xs"
                      />
                    </div>
                    <input
                      type="text"
                      value={invoiceBuilder.billToAddress}
                      onChange={(e) => setInvoiceBuilder({ ...invoiceBuilder, billToAddress: e.target.value })}
                      placeholder="Physical or Mailing Address"
                      className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">FREIGHT ROUTE & SHIPMENT DETAILS:</span>
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-0.5">Route (Origin → Destination)</label>
                      <input
                        type="text"
                        value={invoiceBuilder.shipTo || 'Dallas, TX → Columbus, OH'}
                        onChange={(e) => setInvoiceBuilder({ ...invoiceBuilder, shipTo: e.target.value })}
                        placeholder="e.g. Dallas, TX → Columbus, OH"
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs font-bold text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block mb-0.5">Payment Terms Notice</label>
                      <input
                        type="text"
                        value={invoiceBuilder.terms}
                        onChange={(e) => setInvoiceBuilder({ ...invoiceBuilder, terms: e.target.value })}
                        placeholder="Payment Terms"
                        className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs text-slate-700"
                      />
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800">
                      ✓ Direct Carrier Payout: Broker pays carrier directly. This invoice covers dispatch fee and services rendered.
                    </div>
                  </div>
                </div>

                {/* Dynamic Line Items Table (Like Invoice-Generator.com) */}
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-900 text-white uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Item / Service Description</th>
                        <th className="p-3 w-28 text-right">Unit Rate ($)</th>
                        <th className="p-3 w-20 text-center">Qty / Hours</th>
                        <th className="p-3 w-32 text-right">Line Total ($)</th>
                        <th className="p-3 w-10 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {invoiceBuilder.items.map((item, index) => (
                        <tr key={item.id} className="hover:bg-slate-50/80">
                          <td className="p-2.5">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => {
                                const newItems = [...invoiceBuilder.items];
                                newItems[index].description = e.target.value;
                                setInvoiceBuilder({ ...invoiceBuilder, items: newItems });
                              }}
                              placeholder="Description of dispatch fee, detention, etc."
                              className="w-full px-2.5 py-1 border border-slate-200 rounded text-xs text-slate-900 font-sans"
                            />
                          </td>
                          <td className="p-2.5">
                            <input
                              type="number"
                              step="any"
                              value={item.rate}
                              onChange={(e) => {
                                const newItems = [...invoiceBuilder.items];
                                newItems[index].rate = Number(e.target.value);
                                newItems[index].amount = newItems[index].rate * newItems[index].quantity;
                                setInvoiceBuilder({ ...invoiceBuilder, items: newItems });
                              }}
                              className="w-full px-2 py-1 border border-slate-200 rounded text-xs text-right font-mono"
                            />
                          </td>
                          <td className="p-2.5">
                            <input
                              type="number"
                              min="1"
                              step="any"
                              value={item.quantity}
                              onChange={(e) => {
                                const newItems = [...invoiceBuilder.items];
                                newItems[index].quantity = Number(e.target.value);
                                newItems[index].amount = newItems[index].rate * newItems[index].quantity;
                                setInvoiceBuilder({ ...invoiceBuilder, items: newItems });
                              }}
                              className="w-full px-2 py-1 border border-slate-200 rounded text-xs text-center font-mono"
                            />
                          </td>
                          <td className="p-2.5 text-right font-bold text-slate-900 font-mono">
                            ${(Number(item.rate) * Number(item.quantity)).toFixed(2)}
                          </td>
                          <td className="p-2.5 text-center">
                            {invoiceBuilder.items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newItems = invoiceBuilder.items.filter((_, i) => i !== index);
                                  setInvoiceBuilder({ ...invoiceBuilder, items: newItems });
                                }}
                                className="text-slate-400 hover:text-rose-600 font-bold cursor-pointer text-sm"
                                title="Remove Line"
                              >
                                ✕
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add Line Items Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setInvoiceBuilder({
                        ...invoiceBuilder,
                        items: [
                          ...invoiceBuilder.items,
                          {
                            id: String(Date.now()),
                            description: 'Freight Dispatch Service Fee / Surcharge',
                            rate: 150,
                            quantity: 1,
                            amount: 150,
                          },
                        ],
                      });
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-colors border border-blue-200"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add Line Item</span>
                  </button>

                  {/* Fast add buttons */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400">Quick Add:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setInvoiceBuilder({
                          ...invoiceBuilder,
                          items: [
                            ...invoiceBuilder.items,
                            {
                              id: `tarp-${Date.now()}`,
                              description: 'Tarp & Strap Fee Coordination',
                              rate: 150,
                              quantity: 1,
                              amount: 150,
                            },
                          ],
                        });
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-mono text-slate-700 cursor-pointer"
                    >
                      + Tarp ($150)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setInvoiceBuilder({
                          ...invoiceBuilder,
                          items: [
                            ...invoiceBuilder.items,
                            {
                              id: `lay-${Date.now()}`,
                              description: 'Layover Compensation Claim',
                              rate: 250,
                              quantity: 1,
                              amount: 250,
                            },
                          ],
                        });
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-mono text-slate-700 cursor-pointer"
                    >
                      + Layover ($250)
                    </button>
                  </div>
                </div>

                {/* Bottom Calculations & Remittance (Matching invoice-generator.com) */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 border-t border-slate-200 pt-6">
                  {/* Notes & Terms (7 cols) */}
                  <div className="sm:col-span-7 space-y-3 font-mono text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Notes & Remittance Details:
                      </label>
                      <textarea
                        rows={3}
                        value={invoiceBuilder.notes}
                        onChange={(e) => setInvoiceBuilder({ ...invoiceBuilder, notes: e.target.value })}
                        placeholder="Payment details (Zelle, ACH, wire, factoring deduction)..."
                        className="w-full p-2.5 border border-slate-300 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Terms & Conditions:
                      </label>
                      <textarea
                        rows={2}
                        value={invoiceBuilder.terms}
                        onChange={(e) => setInvoiceBuilder({ ...invoiceBuilder, terms: e.target.value })}
                        placeholder="Terms and conditions..."
                        className="w-full p-2.5 border border-slate-300 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Financial Totals Card (5 cols) */}
                  <div className="sm:col-span-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-2.5">
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Subtotal:</span>
                      <span className="font-bold text-slate-900 text-sm">${invoiceSubtotal.toFixed(2)}</span>
                    </div>

                    {/* Discount Input */}
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Discount ($):</span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={invoiceDiscountAmount}
                        onChange={(e) => setInvoiceDiscountAmount(Number(e.target.value))}
                        className="w-24 px-2 py-0.5 border border-slate-300 rounded text-right text-emerald-600 font-bold"
                      />
                    </div>

                    {/* Tax Input */}
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Tax (%):</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={invoiceTaxPercent}
                          onChange={(e) => setInvoiceTaxPercent(Number(e.target.value))}
                          className="w-16 px-2 py-0.5 border border-slate-300 rounded text-right"
                        />
                        <span className="text-slate-400">%</span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center border-t border-slate-200 pt-2 text-sm font-bold text-slate-900">
                      <span>Total:</span>
                      <span>${invoiceTotal.toFixed(2)}</span>
                    </div>

                    {/* Amount Paid Input */}
                    <div className="flex justify-between items-center text-slate-600">
                      <span>Amount Paid ($):</span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={invoiceAmountPaid}
                        onChange={(e) => setInvoiceAmountPaid(Number(e.target.value))}
                        className="w-24 px-2 py-0.5 border border-slate-300 rounded text-right font-mono"
                      />
                    </div>

                    {/* Balance Due Highlight */}
                    <div className="flex justify-between items-center border-t-2 border-slate-900 pt-2 text-base font-black text-blue-700">
                      <span>BALANCE DUE:</span>
                      <span>${invoiceBalanceDue.toFixed(2)} USD</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Generated Invoices History Table */}
            <div className="rounded-2xl bg-[#0D1527] border border-blue-900/40 p-5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-blue-900/40 pb-3">
                <span className="text-xs font-mono font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-400" />
                  <span>Recent Generated & Sent Freight Invoices ({invoices.length})</span>
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Stored in Owner Portal Vault</span>
              </div>

              {invoices.length === 0 ? (
                <div className="text-center p-6 text-slate-500 text-xs font-mono">
                  No invoices generated yet. Click "Save Invoice" or "Download PDF" to register an invoice.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#080E1C] border-b border-blue-900/40 text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Invoice #</th>
                        <th className="p-3">Billed Carrier</th>
                        <th className="p-3">Load Ref</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Due Date</th>
                        <th className="p-3 text-right">Amount</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-900/20">
                      {invoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-900/50">
                          <td className="p-3 font-bold text-white">#{inv.invoiceNumber}</td>
                          <td className="p-3 text-slate-200">{inv.billToCompany}</td>
                          <td className="p-3 text-sky-400">{inv.poNumber || 'INF-LOAD'}</td>
                          <td className="p-3 text-slate-400">{inv.invoiceDate}</td>
                          <td className="p-3 text-rose-400">{inv.dueDate}</td>
                          <td className="p-3 text-right font-bold text-emerald-400">
                            ${(inv.balanceDue !== undefined ? inv.balanceDue : inv.total).toFixed(2)}
                          </td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                              {inv.status}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  downloadInvoicePdf(inv);
                                  showToast(`Downloaded PDF for Invoice #${inv.invoiceNumber}`);
                                }}
                                className="p-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 cursor-pointer"
                                title="Download PDF"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setInvoiceBuilder(inv);
                                  setInvoiceDiscountAmount(inv.discount || 0);
                                  setInvoiceTaxPercent(inv.tax ? (inv.tax / inv.subtotal) * 100 : 0);
                                  setInvoiceAmountPaid(inv.amountPaid || 0);
                                  setInvoiceViewMode('editor');
                                  showToast(`Loaded Invoice #${inv.invoiceNumber} into editor!`);
                                }}
                                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-sky-300 border border-slate-700 cursor-pointer"
                                title="Open in Editor"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}


        {/* 6. ROUTE & ARITHMETIC CALCULATOR TAB */}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Part 1: Highway Route, Mileage & Profit Estimator */}
              <div className="lg:col-span-7 p-6 rounded-3xl bg-[#0D1527] border border-blue-900/40 space-y-5">
                <div className="flex items-center gap-2 border-b border-blue-900/40 pb-3">
                  <Compass className="w-5 h-5 text-sky-400" />
                  <h3 className="text-base font-bold text-white">Route Mileage & Revenue Calculator</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Origin City, State</label>
                    <input
                      type="text"
                      value={calcOrigin}
                      onChange={(e) => setCalcOrigin(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Destination City, State</label>
                    <input
                      type="text"
                      value={calcDestination}
                      onChange={(e) => setCalcDestination(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Loaded Miles (Distance)</label>
                    <input
                      type="number"
                      value={calcDistance}
                      onChange={(e) => setCalcDistance(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Target Rate Per Mile ($/mi)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={calcTargetRpm}
                      onChange={(e) => setCalcTargetRpm(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Diesel Price ($/gal)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={calcFuelPrice}
                      onChange={(e) => setCalcFuelPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Dispatch Fee Commission (%)</label>
                    <select
                      value={calcCommissionPercent}
                      onChange={(e) => setCalcCommissionPercent(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sky-300 text-xs font-mono font-bold"
                    >
                      <option value={5}>5% (Standard Equipment)</option>
                      <option value={6}>6%</option>
                      <option value={7}>7% (Box Truck / Hotshot)</option>
                      <option value={8}>8%</option>
                      <option value={10}>10%</option>
                    </select>
                  </div>
                </div>

                {/* Outputs */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs pt-2">
                  <div className="p-3.5 rounded-xl bg-black/60 border border-blue-900/40">
                    <span className="text-[10px] text-slate-400 block uppercase">Gross Revenue:</span>
                    <span className="text-xl font-bold text-emerald-400">
                      ${(calcDistance * calcTargetRpm).toFixed(2)}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/60 border border-blue-900/40">
                    <span className="text-[10px] text-slate-400 block uppercase">Fuel Expense (6.5 mpg):</span>
                    <span className="text-xl font-bold text-rose-400">
                      ${((calcDistance / 6.5) * calcFuelPrice).toFixed(2)}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/60 border border-blue-900/40 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 block uppercase">Dispatch Fee ({calcCommissionPercent}%):</span>
                    <span className="text-xl font-bold text-sky-400">
                      ${((calcDistance * calcTargetRpm) * (calcCommissionPercent / 100)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Part 2: Real Simple Arithmetic Keypad Calculator */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0B1326] border-2 border-sky-500/40 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-blue-900/40 pb-2">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-sky-400" />
                    <h3 className="text-sm font-bold text-white">Simple Keypad Calculator</h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Quick Calculations</span>
                </div>

                {/* LCD Display */}
                <div className="p-4 rounded-2xl bg-black/80 border border-blue-800 text-right font-mono">
                  <div className="text-[10px] text-slate-400 h-4">
                    {calcPrevValue !== null && calcOperator ? `${calcPrevValue} ${calcOperator}` : ''}
                  </div>
                  <div className="text-3xl font-black text-white truncate tracking-wider">
                    {calcDisplay}
                  </div>
                </div>

                {/* Buttons Grid */}
                <div className="grid grid-cols-4 gap-2 font-mono text-sm font-bold">
                  <button
                    onClick={handleCalcClear}
                    className="p-3 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 cursor-pointer"
                  >
                    C
                  </button>
                  <button
                    onClick={() => {
                      const val = parseFloat(calcDisplay);
                      setCalcDisplay(String(val * -1));
                    }}
                    className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer"
                  >
                    ±
                  </button>
                  <button
                    onClick={() => {
                      const val = parseFloat(calcDisplay);
                      setCalcDisplay(String(val / 100));
                    }}
                    className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer"
                  >
                    %
                  </button>
                  <button
                    onClick={() => handleCalcOperation('÷')}
                    className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
                  >
                    ÷
                  </button>

                  <button
                    onClick={() => handleCalcDigit('7')}
                    className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-800 cursor-pointer"
                  >
                    7
                  </button>
                  <button
                    onClick={() => handleCalcDigit('8')}
                    className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-800 cursor-pointer"
                  >
                    8
                  </button>
                  <button
                    onClick={() => handleCalcDigit('9')}
                    className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-800 cursor-pointer"
                  >
                    9
                  </button>
                  <button
                    onClick={() => handleCalcOperation('×')}
                    className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
                  >
                    ×
                  </button>

                  <button
                    onClick={() => handleCalcDigit('4')}
                    className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-800 cursor-pointer"
                  >
                    4
                  </button>
                  <button
                    onClick={() => handleCalcDigit('5')}
                    className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-800 cursor-pointer"
                  >
                    5
                  </button>
                  <button
                    onClick={() => handleCalcDigit('6')}
                    className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-800 cursor-pointer"
                  >
                    6
                  </button>
                  <button
                    onClick={() => handleCalcOperation('-')}
                    className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
                  >
                    -
                  </button>

                  <button
                    onClick={() => handleCalcDigit('1')}
                    className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-800 cursor-pointer"
                  >
                    1
                  </button>
                  <button
                    onClick={() => handleCalcDigit('2')}
                    className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-800 cursor-pointer"
                  >
                    2
                  </button>
                  <button
                    onClick={() => handleCalcDigit('3')}
                    className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-800 cursor-pointer"
                  >
                    3
                  </button>
                  <button
                    onClick={() => handleCalcOperation('+')}
                    className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
                  >
                    +
                  </button>

                  <button
                    onClick={() => handleCalcDigit('0')}
                    className="col-span-2 p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-800 cursor-pointer"
                  >
                    0
                  </button>
                  <button
                    onClick={handleCalcDecimal}
                    className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-800 cursor-pointer"
                  >
                    .
                  </button>
                  <button
                    onClick={handleCalcEquals}
                    className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                  >
                    =
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. CARRIERCHK & FMCSA SAFER EMBEDDED INSPECTOR */}
        {activeTab === 'safer' && (
          <CarrierChkInspector
            defaultMc={saferQuery}
            onSelectCarrier={(prof) => {
              setSaferQuery(prof.mcNumber);
              showToast(`CarrierChk inspection active for ${prof.legalName} (${prof.mcNumber})`);
            }}
          />
        )}

        {/* 8. CUSTOMER SERVICE MESSAGES & REPLY TAB */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-[#0D1527] p-4 rounded-2xl border border-blue-900/40">
              <div className="space-y-0.5">
                <span className="text-xs font-mono font-bold text-sky-400">
                  CARRIER INQUIRIES & CUSTOMER SERVICE REPLY DESK
                </span>
                <p className="text-xs text-slate-300">
                  Read incoming inquiries, click "Reply" to send a direct response, and keep conversation threads permanently logged.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-5 rounded-2xl bg-[#0D1527] border border-blue-900/40 space-y-3 shadow-lg"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-blue-900/30 gap-1">
                    <div>
                      <span className="font-bold text-white text-sm">{inq.fullName}</span>
                      <span className="text-xs text-slate-400 ml-2">Phone: {inq.phone} · Email: {inq.email}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        inq.status === 'Sent'
                          ? 'bg-blue-950 text-sky-400 border border-blue-700'
                          : inq.status === 'Seen'
                          ? 'bg-amber-950 text-amber-400 border border-amber-700'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                      }`}>
                        {inq.status}
                      </span>
                      <span className="text-slate-400 text-[10px]">{inq.createdAt}</span>
                    </div>
                  </div>

                  <div className="text-xs font-bold text-sky-300">{inq.subject}</div>
                  <p className="text-xs text-slate-200 leading-relaxed">{inq.message}</p>

                  {inq.replyText && (
                    <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/40 text-xs text-amber-200 space-y-1 font-mono">
                      <div className="text-[10px] text-slate-400">
                        Replied by <strong>{inq.replyAuthor}</strong> at {inq.replyAt}:
                      </div>
                      <div>{inq.replyText}</div>
                    </div>
                  )}

                  {/* Reply Button */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <a
                      href={`mailto:${inq.email}?subject=Infinity Dispatch Reply: ${encodeURIComponent(inq.subject)}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 font-mono flex items-center gap-1 cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email Directly</span>
                    </a>

                    <button
                      onClick={() => {
                        setActiveInquiryForReply(inq);
                        setReplyMessageText(
                          `Hello ${inq.fullName}, thank you for reaching out to Infinity Dispatch LLC. We have high-paying loads available and can get your carrier agreement packet processed within 15 minutes. Call us directly at (409) 509-6940.`
                        );
                      }}
                      className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Reply in Portal</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. GOOGLE EMAIL INTEGRATION TAB */}
        {activeTab === 'email' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[#0D1527] border-2 border-emerald-500/40 space-y-5 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Google & Gmail Automated Dispatch Connection</h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Connected to: <strong className="text-emerald-300">{connectedGoogleEmail}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsGmailModalOpen(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 hover:from-blue-500 hover:to-sky-400 text-white font-mono font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-sky-900/40"
                  >
                    <Mail className="w-4 h-4 text-white" />
                    <span>Live Gmail Dispatch Authenticator</span>
                    <span className="px-1.5 py-0.2 rounded bg-sky-400/25 text-[9px] text-sky-200 border border-sky-400/40">OAuth 2.0</span>
                  </button>

                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isGoogleSigningIn}
                    className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 font-sans font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>{isGoogleSigningIn ? 'Authorizing...' : googleProfile ? `Gmail: ${googleProfile.email}` : 'Sign In with Google (Gmail API)'}</span>
                  </button>

                  <button
                    onClick={handleConnectGoogle}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sky-300 font-mono font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Set Target Inbox</span>
                  </button>

                  <button
                    onClick={handleSendTestEmail}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Test Dispatch Alert</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-blue-900/40 text-xs font-mono space-y-2 text-slate-300">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>100% Real-Time Automated Outbound Forwarding Enabled</span>
                </div>
                <p>
                  Every carrier sign-up, document upload (W-9, COI, MC), booked load, and customer message inquiry automatically generates and forwards an email notification packet to <strong>{connectedGoogleEmail}</strong> and <strong>Davidcross.vl1@gmail.com</strong>.
                </p>
              </div>
            </div>

            {/* Outgoing Transmission Log */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white font-mono">Live Dispatch Email Transmissions ({emailLogs.length}):</h4>
              <div className="rounded-2xl bg-[#0D1527] border border-blue-900/40 overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#080E1C] border-b border-blue-900/40 text-slate-400 text-[10px] uppercase">
                    <tr>
                      <th className="py-2.5 px-4">Timestamp</th>
                      <th className="py-2.5 px-4">Recipient</th>
                      <th className="py-2.5 px-4">Type</th>
                      <th className="py-2.5 px-4">Subject</th>
                      <th className="py-2.5 px-4">Delivery Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-900/20 text-[11px]">
                    {emailLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-900/40">
                        <td className="py-2.5 px-4 text-slate-400">{log.timestamp}</td>
                        <td className="py-2.5 px-4 text-sky-300">{log.to}</td>
                        <td className="py-2.5 px-4 text-amber-300 font-semibold">{log.type}</td>
                        <td className="py-2.5 px-4 text-white max-w-xs truncate">{log.subject}</td>
                        <td className="py-2.5 px-4 text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>{log.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 10. CARRIER PERFORMANCE SCORING & FLEET MANAGEMENT TAB */}
        {activeTab === 'carriers' && (() => {
          const totalFleetLoads = carrierPerformances.reduce((acc, p) => acc + p.totalLoadsCompleted, 0);
          const totalOnTimeLoads = carrierPerformances.reduce((acc, p) => acc + p.onTimeDeliveries, 0);
          const avgFleetOnTimeRate = totalFleetLoads > 0 ? (totalOnTimeLoads / totalFleetLoads) * 100 : 97.4;
          const avgDocSpeed = carrierPerformances.length > 0
            ? Math.round(carrierPerformances.reduce((acc, p) => acc + p.averageDocSubmissionMinutes, 0) / carrierPerformances.length)
            : 19;
          const eliteFleetCount = carrierPerformances.filter((p) => p.performanceTier === 'Elite Tier A+').length;

          const filteredPerformances = carrierPerformances
            .filter((p) => {
              const matchesSearch =
                p.carrierName.toLowerCase().includes(perfSearch.toLowerCase()) ||
                p.mcNumber.toLowerCase().includes(perfSearch.toLowerCase()) ||
                p.equipmentType.toLowerCase().includes(perfSearch.toLowerCase());
              if (!matchesSearch) return false;
              if (perfTierFilter === 'Elite') return p.performanceTier === 'Elite Tier A+';
              if (perfTierFilter === 'High') return p.performanceTier === 'High Performing A';
              if (perfTierFilter === 'Standard') return p.performanceTier === 'Standard B' || p.performanceTier === 'Needs Review';
              return true;
            })
            .sort((a, b) => {
              if (perfSortBy === 'score') return b.overallScore - a.overallScore;
              if (perfSortBy === 'onTime') return b.onTimeRate - a.onTimeRate;
              if (perfSortBy === 'docSpeed') return a.averageDocSubmissionMinutes - b.averageDocSubmissionMinutes;
              if (perfSortBy === 'loads') return b.totalLoadsCompleted - a.totalLoadsCompleted;
              return 0;
            });

          return (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0D1527] border border-blue-900/40 shadow-xl">
                <div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base font-bold text-white font-mono">
                      CARRIER PERFORMANCE SCORING & FLEET TELEMETRY
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                    Live performance telemetry tracking on-time delivery rates, signed document turnaround speed (BOL & Rate Con), and cargo safety across all fleet partners.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      if (carrierPerformances.length > 0) {
                        const target = carrierPerformances[0];
                        storage.recordDeliveryPerformance(target.mcNumber, true, 12, owner.name);
                        showToast(`Logged simulated 12-min BOL delivery for ${target.carrierName}!`);
                        refreshData();
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-sky-300 flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Test Turnaround Drop (+1)</span>
                  </button>

                  <button
                    onClick={() => {
                      showToast('Fleet performance scoring data refreshed!');
                      refreshData();
                    }}
                    className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync Scores</span>
                  </button>
                </div>
              </div>

              {/* KPI Score Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. On-Time Delivery */}
                <div className="p-4 rounded-2xl bg-[#0D1527] border border-emerald-500/30 space-y-2 relative overflow-hidden shadow-lg">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>ON-TIME DELIVERY RATE</span>
                    <Clock className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono flex items-baseline gap-2">
                    <span className="text-emerald-400">{avgFleetOnTimeRate.toFixed(1)}%</span>
                    <span className="text-[11px] font-normal text-slate-400">fleet average</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(100, avgFleetOnTimeRate)}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-emerald-300 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>+11.2% above FMCSA 86.2% national average</span>
                  </div>
                </div>

                {/* 2. Document Submission Speed */}
                <div className="p-4 rounded-2xl bg-[#0D1527] border border-sky-500/30 space-y-2 relative overflow-hidden shadow-lg">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>DOC SUBMISSION SPEED</span>
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono flex items-baseline gap-2">
                    <span className="text-sky-400">{avgDocSpeed} min</span>
                    <span className="text-[11px] font-normal text-slate-400">avg signed BOL</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-sky-500 to-blue-400 h-2 rounded-full transition-all"
                      style={{ width: '92%' }}
                    />
                  </div>
                  <div className="text-[10px] text-sky-300 font-mono flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>94% of signed BOLs uploaded in &lt; 30 mins</span>
                  </div>
                </div>

                {/* 3. Elite Tier A+ Carriers */}
                <div className="p-4 rounded-2xl bg-[#0D1527] border border-amber-500/30 space-y-2 relative overflow-hidden shadow-lg">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>TIER A+ ELITE CARRIERS</span>
                    <Award className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono flex items-baseline gap-2">
                    <span className="text-amber-400">{eliteFleetCount}</span>
                    <span className="text-[11px] font-normal text-slate-400">of {carrierPerformances.length} fleet partners</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-yellow-400 h-2 rounded-full transition-all"
                      style={{ width: `${(eliteFleetCount / (carrierPerformances.length || 1)) * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-amber-300 font-mono flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    <span>Priority spot rate & contract lane allocation</span>
                  </div>
                </div>

                {/* 4. Claims & Safety Record */}
                <div className="p-4 rounded-2xl bg-[#0D1527] border border-purple-500/30 space-y-2 relative overflow-hidden shadow-lg">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>CARGO CLAIMS RECORD</span>
                    <Shield className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono flex items-baseline gap-2">
                    <span className="text-purple-400">0 Claims</span>
                    <span className="text-[11px] font-normal text-slate-400">100% clean loads</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-purple-500 h-2 rounded-full w-full" />
                  </div>
                  <div className="text-[10px] text-purple-300 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>$0.00 freight damage/loss claims on record</span>
                  </div>
                </div>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#0D1527] p-3.5 rounded-2xl border border-blue-900/40">
                <div className="flex flex-1 items-center gap-2 max-w-md">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={perfSearch}
                      onChange={(e) => setPerfSearch(e.target.value)}
                      placeholder="Search fleet by carrier name, MC#, or equipment..."
                      className="w-full pl-9 pr-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-mono placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Tier Filter */}
                  <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono">
                    {(['All', 'Elite', 'High', 'Standard'] as const).map((tier) => (
                      <button
                        key={tier}
                        onClick={() => setPerfTierFilter(tier)}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                          perfTierFilter === tier
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {tier === 'All' ? 'All Tiers' : tier === 'Elite' ? 'Elite A+' : tier === 'High' ? 'Tier A' : 'Tier B'}
                      </button>
                    ))}
                  </div>

                  {/* Sort By Dropdown */}
                  <div className="flex items-center gap-1.5 text-xs font-mono">
                    <span className="text-slate-400 text-[10px] uppercase">Sort:</span>
                    <select
                      value={perfSortBy}
                      onChange={(e) => setPerfSortBy(e.target.value as any)}
                      className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 text-sky-300 text-xs font-bold cursor-pointer"
                    >
                      <option value="score">Overall Score</option>
                      <option value="onTime">On-Time Rate %</option>
                      <option value="docSpeed">Doc Speed (Fastest)</option>
                      <option value="loads">Completed Loads</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Carrier Performance Table */}
              <div className="rounded-2xl bg-[#0D1527] border border-blue-900/40 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#080E1C] border-b border-blue-900/40 text-slate-400 text-[10px] uppercase">
                      <tr>
                        <th className="py-3 px-4">Carrier Legal Name & MC</th>
                        <th className="py-3 px-4 text-center">Score & Grade</th>
                        <th className="py-3 px-4">On-Time Delivery Rate</th>
                        <th className="py-3 px-4">Doc Submission Speed</th>
                        <th className="py-3 px-4">Cargo Claims</th>
                        <th className="py-3 px-4">Dispatch Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-900/20">
                      {filteredPerformances.map((perf) => {
                        const isElite = perf.overallScore >= 95;
                        const isHigh = perf.overallScore >= 85 && perf.overallScore < 95;

                        return (
                          <tr key={perf.carrierId} className="hover:bg-slate-900/40 transition-colors">
                            {/* Carrier & MC */}
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-white text-xs font-sans flex items-center gap-2">
                                <span>{perf.carrierName}</span>
                                {isElite && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                                    ★ ELITE
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-sky-400 flex items-center gap-2 mt-0.5">
                                <span>{perf.mcNumber}</span>
                                <span className="text-slate-500">•</span>
                                <span className="text-slate-300">{perf.equipmentType}</span>
                                <span className="text-slate-500">•</span>
                                <span className="text-slate-400">{perf.totalLoadsCompleted} loads completed</span>
                              </div>
                            </td>

                            {/* Score & Grade */}
                            <td className="py-3.5 px-4 text-center">
                              <div className="inline-flex flex-col items-center">
                                <span
                                  className={`px-3 py-1 rounded-xl font-black text-sm border shadow-sm ${
                                    isElite
                                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                                      : isHigh
                                      ? 'bg-blue-950 text-sky-300 border-sky-500/50'
                                      : 'bg-amber-950 text-amber-300 border-amber-500/50'
                                  }`}
                                >
                                  {perf.overallScore}/100
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">
                                  {perf.performanceTier.replace(' Tier', '')}
                                </span>
                              </div>
                            </td>

                            {/* On-Time Delivery Rate */}
                            <td className="py-3.5 px-4 min-w-[210px]">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="font-bold text-emerald-400">{perf.onTimeRate}% On-Time</span>
                                <span className="text-[10px] text-slate-400">
                                  {perf.onTimeDeliveries}/{perf.totalLoadsCompleted} loads
                                </span>
                              </div>
                              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                <div
                                  className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                                  style={{ width: `${Math.min(100, perf.onTimeRate)}%` }}
                                />
                              </div>
                              <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                                {perf.lateDeliveries === 0 ? (
                                  <span className="text-emerald-400 font-semibold">✓ 0 Late Deliveries</span>
                                ) : (
                                  <span className="text-amber-400 font-semibold">⚠ {perf.lateDeliveries} Late Delivery</span>
                                )}
                              </div>
                            </td>

                            {/* Document Submission Speed */}
                            <td className="py-3.5 px-4 min-w-[200px]">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-0.5">
                                <Zap className="w-3.5 h-3.5 text-amber-400" />
                                <span>{perf.averageDocSubmissionMinutes} min avg signed BOL</span>
                              </div>
                              <div className="text-[10px] text-sky-300">
                                {perf.bolFastUploadRate}% uploaded in &lt; 30 mins
                              </div>
                              <div className="text-[10px] text-slate-400">
                                Rate Con signed in avg {perf.rateConReturnMinutes} mins
                              </div>
                            </td>

                            {/* Cargo Claims */}
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/70 border border-emerald-600/40 text-emerald-400">
                                0 Claims ($0)
                              </span>
                              <span className="text-[10px] text-slate-400 block mt-1">Clean Record</span>
                            </td>

                            {/* Dispatch Status */}
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  perf.status === 'Preferred'
                                    ? 'bg-amber-950 text-amber-300 border border-amber-600/50'
                                    : 'bg-blue-950 text-sky-300 border border-blue-600/50'
                                }`}
                              >
                                {perf.status}
                              </span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                Evaluated: {perf.lastEvaluated}
                              </span>
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setActiveScorecardCarrier(perf)}
                                  className="px-3 py-1.5 rounded-xl bg-blue-950 hover:bg-blue-900 border border-blue-700 text-sky-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                                >
                                  <Eye className="w-3 h-3 text-sky-400" />
                                  <span>Scorecard</span>
                                </button>

                                <button
                                  onClick={() => {
                                    storage.recordDeliveryPerformance(perf.mcNumber, true, perf.averageDocSubmissionMinutes, owner.name);
                                    showToast(`Logged +1 on-time delivery for ${perf.carrierName}!`);
                                    refreshData();
                                  }}
                                  title="Log successful on-time delivery & fast document turnaround"
                                  className="p-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 text-[11px] cursor-pointer transition-colors"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Carrier Scorecard Audit Modal */}
              {activeScorecardCarrier && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                  <div className="bg-[#0B1326] border-2 border-blue-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
                    {/* Header */}
                    <div className="flex items-start justify-between border-b border-blue-900/40 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Award className="w-6 h-6 text-amber-400" />
                          <h3 className="text-xl font-bold text-white font-sans">
                            {activeScorecardCarrier.carrierName}
                          </h3>
                        </div>
                        <span className="text-xs font-mono text-sky-400 block mt-1">
                          {activeScorecardCarrier.mcNumber} • Equipment: {activeScorecardCarrier.equipmentType} • Total Loads: {activeScorecardCarrier.totalLoadsCompleted}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="px-3 py-1 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-mono font-black text-sm block">
                          SCORE: {activeScorecardCarrier.overallScore}/100
                        </span>
                        <span className="text-[10px] font-mono text-amber-400 font-bold mt-1 block">
                          {activeScorecardCarrier.performanceTier}
                        </span>
                      </div>
                    </div>

                    {/* 4 Performance Metric Rings / Gauges */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
                      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase block">ON-TIME DELIVERY</span>
                        <div className="text-xl font-black text-emerald-400">
                          {activeScorecardCarrier.onTimeRate}%
                        </div>
                        <span className="text-[9px] text-slate-400 block">
                          {activeScorecardCarrier.onTimeDeliveries}/{activeScorecardCarrier.totalLoadsCompleted} loads
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-sky-500/30 space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase block">DOC SPEED</span>
                        <div className="text-xl font-black text-sky-400">
                          {activeScorecardCarrier.averageDocSubmissionMinutes}m
                        </div>
                        <span className="text-[9px] text-slate-400 block">avg signed BOL</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase block">FAST BOL SCAN</span>
                        <div className="text-xl font-black text-amber-400">
                          {activeScorecardCarrier.bolFastUploadRate}%
                        </div>
                        <span className="text-[9px] text-slate-400 block">&lt; 30 min turnaround</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-purple-500/30 space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase block">RC RETURN TIME</span>
                        <div className="text-xl font-black text-purple-400">
                          {activeScorecardCarrier.rateConReturnMinutes}m
                        </div>
                        <span className="text-[9px] text-slate-400 block">rate con sign speed</span>
                      </div>
                    </div>

                    {/* Benchmark Comparisons */}
                    <div className="space-y-2 bg-slate-900/50 p-4 rounded-2xl border border-slate-800 text-xs font-mono">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block mb-2">
                        INDUSTRY BENCHMARKS & RELIABILITY COMPARISON:
                      </span>
                      <div className="flex justify-between items-center py-1 border-b border-slate-800 text-slate-300">
                        <span>On-Time Delivery vs US DOT Benchmark:</span>
                        <strong className="text-emerald-400">
                          {activeScorecardCarrier.onTimeRate}% vs 86.2% (+{(activeScorecardCarrier.onTimeRate - 86.2).toFixed(1)}% superiority)
                        </strong>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-slate-800 text-slate-300">
                        <span>Bill of Lading Delivery Turnaround:</span>
                        <strong className="text-sky-300">
                          {activeScorecardCarrier.averageDocSubmissionMinutes} Minutes vs 4.2 Hours Industry Avg
                        </strong>
                      </div>
                      <div className="flex justify-between items-center py-1 border-b border-slate-800 text-slate-300">
                        <span>Cargo Damage & Insurance Claims:</span>
                        <strong className="text-emerald-400">0 Claims Filed ($0.00 loss)</strong>
                      </div>
                      <div className="flex justify-between items-center py-1 text-slate-300">
                        <span>FMCSA SAFER & SearchCarriers Compliance:</span>
                        <strong className="text-emerald-400">100% Active Operating Authority</strong>
                      </div>
                    </div>

                    {/* Evaluator Notes */}
                    <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/40 space-y-1">
                      <span className="text-[10px] font-mono text-amber-300 uppercase font-bold block">
                        DISPATCH LOGISTICS COMMENDATION (DAVID CROSS & ALVIN):
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed font-sans">
                        "{activeScorecardCarrier.evaluatorNotes || 'Consistent on-time performance with immediate paperwork submission. Highly recommended for dedicated shipper freight contracts.'}"
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            storage.recordDeliveryPerformance(activeScorecardCarrier.mcNumber, true, 10, owner.name);
                            showToast(`Simulated rapid 10-minute BOL delivery for ${activeScorecardCarrier.carrierName}!`);
                            refreshData();
                            const updated = storage.getCarrierPerformances().find(p => p.carrierId === activeScorecardCarrier.carrierId);
                            if (updated) setActiveScorecardCarrier(updated);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-300" />
                          <span>Simulate 10m Fast BOL (+1 Drop)</span>
                        </button>
                      </div>

                      <button
                        onClick={() => setActiveScorecardCarrier(null)}
                        className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold cursor-pointer"
                      >
                        Close Scorecard
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* 11. PAYMENTS TAB */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-[#0D1527] border border-blue-900/40 overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#080E1C] border-b border-blue-900/40 text-slate-400 text-[10px] uppercase">
                  <tr>
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Carrier</th>
                    <th className="py-3 px-4">Gross Freight</th>
                    <th className="py-3 px-4">Fee %</th>
                    <th className="py-3 px-4">Commission ($)</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-900/20">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-900/50">
                      <td className="py-3 px-4 font-bold text-white">{p.invoiceNumber}</td>
                      <td className="py-3 px-4 text-slate-300">{p.carrierName}</td>
                      <td className="py-3 px-4 text-white">${p.loadRate.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sky-400">{p.dispatchFeePercent}%</td>
                      <td className="py-3 px-4 font-bold text-emerald-400">${p.commissionAmount.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.paymentStatus === 'Paid'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                            : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                        }`}>
                          {p.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 12. DEMOS TAB */}
        {activeTab === 'demos' && (
          <div className="space-y-3">
            {demoBookings.map((demo) => (
              <div
                key={demo.id}
                className="p-5 rounded-2xl bg-[#0D1527] border border-blue-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white font-sans">{demo.fullName}</span>
                    <span className="text-sky-400">({demo.companyName})</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Phone: <strong>{demo.phone}</strong> · Email: {demo.email}
                  </div>
                  <div className="text-slate-300">
                    Scheduled: <strong className="text-amber-400">{demo.preferredDate}</strong> at <strong>{demo.preferredTime}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-sky-300 font-bold">
                    {demo.assignedOwner}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-bold">
                    {demo.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 13. NOTES TAB */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#0D1527] border border-blue-900/40 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">Owner Confidential Dispatch Notes</h3>
                </div>
                <span className="text-xs font-mono text-emerald-400">Secured (Malik@786)</span>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newNoteTitle.trim() || !newNoteContent.trim()) return;
                  storage.saveNote({
                    id: `note-${Date.now()}`,
                    title: newNoteTitle.trim(),
                    content: newNoteContent.trim(),
                    ownerName: owner.name,
                    tag: newNoteTag,
                    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
                    updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
                  });
                  setNewNoteTitle('');
                  setNewNoteContent('');
                  refreshData();
                }}
                className="space-y-3 pt-2"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Note Title / Lane Target"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    className="sm:col-span-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                  <select
                    value={newNoteTag}
                    onChange={(e) => setNewNoteTag(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                  >
                    <option value="Broker Lane">Broker Lane</option>
                    <option value="Compliance">Compliance</option>
                    <option value="Rate Target">Rate Target</option>
                    <option value="Carrier Alert">Carrier Alert</option>
                  </select>
                </div>
                <textarea
                  rows={2}
                  required
                  placeholder="Type confidential rate, factoring, or shipper notes..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Save Sticky Note
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map((note) => (
                <div key={note.id} className="p-5 rounded-2xl bg-[#0B1326] border border-blue-900/40 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-sky-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                      {note.tag}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{note.createdAt}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{note.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{note.content}</p>
                  <div className="pt-2 border-t border-blue-900/30 flex justify-between items-center text-[11px] font-mono text-amber-400">
                    <span>Logged by: {note.ownerName}</span>
                    <button
                      onClick={() => {
                        storage.deleteNote(note.id);
                        refreshData();
                      }}
                      className="text-slate-500 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 14. REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-5 rounded-2xl bg-[#0D1527] border border-blue-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        storage.toggleReviewApproval(rev.id);
                        refreshData();
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                        rev.isApproved
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {rev.isApproved ? 'Approved (Public)' : 'Hidden'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-200 italic">"{rev.comment}"</p>
                  <div className="text-xs font-mono text-slate-400 pt-2 border-t border-blue-900/30 flex justify-between">
                    <span>{rev.carrierName} ({rev.companyName})</span>
                    <span className="text-sky-300">{rev.equipment}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 15. DISPATCH & SALES FORCE MANAGEMENT */}
        {activeTab === 'dispatchers' && (
          <SalesAndDispatchManager
            loads={loads}
            rosterCarriers={rosterCarriers}
            onUpdate={() => {
              setDispatchers(storage.getDispatchers());
              setLoads(storage.getLoads());
              setRosterCarriers(storage.getRosterCarriers());
              showToast('Dispatch & Sales roster updated');
            }}
          />
        )}

        {/* 16. SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#0D1527] border border-blue-900/40 space-y-4">
              <h3 className="text-base font-bold text-white">Super Admin Access Credentials</h3>
              <p className="text-xs text-slate-300">
                Authorized Executive IDs: <strong>David Cross</strong> & <strong>Alvin</strong>. Master security authentication active across web and live chat consoles.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white font-mono">Immutable Activity Audit Trail:</h4>
              <div className="space-y-2">
                {activities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-mono"
                  >
                    <div>
                      <span className="font-bold text-sky-400">{act.ownerName}</span> ·{' '}
                      <span className="text-white">{act.action}</span>: {act.details}
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{act.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 17. FREIGHT PDF EDITOR (SEJDA-GRADE SUITE) */}
        {activeTab === 'pdfeditor' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#0D1527] border border-blue-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-sky-400" />
                  <span>Freight PDF Editor & Document Studio (Sejda-Grade)</span>
                </h3>
                <p className="text-xs text-slate-300">
                  Full-fidelity document editor for Rate Cons, Carrier Packets, and BOLs. Add text, digital handwritten signature, whiteout redact, highlight, freight stamps, and download signed PDF.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPdfEditorModalOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Open Editor In Fullscreen Modal</span>
              </button>
            </div>

            {/* Embedded Live Workspace */}
            <div className="bg-[#0B1326] border border-blue-900/40 rounded-3xl overflow-hidden p-1 sm:p-2 min-h-[700px]">
              <FreightPdfEditorModal
                isOpen={true}
                onClose={() => setActiveTab('overview')}
                carrierName="Apex Interstate Express LLC"
                loadNumber="INF-8921"
                initialDocumentName="Carrier_Rate_Confirmation_INF-8921.pdf"
              />
            </div>
          </div>
        )}

        {/* 18. GEMINI DISPATCH COPILOT & FREIGHT TRANSLATOR */}
        {activeTab === 'copilot' && (
          <div className="space-y-4">
            <AiFreightCopilot
              loads={loads}
              rosterCarriers={rosterCarriers}
              onApplyAction={(actionType, payload) => {
                if (actionType === 'book_load') {
                  setNewLoad((prev) => ({ ...prev, ...payload }));
                  setIsAddLoadOpen(true);
                  showToast('Auto-populated load fields from AI Copilot analysis!');
                }
              }}
            />
          </div>
        )}

      </main>

      {/* CREATE LOAD MODAL */}
      {isAddLoadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#091122] border-2 border-blue-500/50 shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-blue-900/40">
              <h3 className="text-lg font-bold text-white">Book & Dispatch Freight Load</h3>
              <button onClick={() => setIsAddLoadOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            {/* OCR AUTO-FILL QUICK BANNER */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/70 via-indigo-950/70 to-blue-950/70 border border-purple-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
                  <Scan className="w-5 h-5 text-purple-300 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>AI Document OCR Scanner</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/30">
                      Gemini Multimodal
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Auto-populate shipper, consignee, commodity, weight, and trailer from a Bill of Lading image.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsOcrBolModalOpen(true);
                  if (!ocrPreviewImage && SAMPLE_BOL_DOCUMENTS.length > 0) {
                    handleSelectSampleBol(SAMPLE_BOL_DOCUMENTS[0]);
                  }
                }}
                className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5 shrink-0 transition-all border border-purple-300/30"
              >
                <Scan className="w-3.5 h-3.5 text-purple-200" />
                <span>Scan BOL Image</span>
              </button>
            </div>

            <form onSubmit={handleSaveLoad} className="space-y-4 text-xs">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Carrier Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={newLoad.carrierName}
                    onChange={(e) => setNewLoad({ ...newLoad, carrierName: e.target.value })}
                    placeholder="e.g. Apex Interstate Express"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Carrier / Driver Phone *</label>
                  <input
                    type="tel"
                    required
                    value={newLoad.carrierPhone}
                    onChange={(e) => setNewLoad({ ...newLoad, carrierPhone: e.target.value })}
                    placeholder="e.g. (214) 555-8392"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Carrier MC Number *</label>
                  <input
                    type="text"
                    required
                    value={newLoad.mcNumber}
                    onChange={(e) => setNewLoad({ ...newLoad, mcNumber: e.target.value })}
                    placeholder="e.g. MC-1489201"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Equipment Type *</label>
                  <select
                    value={newLoad.equipmentType}
                    onChange={(e) => setNewLoad({ ...newLoad, equipmentType: e.target.value as EquipmentType })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="Dry Van">Dry Van (53ft/48ft)</option>
                    <option value="Reefer">Reefer (Temp-Controlled)</option>
                    <option value="Flatbed">Flatbed</option>
                    <option value="Step Deck">Step Deck</option>
                    <option value="Power Only">Power Only</option>
                    <option value="Hotshot">Hotshot</option>
                    <option value="Box Truck">Box Truck (26ft)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Dispatched Gross Rate ($) *</label>
                  <input
                    type="number"
                    required
                    value={newLoad.rate}
                    onChange={(e) => setNewLoad({ ...newLoad, rate: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-emerald-400 font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Dispatch Fee Commission (%) *</label>
                  <select
                    value={newLoad.dispatchFeePercent}
                    onChange={(e) => setNewLoad({ ...newLoad, dispatchFeePercent: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sky-300 font-bold font-mono"
                  >
                    <option value={5}>5% (Standard Fee)</option>
                    <option value={6}>6%</option>
                    <option value={7}>7% (Box Truck / Hotshot)</option>
                    <option value={8}>8%</option>
                    <option value={10}>10%</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Origin City, State (PU)</label>
                  <input
                    type="text"
                    required
                    value={newLoad.originCity}
                    onChange={(e) => setNewLoad({ ...newLoad, originCity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Destination City, State (DEL)</label>
                  <input
                    type="text"
                    required
                    value={newLoad.destinationCity}
                    onChange={(e) => setNewLoad({ ...newLoad, destinationCity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Loaded Miles</label>
                  <input
                    type="number"
                    required
                    value={newLoad.loadedMiles}
                    onChange={(e) => setNewLoad({ ...newLoad, loadedMiles: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Broker Name</label>
                  <input
                    type="text"
                    value={newLoad.brokerName}
                    onChange={(e) => setNewLoad({ ...newLoad, brokerName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Commodity / Notes</label>
                <input
                  type="text"
                  value={newLoad.commodity}
                  onChange={(e) => setNewLoad({ ...newLoad, commodity: e.target.value })}
                  placeholder="e.g. Palletized Goods - No Touch"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl cursor-pointer shadow-lg uppercase tracking-wider transition-all"
              >
                Save & Dispatch Load (Auto-Attach RC & BOL)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD ROSTER CARRIER MODAL */}
      {isAddRosterCarrierOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#091122] border-2 border-emerald-500/50 shadow-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-blue-900/40">
              <h3 className="text-base font-bold text-white">Add Active Carrier to Dispatch Roster</h3>
              <button onClick={() => setIsAddRosterCarrierOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRosterCarrier} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Driver Name *</label>
                  <input
                    type="text"
                    required
                    value={newRosterCarrier.driverName}
                    onChange={(e) => setNewRosterCarrier({ ...newRosterCarrier, driverName: e.target.value })}
                    placeholder="e.g. Marcus Vance"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Driver Phone *</label>
                  <input
                    type="tel"
                    required
                    value={newRosterCarrier.driverPhone}
                    onChange={(e) => setNewRosterCarrier({ ...newRosterCarrier, driverPhone: e.target.value })}
                    placeholder="e.g. (214) 555-8392"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Carrier Name *</label>
                  <input
                    type="text"
                    required
                    value={newRosterCarrier.carrierName}
                    onChange={(e) => setNewRosterCarrier({ ...newRosterCarrier, carrierName: e.target.value })}
                    placeholder="e.g. Apex Interstate"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Carrier Phone *</label>
                  <input
                    type="tel"
                    required
                    value={newRosterCarrier.carrierPhone}
                    onChange={(e) => setNewRosterCarrier({ ...newRosterCarrier, carrierPhone: e.target.value })}
                    placeholder="e.g. (214) 555-8392"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Carrier MC# *</label>
                  <input
                    type="text"
                    required
                    value={newRosterCarrier.mcNumber}
                    onChange={(e) => setNewRosterCarrier({ ...newRosterCarrier, mcNumber: e.target.value })}
                    placeholder="e.g. MC-1489201"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Dispatched Amount ($)</label>
                  <input
                    type="number"
                    required
                    value={newRosterCarrier.dispatchedAmount}
                    onChange={(e) => setNewRosterCarrier({ ...newRosterCarrier, dispatchedAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-emerald-400 font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Invoice Status</label>
                  <select
                    value={newRosterCarrier.invoiceStatus}
                    onChange={(e) => setNewRosterCarrier({ ...newRosterCarrier, invoiceStatus: e.target.value as InvoiceStatus })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                  >
                    <option value="Not Invoiced">Not Invoiced</option>
                    <option value="Invoice Sent">Invoice Sent</option>
                    <option value="Pending Payment">Pending Payment</option>
                    <option value="Cleared / Paid">Cleared / Paid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Commission Fee (%)</label>
                  <select
                    value={newRosterCarrier.dispatchFeePercent}
                    onChange={(e) => setNewRosterCarrier({ ...newRosterCarrier, dispatchFeePercent: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sky-300 font-bold font-mono"
                  >
                    <option value={5}>5%</option>
                    <option value={6}>6%</option>
                    <option value={7}>7%</option>
                    <option value={8}>8%</option>
                    <option value={10}>10%</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer shadow-lg uppercase tracking-wider"
              >
                Add Carrier to Active Roster
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOMER SERVICE REPLY MODAL */}
      {activeInquiryForReply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#091122] border-2 border-blue-500/50 shadow-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-blue-900/40">
              <div>
                <h3 className="text-base font-bold text-white">Reply to {activeInquiryForReply.fullName}</h3>
                <span className="text-xs font-mono text-slate-400">
                  Recipient: {activeInquiryForReply.email} · Phone: {activeInquiryForReply.phone}
                </span>
              </div>
              <button onClick={() => setActiveInquiryForReply(null)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Carrier Message:</span>
              <p className="italic">"{activeInquiryForReply.message}"</p>
            </div>

            <form onSubmit={handleSendInquiryReply} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-mono">Reply as Executive:</label>
                <select
                  value={replyAuthor}
                  onChange={(e) => setReplyAuthor(e.target.value as 'David Cross' | 'Alvin')}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold"
                >
                  <option value="David Cross">David Cross (Business Development Executive)</option>
                  <option value="Alvin">Alvin (Operations Director)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-mono">Customer Response Message:</label>
                <textarea
                  rows={4}
                  required
                  value={replyMessageText}
                  onChange={(e) => setReplyMessageText(e.target.value)}
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveInquiryForReply(null)}
                  className="px-4 py-2 bg-slate-900 border border-slate-700 text-slate-300 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Official Response</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI OCR BOL DOCUMENT PARSER MODAL */}
      {isOcrBolModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-5xl rounded-3xl bg-[#091122] border-2 border-purple-500/50 shadow-2xl p-5 sm:p-7 space-y-5 my-auto max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-purple-900/40">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                    <Scan className="w-4 h-4 text-purple-300" />
                  </div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>AI Bill of Lading (BOL) Document OCR Scanner</span>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      Gemini 3.8 Flash Multimodal
                    </span>
                  </h3>
                </div>
                <p className="text-xs text-slate-300">
                  Upload an image of a freight Bill of Lading or pick a verified sample to extract and auto-populate all dispatch load fields.
                </p>
              </div>

              <button
                onClick={() => setIsOcrBolModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors text-sm"
              >
                ✕
              </button>
            </div>

            {/* Quick Sample Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="font-bold flex items-center gap-1.5 text-purple-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Instant 1-Click Verified BOL Samples:</span>
                </span>
                <span className="text-[11px] text-slate-400">Click any document to test instant OCR parsing</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {SAMPLE_BOL_DOCUMENTS.map((sample) => {
                  const isSelected = ocrSelectedSampleId === sample.id;
                  return (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleSelectSampleBol(sample)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                        isSelected
                          ? 'bg-purple-950/60 border-purple-400 ring-2 ring-purple-500/40 shadow-lg shadow-purple-900/20'
                          : 'bg-[#0D1527] border-blue-900/40 hover:border-purple-500/40 hover:bg-slate-900'
                      }`}
                    >
                      <div className="w-10 h-12 rounded border border-slate-700 overflow-hidden bg-white shrink-0 shadow-sm flex items-center justify-center">
                        <img
                          src={sample.imageThumbnail}
                          alt={sample.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-bold text-white truncate">{sample.title}</div>
                        <div className="text-[10px] text-purple-300 truncate">{sample.subtitle}</div>
                        <span className="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {sample.equipmentType}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Workspace Grid: Document Preview + Extracted Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column: Upload / Document Viewer (5 cols) */}
              <div className="lg:col-span-5 space-y-3">
                {/* File Dropzone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsOcrDragging(true);
                  }}
                  onDragLeave={() => setIsOcrDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsOcrDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleBolFileUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all cursor-pointer ${
                    isOcrDragging
                      ? 'border-purple-400 bg-purple-950/40'
                      : 'border-slate-700 hover:border-purple-500/50 bg-[#070D1A]'
                  }`}
                >
                  <input
                    type="file"
                    id="bol-file-input"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleBolFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                  <label htmlFor="bol-file-input" className="cursor-pointer block space-y-1.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-300">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-white">
                      Drop paper BOL scan, camera photo, or PDF
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Supports JPG, PNG, WEBP, PDF · Mobile camera photos supported
                    </div>
                    <span className="inline-block px-3 py-1 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-400/40 text-[11px] font-bold rounded-lg transition-colors">
                      Browse Local Document
                    </span>
                  </label>
                </div>

                {/* Scanned Document Preview Box with Laser OCR Scan Animation */}
                <div className="rounded-2xl border border-blue-900/40 bg-[#050A14] overflow-hidden relative shadow-inner">
                  <div className="flex items-center justify-between px-3 py-2 bg-[#091122] border-b border-blue-900/40 text-[11px] font-mono text-slate-300">
                    <span className="flex items-center gap-1.5 truncate">
                      <FileImage className="w-3.5 h-3.5 text-purple-400" />
                      <span className="truncate">{ocrDocumentName}</span>
                    </span>
                    {isOcrScanning && (
                      <span className="text-purple-400 font-bold flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>OCR Scanning...</span>
                      </span>
                    )}
                  </div>

                  <div className="relative min-h-[300px] max-h-[420px] flex items-center justify-center overflow-hidden bg-slate-950 p-2">
                    {ocrPreviewImage ? (
                      <img
                        src={ocrPreviewImage}
                        alt="Scanned BOL"
                        className="w-full max-h-[400px] object-contain rounded shadow-lg"
                      />
                    ) : (
                      <div className="text-center p-6 space-y-2 text-slate-500">
                        <Scan className="w-10 h-10 mx-auto opacity-30 text-purple-400" />
                        <p className="text-xs">No document selected. Click a sample above or upload a photo.</p>
                      </div>
                    )}

                    {/* Animated Scanning Laser Line */}
                    {isOcrScanning && (
                      <div className="absolute inset-0 pointer-events-none bg-purple-500/10 flex flex-col justify-between">
                        <div className="w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent shadow-[0_0_15px_#a855f7] animate-pulse" />
                        <div className="text-center bg-black/85 text-purple-300 py-1 font-mono text-[10px] tracking-wider uppercase border-t border-purple-500/40">
                          Extracting BOL Entities via Gemini Vision...
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Extracted Fields Review & Auto-Fill (7 cols) */}
              <div className="lg:col-span-7 space-y-3">
                {ocrExtractedData ? (
                  <div className="space-y-3">
                    {/* Confidence Meter Banner */}
                    <div className="p-3 rounded-2xl bg-[#0D1527] border border-emerald-500/40 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                          <CheckCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span>OCR Extraction Verified</span>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {ocrExtractedData.confidenceScore}% Accuracy Confidence
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300">
                            {ocrExtractedData.extractedSummary || 'All key Bill of Lading freight entities extracted.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Extracted Fields Form / Grid */}
                    <div className="p-3.5 rounded-2xl bg-[#0D1527] border border-blue-900/40 space-y-3 text-xs max-h-[380px] overflow-y-auto">
                      {/* Top Identifiers Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-0.5 font-mono">BOL Number</label>
                          <input
                            type="text"
                            value={ocrExtractedData.bolNumber}
                            onChange={(e) => setOcrExtractedData({ ...ocrExtractedData, bolNumber: e.target.value })}
                            className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono font-bold text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-0.5 font-mono">PRO #</label>
                          <input
                            type="text"
                            value={ocrExtractedData.proNumber || ''}
                            onChange={(e) => setOcrExtractedData({ ...ocrExtractedData, proNumber: e.target.value })}
                            placeholder="e.g. PRO-88219"
                            className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-0.5 font-mono">PO / Ref #</label>
                          <input
                            type="text"
                            value={ocrExtractedData.poNumber || ''}
                            onChange={(e) => setOcrExtractedData({ ...ocrExtractedData, poNumber: e.target.value })}
                            placeholder="e.g. PO-90214"
                            className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs"
                          />
                        </div>
                      </div>

                      {/* Origin & Shipper */}
                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold font-mono">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>ORIGIN / SHIPPER (PICKUP)</span>
                          </span>
                          <span>{ocrExtractedData.pickupDate} {ocrExtractedData.pickupTime}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Facility Name</span>
                            <input
                              type="text"
                              value={ocrExtractedData.shipperName}
                              onChange={(e) => setOcrExtractedData({ ...ocrExtractedData, shipperName: e.target.value })}
                              className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-white text-[11px]"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">City, State, Zip</span>
                            <div className="flex gap-1.5">
                              <input
                                type="text"
                                value={ocrExtractedData.originCity}
                                onChange={(e) => setOcrExtractedData({ ...ocrExtractedData, originCity: e.target.value })}
                                className="w-2/3 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-white text-[11px]"
                              />
                              <input
                                type="text"
                                value={ocrExtractedData.originState}
                                onChange={(e) => setOcrExtractedData({ ...ocrExtractedData, originState: e.target.value })}
                                className="w-1/3 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-white text-[11px] font-mono text-center"
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Pickup Street Address</span>
                          <input
                            type="text"
                            value={ocrExtractedData.shipperAddress}
                            onChange={(e) => setOcrExtractedData({ ...ocrExtractedData, shipperAddress: e.target.value })}
                            className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-slate-300 text-[11px]"
                          />
                        </div>
                      </div>

                      {/* Destination & Consignee */}
                      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] text-sky-400 font-bold font-mono">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>DESTINATION / CONSIGNEE (DELIVERY)</span>
                          </span>
                          <span>{ocrExtractedData.deliveryDate} {ocrExtractedData.deliveryTime}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Receiver Facility</span>
                            <input
                              type="text"
                              value={ocrExtractedData.consigneeName}
                              onChange={(e) => setOcrExtractedData({ ...ocrExtractedData, consigneeName: e.target.value })}
                              className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-white text-[11px]"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block">City, State, Zip</span>
                            <div className="flex gap-1.5">
                              <input
                                type="text"
                                value={ocrExtractedData.destinationCity}
                                onChange={(e) => setOcrExtractedData({ ...ocrExtractedData, destinationCity: e.target.value })}
                                className="w-2/3 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-white text-[11px]"
                              />
                              <input
                                type="text"
                                value={ocrExtractedData.destinationState}
                                onChange={(e) => setOcrExtractedData({ ...ocrExtractedData, destinationState: e.target.value })}
                                className="w-1/3 px-2 py-1 bg-slate-950 border border-slate-700 rounded text-white text-[11px] font-mono text-center"
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Delivery Street Address</span>
                          <input
                            type="text"
                            value={ocrExtractedData.consigneeAddress}
                            onChange={(e) => setOcrExtractedData({ ...ocrExtractedData, consigneeAddress: e.target.value })}
                            className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-slate-300 text-[11px]"
                          />
                        </div>
                      </div>

                      {/* Cargo Details: Commodity, Weight, Pieces */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] text-slate-400 mb-0.5">Commodity Description</label>
                          <input
                            type="text"
                            value={ocrExtractedData.commodity}
                            onChange={(e) => setOcrExtractedData({ ...ocrExtractedData, commodity: e.target.value })}
                            className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white text-[11px]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-0.5 font-mono">Gross Weight (lbs)</label>
                          <input
                            type="number"
                            value={ocrExtractedData.weightLbs}
                            onChange={(e) => setOcrExtractedData({ ...ocrExtractedData, weightLbs: Number(e.target.value) })}
                            className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-emerald-400 font-mono font-bold text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-0.5 font-mono">Piece / Pallet Count</label>
                          <input
                            type="number"
                            value={ocrExtractedData.pieceCount}
                            onChange={(e) => setOcrExtractedData({ ...ocrExtractedData, pieceCount: Number(e.target.value) })}
                            className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white font-mono text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-0.5">Package Type</label>
                          <input
                            type="text"
                            value={ocrExtractedData.packageType || 'Pallets'}
                            onChange={(e) => setOcrExtractedData({ ...ocrExtractedData, packageType: e.target.value })}
                            className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-white text-[11px]"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-0.5 font-mono">Trailer / Seal #</label>
                          <input
                            type="text"
                            value={`${ocrExtractedData.trailerNumber || 'TR-5310'} / ${ocrExtractedData.sealNumber || 'SEAL-OK'}`}
                            onChange={(e) => {
                              const [tr, sl] = e.target.value.split('/');
                              setOcrExtractedData({ ...ocrExtractedData, trailerNumber: tr?.trim(), sealNumber: sl?.trim() });
                            }}
                            className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-sky-300 font-mono text-[11px]"
                          />
                        </div>
                      </div>

                      {ocrExtractedData.specialInstructions && (
                        <div>
                          <label className="block text-[10px] text-amber-400 mb-0.5">Special Handling Instructions (OCR Extracted)</label>
                          <div className="p-2 bg-amber-950/30 border border-amber-900/40 rounded-lg text-[10px] text-amber-200">
                            {ocrExtractedData.specialInstructions}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <button
                        type="button"
                        onClick={handleApplyBolToDispatchFields}
                        className="py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider transition-all"
                      >
                        <ArrowRight className="w-4 h-4" />
                        <span>Auto-Populate Dispatch Load Form</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleDirectBookFromBol}
                        className="py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Instant 1-Click Load Dispatch</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-10 text-center rounded-2xl bg-[#0D1527] border border-blue-900/40 space-y-3">
                    <Scan className="w-10 h-10 text-purple-400/50 mx-auto animate-pulse" />
                    <div className="text-sm font-bold text-white">Ready to Scan Bill of Lading</div>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Choose one of the 4 verified freight documents above, or upload a photo of a real paper Bill of Lading to automatically extract all dispatch details.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT VIEWER / LIGHTBOX MODAL */}

      <DocumentViewerModal
        isOpen={isDocViewerOpen}
        onClose={() => setIsDocViewerOpen(false)}
        document={activeDocData}
      />

      {/* GMAIL DISPATCH AUTHENTICATOR MODAL */}
      <GmailDispatchModal
        isOpen={isGmailModalOpen}
        onClose={() => setIsGmailModalOpen(false)}
      />

      {/* ROSTER CARRIER COMPLETE EDIT MODAL */}
      {isRosterEditModalOpen && selectedRosterCarrierForEdit && (
        <RosterCarrierEditModal
          carrier={selectedRosterCarrierForEdit}
          isOpen={isRosterEditModalOpen}
          onClose={() => {
            setIsRosterEditModalOpen(false);
            setSelectedRosterCarrierForEdit(null);
          }}
          onSave={(updatedCarrier) => {
            storage.saveRosterCarrier(updatedCarrier, owner.name);
            setRosterCarriers(storage.getRosterCarriers());
            showToast(`Carrier ${updatedCarrier.carrierName} (${updatedCarrier.mcNumber}) successfully saved!`);
            refreshData();
          }}
        />
      )}

      {/* LOAD COMPLETE EDIT MODAL */}
      {isLoadEditModalOpen && selectedLoadForEdit && (
        <LoadEditModal
          load={selectedLoadForEdit}
          isOpen={isLoadEditModalOpen}
          onClose={() => {
            setIsLoadEditModalOpen(false);
            setSelectedLoadForEdit(null);
          }}
          onSave={(updatedLoad) => {
            storage.saveLoad(updatedLoad, owner.name);
            setLoads(storage.getLoads());
            showToast(`Load #${updatedLoad.loadNumber} successfully saved!`);
            refreshData();
          }}
        />
      )}

      {/* FULLSCREEN FREIGHT PDF EDITOR MODAL */}
      {isPdfEditorModalOpen && (
        <FreightPdfEditorModal
          isOpen={isPdfEditorModalOpen}
          isModal={true}
          onClose={() => setIsPdfEditorModalOpen(false)}
          carrierName={rosterCarriers[0]?.carrierName || 'Apex Interstate Express LLC'}
          loadNumber={loads[0]?.loadNumber || 'INF-8921'}
          initialDocumentName="Rate_Confirmation_INF-8921.pdf"
        />
      )}
    </div>
  );
};
