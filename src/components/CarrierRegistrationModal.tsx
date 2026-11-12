import React, { useState } from 'react';
import { EquipmentType } from '../types';
import { storage } from '../services/storage';
import {
  X,
  Truck,
  CheckCircle,
  Upload,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  FileText,
  AlertCircle,
} from 'lucide-react';

interface CarrierRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEquipment?: EquipmentType;
  initialRPM?: number;
}

export const CarrierRegistrationModal: React.FC<CarrierRegistrationModalProps> = ({
  isOpen,
  onClose,
  initialEquipment = 'Dry Van',
  initialRPM = 2.85,
}) => {
  const [step, setStep] = useState<number>(1);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    mcNumber: '',
    dotNumber: '',
    equipmentType: initialEquipment,
    truckCount: 1,
    currentZip: '',
    preferredLanes: '',
    preferredRPM: initialRPM,
    maxDeadhead: 50,
    availableDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    insuranceStatus: '$1,000,000 Auto Liability / $100,000 Cargo',
    additionalRequirements: '',
  });

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = 'Contact name is required';
    if (!formData.companyName.trim()) errs.companyName = 'Company name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email required';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    if (!formData.mcNumber.trim()) errs.mcNumber = 'MC number is required';
    if (!formData.dotNumber.trim()) errs.dotNumber = 'USDOT number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!formData.currentZip.trim()) errs.currentZip = 'Current ZIP code required';
    if (!formData.preferredLanes.trim()) errs.preferredLanes = 'Please state preferred states or lanes';
    if (formData.preferredRPM <= 0) errs.preferredRPM = 'Please specify target RPM';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
    else if (step === 3) setStep(4);
  };

  const handleSimulateUpload = (fileName: string) => {
    if (!uploadedFiles.includes(fileName)) {
      setUploadedFiles([...uploadedFiles, fileName]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = storage.submitApplication({
      fullName: formData.fullName,
      companyName: formData.companyName,
      email: formData.email,
      phone: formData.phone,
      mcNumber: formData.mcNumber.toUpperCase().startsWith('MC') ? formData.mcNumber : `MC-${formData.mcNumber}`,
      dotNumber: formData.dotNumber.toUpperCase().startsWith('USDOT') ? formData.dotNumber : `USDOT ${formData.dotNumber}`,
      equipmentType: formData.equipmentType,
      truckCount: Number(formData.truckCount),
      currentZip: formData.currentZip,
      preferredLanes: formData.preferredLanes,
      preferredRPM: Number(formData.preferredRPM),
      maxDeadhead: Number(formData.maxDeadhead),
      availableDate: formData.availableDate,
      insuranceStatus: formData.insuranceStatus,
      additionalRequirements: formData.additionalRequirements,
      vinNumber: 'TBD-VIN',
      driversLicense: 'Verified on file',
      assignedOwner: 'David Cross',
      uploadedFiles: uploadedFiles.length > 0 ? uploadedFiles : ['W9_Standard.pdf', 'COI_Proof.pdf'],
      documents: {
        w9: true,
        coi: true,
        mcAuthority: true,
        driversLicense: true,
        noaOrVoidedCheck: true,
      },
    });

    setSubmittedId(result.id);
  };

  const equipmentOptions: EquipmentType[] = [
    'Dry Van',
    'Reefer',
    'Flatbed',
    'Step Deck',
    'Power Only',
    'Hotshot',
    'Box Truck',
    'Sprinter Van',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#0B1222] border border-blue-500/40 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-[#080E1C] border-b border-blue-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-sky-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Carrier Registration</h3>
              <p className="text-xs text-slate-400">
                Infinity Dispatch LLC Onboarding Portal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close registration"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator (if not completed) */}
        {!submittedId && (
          <div className="px-6 py-3 bg-[#0A0F1F] border-b border-blue-900/30 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>1</span>
              <span className={step >= 1 ? 'text-white font-medium' : 'text-slate-400'}>Authority</span>
            </div>
            <div className="w-6 h-px bg-slate-800" />
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>2</span>
              <span className={step >= 2 ? 'text-white font-medium' : 'text-slate-400'}>Equipment & Lanes</span>
            </div>
            <div className="w-6 h-px bg-slate-800" />
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>3</span>
              <span className={step >= 3 ? 'text-white font-medium' : 'text-slate-400'}>Documents</span>
            </div>
            <div className="w-6 h-px bg-slate-800" />
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${step >= 4 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>4</span>
              <span className={step >= 4 ? 'text-white font-medium' : 'text-slate-400'}>Confirm</span>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {submittedId ? (
            /* Successful Submission View */
            <div className="py-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest">
                  Application Logged Successfully
                </span>
                <h3 className="text-2xl font-bold text-white">
                  Welcome to Infinity Dispatch LLC
                </h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Your application (<span className="font-mono text-sky-400">{submittedId}</span>) has been saved in our dispatch database.
                  Owners <strong className="text-white">David Cross</strong> and <strong className="text-white">Alvin</strong> have been alerted to review your carrier profile.
                </p>
              </div>

              {/* Application Summary Box */}
              <div className="p-5 rounded-2xl bg-[#080E1C] border border-blue-900/40 text-left max-w-lg mx-auto text-xs space-y-2.5 font-mono">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Carrier Company:</span>
                  <span className="text-white font-semibold">{formData.companyName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">MC / USDOT:</span>
                  <span className="text-sky-300">{formData.mcNumber} · {formData.dotNumber}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Equipment Type:</span>
                  <span className="text-white">{formData.equipmentType} ({formData.truckCount} Truck)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target RPM:</span>
                  <span className="text-emerald-400 font-bold">${formData.preferredRPM.toFixed(2)} / mi</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setSubmittedId(null);
                    setStep(1);
                    onClose();
                  }}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all cursor-pointer"
                >
                  Return to Website
                </button>
                <a
                  href="tel:+14095096940"
                  className="px-5 py-2.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:text-white border border-slate-700 rounded-xl"
                >
                  Call Dispatch Desk (+1 409-509-6940)
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Step 1: Authority & Contact */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Full Name / Contact Person *
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. John Miller"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                      {errors.fullName && <p className="text-[11px] text-rose-400 mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Carrier Company Legal Name *
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="e.g. Miller Express Hauling LLC"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                      {errors.companyName && <p className="text-[11px] text-rose-400 mt-1">{errors.companyName}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="dispatch@millerexpress.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                      {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Direct Phone / Cell Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(409) 555-0199"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                      {errors.phone && <p className="text-[11px] text-rose-400 mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        MC Number *
                      </label>
                      <input
                        type="text"
                        value={formData.mcNumber}
                        onChange={(e) => setFormData({ ...formData, mcNumber: e.target.value })}
                        placeholder="MC-1234567"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                      />
                      {errors.mcNumber && <p className="text-[11px] text-rose-400 mt-1">{errors.mcNumber}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        USDOT Number *
                      </label>
                      <input
                        type="text"
                        value={formData.dotNumber}
                        onChange={(e) => setFormData({ ...formData, dotNumber: e.target.value })}
                        placeholder="3891024"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                      />
                      {errors.dotNumber && <p className="text-[11px] text-rose-400 mt-1">{errors.dotNumber}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Number of Active Trucks
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={formData.truckCount}
                        onChange={(e) => setFormData({ ...formData, truckCount: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Equipment & Route Preferences */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Primary Equipment Type *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {equipmentOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setFormData({ ...formData, equipmentType: opt })}
                          className={`p-2.5 text-xs font-medium rounded-xl border text-center transition-all cursor-pointer ${
                            formData.equipmentType === opt
                              ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Current Truck Location (ZIP Code) *
                      </label>
                      <input
                        type="text"
                        value={formData.currentZip}
                        onChange={(e) => setFormData({ ...formData, currentZip: e.target.value })}
                        placeholder="e.g. 75201 (Dallas, TX)"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                      />
                      {errors.currentZip && <p className="text-[11px] text-rose-400 mt-1">{errors.currentZip}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Available Date for First Load
                      </label>
                      <input
                        type="date"
                        value={formData.availableDate}
                        onChange={(e) => setFormData({ ...formData, availableDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Preferred States / Running Lanes *
                    </label>
                    <input
                      type="text"
                      value={formData.preferredLanes}
                      onChange={(e) => setFormData({ ...formData, preferredLanes: e.target.value })}
                      placeholder="e.g. Texas Triangle, TX to Midwest, Southeast to East Coast, No NYC"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                    {errors.preferredLanes && <p className="text-[11px] text-rose-400 mt-1">{errors.preferredLanes}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Minimum Desired Rate Per Mile ($ / mi)
                      </label>
                      <input
                        type="number"
                        step="0.05"
                        min="1.50"
                        max="5.00"
                        value={formData.preferredRPM}
                        onChange={(e) => setFormData({ ...formData, preferredRPM: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Maximum Acceptable Deadhead (Miles)
                      </label>
                      <input
                        type="number"
                        min="10"
                        max="150"
                        value={formData.maxDeadhead}
                        onChange={(e) => setFormData({ ...formData, maxDeadhead: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Insurance & Documents */}
              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Current Insurance Coverage Status *
                    </label>
                    <select
                      value={formData.insuranceStatus}
                      onChange={(e) => setFormData({ ...formData, insuranceStatus: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="$1,000,000 Auto Liability / $100,000 Cargo">
                        $1,000,000 Auto Liability / $100,000 Cargo (Industry Standard)
                      </option>
                      <option value="$1,000,000 Auto Liability / $250,000 Cargo">
                        $1,000,000 Auto Liability / $250,000 Cargo (Reefer / High Value)
                      </option>
                      <option value="$750,000 Auto Liability / $100,000 Cargo">
                        $750,000 Auto Liability / $100,000 Cargo (Hotshot / Expedited)
                      </option>
                      <option value="Policy in Renewal / Pending Certification">
                        Policy in Renewal / Pending Certification
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      Upload Required Carrier Documents
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { label: 'W-9 Form (Signed)', file: 'W9_Signed.pdf' },
                        { label: 'Certificate of Insurance', file: 'COI_Certificate.pdf' },
                        { label: 'MC Authority Letter', file: 'MC_Authority.pdf' },
                      ].map((item) => {
                        const isUploaded = uploadedFiles.includes(item.file);
                        return (
                          <div
                            key={item.label}
                            onClick={() => handleSimulateUpload(item.file)}
                            className={`p-3.5 rounded-xl border text-center cursor-pointer transition-all ${
                              isUploaded
                                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                                : 'bg-slate-900 border-slate-800 hover:border-blue-500/50 text-slate-300'
                            }`}
                          >
                            <Upload className="w-5 h-5 mx-auto mb-1.5 opacity-80" />
                            <div className="text-xs font-semibold">{item.label}</div>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {isUploaded ? '✓ Attached' : 'Click to attach'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-2">
                      Documents can also be emailed directly to Davidcross.vl1@gmail.com and alvin.vast@gmail.com after submission.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Additional Requirements or Factoring Notes
                    </label>
                    <textarea
                      rows={3}
                      value={formData.additionalRequirements}
                      onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
                      placeholder="e.g. We factor with OTR Capital; need home every second weekend; prefer direct freight."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Final Review & Submit */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-800/40 text-xs text-sky-200">
                    <span className="font-bold">Final Review:</span> Please confirm your company information.
                    Upon clicking Submit, your profile will be securely registered in our system and both owners
                    will be notified to review and start sourcing freight.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Carrier Legal Name:</span>
                      <span className="text-white font-bold">{formData.companyName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Contact Person:</span>
                      <span className="text-white font-bold">{formData.fullName} ({formData.phone})</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Authority:</span>
                      <span className="text-sky-300">{formData.mcNumber} / {formData.dotNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Equipment & Capacity:</span>
                      <span className="text-white">{formData.equipmentType} ({formData.truckCount} Trucks)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Target RPM:</span>
                      <span className="text-emerald-400 font-bold">${formData.preferredRPM.toFixed(2)} / mi</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Lanes:</span>
                      <span className="text-slate-300">{formData.preferredLanes}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>No long-term lock-in contract. Cancel anytime with written notice.</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
                      <span>Zero forced dispatch. You have final approval on every rate con.</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="pt-6 border-t border-blue-900/40 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>Continue to Step {step + 1}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-7 py-3 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 rounded-xl shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Submit Official Registration</span>
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
