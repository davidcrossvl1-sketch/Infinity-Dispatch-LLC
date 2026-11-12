import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Truck,
  DollarSign,
  Phone,
  Mail,
  Shield,
  FileText,
  CheckCircle2,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Clock,
  Briefcase,
  Award,
  Plus,
  X,
  Copy,
  Check,
} from 'lucide-react';
import { Dispatcher, SalesPerson, LoadItem, RosterCarrier } from '../../types';
import { storage } from '../../services/storage';

export interface SalesAndDispatchManagerProps {
  dispatchers?: Dispatcher[];
  loads?: LoadItem[];
  carriers?: RosterCarrier[];
  rosterCarriers?: RosterCarrier[];
  onAddDispatcher?: (d: Dispatcher) => void;
  onUpdateDispatcher?: (d: Dispatcher) => void;
  onDeleteDispatcher?: (id: string) => void;
  salesPersons?: SalesPerson[];
  onAddSalesPerson?: (sp: SalesPerson) => void;
  onUpdateSalesPerson?: (sp: SalesPerson) => void;
  onDeleteSalesPerson?: (id: string) => void;
  onUpdate?: () => void;
}

export const SalesAndDispatchManager: React.FC<SalesAndDispatchManagerProps> = ({
  dispatchers: propDispatchers,
  loads: propLoads,
  carriers: propCarriers,
  rosterCarriers: propRosterCarriers,
  onAddDispatcher,
  onUpdateDispatcher,
  onDeleteDispatcher,
  salesPersons: propSalesPersons,
  onAddSalesPerson,
  onUpdateSalesPerson,
  onDeleteSalesPerson,
  onUpdate,
}) => {
  const [internalDispatchers, setInternalDispatchers] = useState<Dispatcher[]>(() => propDispatchers || storage.getDispatchers());
  const [internalSalesPersons, setInternalSalesPersons] = useState<SalesPerson[]>(() => propSalesPersons || storage.getSalesPersons());

  const dispatchers = propDispatchers || internalDispatchers;
  const salesPersons = propSalesPersons || internalSalesPersons;
  const loads = propLoads || storage.getLoads();
  const carriers = propRosterCarriers || propCarriers || storage.getRosterCarriers();
  const [activeTab, setActiveTab] = useState<'dispatchers' | 'sales'>('dispatchers');

  // Expanded card state
  const [expandedDispatcherId, setExpandedDispatcherId] = useState<string | null>(null);
  const [expandedSalesPersonId, setExpandedSalesPersonId] = useState<string | null>(null);

  // Modal states
  const [isDispatcherModalOpen, setIsDispatcherModalOpen] = useState(false);
  const [editingDispatcher, setEditingDispatcher] = useState<Dispatcher | null>(null);

  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);
  const [editingSalesPerson, setEditingSalesPerson] = useState<SalesPerson | null>(null);

  // Dispatcher Form
  const [dispName, setDispName] = useState('');
  const [dispEmail, setDispEmail] = useState('');
  const [dispPhone, setDispPhone] = useState('');
  const [dispShift, setDispShift] = useState('Day (EST/CST)');
  const [dispCommission, setDispCommission] = useState(7);
  const [dispStatus, setDispStatus] = useState<'Active' | 'Away'>('Active');

  // Sales Person Form
  const [salesName, setSalesName] = useState('');
  const [salesEmail, setSalesEmail] = useState('');
  const [salesPhone, setSalesPhone] = useState('');
  const [salesCommission, setSalesCommission] = useState(5);
  const [salesStatus, setSalesStatus] = useState<'Active' | 'On Leave' | 'Inactive'>('Active');
  const [salesNotes, setSalesNotes] = useState('');

  // Open Edit Dispatcher
  const handleOpenEditDispatcher = (d: Dispatcher) => {
    setEditingDispatcher(d);
    setDispName(d.name);
    setDispEmail(d.email);
    setDispPhone(d.phone);
    setDispShift(d.shift || 'Day (EST/CST)');
    setDispCommission(d.commissionPercent || 7);
    setDispStatus(d.status);
    setIsDispatcherModalOpen(true);
  };

  // Save Dispatcher
  const handleSaveDispatcher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispName.trim()) return;

    if (editingDispatcher) {
      const updated: Dispatcher = {
        ...editingDispatcher,
        name: dispName.trim(),
        email: dispEmail.trim(),
        phone: dispPhone.trim(),
        shift: dispShift,
        commissionPercent: dispCommission,
        status: dispStatus,
      };
      if (onUpdateDispatcher) onUpdateDispatcher(updated);
      else {
        storage.saveDispatcher(updated);
        setInternalDispatchers(storage.getDispatchers());
      }
    } else {
      const newD: Dispatcher = {
        id: `disp-${Date.now()}`,
        name: dispName.trim(),
        email: dispEmail.trim() || 'dispatch@infinitydispatchllcusa.com',
        phone: dispPhone.trim() || '+1 (409) 509-6940',
        shift: dispShift,
        commissionPercent: dispCommission,
        assignedCarriersCount: 0,
        activeLoadsCount: 0,
        totalDispatchedGross: 0,
        status: dispStatus,
      };
      if (onAddDispatcher) onAddDispatcher(newD);
      else {
        storage.saveDispatcher(newD);
        setInternalDispatchers(storage.getDispatchers());
      }
    }

    if (onUpdate) onUpdate();
    setIsDispatcherModalOpen(false);
    setEditingDispatcher(null);
  };

  // Open Edit Sales Person
  const handleOpenEditSales = (sp: SalesPerson) => {
    setEditingSalesPerson(sp);
    setSalesName(sp.name);
    setSalesEmail(sp.email);
    setSalesPhone(sp.phone);
    setSalesCommission(sp.commissionRate);
    setSalesStatus(sp.status);
    setSalesNotes(sp.notes || '');
    setIsSalesModalOpen(true);
  };

  // Save Sales Person
  const handleSaveSalesPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!salesName.trim()) return;

    if (editingSalesPerson) {
      const updated: SalesPerson = {
        ...editingSalesPerson,
        name: salesName.trim(),
        email: salesEmail.trim(),
        phone: salesPhone.trim(),
        commissionRate: salesCommission,
        status: salesStatus,
        notes: salesNotes,
      };
      if (onUpdateSalesPerson) onUpdateSalesPerson(updated);
      else {
        storage.saveSalesPerson(updated);
        setInternalSalesPersons(storage.getSalesPersons());
      }
    } else {
      const newSp: SalesPerson = {
        id: `sales-${Date.now()}`,
        name: salesName.trim(),
        email: salesEmail.trim() || 'sales@infinitydispatchllcusa.com',
        phone: salesPhone.trim() || '+1 (409) 509-6940',
        commissionRate: salesCommission,
        status: salesStatus,
        onboardedCarriersCount: 0,
        totalRevenueGenerated: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        notes: salesNotes,
        assignedCarriers: [],
      };
      if (onAddSalesPerson) onAddSalesPerson(newSp);
      else {
        storage.saveSalesPerson(newSp);
        setInternalSalesPersons(storage.getSalesPersons());
      }
    }

    if (onUpdate) onUpdate();
    setIsSalesModalOpen(false);
    setEditingSalesPerson(null);
  };

  return (
    <div className="space-y-5">
      {/* Tab Navigation & Add Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0D1527] p-4 rounded-2xl border border-blue-900/40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('dispatchers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'dispatchers'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Truck className="w-4 h-4 text-sky-300" />
            <span>Fleet Dispatch Specialists ({dispatchers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sales')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'sales'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4 text-emerald-300" />
            <span>Carrier Sales & Recruiters ({salesPersons.length})</span>
          </button>
        </div>

        <div>
          {activeTab === 'dispatchers' ? (
            <button
              onClick={() => {
                setEditingDispatcher(null);
                setDispName('');
                setDispEmail('');
                setDispPhone('');
                setDispShift('Day (EST/CST)');
                setDispCommission(7);
                setDispStatus('Active');
                setIsDispatcherModalOpen(true);
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New Dispatcher</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingSalesPerson(null);
                setSalesName('');
                setSalesEmail('');
                setSalesPhone('');
                setSalesCommission(5);
                setSalesStatus('Active');
                setSalesNotes('');
                setIsSalesModalOpen(true);
              }}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add New Sales Person</span>
            </button>
          )}
        </div>
      </div>

      {/* 1. DISPATCHERS LIST */}
      {activeTab === 'dispatchers' && (
        <div className="space-y-3">
          {dispatchers.map((disp) => {
            const assignedLoads = loads.filter(
              (l) => (l.dispatcherName || '').toLowerCase().includes(disp.name.toLowerCase())
            );
            const assignedCarriers = carriers.filter(
              (c) => (c.dispatcherName || '').toLowerCase().includes(disp.name.toLowerCase())
            );
            const totalGross = assignedLoads.reduce((sum, l) => sum + (l.rate || 0), 0);
            const isExpanded = expandedDispatcherId === disp.id;

            return (
              <div
                key={disp.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#0D1527] border border-blue-900/40 hover:border-sky-500/40 transition-all space-y-3 shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-700/60 flex items-center justify-center text-sky-400 font-bold text-sm">
                      {disp.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white font-sans">{disp.name}</h4>
                        <span
                          className={`px-2 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                            disp.status === 'Active'
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-900 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {disp.status}
                        </span>
                        <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-blue-950 text-sky-300 border border-blue-800/40">
                          {disp.shift || 'Full Shift'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-0.5">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-sky-400" />
                          {disp.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {disp.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Metrics & Actions */}
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase">DISPATCHED GROSS</span>
                      <span className="text-emerald-400 font-bold text-sm">
                        ${totalGross.toLocaleString() || '0'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase">CARRIERS</span>
                      <span className="text-sky-300 font-bold">{assignedCarriers.length}</span>
                    </div>

                    <div className="flex items-center gap-1.5 pl-2 border-l border-blue-900/60">
                      <button
                        onClick={() => handleOpenEditDispatcher(disp)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Edit Dispatcher"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete dispatcher ${disp.name}?`)) {
                            if (onDeleteDispatcher) onDeleteDispatcher(disp.id);
                            else {
                              storage.deleteDispatcher(disp.id);
                              setInternalDispatchers(storage.getDispatchers());
                              if (onUpdate) onUpdate();
                            }
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40"
                        title="Delete Dispatcher"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setExpandedDispatcherId(isExpanded ? null : disp.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Toggle Details"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details: Booked Loads & Assigned Carriers */}
                {isExpanded && (
                  <div className="pt-3 border-t border-blue-900/40 space-y-3 animate-fadeIn text-xs font-mono">
                    <div>
                      <span className="text-[11px] font-bold text-sky-300 block mb-1">
                        Assigned Carriers ({assignedCarriers.length}):
                      </span>
                      {assignedCarriers.length === 0 ? (
                        <span className="text-slate-500 text-[11px]">No carriers assigned yet.</span>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {assignedCarriers.map((c) => (
                            <div key={c.id} className="p-2 rounded-lg bg-black/40 border border-blue-900/40">
                              <div className="font-bold text-white font-sans">{c.carrierName}</div>
                              <div className="text-[11px] text-sky-400">{c.mcNumber} · {c.equipmentType}</div>
                              <div className="text-[10px] text-slate-400">Driver: {c.driverName} ({c.driverPhone})</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-emerald-300 block mb-1">
                        Booked Loads ({assignedLoads.length}):
                      </span>
                      {assignedLoads.length === 0 ? (
                        <span className="text-slate-500 text-[11px]">No loads dispatched under this dispatcher.</span>
                      ) : (
                        <div className="space-y-1.5">
                          {assignedLoads.map((l) => (
                            <div
                              key={l.id}
                              className="p-2 rounded-lg bg-black/40 border border-blue-900/40 flex items-center justify-between text-[11px]"
                            >
                              <div>
                                <span className="font-bold text-white">#{l.loadNumber}</span>
                                <span className="text-slate-400 ml-2">{l.carrierName} ({l.mcNumber})</span>
                                <span className="text-sky-300 ml-2">{l.originCity}, {l.originState} ➔ {l.destinationCity}, {l.destinationState}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-emerald-400">${l.rate.toLocaleString()}</span>
                                <span className="px-1.5 py-0.2 rounded bg-blue-950 text-sky-300 border border-blue-800">
                                  {l.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 2. SALES PERSONS LIST */}
      {activeTab === 'sales' && (
        <div className="space-y-3">
          {salesPersons.map((sp) => {
            const onboardedCarriers = carriers.filter(
              (c) => (c.salesPersonName || '').toLowerCase().includes(sp.name.toLowerCase())
            );
            const totalRevenue = onboardedCarriers.reduce((sum, c) => sum + (c.dispatchedAmount || 0), 0);
            const isExpanded = expandedSalesPersonId === sp.id;

            return (
              <div
                key={sp.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#0D1527] border border-blue-900/40 hover:border-emerald-500/40 transition-all space-y-3 shadow-md"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400 font-bold text-sm">
                      {sp.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white font-sans">{sp.name}</h4>
                        <span
                          className={`px-2 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                            sp.status === 'Active'
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-900 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {sp.status}
                        </span>
                        <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                          {sp.commissionRate}% Commission
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-0.5">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-emerald-400" />
                          {sp.phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {sp.email}
                        </span>
                        <span>Joined: {sp.joinedDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Metrics & Actions */}
                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase">GENERATED VOLUME</span>
                      <span className="text-emerald-400 font-bold text-sm">
                        ${totalRevenue.toLocaleString() || '0'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase">ONBOARDED CARRIERS</span>
                      <span className="text-sky-300 font-bold">{onboardedCarriers.length || sp.onboardedCarriersCount}</span>
                    </div>

                    <div className="flex items-center gap-1.5 pl-2 border-l border-blue-900/60">
                      <button
                        onClick={() => handleOpenEditSales(sp)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Edit Sales Person"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete sales person ${sp.name}?`)) {
                            if (onDeleteSalesPerson) onDeleteSalesPerson(sp.id);
                            else {
                              storage.deleteSalesPerson(sp.id);
                              setInternalSalesPersons(storage.getSalesPersons());
                              if (onUpdate) onUpdate();
                            }
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40"
                        title="Delete Sales Person"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setExpandedSalesPersonId(isExpanded ? null : sp.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Toggle Details"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details: Onboarded Carriers & Documents */}
                {isExpanded && (
                  <div className="pt-3 border-t border-blue-900/40 space-y-3 animate-fadeIn text-xs font-mono">
                    <div>
                      <span className="text-[11px] font-bold text-emerald-300 block mb-1">
                        Carriers Onboarded by {sp.name} ({onboardedCarriers.length}):
                      </span>
                      {onboardedCarriers.length === 0 ? (
                        <div className="p-3 bg-black/40 rounded-lg text-slate-400 text-xs">
                          No carriers linked to this sales recruiter yet. Assign this sales representative when enrolling carriers in the Roster.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {onboardedCarriers.map((c) => (
                            <div
                              key={c.id}
                              className="p-3 rounded-xl bg-black/40 border border-blue-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                            >
                              <div>
                                <div className="font-bold text-white font-sans text-xs">{c.carrierName}</div>
                                <div className="text-[11px] text-sky-400">
                                  {c.mcNumber} · {c.truckType || c.equipmentType} · Driver: {c.driverName} ({c.driverPhone})
                                </div>
                                <div className="text-[10px] text-slate-400">{c.carrierAddress || 'Address on file'}</div>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-600 font-bold">
                                  W-9 ✓
                                </span>
                                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-600 font-bold">
                                  COI ✓
                                </span>
                                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-600 font-bold">
                                  MC Auth ✓
                                </span>
                                <span className="font-bold text-emerald-400 text-xs ml-2">
                                  ${c.dispatchedAmount.toLocaleString()} Gross
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {sp.notes && (
                      <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300">
                        <strong className="text-slate-400 block text-[10px] uppercase">Notes & Strategy:</strong>
                        {sp.notes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Dispatcher Modal */}
      {isDispatcherModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#0D152A] border-2 border-sky-400/50 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-blue-900/40">
              <h3 className="text-sm font-bold text-white font-display">
                {editingDispatcher ? 'Edit Dispatch Specialist' : 'Add New Dispatch Specialist'}
              </h3>
              <button
                onClick={() => setIsDispatcherModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDispatcher} className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-slate-300 mb-1">Dispatcher Full Name:</label>
                <input
                  type="text"
                  required
                  value={dispName}
                  onChange={(e) => setDispName(e.target.value)}
                  placeholder="e.g. David Cross or Alvin"
                  className="w-full px-3 py-2 bg-black/60 border border-blue-900/60 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Direct Phone / Extension:</label>
                <input
                  type="text"
                  value={dispPhone}
                  onChange={(e) => setDispPhone(e.target.value)}
                  placeholder="+1 (409) 509-6940"
                  className="w-full px-3 py-2 bg-black/60 border border-blue-900/60 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Email Address:</label>
                <input
                  type="email"
                  value={dispEmail}
                  onChange={(e) => setDispEmail(e.target.value)}
                  placeholder="Davidcross.vl1@gmail.com"
                  className="w-full px-3 py-2 bg-black/60 border border-blue-900/60 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Shift:</label>
                  <select
                    value={dispShift}
                    onChange={(e) => setDispShift(e.target.value)}
                    className="w-full px-3 py-2 bg-black/60 border border-blue-900/60 rounded-lg text-white"
                  >
                    <option value="Day (EST/CST)">Day (EST/CST)</option>
                    <option value="Night (24/7)">Night (24/7)</option>
                    <option value="Weekend Fleet">Weekend Fleet</option>
                    <option value="Full Time">Full Time</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Commission %:</label>
                  <input
                    type="number"
                    value={dispCommission}
                    onChange={(e) => setDispCommission(Number(e.target.value))}
                    min={1}
                    max={25}
                    className="w-full px-3 py-2 bg-black/60 border border-blue-900/60 rounded-lg text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Active Status:</label>
                <select
                  value={dispStatus}
                  onChange={(e) => setDispStatus(e.target.value as 'Active' | 'Away')}
                  className="w-full px-3 py-2 bg-black/60 border border-blue-900/60 rounded-lg text-white font-bold"
                >
                  <option value="Active">Active (Taking Dispatches)</option>
                  <option value="Away">Away / On Leave</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDispatcherModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  Save Dispatcher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sales Person Modal */}
      {isSalesModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#0D152A] border-2 border-emerald-400/50 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-blue-900/40">
              <h3 className="text-sm font-bold text-white font-display">
                {editingSalesPerson ? 'Edit Carrier Sales Representative' : 'Add New Carrier Sales Representative'}
              </h3>
              <button
                onClick={() => setIsSalesModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSalesPerson} className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-slate-300 mb-1">Sales Person Full Name:</label>
                <input
                  type="text"
                  required
                  value={salesName}
                  onChange={(e) => setSalesName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins or Michael Brown"
                  className="w-full px-3 py-2 bg-black/60 border border-blue-900/60 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Phone Number:</label>
                <input
                  type="text"
                  value={salesPhone}
                  onChange={(e) => setSalesPhone(e.target.value)}
                  placeholder="+1 (409) 509-6940"
                  className="w-full px-3 py-2 bg-black/60 border border-blue-900/60 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Email Address:</label>
                <input
                  type="email"
                  value={salesEmail}
                  onChange={(e) => setSalesEmail(e.target.value)}
                  placeholder="sales@infinitydispatchllcusa.com"
                  className="w-full px-3 py-2 bg-black/60 border border-blue-900/60 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Commission %:</label>
                  <input
                    type="number"
                    value={salesCommission}
                    onChange={(e) => setSalesCommission(Number(e.target.value))}
                    min={1}
                    max={20}
                    className="w-full px-3 py-2 bg-black/60 border border-blue-900/60 rounded-lg text-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Status:</label>
                  <select
                    value={salesStatus}
                    onChange={(e) => setSalesStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-black/60 border border-blue-900/60 rounded-lg text-white font-bold"
                  >
                    <option value="Active">Active Recruiter</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Recruitment Notes & Lanes:</label>
                <textarea
                  rows={2}
                  value={salesNotes}
                  onChange={(e) => setSalesNotes(e.target.value)}
                  placeholder="Targeting owner-operators with Reefer/Flatbed in Midwest & Southeast..."
                  className="w-full px-3 py-2 bg-black/60 border border-blue-900/60 rounded-lg text-white leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSalesModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Save Sales Person
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
