import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Truck,
  MapPin,
  Calendar,
  Clock,
  Building2,
  DollarSign,
  Phone,
  Mail,
  FileText,
  FileCheck,
  Plus,
  Trash2,
  Copy,
  Check,
  Eye,
} from 'lucide-react';
import { LoadItem, EquipmentType, LoadStatus, InvoiceStatus, LoadDocumentItem } from '../../types';

interface LoadEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  load: LoadItem | null;
  onSave: (updatedLoad: LoadItem) => void;
  onOpenDocViewer?: (title: string, type: string, fileName: string, content?: string) => void;
}

export const LoadEditModal: React.FC<LoadEditModalProps> = ({
  isOpen,
  onClose,
  load,
  onSave,
  onOpenDocViewer,
}) => {
  const [formData, setFormData] = useState<LoadItem | null>(null);
  const [copied, setCopied] = useState(false);

  // New Document Attachment
  const [isAddingDoc, setIsAddingDoc] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState<LoadDocumentItem['type']>('POD');

  useEffect(() => {
    if (load) {
      setFormData({
        ...load,
        loadDocuments: load.loadDocuments || [],
      });
      setIsAddingDoc(false);
    }
  }, [load]);

  if (!isOpen || !formData) return null;

  const handleChange = (field: keyof LoadItem, value: any) => {
    setFormData((prev) => {
      if (!prev) return null;
      const updated = { ...prev, [field]: value };
      // Recalculate fee & rpm if rate/miles/fee change
      if (field === 'rate' || field === 'dispatchFeePercent') {
        const rate = field === 'rate' ? Number(value) : prev.rate;
        const feePercent = field === 'dispatchFeePercent' ? Number(value) : prev.dispatchFeePercent;
        updated.dispatchFeeAmount = (rate * feePercent) / 100;
      }
      if (field === 'rate' || field === 'loadedMiles') {
        const rate = field === 'rate' ? Number(value) : prev.rate;
        const miles = field === 'loadedMiles' ? Number(value) : prev.loadedMiles;
        updated.rpm = miles > 0 ? Number((rate / miles).toFixed(2)) : 0;
      }
      return updated;
    });
  };

  const handleCopyAll = () => {
    if (!formData) return;
    const text = `[LOAD DISPATCH SHEET - INFINITY DISPATCH LLC]
Load Confirmation #: #${formData.loadNumber}
Equipment: ${formData.equipmentType} | Commodity: ${formData.commodity || 'General Freight'}
Weight: ${formData.weightLbs ? `${formData.weightLbs.toLocaleString()} lbs` : 'N/A'}

BROKER DETAILS:
Broker: ${formData.brokerName} | Broker MC: ${formData.brokerageMc || 'N/A'}
Phone: ${formData.brokerPhone} | Email: ${formData.brokerageEmail || 'N/A'}

ROUTE & TIMELINE:
Pickup: ${formData.pickupDate} @ ${formData.puTime || '08:00'}
PU Address: ${formData.puAddress || `${formData.originCity}, ${formData.originState}`}
Delivery: ${formData.deliveryDate} @ ${formData.delTime || '14:00'}
DEL Address: ${formData.delAddress || `${formData.destinationCity}, ${formData.destinationState}`}
Miles: ${formData.loadedMiles} mi | RPM: $${formData.rpm.toFixed(2)}/mi

FINANCIALS:
Dispatched Linehaul Gross: $${formData.rate.toLocaleString()} USD
Infinity Commission Fee: ${formData.dispatchFeePercent}% ($${formData.dispatchFeeAmount.toFixed(2)})
Load Status: ${formData.status} | Invoice: ${formData.invoiceStatus || 'Not Invoiced'}

CARRIER / DRIVER:
Carrier: ${formData.carrierName} | MC: ${formData.mcNumber}
Driver: ${formData.driverName || 'On File'} (${formData.driverPhone || formData.carrierPhone})
Special Instructions: ${formData.notes || 'Clean trailer, seal intact.'}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    const newDoc: LoadDocumentItem = {
      id: `ldoc-${Date.now()}`,
      name: newDocName.trim(),
      type: newDocType,
      fileUrl: '/assets/sample_pod.pdf',
      uploadedAt: new Date().toISOString().split('T')[0],
    };

    setFormData((prev) =>
      prev
        ? {
            ...prev,
            loadDocuments: [...(prev.loadDocuments || []), newDoc],
          }
        : null
    );

    setNewDocName('');
    setIsAddingDoc(false);
  };

  const handleDeleteDoc = (docId: string) => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            loadDocuments: (prev.loadDocuments || []).filter((d) => d.id !== docId),
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
      <div className="relative w-full max-w-4xl bg-[#0A1020] border-2 border-emerald-500/40 rounded-2xl shadow-[0_0_80px_rgba(16,185,129,0.3)] overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#070B14] border-b border-blue-900/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-sky-500 flex items-center justify-center text-white shadow-md">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-display">
                  Edit Dispatch Load Record
                </h3>
                <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  #{formData.loadNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Full editing for PU/DEL dates, addresses, broker MC, rate, and attached documents.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyAll}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs font-mono">
          {/* 1. Basic Info & Equipment */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-2 pb-1.5 border-b border-blue-900/30">
              <FileText className="w-4 h-4 text-sky-400" />
              <span>1. Load Identification & Carrier Assigned</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Load / Ref Number *</label>
                <input
                  type="text"
                  required
                  value={formData.loadNumber}
                  onChange={(e) => handleChange('loadNumber', e.target.value)}
                  className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Trailer Equipment Type *</label>
                <select
                  value={formData.equipmentType}
                  onChange={(e) => handleChange('equipmentType', e.target.value as EquipmentType)}
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
                <label className="block text-slate-400 mb-1">Carrier Company Name *</label>
                <input
                  type="text"
                  required
                  value={formData.carrierName}
                  onChange={(e) => handleChange('carrierName', e.target.value)}
                  className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-white font-sans font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Carrier MC Number *</label>
                <input
                  type="text"
                  required
                  value={formData.mcNumber}
                  onChange={(e) => handleChange('mcNumber', e.target.value)}
                  className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-sky-300 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Carrier / Driver Phone</label>
                <input
                  type="text"
                  value={formData.carrierPhone || formData.driverPhone || ''}
                  onChange={(e) => {
                    handleChange('carrierPhone', e.target.value);
                    handleChange('driverPhone', e.target.value);
                  }}
                  className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-emerald-400 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Driver Name</label>
                <input
                  type="text"
                  value={formData.driverName || ''}
                  onChange={(e) => handleChange('driverName', e.target.value)}
                  placeholder="e.g. Marcus Vance"
                  className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-white font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Assigned Dispatcher</label>
                <input
                  type="text"
                  value={formData.dispatcherName || 'David Cross'}
                  onChange={(e) => handleChange('dispatcherName', e.target.value)}
                  className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-white"
                />
              </div>
            </div>
          </div>

          {/* 2. Pickup & Delivery Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-2 pb-1.5 border-b border-blue-900/30">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>2. Pickup & Delivery Schedules & Addresses</span>
            </h4>

            {/* Pickup */}
            <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-900/40 space-y-2">
              <span className="text-[11px] font-bold text-sky-400 uppercase block">PICKUP (ORIGIN)</span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Pickup Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.pickupDate}
                    onChange={(e) => handleChange('pickupDate', e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#05080F] border border-blue-900/60 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Pickup Time / Window</label>
                  <input
                    type="text"
                    value={formData.puTime || '08:00 CST'}
                    onChange={(e) => handleChange('puTime', e.target.value)}
                    placeholder="e.g. 08:00 - 11:00 AM"
                    className="w-full px-3 py-1.5 bg-[#05080F] border border-blue-900/60 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Origin City *</label>
                  <input
                    type="text"
                    required
                    value={formData.originCity}
                    onChange={(e) => handleChange('originCity', e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#05080F] border border-blue-900/60 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Origin State *</label>
                  <input
                    type="text"
                    required
                    value={formData.originState}
                    onChange={(e) => handleChange('originState', e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#05080F] border border-blue-900/60 rounded-lg text-white uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Full Pickup Facility & Street Address</label>
                <input
                  type="text"
                  value={formData.puAddress || ''}
                  onChange={(e) => handleChange('puAddress', e.target.value)}
                  placeholder="e.g. 4800 Logistics Way, Dallas, TX 75241"
                  className="w-full px-3 py-1.5 bg-[#05080F] border border-blue-900/60 rounded-lg text-white"
                />
              </div>
            </div>

            {/* Delivery */}
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-2">
              <span className="text-[11px] font-bold text-emerald-400 uppercase block">DELIVERY (DESTINATION)</span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Delivery Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.deliveryDate}
                    onChange={(e) => handleChange('deliveryDate', e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#05080F] border border-blue-900/60 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Delivery Time / Window</label>
                  <input
                    type="text"
                    value={formData.delTime || '14:00 EST'}
                    onChange={(e) => handleChange('delTime', e.target.value)}
                    placeholder="e.g. 13:00 - 16:00 EST"
                    className="w-full px-3 py-1.5 bg-[#05080F] border border-blue-900/60 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Destination City *</label>
                  <input
                    type="text"
                    required
                    value={formData.destinationCity}
                    onChange={(e) => handleChange('destinationCity', e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#05080F] border border-blue-900/60 rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Destination State *</label>
                  <input
                    type="text"
                    required
                    value={formData.destinationState}
                    onChange={(e) => handleChange('destinationState', e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#05080F] border border-blue-900/60 rounded-lg text-white uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Full Delivery Facility & Street Address</label>
                <input
                  type="text"
                  value={formData.delAddress || ''}
                  onChange={(e) => handleChange('delAddress', e.target.value)}
                  placeholder="e.g. 2150 Distribution Pkwy, Atlanta, GA 30303"
                  className="w-full px-3 py-1.5 bg-[#05080F] border border-blue-900/60 rounded-lg text-white"
                />
              </div>
            </div>
          </div>

          {/* 3. Broker Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-2 pb-1.5 border-b border-blue-900/30">
              <Building2 className="w-4 h-4 text-purple-400" />
              <span>3. Brokerage & Freight Contracting Party</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Broker Company Name *</label>
                <input
                  type="text"
                  required
                  value={formData.brokerName}
                  onChange={(e) => handleChange('brokerName', e.target.value)}
                  className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Broker MC Number</label>
                <input
                  type="text"
                  value={formData.brokerageMc || ''}
                  onChange={(e) => handleChange('brokerageMc', e.target.value)}
                  placeholder="e.g. MC-458921"
                  className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-sky-300 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Broker Contact Phone</label>
                <input
                  type="text"
                  value={formData.brokerPhone}
                  onChange={(e) => handleChange('brokerPhone', e.target.value)}
                  className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Broker Email Address</label>
                <input
                  type="email"
                  value={formData.brokerageEmail || ''}
                  onChange={(e) => handleChange('brokerageEmail', e.target.value)}
                  placeholder="dispatch@brokerage.com"
                  className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-white"
                />
              </div>
            </div>
          </div>

          {/* 4. Financials & Commission */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-2 pb-1.5 border-b border-blue-900/30">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>4. Dispatched Gross Rate & Commission Fee</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Dispatched Linehaul Gross ($) *</label>
                <input
                  type="number"
                  required
                  value={formData.rate}
                  onChange={(e) => handleChange('rate', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-emerald-400 font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Loaded Miles</label>
                <input
                  type="number"
                  value={formData.loadedMiles}
                  onChange={(e) => handleChange('loadedMiles', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Commission Fee (%)</label>
                <select
                  value={formData.dispatchFeePercent}
                  onChange={(e) => handleChange('dispatchFeePercent', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-sky-300 font-bold"
                >
                  <option value={5}>5%</option>
                  <option value={6}>6%</option>
                  <option value={7}>7%</option>
                  <option value={8}>8%</option>
                  <option value={10}>10%</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Due Commission ($)</label>
                <input
                  type="text"
                  readOnly
                  value={`$${formData.dispatchFeeAmount.toFixed(2)}`}
                  className="w-full px-3 py-2 bg-black/40 border border-slate-800 rounded-lg text-emerald-300 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Calculated RPM</label>
                <input
                  type="text"
                  readOnly
                  value={`$${formData.rpm.toFixed(2)} / mi`}
                  className="w-full px-3 py-2 bg-black/40 border border-slate-800 rounded-lg text-sky-300 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Load Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value as LoadStatus)}
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
                  value={formData.invoiceStatus || 'Not Invoiced'}
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
          </div>

          {/* 5. Cargo Specs & Attached Documents */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-2 pb-1.5 border-b border-blue-900/30">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>5. Cargo Details & Attached Documents (RC, BOL, POD)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Commodity Description</label>
                <input
                  type="text"
                  value={formData.commodity || ''}
                  onChange={(e) => handleChange('commodity', e.target.value)}
                  placeholder="e.g. Palletized Consumer Goods"
                  className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Weight (lbs)</label>
                <input
                  type="number"
                  value={formData.weightLbs || 42000}
                  onChange={(e) => handleChange('weightLbs', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Seal Number</label>
                <input
                  type="text"
                  value={formData.sealNumber || ''}
                  onChange={(e) => handleChange('sealNumber', e.target.value)}
                  placeholder="e.g. SL-882194"
                  className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Special Dispatch Notes / Detention Terms</label>
              <textarea
                rows={2}
                value={formData.notes || ''}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="e.g. $75/hr after 2 hours. Driver must call on arrival. Clean dry trailer."
                className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-white"
              />
            </div>

            {/* Document Attachments Manager */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-300">
                  Attached Documents (RC, BOL, POD, Scale, Lumper):
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingDoc(true)}
                  className="px-2.5 py-1 rounded-lg bg-sky-600/30 hover:bg-sky-600/50 border border-sky-400/50 text-sky-200 text-[11px] font-mono flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Attach Document</span>
                </button>
              </div>

              {isAddingDoc && (
                <div className="p-3 rounded-xl bg-blue-950/40 border border-sky-400/40 space-y-3 mb-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 mb-1">Document Name / File</label>
                      <input
                        type="text"
                        value={newDocName}
                        onChange={(e) => setNewDocName(e.target.value)}
                        placeholder="e.g. Stamped_POD_Receiving.pdf"
                        className="w-full px-3 py-1.5 bg-black/60 border border-blue-900/60 rounded-lg text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">Document Type</label>
                      <select
                        value={newDocType}
                        onChange={(e) => setNewDocType(e.target.value as any)}
                        className="w-full px-3 py-1.5 bg-black/60 border border-blue-900/60 rounded-lg text-white font-bold"
                      >
                        <option value="RC">Rate Confirmation (RC)</option>
                        <option value="BOL">Bill of Lading (BOL)</option>
                        <option value="POD">Proof of Delivery (POD)</option>
                        <option value="Lumper">Lumper Receipt</option>
                        <option value="Scale Ticket">Scale Ticket (Certified Weight)</option>
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
                      onClick={handleAddDoc}
                      className="px-4 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                    >
                      Add Document
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {/* Standard RC */}
                <div className="p-2.5 rounded-lg bg-[#05080F] border border-blue-900/40 flex items-center justify-between">
                  <div className="truncate">
                    <span className="font-bold text-white block text-xs truncate">Rate Confirmation</span>
                    <span className="text-[10px] text-sky-400 font-mono">RC-INF-{formData.loadNumber}</span>
                  </div>
                  {onOpenDocViewer && (
                    <button
                      type="button"
                      onClick={() =>
                        onOpenDocViewer(
                          `Rate Confirmation #${formData.loadNumber}`,
                          'Rate Confirmation',
                          `RC_${formData.loadNumber}.pdf`,
                          formData.rcDocumentContent
                        )
                      }
                      className="p-1 rounded text-slate-400 hover:text-white"
                      title="View Document"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Standard BOL */}
                <div className="p-2.5 rounded-lg bg-[#05080F] border border-blue-900/40 flex items-center justify-between">
                  <div className="truncate">
                    <span className="font-bold text-white block text-xs truncate">Bill of Lading (BOL)</span>
                    <span className="text-[10px] text-emerald-400 font-mono">BOL-INF-{formData.loadNumber}</span>
                  </div>
                  {onOpenDocViewer && (
                    <button
                      type="button"
                      onClick={() =>
                        onOpenDocViewer(
                          `Bill of Lading #${formData.loadNumber}`,
                          'Bill of Lading',
                          `BOL_${formData.loadNumber}.pdf`,
                          formData.bolDocumentContent
                        )
                      }
                      className="p-1 rounded text-slate-400 hover:text-white"
                      title="View Document"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Extra custom docs */}
                {(formData.loadDocuments || []).map((doc) => (
                  <div
                    key={doc.id}
                    className="p-2.5 rounded-lg bg-[#05080F] border border-blue-900/40 flex items-center justify-between gap-1"
                  >
                    <div className="truncate">
                      <span className="font-bold text-white block text-xs truncate">{doc.name}</span>
                      <span className="text-[10px] text-amber-400 font-mono">{doc.type} · {doc.uploadedAt}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteDoc(doc.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-blue-900/50 flex flex-wrap items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400">
              Dispatched Amount: <strong className="text-emerald-400 font-bold">${formData.rate.toLocaleString()}</strong>
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
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-sky-500 hover:from-emerald-500 hover:to-sky-400 text-white font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save All Load Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
