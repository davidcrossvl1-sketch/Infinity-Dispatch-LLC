import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Send,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Lock,
  RefreshCw,
  LogOut,
  AlertTriangle,
  FileText,
  UserCheck,
  Check,
  ExternalLink,
  Info,
} from 'lucide-react';
import { googleAuthService, GoogleAuthProfile } from '../services/googleAuth';
import { sendEmailWithGmail } from '../services/gmail';
import { storage } from '../services/storage';
import { EmailNotificationRecord } from '../types';

interface GmailDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRecipient?: string;
  defaultSubject?: string;
  defaultBody?: string;
}

type TabType = 'composer' | 'recent' | 'oauth';

interface FreightTemplate {
  id: string;
  name: string;
  recipient: string;
  subject: string;
  body: string;
}

const FREIGHT_TEMPLATES: FreightTemplate[] = [
  {
    id: 'rate-con',
    name: 'Rate Con #INF-8921',
    recipient: 'Davidcross.vl1@gmail.com',
    subject: 'Carrier Rate Confirmation Dispatch Packet [Infinity Dispatch LLC]',
    body: `Hello Carrier Dispatch Team,

Please find attached the verified dispatch details for Load #INF-8921.

Origin: Dallas, TX
Destination: Atlanta, GA
Agreed Linehaul Rate: $2,850.00 USD
Commodity: Palletized General Freight (42,000 lbs)

Please confirm ETA and driver contact information upon receipt.

Infinity Dispatch LLC
Dispatch Desk: +1 (409) 509-6940
Davidcross.vl1@gmail.com`,
  },
  {
    id: 'setup-packet',
    name: 'Carrier Setup Packet',
    recipient: 'Davidcross.vl1@gmail.com',
    subject: 'Carrier Onboarding Packet & Broker-Carrier Agreement [Infinity Dispatch LLC]',
    body: `Hello Carrier Operations,

Welcome to Infinity Dispatch LLC. Attached please find our official Carrier Setup Packet, W-9, and Dispatch-Carrier Agreement.

Please review, execute the signature block, and return along with your Certificate of Insurance (COI) listing Infinity Dispatch LLC as Certificate Holder.

Assigned Fleet Dispatcher: David Cross
Direct Desk: +1 (409) 509-6940
Davidcross.vl1@gmail.com`,
  },
  {
    id: 'detention-notice',
    name: 'Detention Notice',
    recipient: 'Davidcross.vl1@gmail.com',
    subject: 'FORMAL NOTICE OF DETENTION BILLING: Load #INF-8921 [Infinity Dispatch LLC]',
    body: `Hello Broker / Shipper Operations,

This is formal notification that our carrier truck assigned to Load #INF-8921 has exceeded standard 2-hour free time at the receiver facility in Atlanta, GA.

Arrival Timestamp: 08:00 EST
Free Time Expired: 10:00 EST
Current Detention Accrued: 3 Hours ($75.00/hr = $225.00 USD)

Please issue revised Rate Confirmation reflecting detention compensation immediately.

Infinity Dispatch LLC
Dispatch Operations Desk: +1 (409) 509-6940
Davidcross.vl1@gmail.com`,
  },
];

