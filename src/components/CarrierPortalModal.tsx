import React, { useState } from 'react';
import { storage } from '../services/storage';
import { Carrier, LoadItem } from '../types';
import {
  X,
  Truck,
  MapPin,
  Calendar,
  Send,
  Upload,
  CheckCircle,
  FileText,
  AlertCircle,
  Phone,
} from 'lucide-react';
import { googleAuthService } from '../services/googleAuth';

interface CarrierPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CarrierPortalModal: React.FC<CarrierPortalModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [mcInput, setMcInput] = useState('');
  const [activeCarrier, setActiveCarrier] = useState<Carrier | null>(null);
  const [loginError, setLoginError] = useState('');

  // Portal Actions
  const [nextEmptyCity, setNextEmptyCity] = useState('');
  const [nextEmptyDate, setNextEmptyDate] = useState('');
  const [backhaulNotes, setBackhaulNotes] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');

  // Dispatch message
  const [chatMessage, setChatMessage] = useState('');
  const [chatSent, setChatSent] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const query = mcInput.trim().toLowerCase().replace('mc-', '').replace('mc', '');
    const carriers = storage.getCarriers();

    const matched = carriers.find(
      (c) =>
        c.mcNumber.toLowerCase().includes(query) ||
        c.email.toLowerCase() === mcInput.trim().toLowerCase()
    );

    if (matched) {
      setActiveCarrier(matched);
      setNextEmptyDate(matched.availableDate || '');
      setLoginError('');
    } else {
      setLoginError('No carrier found with this MC# or email. Please check your number or register as a new carrier.');
    }
  };

  const handleGoogleCarrierLogin = async () => {
    try {
      const res = await googleAuthService.signInWithGoogle();
      if (res.success && res.profile) {
        const userEmail = (res.profile.email || '').toLowerCase();
        const carriers = storage.getCarriers();
        const matched = carriers.find(
          (c) => c.email.toLowerCase() === userEmail || userEmail.includes(c.companyName.toLowerCase().replace(/\s/g, ''))
        );
        if (matched) {
          setActiveCarrier(matched);
          setNextEmptyDate(matched.availableDate || '');
          setLoginError('');
        } else {
          // Provision linked portal carrier profile
          const carrierObj: Carrier = {
            id: `c-g-${Date.now()}`,
            companyName: res.profile.displayName || 'Apex Interstate Express Partner',
            ownerName: res.profile.displayName || 'Carrier Owner',
            email: res.profile.email || 'driver@carrier.com',
            phone: '+1 (409) 509-6940',
            mcNumber: 'MC-1489201',
            dotNumber: 'USDOT 3920141',
            equipmentType: 'Dry Van',
            truckCount: 1,
            currentZip: '75201',
            preferredLanes: ['Nationwide', 'Texas Triangle'],
            preferredRPM: 2.85,
            maxDeadhead: 50,
            availableDate: new Date().toISOString().split('T')[0],
            insuranceStatus: 'Active ($1M / $100K)',
            status: 'Active',
            createdAt: new Date().toISOString().split('T')[0],
            documents: { w9: true, coi: true, mcAuthority: true, noa: true, driversLicense: true },
          };
          setActiveCarrier(carrierObj);
          setNextEmptyDate(carrierObj.availableDate || '');
          setLoginError('');
        }
      }
    } catch (err: any) {
      console.warn('Carrier Google login error:', err);
    }
  };

  const handleUpdateAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCarrier) return;

    const updated: Carrier = {
      ...activeCarrier,
      availableDate: nextEmptyDate || activeCarrier.availableDate,
      currentZip: nextEmptyCity || activeCarrier.currentZip,
      notes: backhaulNotes ? `${activeCarrier.notes || ''} | Need backhaul: ${backhaulNotes}` : activeCarrier.notes,
    };

    storage.saveCarrier(updated);
    setActiveCarrier(updated);
    storage.logActivity(
      'David Cross',
      'Carrier Availability Update',
      `${activeCarrier.companyName} (${activeCarrier.mcNumber}) updated location to ${nextEmptyCity || activeCarrier.currentZip}.`,
      'Carrier'
    );

    setUpdateSuccess('Availability & reload preference updated. Your dispatcher has been alerted.');
    setTimeout(() => setUpdateSuccess(''), 4000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !activeCarrier) return;

    storage.submitInquiry({
      fullName: activeCarrier.ownerName,
      companyName: activeCarrier.companyName,
      email: activeCarrier.email,
      phone: activeCarrier.phone,
      equipment: activeCarrier.equipmentType,
      subject: `Driver Urgent Message - ${activeCarrier.mcNumber}`,
      message: chatMessage,
    });

    setChatSent(true);
    setChatMessage('');
    setTimeout(() => setChatSent(false), 4000);
  };

  // Find active loads for this carrier
  const carrierLoads: LoadItem[] = activeCarrier
    ? storage.getLoads().filter((l) => l.mcNumber === activeCarrier.mcNumber)
    : [];

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
              <h3 className="text-lg font-bold text-white">Carrier Self-Service Portal</h3>
              <p className="text-xs text-slate-400">
                Live Freight Status, Backhaul Requests & Check-Ins
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close portal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {!activeCarrier ? (
            /* Login Form */
            <div className="max-w-md mx-auto py-8 space-y-6">
              <div className="text-center space-y-2">
                <h4 className="text-xl font-bold text-white">Carrier Portal Login</h4>
                <p className="text-xs text-slate-400">
                  Enter your MC Number or registered email to view active loads and dispatch updates.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    MC Number or Carrier Email
                  </label>
                  <input
                    type="text"
                    value={mcInput}
                    onChange={(e) => setMcInput(e.target.value)}
                    placeholder="e.g. MC-1489201 or 1489201"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm font-mono focus:outline-none focus:border-blue-500"
                  />
                  {loginError && (
                    <div className="mt-2 text-xs text-rose-400 flex items-start gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{loginError}</span>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  Access My Carrier Dashboard
                </button>

                <div className="relative flex items-center justify-center my-3">
                  <div className="border-t border-slate-800 w-full" />
                  <span className="bg-[#0B1222] px-3 text-[10px] text-slate-500 uppercase font-mono">Or Fast Sign-In</span>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleCarrierLogin}
                  className="w-full py-2.5 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Sign In with Google</span>
                </button>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1">
                  <span className="font-semibold text-slate-300 block">Quick Demo Carriers:</span>
                  <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
                    <button
                      type="button"
                      onClick={() => setMcInput('MC-1489201')}
                      className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded cursor-pointer"
                    >
                      MC-1489201 (Dry Van)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMcInput('MC-1290384')}
                      className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded cursor-pointer"
                    >
                      MC-1290384 (Reefer)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMcInput('MC-1619024')}
                      className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded cursor-pointer"
                    >
                      MC-1619024 (Hotshot)
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            /* Active Carrier Dashboard View */
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="p-5 rounded-2xl bg-[#080E1C] border border-blue-900/40 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold text-white">{activeCarrier.companyName}</h4>
                    <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                      {activeCarrier.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                    <span>{activeCarrier.mcNumber}</span>
                    <span>·</span>
                    <span>{activeCarrier.dotNumber}</span>
                    <span>·</span>
                    <span className="text-sky-300">{activeCarrier.equipmentType}</span>
                    <span>·</span>
                    <span>Dispatcher: {activeCarrier.assignedDispatcher || 'David Cross'}</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveCarrier(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg cursor-pointer"
                >
                  Log Out
                </button>
              </div>

              {/* Active Loads Section */}
              <div className="space-y-3">
                <h5 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
                  Assigned & Active Loads
                </h5>
                {carrierLoads.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-400">
                    No active loads right now. Submit your next empty location below to receive new load offers!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {carrierLoads.map((load) => (
                      <div
                        key={load.id}
                        className="p-4 rounded-xl bg-slate-900/80 border border-blue-900/40 space-y-2.5 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-white text-sm">
                            #{load.loadNumber}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full font-semibold text-[11px] bg-blue-950 text-sky-300 border border-blue-800/50">
                            {load.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                          <div>
                            <span className="text-slate-400 block text-[10px]">Route:</span>
                            <span className="text-white font-medium">
                              {load.originCity}, {load.originState} → {load.destinationCity}, {load.destinationState}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Agreed Rate:</span>
                            <span className="text-emerald-400 font-bold">${load.rate.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Loaded Miles:</span>
                            <span className="text-slate-300">{load.loadedMiles} mi (${load.rpm.toFixed(2)}/mi)</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Broker:</span>
                            <span className="text-slate-300">{load.brokerName}</span>
                          </div>
                        </div>
                        {load.notes && (
                          <div className="p-2 bg-slate-950/60 rounded text-[11px] text-slate-300 border-l-2 border-sky-500">
                            <strong>Dispatch Note:</strong> {load.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form: Post Next Availability / Request Backhaul */}
              <div className="p-5 rounded-2xl bg-[#080E1C] border border-blue-900/40 space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-400" />
                  <h5 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Submit Next Empty Location (Request Reload)
                  </h5>
                </div>

                {updateSuccess && (
                  <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{updateSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleUpdateAvailability} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Next Empty City / ZIP</label>
                    <input
                      type="text"
                      value={nextEmptyCity}
                      onChange={(e) => setNextEmptyCity(e.target.value)}
                      placeholder="e.g. Memphis, TN (38103)"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Expected Empty Date</label>
                    <input
                      type="date"
                      value={nextEmptyDate}
                      onChange={(e) => setNextEmptyDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Preferred Backhaul Destination</label>
                    <input
                      type="text"
                      value={backhaulNotes}
                      onChange={(e) => setBackhaulNotes(e.target.value)}
                      placeholder="e.g. Back to Texas or Midwest"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="sm:col-span-3 pt-1">
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-all cursor-pointer"
                    >
                      Update Dispatch & Find Reload
                    </button>
                  </div>
                </form>
              </div>

              {/* Quick Message to Dispatch */}
              <div className="p-5 rounded-2xl bg-[#080E1C] border border-blue-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Send className="w-3.5 h-3.5 text-sky-400" />
                    <span>Direct Message to Dispatch</span>
                  </h5>
                  <span className="text-[11px] text-slate-400">David Cross / Alvin Desk</span>
                </div>

                {chatSent && (
                  <div className="p-2.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs">
                    ✓ Message received by dispatch desk.
                  </div>
                )}

                <form onSubmit={handleSendMessage} className="space-y-2">
                  <textarea
                    rows={2}
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type urgent check-in, detention notice, or question for your dispatcher..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
