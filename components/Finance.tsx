import React, { useState } from 'react';
import { MOCK_COMMISSIONS, MOCK_COUNSELORS } from '../constants';
import { CommissionRecord, TransactionType } from '../types';
import { DollarSign, ArrowUpRight, ArrowDownLeft, Users, Building2, TrendingUp, Search, Filter, Calendar, Briefcase, Download, ChevronRight } from 'lucide-react';

const Finance: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'receivables' | 'payables' | 'team'>('overview');
    
    // Calculations
    const totalIncoming = MOCK_COMMISSIONS.filter(c => c.type === 'incoming').reduce((acc, curr) => acc + curr.amount, 0);
    const totalOutgoingSub = MOCK_COMMISSIONS.filter(c => c.type === 'outgoing_sub_agent').reduce((acc, curr) => acc + curr.amount, 0);
    const totalOutgoingStaff = MOCK_COMMISSIONS.filter(c => c.type === 'outgoing_staff').reduce((acc, curr) => acc + curr.amount, 0);
    const totalOutgoing = totalOutgoingSub + totalOutgoingStaff;
    const netProfit = totalIncoming - totalOutgoing;

    const filteredTransactions = MOCK_COMMISSIONS.filter(tx => {
        if (activeTab === 'receivables') return tx.type === 'incoming';
        if (activeTab === 'payables') return tx.type !== 'incoming';
        return true;
    });

    return (
        <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
            {/* Header */}
            <div className="p-8 bg-white border-b border-slate-100 flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Commission & Finance Hub</h1>
                    <p className="text-slate-500 text-sm mt-1">Track incoming commissions from RTOs and manage payouts to Sub-Agents & Counselors.</p>
                </div>
                <button className="flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors">
                    <Download className="w-4 h-4" /> Export Report
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="px-8 border-b border-slate-200 bg-white">
                <div className="flex gap-8">
                    {['overview', 'receivables', 'payables', 'team'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`py-4 text-sm font-bold capitalize relative transition-colors ${activeTab === tab ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {tab}
                            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-8">
                
                {/* 1. STATS OVERVIEW CARDS */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* INCOMING */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <ArrowDownLeft className="w-24 h-24 text-emerald-500" />
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Building2 className="w-5 h-5" /></div>
                                <span className="text-sm font-bold text-slate-500">From RTOs / Super Agents</span>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-800">${totalIncoming.toLocaleString()}</h3>
                            <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> +12% this month
                            </p>
                        </div>

                        {/* OUTGOING */}
                        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <ArrowUpRight className="w-24 h-24 text-red-500" />
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-2 bg-red-50 rounded-lg text-red-600"><Users className="w-5 h-5" /></div>
                                <span className="text-sm font-bold text-slate-500">To Sub-Agents & Staff</span>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-800">${totalOutgoing.toLocaleString()}</h3>
                            <div className="flex gap-3 mt-2">
                                <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-md font-semibold">
                                    Sub-Agents: ${totalOutgoingSub.toLocaleString()}
                                </span>
                                <span className="text-[10px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-md font-semibold">
                                    Staff: ${totalOutgoingStaff.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* NET PROFIT */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 shadow-lg relative overflow-hidden text-white">
                             <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20"></div>
                             <div className="flex items-center gap-2 mb-2 relative z-10">
                                <div className="p-2 bg-white/10 rounded-lg"><DollarSign className="w-5 h-5" /></div>
                                <span className="text-sm font-bold text-slate-300">Net Profit (Estimated)</span>
                            </div>
                            <h3 className="text-3xl font-bold relative z-10">${netProfit.toLocaleString()}</h3>
                            <p className="text-xs text-slate-400 mt-2 relative z-10">
                                Based on active deals in pipeline.
                            </p>
                        </div>
                    </div>
                )}

                {/* 2. TEAM PERFORMANCE VIEW */}
                {activeTab === 'team' ? (
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                         {MOCK_COUNSELORS.map(counselor => (
                             <div key={counselor.id} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-5">
                                 <img src={counselor.avatar} alt={counselor.name} className="w-16 h-16 rounded-full ring-4 ring-slate-50" />
                                 <div className="flex-1">
                                     <div className="flex justify-between items-start">
                                         <div>
                                            <h3 className="font-bold text-slate-900 text-lg">{counselor.name}</h3>
                                            <p className="text-xs text-slate-500 font-medium">Sales Counselor</p>
                                         </div>
                                         <div className="text-right">
                                             <span className="block text-lg font-bold text-emerald-600">${counselor.commissionEarned.toLocaleString()}</span>
                                             <span className="text-[10px] text-slate-400 uppercase tracking-wide">Commission Earned</span>
                                         </div>
                                     </div>
                                     
                                     <div className="mt-4 grid grid-cols-2 gap-4">
                                         <div className="bg-slate-50 rounded-lg p-2">
                                             <span className="block text-slate-400 text-[10px] font-bold uppercase">Total Sales</span>
                                             <span className="text-sm font-bold text-slate-700">${counselor.totalSales.toLocaleString()}</span>
                                         </div>
                                         <div className="bg-slate-50 rounded-lg p-2">
                                             <span className="block text-slate-400 text-[10px] font-bold uppercase">Active Deals</span>
                                             <span className="text-sm font-bold text-slate-700">{counselor.activeDeals} Files</span>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                         ))}
                     </div>
                ) : (
                    /* 3. TRANSACTIONS LIST (Ledger) */
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="font-bold text-slate-700 text-sm">Transaction Ledger</h3>
                            <div className="flex gap-2">
                                <button className="p-1.5 text-slate-400 hover:bg-white rounded-md transition-colors"><Search className="w-4 h-4" /></button>
                                <button className="p-1.5 text-slate-400 hover:bg-white rounded-md transition-colors"><Filter className="w-4 h-4" /></button>
                            </div>
                        </div>
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-3">Client / Reference</th>
                                    <th className="px-6 py-3">Entity (From/To)</th>
                                    <th className="px-6 py-3">Type</th>
                                    <th className="px-6 py-3">Due Date</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredTransactions.map(tx => (
                                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-800">{tx.clientName}</div>
                                            <div className="text-xs text-slate-400">{tx.description}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`p-1 rounded-md ${tx.type === 'incoming' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                                                    {tx.type === 'incoming' ? <Building2 className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                                                </div>
                                                <span className="font-medium text-slate-700">{tx.relatedEntityName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide border
                                                ${tx.type === 'incoming' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                                : tx.type === 'outgoing_sub_agent' ? 'bg-purple-50 text-purple-700 border-purple-100'
                                                : 'bg-blue-50 text-blue-700 border-blue-100'
                                                }
                                            `}>
                                                {tx.type === 'incoming' ? 'Receivable' : tx.type === 'outgoing_sub_agent' ? 'Sub-Agent Payout' : 'Staff Bonus'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 font-medium">
                                            {tx.dueDate.toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            {tx.status === 'paid' && <span className="flex items-center gap-1 text-xs font-bold text-emerald-600"><CheckCircle2 className="w-3.5 h-3.5" /> Paid</span>}
                                            {tx.status === 'pending' && <span className="flex items-center gap-1 text-xs font-bold text-amber-500"><Clock className="w-3.5 h-3.5" /> Pending</span>}
                                            {tx.status === 'overdue' && <span className="flex items-center gap-1 text-xs font-bold text-red-500"><AlertCircle className="w-3.5 h-3.5" /> Overdue</span>}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`font-bold ${tx.type === 'incoming' ? 'text-emerald-600' : 'text-slate-800'}`}>
                                                {tx.type === 'incoming' ? '+' : '-'}${tx.amount.toLocaleString()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredTransactions.length === 0 && (
                             <div className="p-8 text-center text-slate-400">
                                 No transactions found for this filter.
                             </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// Required Icons for status
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default Finance;