import React, { useState } from 'react';
import { Conversation, DocumentStatus } from '../types';
import { PROGRESS_STEPS } from '../constants';
import { 
    User, FileText, CreditCard, Bot, ChevronDown, ChevronUp, 
    CheckCircle, XCircle, Clock, Send, FileCheck, ArrowRight, Sparkles, MoreHorizontal, Building2, Globe, Mail, FileBarChart, Zap, ShoppingCart, UploadCloud, Eye, Download, AlertCircle, Plus
} from 'lucide-react';

interface Props {
  conversation: Conversation;
  isOpen: boolean;
}

const ClientIntelligence: React.FC<Props> = ({ conversation, isOpen }) => {
    
    // Calculate stats
    const verifiedCount = conversation.documents.filter(d => d.status === 'verified').length;
    const totalDocs = conversation.documents.length;
    const progressPercent = Math.round((verifiedCount / totalDocs) * 100) || 0;

    return (
        <div className="h-full bg-slate-50 flex flex-col overflow-y-auto custom-scrollbar">
            
            {/* 1. Header & Profile Card */}
            <div className="p-6 bg-white border-b border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] z-10">
                <div className="flex items-start gap-4 mb-6">
                     <div className="relative group cursor-pointer">
                         <div className="absolute inset-0 bg-blue-500 rounded-2xl rotate-3 opacity-10 group-hover:rotate-6 transition-transform"></div>
                         <img src={conversation.client.avatar} alt="" className="relative w-16 h-16 rounded-2xl object-cover ring-1 ring-slate-100 shadow-sm" />
                         <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full shadow-md z-10">
                            <div className="bg-gradient-to-tr from-green-500 to-emerald-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                                {conversation.progressStage}%
                            </div>
                         </div>
                     </div>
                     <div className="flex-1 min-w-0">
                         <h2 className="text-lg font-bold text-slate-900 leading-tight truncate">{conversation.client.name}</h2>
                         <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 font-medium">
                            <Globe className="w-3 h-3" />
                            {conversation.client.location}
                         </div>
                         <div className="mt-2 flex flex-wrap gap-1">
                             <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-slate-100 text-[10px] font-semibold text-slate-600 border border-slate-200">
                                 {conversation.client.visaStatus}
                             </span>
                             {conversation.client.visaExpiry !== 'N/A' && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-red-50 text-[10px] font-semibold text-red-600 border border-red-100">
                                    Exp: {conversation.client.visaExpiry}
                                </span>
                             )}
                         </div>
                     </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-4 gap-3">
                    {[
                        { icon: Mail, label: 'Email', color: 'text-blue-600', bg: 'bg-blue-50 hover:bg-blue-100' },
                        { icon: FileBarChart, label: 'Brief', color: 'text-purple-600', bg: 'bg-purple-50 hover:bg-purple-100' },
                        { icon: Zap, label: 'Nudge', color: 'text-amber-600', bg: 'bg-amber-50 hover:bg-amber-100' },
                        { icon: MoreHorizontal, label: 'More', color: 'text-slate-600', bg: 'bg-slate-50 hover:bg-slate-100' },
                    ].map((action, i) => (
                        <button key={i} className={`flex flex-col items-center justify-center py-2.5 rounded-xl transition-all active:scale-95 ${action.bg}`}>
                            <action.icon className={`w-5 h-5 mb-1.5 ${action.color}`} />
                            <span className="text-[10px] font-bold text-slate-600">{action.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-5 space-y-6">

                {/* 2. Smart Documentation Checklist (THE REQUESTED FEATURE) */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-2">
                            <div className="bg-indigo-100 p-1.5 rounded-lg text-indigo-600">
                                <FileText className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">Evidence Checklist</h3>
                                <p className="text-[10px] text-slate-500 font-medium">Target: {conversation.client.qualificationTarget}</p>
                            </div>
                        </div>
                        {/* Circular Progress */}
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
                                <path className="text-slate-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                                <path className="text-indigo-500 transition-all duration-1000 ease-out" strokeDasharray={`${progressPercent}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                            </svg>
                            <span className="absolute text-[10px] font-bold text-slate-700">{progressPercent}%</span>
                        </div>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {conversation.documents.map((doc) => (
                            <div key={doc.id} className="p-3 hover:bg-slate-50 transition-colors group">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2.5 min-w-0">
                                        {doc.status === 'verified' ? (
                                            <div className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                <CheckCircle className="w-3.5 h-3.5" />
                                            </div>
                                        ) : doc.status === 'missing' ? (
                                            <div className="shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                                <AlertCircle className="w-3.5 h-3.5" />
                                            </div>
                                        ) : (
                                            <div className="shrink-0 w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                                <Clock className="w-3.5 h-3.5" />
                                            </div>
                                        )}
                                        <span className={`text-xs font-semibold truncate ${doc.status === 'missing' ? 'text-slate-400' : 'text-slate-700'}`}>
                                            {doc.name}
                                        </span>
                                    </div>
                                    
                                    {/* Actions */}
                                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                        {doc.status === 'verified' && (
                                            <>
                                            <button title="View" className="p-1.5 text-slate-400 hover:text-messenger-blue hover:bg-blue-50 rounded-md transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                                            <button title="Download" className="p-1.5 text-slate-400 hover:text-messenger-blue hover:bg-blue-50 rounded-md transition-colors"><Download className="w-3.5 h-3.5" /></button>
                                            </>
                                        )}
                                        {doc.status === 'missing' && (
                                            <button className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-[10px] font-bold transition-colors">
                                                <Sparkles className="w-3 h-3" /> Request
                                            </button>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Meta Info */}
                                <div className="pl-7 flex justify-between items-center">
                                    <span className="text-[10px] text-slate-400">
                                        {doc.status === 'verified' ? `AI Verified • ${doc.confidence}% Match` : doc.status === 'missing' ? 'Required for submission' : 'Processing...'}
                                    </span>
                                    {doc.uploadDate && <span className="text-[10px] text-slate-300">{doc.uploadDate.toLocaleDateString()}</span>}
                                </div>
                            </div>
                        ))}
                        
                        {/* Drag Drop Hint */}
                        <div className="p-3 bg-slate-50/50 border-t border-dashed border-slate-200 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-slate-100 transition-colors">
                             <UploadCloud className="w-4 h-4 text-slate-400" />
                             <span className="text-[10px] font-medium text-slate-400">Drag & Drop new evidence here</span>
                        </div>
                    </div>
                </div>

                {/* 3. Financial Cart Summary */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative overflow-hidden group">
                     {/* Decorative background */}
                     <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
                     
                     <div className="flex items-center gap-2 mb-4 relative z-10">
                         <div className="p-1.5 bg-green-100 rounded-lg text-green-700"><ShoppingCart className="w-4 h-4" /></div>
                         <h3 className="text-sm font-bold text-slate-800">Financials</h3>
                         <span className="ml-auto text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Active</span>
                     </div>
                     
                     <div className="space-y-3 relative z-10">
                         <div className="flex justify-between items-center text-xs">
                             <span className="text-slate-500 font-medium">Course Fee</span>
                             <span className="font-bold text-slate-700">${conversation.paymentTotal.toLocaleString()}</span>
                         </div>
                         <div className="flex justify-between items-center text-xs">
                             <span className="text-slate-500 font-medium">Paid to Date</span>
                             <span className="font-bold text-emerald-600">-${conversation.paymentPaid.toLocaleString()}</span>
                         </div>
                         <div className="h-px bg-slate-100 my-1"></div>
                         <div className="flex justify-between items-center">
                             <span className="text-sm font-bold text-slate-900">Outstanding</span>
                             <span className="text-lg font-bold text-slate-900">${(conversation.paymentTotal - conversation.paymentPaid).toLocaleString()}</span>
                         </div>
                     </div>
                     
                     <button className="w-full mt-4 flex items-center justify-center gap-2 bg-slate-900 text-white rounded-xl py-2.5 text-xs font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                         <Mail className="w-3.5 h-3.5" /> Send Invoice & Pay Link
                     </button>
                </div>
                
                {/* 4. Notes / Internal */}
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <div className="flex items-center gap-2 mb-2 text-amber-800">
                        <FileText className="w-4 h-4" />
                        <h3 className="text-xs font-bold uppercase tracking-wide">Internal Notes</h3>
                    </div>
                    <p className="text-xs text-amber-900/80 leading-relaxed font-medium">
                        Client prefers evening calls. Needs final certificate by Dec 15th for visa application.
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                        <img src="https://ui-avatars.com/api/?name=Agent+Smith&background=FCD34D&color=78350F" className="w-5 h-5 rounded-full" alt="" />
                        <span className="text-[10px] text-amber-700 font-bold">Added by You • 2d ago</span>
                    </div>
                </div>

                {/* Source Info */}
                <div className="flex items-center justify-between px-2 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                     <span>Source: {conversation.source === 'sub_agent' ? 'Partner Network' : 'Direct Traffic'}</span>
                     <span>ID: #{conversation.id.toUpperCase()}</span>
                </div>

            </div>
        </div>
    );
};

export default ClientIntelligence;