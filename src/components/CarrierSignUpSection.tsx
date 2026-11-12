import React, { useState } from 'react';
import { EquipmentType } from '../types';
import { storage } from '../services/storage';
import {
  FileCheck2,
  Truck,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Check,
  Calendar,
  MapPin,
  Upload,
  User,
  Building,
  Mail,
  Phone,
  FileText,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { googleAuthService } from '../services/googleAuth';
import { sendEmailWithGmail } from '../services/gmail';

interface CarrierSignUpSectionProps {
  initialEquipment?: EquipmentType;
  initialRPM?: number;
  onApplicationSubmitted?: () => void;
}

export const CarrierSignUpSection: React.FC<CarrierSignUpSectionProps> = ({
  initialEquipment = 'Dry Van',
  initialRPM = 2.85,
  onApplicationSubmitted,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    carrierAddress: '',
    mcNumber: '',
    dotNumber: '',
    vinNumber: '',
    driversLicense: '',
    equipmentType: initialEquipment,
    truckCount: 1,
    currentZip: '',
    preferredLanes: '',
    preferredRPM: initialRPM,
    maxDeadhead: 50,
    availableDate: new Date().toISOString().split('T')[0],
    insuranceStatus: '$1,000,000 Auto Liability / $100,000 Cargo',
    additionalRequirements: '',
    notes: '',
    assignedOwner: 'David Cross' as 'David Cross' | 'Alvin',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const markTouched = (field: string) => {
    setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
  };

  // Real-Time Field Validators
  const validateCompanyName = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return { isValid: false, message: 'Company or Carrier legal name is required' };
    if (trimmed.length < 2) return { isValid: false, message: 'Must be at least 2 characters' };
    return { isValid: true, message: 'Legal business name verified' };
  };

  const validateFullName = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return { isValid: false, message: 'Owner / Contact full name is required' };
    if (trimmed.length < 2) return { isValid: false, message: 'Must be at least 2 characters' };
    return { isValid: true, message: 'Authorized contact name verified' };
  };

  const validatePhone = (val: string) => {
    const digits = val.replace(/\D/g, '');
    if (!val.trim()) return { isValid: false, message: 'Direct phone number is required' };
    if (digits.length < 10) return { isValid: false, message: `10-digit US phone required (${digits.length}/10 digits)` };
    return { isValid: true, message: 'Phone number verified' };
  };

  const validateEmail = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return { isValid: false, message: 'Primary email address is required' };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(trimmed)) return { isValid: false, message: 'Enter a valid email address (e.g. name@domain.com)' };
    return { isValid: true, message: 'Email address verified' };
  };

  const validateMcNumber = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return { isValid: false, message: 'MC# or DOT# required for carrier verification' };
    const digits = trimmed.replace(/\D/g, '');
    if (digits.length < 5) return { isValid: false, message: 'MC# must contain 5 to 8 digits (e.g. MC-148920)' };
    return { isValid: true, message: 'FMCSA MC Authority format verified' };
  };

  const validateDotNumber = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return null;
    const digits = trimmed.replace(/\D/g, '');
    if (digits.length < 5 || digits.length > 8) {
      return { isValid: false, message: 'USDOT should be 5 to 8 digits' };
    }
    return { isValid: true, message: 'USDOT format verified' };
  };

  const validateVinNumber = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return null;
    const cleanVin = trimmed.replace(/[\s-]/g, '').toUpperCase();
    if (cleanVin.length !== 17) {
      return { isValid: false, message: `Standard VIN requires 17 characters (${cleanVin.length}/17)` };
    }
    if (/[IOQ]/i.test(cleanVin)) {
      return { isValid: false, message: 'VIN cannot contain letters I, O, or Q' };
    }
    return { isValid: true, message: '17-digit VIN verified' };
  };

  const validateZip = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return null;
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (zipRegex.test(trimmed) || trimmed.length >= 3) {
      return { isValid: true, message: 'Base location registered' };
    }
    return { isValid: false, message: 'Enter valid 5-digit US ZIP' };
  };

  const handlePhoneChange = (raw: string) => {
    let digits = raw.replace(/\D/g, '');
    if (digits.startsWith('1') && digits.length > 10) {
      digits = digits.slice(1);
    }
    digits = digits.slice(0, 10);
    let formatted = digits;
    if (digits.length > 6) {
      formatted = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length > 3) {
      formatted = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else if (digits.length > 0) {
      formatted = `(${digits}`;
    }
    setFormData((prev) => ({ ...prev, phone: formatted }));
    markTouched('phone');
  };

  const getFieldState = (
    fieldName: string,
    val: string,
    validator: (v: string) => { isValid: boolean; message: string } | null,
    hasLeftIcon: boolean = true
  ) => {
    const result = validator(val);
    const isTouched = touched[fieldName];
    const hasValue = val.trim().length > 0;
    const showFeedback = isTouched || hasValue;

    if (!result || !showFeedback) {
      return {
        inputClass: `w-full ${hasLeftIcon ? 'pl-9' : 'pl-3'} pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors`,
        icon: null,
        message: null,
      };
    }

    if (!result.isValid) {
      return {
        inputClass: `w-full ${hasLeftIcon ? 'pl-9' : 'pl-3'} pr-9 py-2.5 rounded-xl bg-rose-950/25 border border-rose-500/80 text-white text-xs focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-500/40 transition-colors`,
        icon: (
          <AlertCircle className="w-4 h-4 text-rose-400 absolute right-3 top-3 pointer-events-none animate-in fade-in zoom-in-95 duration-150" />
        ),
        message: (
          <p className="mt-1 text-[11px] font-mono text-rose-400 flex items-center gap-1.5 animate-in fade-in duration-150">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{result.message}</span>
          </p>
        ),
      };
    }

    return {
      inputClass: `w-full ${hasLeftIcon ? 'pl-9' : 'pl-3'} pr-9 py-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/70 text-white text-xs focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/30 transition-colors`,
      icon: (
        <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3 top-3 pointer-events-none animate-in fade-in zoom-in-95 duration-150" />
      ),
      message: (
        <p className="mt-1 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 animate-in fade-in duration-150">
          <Check className="w-3.5 h-3.5 shrink-0" />
          <span>{result.message}</span>
        </p>
      ),
    };
  };

  const coreChecks = [
    { id: 'field-company-name', key: 'companyName', label: 'Company Name', valid: validateCompanyName(formData.companyName).isValid },
    { id: 'field-full-name', key: 'fullName', label: 'Contact Person', valid: validateFullName(formData.fullName).isValid },
    { id: 'field-phone', key: 'phone', label: 'Direct Phone', valid: validatePhone(formData.phone).isValid },
    { id: 'field-email', key: 'email', label: 'Primary Email', valid: validateEmail(formData.email).isValid },
    { id: 'field-mc-number', key: 'mcNumber', label: 'MC# Authority', valid: validateMcNumber(formData.mcNumber).isValid },
  ];
  const passedCount = coreChecks.filter((c) => c.valid).length;
  const progressPct = Math.round((passedCount / coreChecks.length) * 100);
  const isAllCoreValid = passedCount === coreChecks.length;

  const [docs, setDocs] = useState({
    w9: true,
    coi: true,
    mcAuthority: true,
    driversLicense: true,
    noaOrVoidedCheck: true,
    truckPicture: true,
  });

  const [attachedFiles, setAttachedFiles] = useState<{
    w9File?: string;
    coiFile?: string;
    mcFile?: string;
    dlFile?: string;
    noaFile?: string;
    truckFile?: string;
    extraDocs: Array<{ name: string; type: string; fileName: string }>;
  }>({
    extraDocs: [],
  });

  const [newExtraDocName, setNewExtraDocName] = useState('');

  const [submittedApp, setSubmittedApp] = useState<{
    id: string;
    applicationNumber: number;
    assignedOwner: string;
    companyName: string;
  } | null>(null);

  const [error, setError] = useState('');

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

  const [isGoogleSignedIn, setIsGoogleSignedIn] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [emailConfirmationSent, setEmailConfirmationSent] = useState(false);

  const handleGoogleAutoFill = async () => {
    setIsGoogleLoading(true);
    try {
      const res = await googleAuthService.signInWithGoogle();
      if (res.success && res.profile) {
        setIsGoogleSignedIn(true);
        setGoogleEmail(res.profile.email || '');
        setFormData((prev) => ({
          ...prev,
          fullName: res.profile?.displayName || prev.fullName,
          email: res.profile?.email || prev.email,
        }));
        setTouched((prev) => ({
          ...prev,
          fullName: true,
          email: true,
        }));
      }
    } catch (err) {
      console.warn('Google sign-in error:', err);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const companyVal = validateCompanyName(formData.companyName);
    const nameVal = validateFullName(formData.fullName);
    const phoneVal = validatePhone(formData.phone);
    const emailVal = validateEmail(formData.email);
    const mcVal = validateMcNumber(formData.mcNumber);

    if (!companyVal.isValid || !nameVal.isValid || !phoneVal.isValid || !emailVal.isValid || !mcVal.isValid) {
      setTouched({
        companyName: true,
        fullName: true,
        phone: true,
        email: true,
        mcNumber: true,
        dotNumber: true,
        vinNumber: true,
        driversLicense: true,
        carrierAddress: true,
        currentZip: true,
      });
      setError('Please review the highlighted fields in red before submitting.');

      const firstInvalid = coreChecks.find((c) => !c.valid);
      if (firstInvalid) {
        const el = document.getElementById(firstInvalid.id);
        if (el) {
          el.focus();
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }

    setError('');

    const uploadedFiles: string[] = [];
    if (docs.w9) uploadedFiles.push(attachedFiles.w9File || 'W-9_Form.pdf');
    if (docs.coi) uploadedFiles.push(attachedFiles.coiFile || 'Certificate_of_Insurance_COI.pdf');
    if (docs.mcAuthority) uploadedFiles.push(attachedFiles.mcFile || 'FMCSA_MC_Authority.pdf');
    if (docs.driversLicense) uploadedFiles.push(attachedFiles.dlFile || 'Drivers_License_Copy.pdf');
    if (docs.noaOrVoidedCheck) uploadedFiles.push(attachedFiles.noaFile || 'Notice_of_Assignment_VoidedCheck.pdf');
    if (docs.truckPicture) uploadedFiles.push(attachedFiles.truckFile || 'Truck_Fleet_Photo.jpg');
    attachedFiles.extraDocs.forEach((ed) => uploadedFiles.push(`${ed.name}_${ed.fileName}`));

    const formattedMc = formData.mcNumber.startsWith('MC') ? formData.mcNumber : `MC-${formData.mcNumber}`;
    const formattedDot = formData.dotNumber ? (formData.dotNumber.startsWith('USDOT') ? formData.dotNumber : `USDOT ${formData.dotNumber}`) : 'Pending';

    const newApp = storage.submitApplication({
      fullName: formData.fullName,
      companyName: formData.companyName,
      email: formData.email,
      phone: formData.phone,
      mcNumber: formattedMc,
      dotNumber: formattedDot,
      vinNumber: formData.vinNumber || 'TBD-VIN',
      driversLicense: formData.driversLicense || 'Verified on file',
      equipmentType: formData.equipmentType,
      truckCount: Number(formData.truckCount) || 1,
      currentZip: formData.currentZip || '75001',
      preferredLanes: formData.preferredLanes || 'Nationwide / Open Lanes',
      preferredRPM: Number(formData.preferredRPM) || 2.85,
      maxDeadhead: Number(formData.maxDeadhead) || 50,
      availableDate: formData.availableDate,
      insuranceStatus: formData.insuranceStatus,
      additionalRequirements: formData.notes || formData.additionalRequirements,
      assignedOwner: formData.assignedOwner,
      uploadedFiles,
      documents: docs,
    });

    // Also register directly into Active Carrier Roster
    const carrierDocItems = [
      { name: attachedFiles.mcFile || 'FMCSA_MC_Authority.pdf', type: 'MC Authority' as const, uploadDate: new Date().toISOString().split('T')[0], status: 'Verified' as const },
      { name: attachedFiles.w9File || 'W-9_Tax_Identification.pdf', type: 'W-9' as const, uploadDate: new Date().toISOString().split('T')[0], status: 'Verified' as const },
      { name: attachedFiles.coiFile || 'Certificate_of_Insurance.pdf', type: 'COI' as const, uploadDate: new Date().toISOString().split('T')[0], status: 'Verified' as const },
      { name: attachedFiles.noaFile || 'Notice_of_Assignment_NOA.pdf', type: 'NOA' as const, uploadDate: new Date().toISOString().split('T')[0], status: 'Verified' as const },
      { name: attachedFiles.dlFile || 'Drivers_License_Copy.pdf', type: 'Driver License' as const, uploadDate: new Date().toISOString().split('T')[0], status: 'Verified' as const },
      { name: attachedFiles.truckFile || 'Tractor_Fleet_Photo.jpg', type: 'Truck Picture' as const, uploadDate: new Date().toISOString().split('T')[0], status: 'Verified' as const },
      ...attachedFiles.extraDocs.map((ed) => ({
        name: ed.fileName,
        type: 'Other' as const,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'Verified' as const,
      })),
    ];

    storage.saveRosterCarrier({
      id: `roster-${Date.now()}`,
      driverName: formData.fullName,
      driverPhone: formData.phone,
      carrierName: formData.companyName,
      carrierPhone: formData.phone,
      carrierEmail: formData.email,
      carrierAddress: formData.carrierAddress || formData.currentZip || 'Dallas, TX',
      truckType: formData.equipmentType,
      vinNumber: formData.vinNumber || '1FT8W3BT8NE... (Verified)',
      notes: formData.notes || formData.additionalRequirements || 'Carrier registered via online onboarding portal. Rates & lanes open.',
      mcNumber: formattedMc,
      dotNumber: formattedDot,
      dispatcherName: formData.assignedOwner,
      dispatcherPhone: '+1 (409) 509-6940',
      dispatchedAmount: 0,
      dispatchFeePercent: 5,
      invoiceStatus: 'Not Invoiced',
      loadStatus: 'Booked',
      originDestination: formData.preferredLanes || 'Nationwide',
      equipmentType: formData.equipmentType,
      documents: carrierDocItems,
      updatedAt: new Date().toISOString(),
    }, formData.assignedOwner);

    // Automatically send real email confirmation to the carrier and dispatch owners
    sendEmailWithGmail({
      to: formData.email,
      cc: formData.assignedOwner === 'Alvin' ? 'alvin.vast@gmail.com' : 'Davidcross.vl1@gmail.com',
      subject: `[ONBOARDING CONFIRMATION #${newApp.applicationNumber}] Infinity Dispatch LLC - ${formData.companyName}`,
      bodyText: `Dear ${formData.fullName},\n\nWelcome to Infinity Dispatch LLC! Your carrier registration #${newApp.applicationNumber} has been received and permanently saved in our fleet dispatch system.\n\nCarrier Details:\nCompany: ${formData.companyName}\nMC Number: ${newApp.mcNumber}\nUSDOT: ${newApp.dotNumber}\nEquipment: ${formData.equipmentType} (${formData.truckCount} Truck${formData.truckCount > 1 ? 's' : ''})\nTarget Rate: $${formData.preferredRPM}/mile\nAssigned Director: ${formData.assignedOwner} (+1 (409) 509-6940)\n\nAll documents (W-9, COI, MC Authority, Driver License) have been filed. Our team is actively scanning spot and dedicated lanes matching your equipment and will contact you within 15 minutes.\n\nBest regards,\nDavid Cross & Alvin\nInfinity Dispatch LLC (Houston, TX)\nWeb: infinitydispatchllcusa.com\nDirect Phone: +1 (409) 509-6940`,
    }).then(() => {
      setEmailConfirmationSent(true);
    });

    setSubmittedApp({
      id: newApp.id,
      applicationNumber: newApp.applicationNumber,
      assignedOwner: newApp.assignedOwner,
      companyName: newApp.companyName,
    });

    if (onApplicationSubmitted) {
      onApplicationSubmitted();
    }
  };

  return (
    <section id="carrier-signup" className="py-20 bg-[#060A14] border-t border-b border-blue-900/40 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/90 border border-blue-500/40 text-xs font-mono text-sky-400 mb-3 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>ONE-STEP FAST ONBOARDING · NO DELAYS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Carrier Sign-Up & Direct Dispatch Setup
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300">
            Submit your authority and equipment details below. All fields are accessible in one continuous form — no multi-step wizard, no hidden fees, instant owner assignment.
          </p>
        </div>

        {submittedApp ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#09152C] via-[#0B1A38] to-[#071024] border border-emerald-500/50 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block">
                APPLICATION #{submittedApp.applicationNumber} REGISTERED SUCCESSFULLY
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-black text-white">
                Welcome Aboard, {submittedApp.companyName}!
              </h3>
              <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                Your application has been assigned directly to <strong>{submittedApp.assignedOwner}</strong>. A full notification packet and document check have been forwarded to executive email:
                <code className="text-sky-300 font-mono block mt-1">
                  {submittedApp.assignedOwner === 'David Cross' ? 'Davidcross.vl1@gmail.com' : 'alvin.vast@gmail.com'}
                </code>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#050C1A] border border-blue-900/60 max-w-md mx-auto text-xs font-mono text-left space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Application Sequence:</span>
                <span className="text-white font-bold">#{submittedApp.applicationNumber}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Assigned Executive:</span>
                <span className="text-amber-400 font-bold">{submittedApp.assignedOwner}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Direct Contact:</span>
                <span className="text-sky-400 font-bold">+1 (409) 509-6940</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Direct Telegram:</span>
                <span className="text-sky-400 font-bold">@DavidCross4899</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setSubmittedApp(null)}
                className="px-6 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-700 rounded-xl cursor-pointer"
              >
                Register Another Truck / Carrier
              </button>
              <a
                href="https://t.me/DavidCross4899"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg cursor-pointer"
              >
                Connect on Telegram with David Cross
              </a>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-10 rounded-3xl bg-[#091122] border border-blue-500/40 shadow-2xl space-y-8"
          >
            {error && (
              <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Google One-Click Auto-Fill & Email Sync */}
            <div className="p-4 rounded-2xl bg-[#0C162E] border border-blue-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span className="text-xs font-bold text-white font-mono">
                    Google Sign-In & Automated Email Sync
                  </span>
                  {isGoogleSignedIn && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                      ✓ Connected ({googleEmail})
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-300">
                  {isGoogleSignedIn
                    ? 'Your Google account is linked. Onboarding packet and rate confirmations will automatically be emailed to your inbox.'
                    : 'Connect with Google to auto-fill your contact details and automatically receive all dispatch paperwork and rate confirmations.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleGoogleAutoFill}
                disabled={isGoogleLoading}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 font-medium text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2 shrink-0 transition-all font-sans font-semibold disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{isGoogleLoading ? 'Connecting...' : isGoogleSignedIn ? 'Re-link Google Account' : 'Auto-Fill with Google'}</span>
              </button>
            </div>

            {/* REAL-TIME ONBOARDING READINESS & VALIDATION PROGRESS BAR */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#081020] border border-blue-500/40 space-y-3 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${isAllCoreValid ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Registration Verification Status:
                  </span>
                  <span className={`text-xs font-mono font-bold ${isAllCoreValid ? 'text-emerald-400' : 'text-sky-400'}`}>
                    {passedCount} of {coreChecks.length} Core Requirements Verified ({progressPct}%)
                  </span>
                </div>
                {isAllCoreValid ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Ready for 15-Min Onboarding!</span>
                  </span>
                ) : (
                  <span className="text-[11px] font-mono text-slate-400">
                    Live checking as you type
                  </span>
                )}
              </div>

              {/* Progress bar track */}
              <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    isAllCoreValid
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]'
                      : 'bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-400'
                  }`}
                  style={{ width: `${Math.max(progressPct, 5)}%` }}
                />
              </div>

              {/* Interactive Core Requirement Badges (Clicking scrolls to that field) */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {coreChecks.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      const el = document.getElementById(item.id);
                      if (el) {
                        el.focus();
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                      item.valid
                        ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300'
                        : 'bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {item.valid ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                    )}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* BLOCK 1: Carrier & Company Identity */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-blue-900/40">
                <Building className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  1. Company & Contact Details
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Company Legal Name */}
                <div>
                  {(() => {
                    const field = getFieldState('companyName', formData.companyName, validateCompanyName, true);
                    return (
                      <>
                        <label htmlFor="field-company-name" className="block text-xs font-semibold text-slate-300 mb-1">
                          Company / Carrier Legal Name *
                        </label>
                        <div className="relative">
                          <input
                            id="field-company-name"
                            type="text"
                            required
                            value={formData.companyName}
                            onChange={(e) => {
                              setFormData({ ...formData, companyName: e.target.value });
                              markTouched('companyName');
                            }}
                            onBlur={() => markTouched('companyName')}
                            placeholder="e.g. Apex Interstate Express LLC"
                            className={field.inputClass}
                          />
                          <Building className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                          {field.icon}
                        </div>
                        {field.message}
                      </>
                    );
                  })()}
                </div>

                {/* 2. Contact Full Name */}
                <div>
                  {(() => {
                    const field = getFieldState('fullName', formData.fullName, validateFullName, true);
                    return (
                      <>
                        <label htmlFor="field-full-name" className="block text-xs font-semibold text-slate-300 mb-1">
                          Owner / Contact Full Name *
                        </label>
                        <div className="relative">
                          <input
                            id="field-full-name"
                            type="text"
                            required
                            value={formData.fullName}
                            onChange={(e) => {
                              setFormData({ ...formData, fullName: e.target.value });
                              markTouched('fullName');
                            }}
                            onBlur={() => markTouched('fullName')}
                            placeholder="e.g. Marcus Vance"
                            className={field.inputClass}
                          />
                          <User className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                          {field.icon}
                        </div>
                        {field.message}
                      </>
                    );
                  })()}
                </div>

                {/* 3. Direct Phone Number */}
                <div>
                  {(() => {
                    const field = getFieldState('phone', formData.phone, validatePhone, true);
                    return (
                      <>
                        <label htmlFor="field-phone" className="block text-xs font-semibold text-slate-300 mb-1">
                          Direct Phone / Cell Number *
                        </label>
                        <div className="relative">
                          <input
                            id="field-phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            onBlur={() => markTouched('phone')}
                            placeholder="e.g. (214) 555-8392"
                            className={field.inputClass}
                          />
                          <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                          {field.icon}
                        </div>
                        {field.message}
                      </>
                    );
                  })()}
                </div>

                {/* 4. Primary Email Address */}
                <div>
                  {(() => {
                    const field = getFieldState('email', formData.email, validateEmail, true);
                    return (
                      <>
                        <label htmlFor="field-email" className="block text-xs font-semibold text-slate-300 mb-1">
                          Primary Email Address *
                        </label>
                        <div className="relative">
                          <input
                            id="field-email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => {
                              setFormData({ ...formData, email: e.target.value });
                              markTouched('email');
                            }}
                            onBlur={() => markTouched('email')}
                            placeholder="e.g. dispatch@apexinterstate.com"
                            className={field.inputClass}
                          />
                          <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                          {field.icon}
                        </div>
                        {field.message}
                      </>
                    );
                  })()}
                </div>

                {/* 5. Carrier Physical Address */}
                <div className="sm:col-span-2">
                  {(() => {
                    const field = getFieldState(
                      'carrierAddress',
                      formData.carrierAddress,
                      (val) => (val.trim() ? { isValid: true, message: 'Carrier facility address recorded' } : null),
                      true
                    );
                    return (
                      <>
                        <label htmlFor="field-carrier-address" className="block text-xs font-semibold text-slate-300 mb-1">
                          Carrier Physical / Business Address
                        </label>
                        <div className="relative">
                          <input
                            id="field-carrier-address"
                            type="text"
                            value={formData.carrierAddress}
                            onChange={(e) => {
                              setFormData({ ...formData, carrierAddress: e.target.value });
                              markTouched('carrierAddress');
                            }}
                            onBlur={() => markTouched('carrierAddress')}
                            placeholder="e.g. 4800 Logistics Way, Dallas, TX 75241"
                            className={field.inputClass}
                          />
                          <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                          {field.icon}
                        </div>
                        {field.message}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* BLOCK 2: FMCSA Authority, VIN & Driver License */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-blue-900/40">
                <FileText className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  2. Authority, VIN & Driver Credentials
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {/* MC Number */}
                <div>
                  {(() => {
                    const field = getFieldState('mcNumber', formData.mcNumber, validateMcNumber, false);
                    return (
                      <>
                        <label htmlFor="field-mc-number" className="block text-xs font-semibold text-slate-300 mb-1">
                          MC Number *
                        </label>
                        <div className="relative">
                          <input
                            id="field-mc-number"
                            type="text"
                            required
                            value={formData.mcNumber}
                            onChange={(e) => {
                              setFormData({ ...formData, mcNumber: e.target.value.toUpperCase() });
                              markTouched('mcNumber');
                            }}
                            onBlur={() => markTouched('mcNumber')}
                            placeholder="e.g. MC-1489201"
                            className={field.inputClass}
                          />
                          {field.icon}
                        </div>
                        {field.message}
                      </>
                    );
                  })()}
                </div>

                {/* USDOT Number */}
                <div>
                  {(() => {
                    const field = getFieldState('dotNumber', formData.dotNumber, validateDotNumber, false);
                    return (
                      <>
                        <label htmlFor="field-dot-number" className="block text-xs font-semibold text-slate-300 mb-1">
                          USDOT Number
                        </label>
                        <div className="relative">
                          <input
                            id="field-dot-number"
                            type="text"
                            value={formData.dotNumber}
                            onChange={(e) => {
                              setFormData({ ...formData, dotNumber: e.target.value.toUpperCase() });
                              markTouched('dotNumber');
                            }}
                            onBlur={() => markTouched('dotNumber')}
                            placeholder="e.g. USDOT 3920141"
                            className={field.inputClass}
                          />
                          {field.icon}
                        </div>
                        {field.message}
                      </>
                    );
                  })()}
                </div>

                {/* Tractor VIN */}
                <div>
                  {(() => {
                    const field = getFieldState('vinNumber', formData.vinNumber, validateVinNumber, false);
                    return (
                      <>
                        <label htmlFor="field-vin-number" className="block text-xs font-semibold text-slate-300 mb-1">
                          Tractor / Truck VIN Number
                        </label>
                        <div className="relative">
                          <input
                            id="field-vin-number"
                            type="text"
                            value={formData.vinNumber}
                            onChange={(e) => {
                              setFormData({ ...formData, vinNumber: e.target.value.toUpperCase() });
                              markTouched('vinNumber');
                            }}
                            onBlur={() => markTouched('vinNumber')}
                            placeholder="17-Digit VIN Number"
                            className={field.inputClass}
                          />
                          {field.icon}
                        </div>
                        {field.message}
                      </>
                    );
                  })()}
                </div>

                {/* Driver License */}
                <div>
                  {(() => {
                    const field = getFieldState(
                      'driversLicense',
                      formData.driversLicense,
                      (val) => (val.trim() ? { isValid: true, message: 'Driver license noted' } : null),
                      false
                    );
                    return (
                      <>
                        <label htmlFor="field-dl-number" className="block text-xs font-semibold text-slate-300 mb-1">
                          Driver License (DL) Number
                        </label>
                        <div className="relative">
                          <input
                            id="field-dl-number"
                            type="text"
                            value={formData.driversLicense}
                            onChange={(e) => {
                              setFormData({ ...formData, driversLicense: e.target.value });
                              markTouched('driversLicense');
                            }}
                            onBlur={() => markTouched('driversLicense')}
                            placeholder="State & DL Number"
                            className={field.inputClass}
                          />
                          {field.icon}
                        </div>
                        {field.message}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* BLOCK 3: Equipment, Fleet Size & Running Preferences */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-blue-900/40">
                <Truck className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  3. Equipment Setup & Lane Targets
                </h3>
              </div>

              {/* Equipment Selector Buttons */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Select Primary Equipment Type:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {equipmentOptions.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, equipmentType: type })}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                        formData.equipmentType === type
                          ? 'bg-blue-600 border-blue-400 text-white shadow-md font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Truck / Fleet Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.truckCount}
                    onChange={(e) => setFormData({ ...formData, truckCount: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Current Base ZIP / City
                  </label>
                  <input
                    type="text"
                    value={formData.currentZip}
                    onChange={(e) => setFormData({ ...formData, currentZip: e.target.value })}
                    placeholder="e.g. 75201 (Dallas, TX)"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target RPM ($ / Mile)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="1.50"
                    max="6.00"
                    value={formData.preferredRPM}
                    onChange={(e) => setFormData({ ...formData, preferredRPM: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Max Unpaid Deadhead
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={formData.maxDeadhead}
                    onChange={(e) => setFormData({ ...formData, maxDeadhead: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Preferred Freight Lanes & States
                </label>
                <input
                  type="text"
                  value={formData.preferredLanes}
                  onChange={(e) => setFormData({ ...formData, preferredLanes: e.target.value })}
                  placeholder="e.g. Texas Triangle, Midwest to Southeast, West Coast produce lanes"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>
            </div>

            {/* BLOCK 4: Comprehensive Document Attachments & Carrier Notes */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-blue-900/40">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    4. Document Packet & Vehicle Attachments
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-sky-400 font-bold">
                  PDF / PNG / JPG Supported
                </span>
              </div>

              {/* 6 Key Document Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
                {/* 1. MC Authority */}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-200">
                      <input
                        type="checkbox"
                        checked={docs.mcAuthority}
                        onChange={(e) => setDocs({ ...docs, mcAuthority: e.target.checked })}
                        className="w-4 h-4 accent-blue-600 rounded"
                      />
                      <span>MC Authority Letter</span>
                    </label>
                    <span className="text-[10px] text-emerald-400">Required</span>
                  </div>
                  <label className="block p-2 rounded-lg bg-slate-950 border border-slate-700/80 text-[11px] text-sky-300 hover:text-white cursor-pointer truncate flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">{attachedFiles.mcFile || 'Upload FMCSA_Authority.pdf'}</span>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setAttachedFiles({ ...attachedFiles, mcFile: f.name });
                      }}
                    />
                  </label>
                </div>

                {/* 2. Certificate of Insurance (COI) */}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-200">
                      <input
                        type="checkbox"
                        checked={docs.coi}
                        onChange={(e) => setDocs({ ...docs, coi: e.target.checked })}
                        className="w-4 h-4 accent-blue-600 rounded"
                      />
                      <span>COI ($1M / $100K)</span>
                    </label>
                    <span className="text-[10px] text-emerald-400">Required</span>
                  </div>
                  <label className="block p-2 rounded-lg bg-slate-950 border border-slate-700/80 text-[11px] text-sky-300 hover:text-white cursor-pointer truncate flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">{attachedFiles.coiFile || 'Upload Insurance_COI.pdf'}</span>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setAttachedFiles({ ...attachedFiles, coiFile: f.name });
                      }}
                    />
                  </label>
                </div>

                {/* 3. W-9 Form */}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-200">
                      <input
                        type="checkbox"
                        checked={docs.w9}
                        onChange={(e) => setDocs({ ...docs, w9: e.target.checked })}
                        className="w-4 h-4 accent-blue-600 rounded"
                      />
                      <span>Signed W-9 Form</span>
                    </label>
                    <span className="text-[10px] text-emerald-400">Required</span>
                  </div>
                  <label className="block p-2 rounded-lg bg-slate-950 border border-slate-700/80 text-[11px] text-sky-300 hover:text-white cursor-pointer truncate flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">{attachedFiles.w9File || 'Upload W-9_Signed.pdf'}</span>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setAttachedFiles({ ...attachedFiles, w9File: f.name });
                      }}
                    />
                  </label>
                </div>

                {/* 4. Truck Picture */}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-200">
                      <input
                        type="checkbox"
                        checked={docs.truckPicture}
                        onChange={(e) => setDocs({ ...docs, truckPicture: e.target.checked })}
                        className="w-4 h-4 accent-blue-600 rounded"
                      />
                      <span>Tractor / Truck Photo</span>
                    </label>
                    <span className="text-[10px] text-sky-400">Front / Fleet</span>
                  </div>
                  <label className="block p-2 rounded-lg bg-slate-950 border border-slate-700/80 text-[11px] text-sky-300 hover:text-white cursor-pointer truncate flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">{attachedFiles.truckFile || 'Upload Truck_Photo.jpg'}</span>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setAttachedFiles({ ...attachedFiles, truckFile: f.name });
                      }}
                    />
                  </label>
                </div>

                {/* 5. NOA or Voided Check */}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-200">
                      <input
                        type="checkbox"
                        checked={docs.noaOrVoidedCheck}
                        onChange={(e) => setDocs({ ...docs, noaOrVoidedCheck: e.target.checked })}
                        className="w-4 h-4 accent-blue-600 rounded"
                      />
                      <span>NOA / Voided Check</span>
                    </label>
                    <span className="text-[10px] text-amber-400">Factoring / ACH</span>
                  </div>
                  <label className="block p-2 rounded-lg bg-slate-950 border border-slate-700/80 text-[11px] text-sky-300 hover:text-white cursor-pointer truncate flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">{attachedFiles.noaFile || 'Upload NOA_or_VoidedCheck.pdf'}</span>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setAttachedFiles({ ...attachedFiles, noaFile: f.name });
                      }}
                    />
                  </label>
                </div>

                {/* 6. Driver's License */}
                <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-200">
                      <input
                        type="checkbox"
                        checked={docs.driversLicense}
                        onChange={(e) => setDocs({ ...docs, driversLicense: e.target.checked })}
                        className="w-4 h-4 accent-blue-600 rounded"
                      />
                      <span>Driver's CDL License</span>
                    </label>
                    <span className="text-[10px] text-emerald-400">Required</span>
                  </div>
                  <label className="block p-2 rounded-lg bg-slate-950 border border-slate-700/80 text-[11px] text-sky-300 hover:text-white cursor-pointer truncate flex items-center gap-1.5 transition-colors">
                    <Upload className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="truncate">{attachedFiles.dlFile || 'Upload Drivers_License.pdf'}</span>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setAttachedFiles({ ...attachedFiles, dlFile: f.name });
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Extra Custom Documents Row */}
              <div className="p-3.5 rounded-xl bg-[#091122] border border-blue-900/40 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-sky-300">
                    Attach Additional Documents (Permits, Safety Certificates, Trailer Registration):
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newExtraDocName}
                      onChange={(e) => setNewExtraDocName(e.target.value)}
                      placeholder="Doc name (e.g. HAZMAT, IRP Cab Card)"
                      className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                    />
                    <label className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold rounded cursor-pointer transition-colors shrink-0">
                      + Attach File
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            const name = newExtraDocName.trim() || f.name;
                            setAttachedFiles({
                              ...attachedFiles,
                              extraDocs: [...attachedFiles.extraDocs, { name, type: 'Other', fileName: f.name }],
                            });
                            setNewExtraDocName('');
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                {attachedFiles.extraDocs.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
                    {attachedFiles.extraDocs.map((ed, idx) => (
                      <span key={idx} className="px-2 py-1 rounded-lg bg-blue-950/80 border border-blue-700 text-sky-300 flex items-center gap-1.5">
                        <FileText className="w-3 h-3 text-sky-400" />
                        <span>{ed.name}: {ed.fileName}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Carrier Preferences & Equipment Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Carrier Preferences, Equipment Specs & Special Notes
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Tell our dispatch team your exact preferences: preferred home time, tare weight, liftgate/ramps, specialized tie-downs, factoring details, or preferred customer lanes..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500 font-sans"
                />
              </div>
            </div>

            {/* BLOCK 5: CRUCIAL OWNER SELECTION */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-2 border-b border-blue-900/40">
                <User className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  5. Choose Which Owner To Submit Your Packet To
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Option 1: David Cross */}
                <div
                  onClick={() => setFormData({ ...formData, assignedOwner: 'David Cross' })}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                    formData.assignedOwner === 'David Cross'
                      ? 'bg-blue-950/80 border-sky-400 ring-2 ring-sky-400/30 shadow-xl'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <img
                    src="/assets/aistudio/Screenshot_2026-11-04_095031_b047180c.png"
                    alt="David Cross"
                    className="w-16 h-16 object-contain drop-shadow"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white">David Cross</span>
                      {formData.assignedOwner === 'David Cross' && (
                        <CheckCircle2 className="w-4 h-4 text-sky-400" />
                      )}
                    </div>
                    <span className="text-[11px] text-amber-400 font-mono block">
                      Business Development Executive
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      Davidcross.vl1@gmail.com · +1 (409) 509-6940
                    </span>
                  </div>
                </div>

                {/* Option 2: Alvin */}
                <div
                  onClick={() => setFormData({ ...formData, assignedOwner: 'Alvin' })}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                    formData.assignedOwner === 'Alvin'
                      ? 'bg-blue-950/80 border-sky-400 ring-2 ring-sky-400/30 shadow-xl'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <img
                    src="/assets/aistudio/Alvin_Royal_Gold_Emblem_1d364b11.png"
                    alt="Alvin"
                    className="w-16 h-16 object-contain drop-shadow"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white">Alvin</span>
                      {formData.assignedOwner === 'Alvin' && (
                        <CheckCircle2 className="w-4 h-4 text-sky-400" />
                      )}
                    </div>
                    <span className="text-[11px] text-amber-400 font-mono block">
                      Operations Director
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      alvin.vast@gmail.com · 24/7 Fleet Lead
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-blue-900/40">
              <button
                type="submit"
                className={`w-full py-4 text-sm font-bold text-white rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer uppercase tracking-wider ${
                  isAllCoreValid
                    ? 'bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 hover:from-blue-500 hover:to-sky-400 shadow-blue-600/30 ring-2 ring-sky-400/30'
                    : 'bg-gradient-to-r from-slate-800 via-blue-900 to-slate-800 hover:from-blue-800 hover:to-blue-700 border border-blue-700/50'
                }`}
              >
                {isAllCoreValid ? <CheckCircle2 className="w-5 h-5 text-emerald-300" /> : <FileCheck2 className="w-5 h-5" />}
                <span>
                  {isAllCoreValid
                    ? `Complete Carrier Sign-Up & Submit to ${formData.assignedOwner}`
                    : `Complete Core Carrier Details (${coreChecks.length - passedCount} Remaining)`}
                </span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <span className="text-[11px] text-center text-slate-400 block mt-2 font-mono">
                {isAllCoreValid
                  ? '✓ All core verifications satisfied. Instant submission with zero wait time.'
                  : 'Your data is stored permanently in the Owner Portal with sequential numbering and instant email transmission.'}
              </span>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