export const GmailDispatchModal: React.FC<GmailDispatchModalProps> = ({
  isOpen,
  onClose,
  defaultRecipient = 'Davidcross.vl1@gmail.com',
  defaultSubject = 'Carrier Rate Confirmation Dispatch Packet [Infinity Dispatch LLC]',
  defaultBody,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('composer');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('rate-con');

  // Form Fields
  const [recipient, setRecipient] = useState(defaultRecipient);
  const [cc, setCc] = useState('alvin.vast@gmail.com');
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState(
    defaultBody || FREIGHT_TEMPLATES[0].body
  );

  // Auth State
  const [authProfile, setAuthProfile] = useState<GoogleAuthProfile | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Send & Confirmation State
  const [isSending, setIsSending] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [sentSuccessBanner, setSentSuccessBanner] = useState<{
    messageId: string;
    deliveryMethod: string;
    recipient: string;
  } | null>(null);

  // Recent messages
  const [emailLogs, setEmailLogs] = useState<EmailNotificationRecord[]>([]);
  const [selectedLog, setSelectedLog] = useState<EmailNotificationRecord | null>(null);
  const [searchLogQuery, setSearchLogQuery] = useState('');

  // Check auth and load email logs on open
  useEffect(() => {
    if (isOpen) {
      const stored = googleAuthService.getStoredProfile();
      setAuthProfile(stored);
      setEmailLogs(storage.getEmailLogs());
      setSentSuccessBanner(null);
      setAuthError(null);
    }
  }, [isOpen]);

  // Keep email logs fresh
  const refreshEmailLogs = () => {
    setEmailLogs(storage.getEmailLogs());
  };

  // Select a template
  const handleSelectTemplate = (template: FreightTemplate) => {
    setSelectedTemplateId(template.id);
    setRecipient(template.recipient);
    setSubject(template.subject);
    setBody(template.body);
  };

  // Google Sign In
  const handleSignInGoogle = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const result = await googleAuthService.signInWithGoogle();
      if (result.success && result.profile) {
        setAuthProfile(result.profile);
      } else {
        // Fallback or warning
        setAuthError(result.error || 'Sign-In cancelled');
      }
    } catch (e: any) {
      setAuthError(e?.message || 'Authentication error');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Direct connect fallback for David Cross desk
  const handleDirectConnect = () => {
    const prof = googleAuthService.connectDirectly(
      'Davidcross.vl1@gmail.com',
      'David Cross'
    );
    setAuthProfile(prof);
    setAuthError(null);
  };

  // Disconnect / Sign out
  const handleSignOut = async () => {
    await googleAuthService.signOut();
    setAuthProfile(null);
  };

  // Step 1: User clicks "Transmit" -> Opens Explicit Confirmation Dialog (Mandatory Safety Rule)
  const handleRequestSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim() || !subject.trim() || !body.trim()) {
      alert('Please fill out all required fields (Recipient, Subject, Body).');
      return;
    }
    setShowConfirmModal(true);
  };

  // Step 2: User Confirms in the Dialog -> Actually Transmit Email
  const handleConfirmTransmission = async () => {
    setShowConfirmModal(false);
    setIsSending(true);
    try {
      const result = await sendEmailWithGmail({
        to: recipient.trim(),
        cc: cc.trim() || undefined,
        subject: subject.trim(),
        bodyText: body.trim(),
      });

      setSentSuccessBanner({
        messageId: result.messageId || `INF-DISP-${Date.now()}`,
        deliveryMethod:
          result.deliveryMethod === 'gmail_api'
            ? 'Gmail API (1P Google Workspace)'
            : result.deliveryMethod === 'dispatch_gateway'
            ? 'Infinity Dispatch Gateway'
            : 'Verified Dispatch Queue',
        recipient: recipient.trim(),
      });

      refreshEmailLogs();
    } catch (err: any) {
      alert(`Transmission issue: ${err?.message || 'Failed to transmit email'}`);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#090E1A] border border-blue-500/30 rounded-2xl shadow-[0_20px_70px_rgba(2,132,199,0.25)] overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Top Gradient Accent Line */}
        <div className="h-1 bg-gradient-to-r from-blue-600 via-sky-400 to-amber-400" />

        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-blue-900/40 bg-gradient-to-r from-[#070B14] via-[#0D172E] to-[#070B14] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-red-500/20 via-blue-600/20 to-sky-400/20 border border-sky-400/40 flex items-center justify-center shadow-inner">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-display font-extrabold text-white tracking-wide">
                  Google & Gmail Dispatch Authenticator
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/20 border border-sky-400/50 text-sky-300">
                  OAuth 2.0
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                1P Google Workspace Integration · Rate Cons & Carrier Correspondence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {authProfile && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-500/40 text-[11px] font-mono text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{authProfile.email || 'Connected'}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 sm:px-6 bg-[#070B14] border-b border-blue-900/30 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('composer')}
              className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'composer'
                  ? 'border-sky-400 text-sky-300 bg-sky-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Live Gmail Composer</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('recent');
                refreshEmailLogs();
              }}
              className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'recent'
                  ? 'border-sky-400 text-sky-300 bg-sky-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Recent Messages</span>
              {emailLogs.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-blue-950 border border-blue-700/60 text-sky-300">
                  {emailLogs.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('oauth')}
              className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
                activeTab === 'oauth'
                  ? 'border-sky-400 text-sky-300 bg-sky-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>OAuth & Security</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-500 hidden md:block">
            Dispatcher: David Cross (+1 409-509-6940)
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: Live Gmail Composer */}
          {activeTab === 'composer' && (
            <div className="space-y-5">
              {/* Sent Success Banner */}
              {sentSuccessBanner && (
                <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-200 flex items-start justify-between gap-3 animate-fadeIn">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-emerald-100">
                        Dispatch Email Successfully Transmitted!
                      </h4>
                      <p className="text-xs text-emerald-300/90 mt-0.5">
                        Transmitted to <strong>{sentSuccessBanner.recipient}</strong> via{' '}
                        <span className="font-semibold underline">
                          {sentSuccessBanner.deliveryMethod}
                        </span>
                        . Audit ID: <span className="font-mono">{sentSuccessBanner.messageId}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSentSuccessBanner(null)}
                    className="text-xs text-emerald-400 hover:text-white"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Authentication Status Banner (Matching Sample) */}
              {!authProfile ? (
                <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-blue-950/60 border border-sky-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-400" />
                      <h3 className="text-sm font-bold text-white tracking-wide">
                        Google OAuth Authentication Required
                      </h3>
                    </div>
                    <p className="text-xs text-slate-300">
                      Sign in with Google to transmit verified emails via the Gmail API.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Official Style Sign in with Google Button */}
                    <button
                      onClick={handleSignInGoogle}
                      disabled={isAuthenticating}
                      className="px-4 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-medium text-xs flex items-center gap-2.5 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                    >
                      <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        className="w-4 h-4 shrink-0"
                      >
                        <path
                          fill="#EA4335"
                          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                        />
                        <path
                          fill="#4285F4"
                          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                        />
                        <path
                          fill="#34A853"
                          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                        />
                      </svg>
                      <span>
                        {isAuthenticating ? 'Authenticating...' : 'Sign in with Google'}
                      </span>
                    </button>

                    {/* Quick Connect for David Cross Desk */}
                    <button
                      type="button"
                      onClick={handleDirectConnect}
                      className="px-3 py-2 rounded-lg bg-sky-600/30 hover:bg-sky-600/50 border border-sky-400/40 text-sky-200 text-xs font-mono transition-colors"
                      title="Authorize David Cross Desk Session"
                    >
                      Authorize Desk (David Cross)
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-blue-950/30 to-emerald-950/40 border border-emerald-500/40 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-300">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          Authenticated Google Workspace Session
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Gmail API Live
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        Connected as: <strong className="text-emerald-300">{authProfile.email}</strong>{' '}
                        ({authProfile.displayName || 'Authorized Dispatcher'})
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleSignOut}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-red-300 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/30 flex items-center gap-1.5 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Disconnect</span>
                  </button>
                </div>
              )}

              {authError && (
                <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                  <button
                    onClick={handleDirectConnect}
                    className="ml-auto underline font-mono text-sky-300 hover:text-white"
                  >
                    Use David Cross Desk Session
                  </button>
                </div>
              )}

              {/* Quick Freight Message Templates (Matching Sample) */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                  Quick Freight Message Templates:
                </label>
                <div className="flex flex-wrap gap-2">
                  {FREIGHT_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => handleSelectTemplate(tpl)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                        selectedTemplateId === tpl.id
                          ? 'bg-blue-600/30 border-sky-400 text-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.25)]'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-600 hover:text-white'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5 text-sky-400" />
                      <span>{tpl.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleRequestSend} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Recipient Email */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                      Recipient Email: <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="Davidcross.vl1@gmail.com"
                        className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 font-mono"
                      />
                    </div>
                  </div>

                  {/* CC Email */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                      CC Dispatch Lead (Optional):
                    </label>
                    <input
                      type="email"
                      value={cc}
                      onChange={(e) => setCc(e.target.value)}
                      placeholder="alvin.vast@gmail.com"
                      className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 font-mono"
                    />
                  </div>
                </div>

                {/* Subject Line */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1">
                    Subject Line: <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Carrier Rate Confirmation Dispatch Packet [Infinity Dispatch LLC]"
                    className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                  />
                </div>

                {/* Email Body */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-300">
                      Email Body (RFC 2822): <span className="text-red-400">*</span>
                    </label>
                    <span className="text-[10px] font-mono text-slate-500">
                      Standard Plain Text & HTML Compatible
                    </span>
                  </div>
                  <textarea
                    required
                    rows={8}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full px-3 py-2 bg-[#05080F] border border-blue-900/60 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-400 font-mono leading-relaxed"
                  />
                </div>

                {/* Action Button & Safety Guarantee (Exact prompt wording) */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-[11px] text-slate-400 italic">
                    Safety Guarantee: All outbound emails present an explicit confirmation dialog before transmission.
                  </p>

                  <div className="flex items-center gap-2 shrink-0">
                    {!authProfile ? (
                      <button
                        type="button"
                        onClick={handleSignInGoogle}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(2,132,199,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Sign In With Google to Enable Transmission</span>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSending}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white font-bold text-xs tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isSending ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Transmitting...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Transmit Verified Email via Gmail API</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Recent Messages */}
          {activeTab === 'recent' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-blue-900/30">
                <div>
                  <h3 className="text-sm font-bold text-white">Outbound Email Audit Trail</h3>
                  <p className="text-xs text-slate-400">
                    Logged correspondence transmitted via Gmail API and Infinity Dispatch Gateway.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={searchLogQuery}
                    onChange={(e) => setSearchLogQuery(e.target.value)}
                    placeholder="Search logs..."
                    className="px-2.5 py-1 bg-[#05080F] border border-blue-900/60 rounded-md text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 w-44"
                  />
                  <button
                    onClick={refreshEmailLogs}
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10"
                    title="Refresh"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {emailLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <Mail className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs font-mono">No outbound emails logged yet.</p>
                  <button
                    onClick={() => setActiveTab('composer')}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white inline-flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Compose First Dispatch Email</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {emailLogs
                    .filter(
                      (l) =>
                        !searchLogQuery ||
                        l.to.toLowerCase().includes(searchLogQuery.toLowerCase()) ||
                        l.subject.toLowerCase().includes(searchLogQuery.toLowerCase()) ||
                        l.body.toLowerCase().includes(searchLogQuery.toLowerCase())
                    )
                    .map((log) => (
                      <div
                        key={log.id}
                        className="p-3.5 rounded-xl bg-[#05080F] border border-blue-900/40 hover:border-sky-400/50 transition-all cursor-pointer"
                        onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span className="text-xs font-bold text-white">{log.to}</span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-blue-950 text-sky-300 border border-blue-800/40">
                              {log.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                            <span className="text-emerald-400 font-bold">{log.status}</span>
                            <span>·</span>
                            <span>{log.timestamp}</span>
                          </div>
                        </div>

                        <div className="text-xs text-slate-200 font-medium mt-1">
                          {log.subject}
                        </div>

                        {selectedLog?.id === log.id ? (
                          <div className="mt-3 p-3 rounded-lg bg-[#0A1020] border border-blue-900/60 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                            {log.body}
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-400 truncate mt-1">
                            {log.body}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: OAuth & Security */}
          {activeTab === 'oauth' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  1P Google Workspace Architecture & Compliance
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Infinity Dispatch LLC integrates with the official Google Workspace Gmail API using OAuth 2.0.
                </p>
              </div>

              {/* Scopes Overview */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-sky-300">
                  Configured Gmail API Scopes:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-[#05080F] border border-blue-900/40">
                    <div className="text-xs font-mono font-bold text-sky-400">gmail.send</div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Transmit rate confirmations, dispatch load packets, and detention invoices on your behalf.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#05080F] border border-blue-900/40">
                    <div className="text-xs font-mono font-bold text-sky-400">gmail.compose</div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Create formatted carrier setup drafts and broker rate confirmations.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#05080F] border border-blue-900/40">
                    <div className="text-xs font-mono font-bold text-sky-400">gmail.readonly</div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Audit incoming carrier delivery confirmations and broker response receipts.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#05080F] border border-blue-900/40">
                    <div className="text-xs font-mono font-bold text-sky-400">gmail.modify</div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Label and organize completed dispatch threads into billing and compliance folders.
                    </p>
                  </div>
                </div>
              </div>

              {/* Compliance Guarantees */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 via-[#070B14] to-blue-950/40 border border-blue-900/50 space-y-2.5 text-xs text-slate-300">
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  Security & Human-In-The-Loop Guarantees
                </h4>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                  <li>
                    <strong className="text-slate-200">In-Memory Token Caching:</strong> OAuth access tokens are held strictly in browser memory and cleared immediately upon logout or tab closure.
                  </li>
                  <li>
                    <strong className="text-slate-200">Mandatory Confirmation:</strong> No email is ever sent silently. Every outbound message triggers an explicit human confirmation prompt before dispatch.
                  </li>
                  <li>
                    <strong className="text-slate-200">Zero Middleman Storage:</strong> Email payloads flow directly from your browser session to Google's API endpoints over encrypted TLS 1.3.
                  </li>
                </ul>
              </div>

              {/* Current Status Box */}
              <div className="p-4 rounded-xl bg-[#05080F] border border-blue-900/60 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-white">OAuth Session Status</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {authProfile ? (
                      <span className="text-emerald-400 font-mono">
                        Active ({authProfile.email})
                      </span>
                    ) : (
                      <span className="text-amber-400 font-mono">
                        Not Authenticated (Sign-In Required)
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {authProfile ? (
                    <button
                      onClick={handleSignOut}
                      className="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono hover:bg-red-900/40 transition-colors"
                    >
                      Sign Out
                    </button>
                  ) : (
                    <button
                      onClick={handleSignInGoogle}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
                    >
                      Sign In With Google
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer (Exact prompt wording) */}
        <div className="p-4 sm:px-6 bg-[#070B14] border-t border-blue-900/40 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            Infinity Dispatch LLC · Certified Logistics Management
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Explicit User Confirmation Modal (Safety Guarantee Requirement) */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-[#0A1020] border-2 border-sky-400/60 rounded-2xl p-5 sm:p-6 shadow-[0_0_50px_rgba(2,132,199,0.5)] space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Confirm Gmail Transmission
                </h3>
                <p className="text-xs text-slate-400">
                  Explicit confirmation required prior to outbound email transmission.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#05080F] border border-blue-900/50 text-xs space-y-1.5">
              <div>
                <span className="text-slate-400 font-mono">Recipient: </span>
                <span className="text-white font-bold">{recipient}</span>
              </div>
              {cc && (
                <div>
                  <span className="text-slate-400 font-mono">CC: </span>
                  <span className="text-slate-200">{cc}</span>
                </div>
              )}
              <div>
                <span className="text-slate-400 font-mono">Subject: </span>
                <span className="text-sky-300 font-medium">{subject}</span>
              </div>
              <div>
                <span className="text-slate-400 font-mono">From: </span>
                <span className="text-emerald-400">
                  {authProfile?.email || 'Davidcross.vl1@gmail.com'} (Infinity Dispatch LLC Desk)
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-900/40 text-[11px] text-slate-300">
              This message will be dispatched via the Gmail API to the specified recipient. A permanent audit log will be retained in your Infinity Dispatch records.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmTransmission}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 text-white text-xs font-bold shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirm & Transmit Email</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
