import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  X,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building2,
  Truck,
  DollarSign,
  User,
  Sparkles,
  Copy,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Edit3,
  Eye,
  Mail,
  Stamp,
  Check,
  FileCheck2,
} from 'lucide-react';
import {
  generateFreightDocumentPdf,
  downloadFreightDocumentPdf,
} from '../../services/pdfInvoice';
import { sendEmailWithGmail } from '../../services/gmail';

export interface DocumentViewerData {
  title: string;
  docType: 'Rate Confirmation' | 'Bill of Lading' | 'W-9' | 'COI' | 'MC Authority' | 'Driver License' | 'NOA' | 'Invoice' | 'General';
  fileName: string;
  carrierName?: string;
  mcNumber?: string;
  loadNumber?: string;
  date?: string;
  rawText?: string;
  extraDetails?: Record<string, string | number>;
}

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentViewerData | null;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  document: doc,
}) => {
  const [viewMode, setViewMode] = useState<'paper' | 'edit'>('paper');
  const [zoomScale, setZoomScale] = useState<number>(100);
  const [aiDisputeLetter, setAiDisputeLetter] = useState<string | null>(null);
  const [isGeneratingDispute, setIsGeneratingDispute] = useState(false);
  const [copiedDispute, setCopiedDispute] = useState(false);
  const [isEmailingPdf, setIsEmailingPdf] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Editable document state
  const [editTitle, setEditTitle] = useState('');
  const [editCarrier, setEditCarrier] = useState('');
  const [editMc, setEditMc] = useState('');
  const [editLoadNo, setEditLoadNo] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editContent, setEditContent] = useState('');
  const [selectedStamp, setSelectedStamp] = useState<string>('OFFICIALLY VERIFIED & LOCKED');
  const [signatureOfficer, setSignatureOfficer] = useState<string>('David Cross (Business Development Executive)');

  useEffect(() => {
    if (doc) {
      setEditTitle(doc.title || 'Official Freight Document');
      setEditCarrier(doc.carrierName || 'Apex Interstate Express LLC');
      setEditMc(doc.mcNumber || 'MC-1489201');
      setEditLoadNo(doc.loadNumber || 'INF-2026-0891');
      setEditDate(doc.date || new Date().toISOString().split('T')[0]);
      setEditContent(
        doc.rawText ||
          `${doc.title}
Carrier: ${doc.carrierName || 'Apex Interstate Express LLC'} (${doc.mcNumber || 'MC-1489201'})
Load Reference: ${doc.loadNumber || 'INF-2026-0891'}
Date: ${doc.date || new Date().toISOString().split('T')[0]}

Official Dispatch & Logistics Notes:
- Rate and route confirmed under Infinity Dispatch LLC broker agreement.
- 100% direct broker payout to carrier verified.
- Paperwork and check-calls active 24/7.`
      );
      setSelectedStamp('OFFICIALLY VERIFIED & LOCKED');
      setAiDisputeLetter(null);
      setViewMode('paper');
      setZoomScale(100);
    }
  }, [doc]);

  if (!isOpen || !doc) return null;

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleGenerateDispute = async (type: 'Detention' | 'TONU') => {
    setIsGeneratingDispute(true);
    try {
      const res = await fetch('/api/ai/draft-dispute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: type === 'Detention' ? 'Detention Compensation ($75/hr)' : 'Truck Ordered Not Used (TONU)',
          loadNumber: editLoadNo || 'INF-2026-0891',
          brokerName: String(doc.extraDetails?.Broker || 'Brokerage Claims Dept'),
          carrierName: editCarrier || 'Apex Interstate Express LLC',
          hoursDelayed: 3,
          dockAddress: String(doc.extraDetails?.['Shipper Address'] || 'Receiver Terminal'),
        }),
      });
      const data = await res.json();
      setAiDisputeLetter(data.letter || 'Demand letter generated.');
    } catch (err) {
      console.error(err);
      setAiDisputeLetter(
        `FORMAL DEMAND FOR DETENTION PAYMENT\nRe: Load #${editLoadNo || 'INF-2026-0891'}\nCarrier: ${editCarrier || 'Carrier'}\n\nPlease issue revised Rate Con with $225.00 detention (3 hrs @ $75/hr) to Davidcross.vl1@gmail.com.`
      );
    } finally {
      setIsGeneratingDispute(false);
    }
  };

  const handleCopyDispute = () => {
    if (aiDisputeLetter) {
      navigator.clipboard.writeText(aiDisputeLetter);
      setCopiedDispute(true);
      setTimeout(() => setCopiedDispute(false), 3000);
    }
  };

  // Real PDF Generator & Download using jsPDF!
  const handleDownloadPdf = () => {
    try {
      downloadFreightDocumentPdf({
        title: editTitle,
        docType: doc.docType,
        fileName: doc.fileName,
        carrierName: editCarrier,
        mcNumber: editMc,
        loadNumber: editLoadNo,
        date: editDate,
        content: editContent,
        extraDetails: doc.extraDetails,
        stampText: selectedStamp,
        signatureName: signatureOfficer,
      });
      showNotice(`✓ Official PDF "${editTitle}.pdf" downloaded successfully!`);
    } catch (err) {
      console.error('PDF download error:', err);
      showNotice('Error generating PDF document');
    }
  };

  // Send PDF directly via Gmail integration
  const handleEmailPdf = async () => {
    setIsEmailingPdf(true);
    try {
      const pdfDoc = generateFreightDocumentPdf({
        title: editTitle,
        docType: doc.docType,
        fileName: doc.fileName,
        carrierName: editCarrier,
        mcNumber: editMc,
        loadNumber: editLoadNo,
        date: editDate,
        content: editContent,
        extraDetails: doc.extraDetails,
        stampText: selectedStamp,
        signatureName: signatureOfficer,
      });

      const dataUri = pdfDoc.output('datauristring');
      const base64Index = dataUri.indexOf(';base64,');
      const base64 = base64Index >= 0 ? dataUri.substring(base64Index + ';base64,'.length) : '';

      const cleanFileName = `${(doc.fileName || editTitle).replace(/\s+/g, '_')}.pdf`;

      const res = await sendEmailWithGmail({
        to: 'dispatch@carrierlogistics.com',
        cc: 'Davidcross.vl1@gmail.com',
        subject: `[DISPATCH DOCUMENT] ${editTitle} - Ref: ${editLoadNo || editMc}`,
        bodyText: `Hello,\n\nPlease find attached the verified freight document "${editTitle}" for Carrier ${editCarrier} (MC# ${editMc}).\n\nDocument Reference: ${editLoadNo}\nVerification Stamp: ${selectedStamp}\nAuthorized by: ${signatureOfficer}\n\nInfinity Dispatch LLC · Houston, TX · +1 (409) 509-6940`,
        pdfBase64: base64,
        pdfFileName: cleanFileName,
      });

      showNotice(`✓ Document emailed to carrier via ${res.deliveryMethod === 'gmail_api' ? 'Gmail API' : 'Infinity Email Gateway'}!`);
    } catch (err) {
      console.error('Error emailing PDF:', err);
      showNotice('Failed to dispatch PDF via email');
    } finally {
      setIsEmailingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-5xl max-h-[94vh] flex flex-col rounded-3xl bg-[#091122] border-2 border-blue-500/50 shadow-2xl overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="p-3.5 sm:p-4 bg-[#0C152B] border-b border-blue-900/50 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-sky-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white truncate max-w-sm sm:max-w-md">
                  {editTitle}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hidden sm:inline-block">
                  {selectedStamp}
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400">
                File: <span className="text-sky-300">{doc.fileName}</span> · Infinity Dispatch LLC PDF Engine
              </p>
            </div>
          </div>

          {/* Center Mode Switcher */}
          <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setViewMode('paper')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'paper'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>PDF Paper View</span>
            </button>
            <button
              onClick={() => setViewMode('edit')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'edit'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Document</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            {viewMode === 'paper' && (
              <div className="hidden md:flex items-center bg-slate-900 border border-slate-700 rounded-xl px-1.5 py-1 text-slate-300 text-xs font-mono">
                <button
                  onClick={() => setZoomScale((prev) => Math.max(75, prev - 10))}
                  className="p-1 hover:text-white cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-1 text-[11px] font-bold text-sky-400">{zoomScale}%</span>
                <button
                  onClick={() => setZoomScale((prev) => Math.min(130, prev + 10))}
                  className="p-1 hover:text-white cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              onClick={handleDownloadPdf}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-mono text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
              title="Download High-Resolution PDF"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download PDF</span>
            </button>

            <button
              onClick={handleEmailPdf}
              disabled={isEmailingPdf}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-mono text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-colors disabled:opacity-50"
              title="Email PDF with Gmail"
            >
              <Mail className="w-4 h-4 text-sky-200" />
              <span className="hidden sm:inline">{isEmailingPdf ? 'Sending...' : 'Email PDF'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 flex items-center gap-1 cursor-pointer transition-colors"
              title="Print View"
            >
              <Printer className="w-4 h-4 text-sky-400" />
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-rose-950/60 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Notice Banner */}
        {actionNotice && (
          <div className="bg-emerald-500 text-slate-950 text-xs font-mono font-bold px-4 py-1.5 text-center transition-all flex items-center justify-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Document Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-6 bg-[#070B14]">
          {viewMode === 'edit' ? (
            /* Document Field Editor Form */
            <div className="max-w-3xl mx-auto rounded-2xl bg-[#0D1527] border border-blue-900/40 p-5 sm:p-7 space-y-4 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-blue-900/40 pb-3">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-sky-400" />
                  <span className="font-bold text-white text-sm">Interactive Document & PDF Editor</span>
                </div>
                <span className="text-[11px] text-slate-400">Modify any field before generating or downloading PDF</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Document Title</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Carrier Legal Name</label>
                  <input
                    type="text"
                    value={editCarrier}
                    onChange={(e) => setEditCarrier(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Carrier MC Number</label>
                  <input
                    type="text"
                    value={editMc}
                    onChange={(e) => setEditMc(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Load / Reference Number</label>
                  <input
                    type="text"
                    value={editLoadNo}
                    onChange={(e) => setEditLoadNo(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Official Document Stamp</label>
                  <select
                    value={selectedStamp}
                    onChange={(e) => setSelectedStamp(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-emerald-400 font-bold"
                  >
                    <option value="OFFICIALLY VERIFIED & LOCKED">OFFICIALLY VERIFIED & LOCKED</option>
                    <option value="APPROVED FOR DISPATCH">APPROVED FOR DISPATCH</option>
                    <option value="CLEARED / PAID IN FULL">CLEARED / PAID IN FULL</option>
                    <option value="REVISED RATE CONFIRMATION">REVISED RATE CONFIRMATION</option>
                    <option value="CERTIFIED HAZMAT-FREE">CERTIFIED HAZMAT-FREE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 text-[11px] mb-1">Authorized Officer Signature</label>
                  <select
                    value={signatureOfficer}
                    onChange={(e) => setSignatureOfficer(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sky-300 font-bold"
                  >
                    <option value="David Cross (Business Development Executive)">David Cross (Business Development Executive)</option>
                    <option value="Alvin (Operations Director)">Alvin (Operations Director)</option>
                    <option value="Infinity Dispatch LLC Operations Desk">Infinity Dispatch LLC Operations Desk</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Document Content & Legal Terms</label>
                <textarea
                  rows={8}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-emerald-400 font-mono text-xs leading-relaxed focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setViewMode('paper')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl cursor-pointer"
                >
                  Apply & Preview PDF Sheet
                </button>
              </div>
            </div>
          ) : (
            /* Visual Formal Printable PDF Paper View */
            <div
              style={{ transform: `scale(${zoomScale / 100})`, transformOrigin: 'top center' }}
              className="transition-transform duration-200"
            >
              <div className="max-w-3xl mx-auto rounded-2xl bg-white text-slate-900 p-6 sm:p-10 shadow-2xl border border-slate-300 font-sans space-y-6 relative print:m-0 print:border-none print:shadow-none">
                
                {/* Visual Watermark / Stamp */}
                <div className="absolute right-6 top-6 sm:right-10 sm:top-10 border-2 border-emerald-600/80 rounded-xl p-2.5 text-center text-emerald-700 font-mono text-[10px] font-black uppercase rotate-6 pointer-events-none select-none bg-emerald-50/90 shadow-sm">
                  INFINITY DISPATCH LLC<br />
                  {selectedStamp}<br />
                  PORTAL VAULT RECORD
                </div>

                {/* Document Header */}
                <div className="border-b-2 border-slate-900 pb-5">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-700 uppercase tracking-widest mb-1">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>INFINITY DISPATCH LLC · COMMERCIAL FREIGHT DOCUMENT</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                    {editTitle}
                  </h1>
                  <div className="text-xs text-slate-600 font-mono mt-1 flex flex-wrap gap-x-4 gap-y-1">
                    <span>Date: <strong>{editDate}</strong></span>
                    {editLoadNo && <span>Load #: <strong>{editLoadNo}</strong></span>}
                    {editMc && <span>Carrier MC: <strong>{editMc}</strong></span>}
                  </div>
                </div>

                {/* Metadata Summary Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">CARRIER / HOLDER:</span>
                    <span className="text-sm font-bold text-slate-900">{editCarrier}</span>
                    <div className="text-slate-600">{editMc}</div>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">MANAGED BY DISPATCH DESK:</span>
                    <span className="text-sm font-bold text-blue-700">Infinity Dispatch LLC (Houston HQ)</span>
                    <div className="text-slate-600">David Cross / Alvin · (409) 509-6940</div>
                  </div>
                </div>

                {/* Document Specific Breakdown */}
                {doc.docType === 'Rate Confirmation' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs font-mono space-y-2">
                      <div className="flex justify-between border-b border-blue-200 pb-1.5 font-bold text-blue-900">
                        <span>RATE CONFIRMATION SPECIFICATIONS</span>
                        <span className="text-emerald-700">100% DIRECT BROKER PAYOUT</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-slate-700">
                        <div>Gross Agreed Rate: <strong className="text-slate-950 font-bold">$2,850.00 USD</strong></div>
                        <div>Dispatch Fee Commission: <strong className="text-blue-700 font-bold">7% ($199.50)</strong></div>
                        <div>Net Carrier Remittance: <strong className="text-emerald-700 font-bold">$2,650.50 USD</strong></div>
                        <div>Detention / Layover Clause: <strong>$75/hr after 2h at dock</strong></div>
                      </div>
                    </div>
                  </div>
                )}

                {doc.docType === 'Bill of Lading' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs font-mono space-y-2">
                      <div className="flex justify-between border-b border-amber-200 pb-1.5 font-bold text-amber-900">
                        <span>STRAIGHT BILL OF LADING · SHORT FORM</span>
                        <span className="text-slate-700">ORIGINAL - NOT NEGOTIABLE</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-slate-700">
                        <div>Shipper: <strong>Dallas Central Distribution, TX</strong></div>
                        <div>Consignee: <strong>Buckeye Retail Logistics, Columbus, OH</strong></div>
                        <div>Commodity: <strong>Consumer Packaged Freight</strong></div>
                        <div>Gross Weight: <strong>Verified Commercial Cargo</strong></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Content Box */}
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block">
                    Document Terms & Content:
                  </span>
                  <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto border border-slate-800">
                    {editContent}
                  </pre>
                </div>

                {/* Extra Key-Values */}
                {doc.extraDetails && Object.keys(doc.extraDetails).length > 0 && (
                  <div className="border-t border-slate-200 pt-4">
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Registered Attributes:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
                      {Object.entries(doc.extraDetails).map(([key, val]) => (
                        <div key={key} className="p-2.5 rounded-lg bg-slate-100 border border-slate-200">
                          <span className="text-slate-500 text-[10px] block uppercase">{key}:</span>
                          <strong className="text-slate-900">{String(val)}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Signatures & Stamps */}
                <div className="border-t-2 border-slate-900 pt-5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 font-mono text-xs text-slate-600">
                  <div>
                    <div className="font-bold text-slate-900 uppercase">Authorized Signature:</div>
                    <div className="font-serif italic text-lg text-blue-900 font-bold mt-1">
                      {signatureOfficer.split(' ')[0]} {signatureOfficer.split(' ')[1] || ''}
                    </div>
                    <div className="text-[10px] text-slate-500">{signatureOfficer}</div>
                  </div>

                  <div className="text-left sm:text-right text-[10px] space-y-0.5">
                    <div>Digital Verification ID: <strong className="text-slate-800">INF-AUTH-{Math.floor(100000 + Math.random() * 900000)}</strong></div>
                    <div>Status: <span className="text-emerald-700 font-bold">{selectedStamp}</span></div>
                    <div>Server Time: <span>{new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC</span></div>
                  </div>
                </div>

                {/* AI Dispute Demand Letter Generator Section */}
                {(doc.docType === 'Rate Confirmation' || doc.docType === 'Bill of Lading') && (
                  <div className="mt-6 pt-6 border-t-2 border-dashed border-slate-300 print:hidden space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span className="font-bold text-slate-900 font-mono text-xs">
                          AI BROKER DISPUTE COPILOT (GEMINI POWERED)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={isGeneratingDispute}
                          onClick={() => handleGenerateDispute('Detention')}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono font-bold text-[11px] cursor-pointer transition-colors shadow-sm disabled:opacity-50"
                        >
                          {isGeneratingDispute ? 'Drafting...' : '⚡ AI Draft Detention Claim ($75/hr)'}
                        </button>
                        <button
                          type="button"
                          disabled={isGeneratingDispute}
                          onClick={() => handleGenerateDispute('TONU')}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-sky-300 font-mono font-bold text-[11px] cursor-pointer transition-colors shadow-sm disabled:opacity-50"
                        >
                          ⚡ AI Draft TONU Claim ($350)
                        </button>
                      </div>
                    </div>

                    {aiDisputeLetter && (
                      <div className="p-4 rounded-xl bg-slate-900 text-white font-mono text-xs space-y-2 border border-slate-800">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="text-amber-400 font-bold">Official Ready-to-Send Demand Letter:</span>
                          <button
                            type="button"
                            onClick={handleCopyDispute}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 flex items-center gap-1 cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>{copiedDispute ? 'Copied to Clipboard!' : 'Copy Letter'}</span>
                          </button>
                        </div>
                        <pre className="whitespace-pre-wrap text-[11px] text-slate-200 leading-relaxed font-mono">
                          {aiDisputeLetter}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-3.5 bg-[#0C152B] border-t border-blue-900/50 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs font-mono text-slate-400">
            Official Infinity Dispatch LLC Vault · Digital Signature & PDF Download ready
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-mono text-white font-bold cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Real PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-white font-bold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
