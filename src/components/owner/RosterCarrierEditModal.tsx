import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Truck,
  Phone,
  Mail,
  MapPin,
  FileText,
  DollarSign,
  Percent,
  Plus,
  Trash2,
  Eye,
  CheckCircle2,
  Copy,
  Check,
  Upload,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { RosterCarrier, EquipmentType, InvoiceStatus, LoadStatus, CarrierDocumentItem } from '../../types';

interface RosterCarrierEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  carrier: RosterCarrier | null;
  onSave: (updatedCarrier: RosterCarrier) => void;
  onViewDoc?: (doc: CarrierDocumentItem) => void;
}

export const RosterCarrierEditModal: React.FC<RosterCarrierEditModalProps> = ({
  isOpen,
  onClose,
  carrier,
  onSave,
  onViewDoc,
}) => {
  const [formData, setFormData] = useState<RosterCarrier | null>(null);
  const [copied, setCopied] = useState(false);

  // New Document Upload State
  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState<CarrierDocumentItem['type']>('MC Authority');

  useEffect(() => {
    if (carrier) {
      setFormData({
        ...carrier,
        documents: carrier.documents || [],
      });
      setIsAddingDoc(false);
    }
  }, [carrier]);

  if (!isOpen || !formData) return null;

  const handleChange = (field: keyof RosterCarrier, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleCopyDossier = () => {
    if (!formData) return;
    const text = `[CARRIER DISPATCH DOSSIER - INFINITY DISPATCH LLC]
Carrier Legal Name: ${formData.carrierName}
MC Number: ${formData.mcNumber} | USDOT: ${formData.dotNumber || 'N/A'}
Phone: ${formData.carrierPhone} | Email: ${formData.carrierEmail || 'On file'}
Address: ${formData.carrierAddress || 'On file'}
Driver Name: ${formData.driverName} (${formData.driverPhone})
Truck Type: ${formData.truckType || formData.equipmentType} | VIN: ${formData.vinNumber || 'N/A'}
Dispatched Gross: $${formData.dispatchedAmount.toLocaleString()} | Fee: ${formData.dispatchFeePercent}%
Active Load Status: ${formData.loadStatus} | Invoice Status: ${formData.invoiceStatus}
Assigned Dispatcher: ${formData.dispatcherName} (${formData.dispatcherPhone})
Sales Representative: ${formData.salesPersonName || 'Unassigned'}
Carrier Preferences / Notes: ${formData.notes || 'None recorded'}
Attached Documents: ${(formData.documents || []).map((d) => `${d.type} (${d.name})`).join(', ') || 'None'}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    const newDoc: CarrierDocumentItem = {
      id: `cdoc-${Date.now()}`,
      name: newDocName.trim(),
      type: newDocType,
      fileUrl: '/assets/sample_mc.pdf',
      uploadedAt: new Date().toISOString().split('T')[0],
      fileSize: '1.2 MB',
    };

    setFormData((prev) =>
      prev
        ? {
            ...prev,
            documents: [...(prev.documents || []), newDoc],
          }
        : null
    );

    setNewDocName('');
    setIsAddingDoc(false);
  };

  const handleDeleteDocument = (docIdOrName?: string) => {
    if (!docIdOrName) return;
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            documents: (prev.documents || []).filter((d) => (d.id || d.name) !== docIdOrName),
          }
        : null
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#0A1020] border-2 border-sky-500/40 rounded-2xl shadow-[0_0_80px_rgba(2,132,199,0.3)] overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#070B14] border-b border-blue-900/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-display">
                  Edit Carrier Roster Record
                </h3>
                <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-400/50">
                  {formData.mcNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Full authority to edit carrier MC, phone, address, truck type, VIN, notes, and attached documents.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyDossier}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sky-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied All!' : 'Copy All'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs font-mono">
          {/* Section 1: Carrier & Legal Authority */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-2 pb-1.5 border-b border-blue-900/30">
              <FileCheck className="w-4 h-4 text-sky-400" />
              <span>1. Carrier Company & Authority Details</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Carrier Legal Name *</label>
                <input
                  type="text"
                  required
                  value={formData.carrierName}
                  onChange={(e) => handleChange('carrierName', e.target.value)}
                  className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-white font-sans font-bold focus:border-sky-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Carrier MC Number *</label>
                <input
                  type="text"
                  required
                  value={formData.mcNumber}
                  onChange={(e) => handleChange('mcNumber', e.target.value)}
                  placeholder="MC-1489201"
                  className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-sky-300 font-bold focus:border-sky-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">USDOT Number</label>
                <input
                  type="text"
                  value={formData.dotNumber || ''}
                  onChange={(e) => handleChange('dotNumber', e.target.value)}
                  placeholder="DOT-3920141"
                  className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-white focus:border-sky-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Carrier Phone *</label>
                <input
                  type="text"
                  required
                  value={formData.carrierPhone}
                  onChange={(e) => handleChange('carrierPhone', e.target.value)}
                  className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-white focus:border-sky-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Carrier Email Address</label>
                <input
                  type="email"
                  value={formData.carrierEmail || ''}
                  onChange={(e) => handleChange('carrierEmail', e.target.value)}
                  placeholder="dispatch@carrier.com"
                  className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-white focus:border-sky-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Carrier Physical Address</label>
                <input
                  type="text"
                  value={formData.carrierAddress || ''}
                  onChange={(e) => handleChange('carrierAddress', e.target.value)}
                  placeholder="4800 Logistics Way, Dallas, TX 75241"
                  className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-white focus:border-sky-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Driver & Equipment Specifications */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-2 pb-1.5 border-b border-blue-900/30">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>2. Driver & Equipment Information</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Assigned Driver Name *</label>
                <input
                  type="text"
                  required
                  value={formData.driverName}
                  onChange={(e) => handleChange('driverName', e.target.value)}
                  className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-white font-sans font-bold focus:border-sky-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Driver Phone *</label>
                <input
                  type="text"
                  required
                  value={formData.driverPhone}
                  onChange={(e) => handleChange('driverPhone', e.target.value)}
                  className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-emerald-400 font-bold focus:border-sky-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Truck Equipment Type *</label>
                <select
                  value={formData.truckType || formData.equipmentType}
                  onChange={(e) => {
                    const eq = e.target.value as EquipmentType;
                    handleChange('truckType', eq);
                    handleChange('equipmentType', eq);
                  }}
                  className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-white font-bold"
                >
                  <option value="Dry Van">53ft Dry Van</option>
                  <option value="Reefer">53ft Reefer</option>
                  <option value="Flatbed">48ft/53ft Flatbed</option>
                  <option value="Step Deck">Step Deck</option>
                  <option value="Power Only">Power Only</option>
                  <option value="Hotshot">40ft Hotshot</option>
                  <option value="Box Truck">26ft Box Truck</option>
                  <option value="Sprinter Van">Cargo / Sprinter Van</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Truck VIN Number</label>
                <input
                  type="text"
                  value={formData.vinNumber || ''}
                  onChange={(e) => handleChange('vinNumber', e.target.value)}
                  placeholder="1FT8W3BT9NED48912"
                  className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-white uppercase focus:border-sky-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Financials, Commission & Live Status */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-2 pb-1.5 border-b border-blue-900/30">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>3. Financial Rates, Commission & Dispatch Staff</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Dispatched Gross Amount ($) *</label>
                <input
                  type="number"
                  required
                  value={formData.dispatchedAmount}
                  onChange={(e) => handleChange('dispatchedAmount', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-emerald-400 font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Dispatch Fee Commission (%)</label>
                <select
                  value={formData.dispatchFeePercent}
                  onChange={(e) => handleChange('dispatchFeePercent', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-sky-300 font-bold"
                >
                  <option value={5}>5% (Starter)</option>
                  <option value={6}>6% (Standard)</option>
                  <option value={7}>7% (Full Service)</option>
                  <option value={8}>8% (Premium / Dedicated)</option>
                  <option value={10}>10% (Specialized Heavy)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Active Load Status</label>
                <select
                  value={formData.loadStatus}
                  onChange={(e) => handleChange('loadStatus', e.target.value as LoadStatus)}
                  className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-white font-bold"
                >
                  <option value="Booked">Booked</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Loading">Loading</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Invoice Status</label>
                <select
                  value={formData.invoiceStatus}
                  onChange={(e) => handleChange('invoiceStatus', e.target.value as InvoiceStatus)}
                  className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-white font-bold"
                >
                  <option value="Not Invoiced">Not Invoiced</option>
                  <option value="Invoice Sent">Invoice Sent</option>
                  <option value="Pending Payment">Pending Payment</option>
                  <option value="Cleared / Paid">Cleared / Paid</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Assigned Dispatcher</label>
                <select
                  value={formData.dispatcherName}
                  onChange={(e) => handleChange('dispatcherName', e.target.value)}
                  className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-white font-bold"
                >
                  <option value="David Cross">David Cross</option>
                  <option value="Alvin">Alvin</option>
                  <option value="Sarah Jenkins">Sarah Jenkins</option>
                  <option value="Elena Rostova">Elena Rostova</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Dispatcher Phone</label>
                <input
                  type="text"
                  value={formData.dispatcherPhone}
                  onChange={(e) => handleChange('dispatcherPhone', e.target.value)}
                  className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Sales Representative / Recruiter</label>
                <select
                  value={formData.salesPersonName || 'Marcus Sterling'}
                  onChange={(e) => handleChange('salesPersonName', e.target.value)}
                  className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-white font-bold"
                >
                  <option value="Marcus Sterling">Marcus Sterling</option>
                  <option value="Jessica Vance">Jessica Vance</option>
                  <option value="Direct Onboarding">Direct Onboarding</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Carrier Preferences & Notes */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-2 pb-1.5 border-b border-blue-900/30">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>4. Carrier Preferences, Lanes & Dispatch Notes</span>
            </h4>
            <textarea
              rows={3}
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="e.g. Prefers TX to Southeast lanes. Avoids NYC / Northeast. Home every weekend. Target RPM $2.85+. Uses OTR Solutions Factoring. No touch freight."
              className="w-full px-3 py-2.5 bg-[#05080F] border border-blue-900/60 rounded-xl text-slate-200 placeholder-slate-500 focus:border-sky-400 focus:outline-none leading-relaxed font-sans"
            />
          </div>

          {/* Section 5: Attached Documents Manager (MC, W-9, COI, NOA, DL, Extra Docs) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-1.5 border-b border-blue-900/30">
              <h4 className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>5. Attached Carrier Documents ({(formData.documents || []).length})</span>
              </h4>

              <button
                type="button"
                onClick={() => setIsAddingDoc(true)}
                className="px-2.5 py-1 rounded-lg bg-sky-600/30 hover:bg-sky-600/50 border border-sky-400/50 text-sky-200 text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Attach New Document</span>
              </button>
            </div>

            {/* Upload New Document Box */}
            {isAddingDoc && (
              <div className="p-3 rounded-xl bg-blue-950/40 border border-sky-400/40 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 mb-1">Document Title / File Name *</label>
                    <input
                      type="text"
                      value={newDocName}
                      onChange={(e) => setNewDocName(e.target.value)}
                      placeholder="e.g. COI_Endorsement_2026.pdf"
                      className="w-full px-3 py-1.5 bg-black/60 border border-blue-900/60 rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 mb-1">Document Classification *</label>
                    <select
                      value={newDocType}
                      onChange={(e) => setNewDocType(e.target.value as any)}
                      className="w-full px-3 py-1.5 bg-black/60 border border-blue-900/60 rounded-lg text-white font-bold"
                    >
                      <option value="MC Authority">MC Authority Certificate</option>
                      <option value="W-9">W-9 Form (Signed)</option>
                      <option value="COI">Certificate of Insurance (COI)</option>
                      <option value="NOA">Notice of Assignment (NOA) / Voided Check</option>
                      <option value="Driver License">Driver's License (CDL)</option>
                      <option value="Truck Picture">Truck / Equipment Photo</option>
                      <option value="Voided Check">Voided Check</option>
                      <option value="Other">Other Document</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingDoc(false)}
                    className="px-3 py-1 rounded bg-slate-800 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddDocument}
                    className="px-4 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                  >
                    Attach Document
                  </button>
                </div>
              </div>
            )}

            {/* List of Attached Documents */}
            {(formData.documents || []).length === 0 ? (
              <div className="p-4 rounded-xl bg-black/40 border border-blue-900/40 text-center text-slate-400">
                No documents attached yet. Click 'Attach New Document' to attach MC Authority, COI, W-9, NOA, or CDL.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(formData.documents || []).map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-xl bg-[#05080F] border border-blue-900/40 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800/60 flex items-center justify-center text-sky-400 shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="text-white font-bold truncate">{doc.name}</div>
                        <div className="text-[10px] text-slate-400">
                          <span className="text-emerald-400 font-bold">{doc.type}</span> · {doc.uploadedAt}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {onViewDoc && (
                        <button
                          type="button"
                          onClick={() => onViewDoc(doc)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                          title="View Document"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteDocument(doc.id || doc.name)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40"
                        title="Remove Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-4 border-t border-blue-900/50 flex flex-wrap items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400">
              Last Updated: <strong className="text-white">{formData.updatedAt || 'Recently'}</strong>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save All Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
