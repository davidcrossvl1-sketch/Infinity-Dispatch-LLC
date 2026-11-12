import React, { useState } from 'react';
import { OFFICIAL_OWNERS, storage } from '../../services/storage';
import { OwnerUser } from '../../types';
import { Shield, Lock, User, X, AlertCircle } from 'lucide-react';

interface OwnerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (owner: OwnerUser) => void;
}

export const OwnerLoginModal: React.FC<OwnerLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [selectedOwnerId, setSelectedOwnerId] = useState<string>('owner-david-cross');
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const owner = OFFICIAL_OWNERS.find((o) => o.id === selectedOwnerId);
    if (!owner) {
      setError('Owner profile not found.');
      return;
    }

    // Strict owner master password verification - exactly Malik@786
    if (storage.verifyOwnerPassword(passcode)) {
      storage.setCurrentOwner(owner);
      storage.logActivity(
        owner.name as 'David Cross' | 'Alvin',
        'Owner Authenticated',
        `${owner.name} logged in to Owner Control Center with full SUPER ADMIN permissions.`,
        'System'
      );
      onSuccess(owner);
      onClose();
    } else {
      setError('Invalid master password. Access denied.');
    }
  };

  const handleQuickSelect = (owner: OwnerUser) => {
    setSelectedOwnerId(owner.id);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0B1222] border border-blue-500/40 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-blue-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-sky-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Owner Control Center</h3>
              <p className="text-xs text-slate-400">Infinity Dispatch LLC · Private Access</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Select Official Owner Identity:
            </label>
            <div className="grid grid-cols-2 gap-3">
              {OFFICIAL_OWNERS.map((owner) => {
                const isSelected = selectedOwnerId === owner.id;
                return (
                  <button
                    key={owner.id}
                    type="button"
                    onClick={() => handleQuickSelect(owner)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/30 border-blue-500 text-white ring-1 ring-blue-500'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-3.5 h-3.5 text-sky-400" />
                      <span className="font-bold text-xs">{owner.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate font-mono">
                      {owner.email}
                    </span>
                    <span className="text-[9px] font-mono font-bold text-emerald-400 mt-1 block">
                      SUPER ADMIN
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Secure Owner Master Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter confidential owner password"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
            {error && (
              <div className="mt-2 text-xs text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-900/40 text-[11px] text-sky-300 leading-relaxed font-mono">
            Equal Super Admin Credentials: David Cross and Alvin share confidential master credentials for complete dispatch administration.
          </div>

          <button
            type="submit"
            className="w-full py-3 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
          >
            <Shield className="w-4 h-4" />
            <span>Authenticate As {OFFICIAL_OWNERS.find((o) => o.id === selectedOwnerId)?.name}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
