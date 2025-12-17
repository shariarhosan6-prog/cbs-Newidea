import React, { useState } from 'react';
import { Conversation, DocumentStatus } from '../types';
import { PROGRESS_STEPS } from '../constants';
import { 
    User, FileText, CreditCard, Bot, ChevronDown, ChevronUp, 
    CheckCircle, XCircle, Clock, Send, FileCheck, ArrowRight, Sparkles, MoreHorizontal, Building2, Globe, Mail, FileBarChart, Zap, ShoppingCart
} from 'lucide-react';

interface Props {
  conversation: Conversation;
  isOpen: boolean;
}

const ClientIntelligence: React.FC<Props> = ({ conversation, isOpen }) => {
    
    const getStatusIcon = (status: DocumentStatus['status']) => {
        switch(status) {
            case 'verified': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
            case 'missing': return <XCircle className="w-4 h-4 text-red-500" />;
            case 'pending': return <Clock className="w-4 h-4 text-orange-500" />;
            default: return <Clock className="w-4 h-4 text-slate-300" />;
        }
    };

    const activeStepIndex = PROGRESS_STEPS.indexOf(conversation.currentStep);

    return (
        <div className="h-full bg-slate-50 flex flex-col overflow-y-auto">
            {/* 1. Header & Profile Card */}
            <div className="p-6 bg-white border-b border-slate-100">
                <div className="flex items-start gap-4 mb-6">
                     <div className="relative group">
                         <img src={conversation.client.avatar} alt="" className="w-16 h-16 rounded-2xl object-cover ring-1 ring-slate-100 shadow-sm" />
                         <div className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full shadow-md">
                            <div className="bg-gradient-to-tr from-green-500 to-emerald-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">98%</div>
                         </div>
                     </div>
                     <div className="flex-1">
                         <h2 className="text-lg font-bold text-slate-900 leading-tight">{conversation.client.name}</h2>
                         <p className="text-xs text-slate-500 font-medium mb-2">{conversation.client.location}</p>
                         <span className="inline-flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-lg text-[10px] font-semibold text-slate-600">
                             {conversation.client.visaStatus} <span className="text-slate-300">|</span> <span className="text-red-500">Exp: {conversation.client.visaExpiry}</span>
                         </span>
                     </div>
                </div>

                {/* Quick Actions Grid (New) */}
                <div className="grid grid-cols-4 gap-2 mb-2">
                    {[
                        { icon: Mail, label: 'Email', color: 'text-blue-500', bg: 'bg-blue-50' },
                        { icon: FileBarChart, label: 'Report', color: 'text-purple-500', bg: 'bg-purple-50' },
                        { icon: Zap, label: 'Urgent', color: 'text-orange-500', bg: 'bg-orange-50' },
                        { icon: MoreHorizontal, label: 'More', color: 'text-slate-500', bg: 'bg-slate-50' },
                    ].map((action, i) => (
                        <button key={i} className={`flex flex-col items-center justify-center p-2 rounded-xl transition-transform active:scale-95 hover:bg-opacity-80 ${action.bg}`}>
                            <action.icon className={`w-5 h-5 mb-1 ${action.color}`} />
                            <span className="text-[10px] font-semibold text-slate-600">{action.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-5 space-y-6">

                {/* Financial Cart Summary (The "Cart") */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-green-100 to-transparent opacity-50 rounded-bl-full -mr-4 -mt-4"></div>
                     <div className="flex items-center gap-2 mb-4">
                         <div className="p-1.5 bg-green-50 rounded-lg text-green-600"><ShoppingCart className="w-4 h-4" /></div>
                         <h3 className="text-sm font-bold text-slate-800">Financial Summary</h3>
                     </div>
                     
                     <div className="space-y-3">
                         <div className="flex justify-between items-center text-xs">
                             <span className="text-slate-500">Course Fee</span>
                             <span className="font-semibold text-slate-800">${conversation.paymentTotal.toLocaleString()}</span>
                         </div>
                         <div className="flex justify-between items-center text-xs">
                             <span className="text-slate-500">Discount applied</span>
                             <span className="font-semibold text-green-600">-$0.00</span>
                         </div>
                         <div className="h-px bg-slate-100 my-1"></div>
                         <div className="flex justify-between items-center">
                             <span className="text-xs font-bold text-slate-700">Total Due</span>
                             <span className="text-sm font-bold text-slate-900">${(conversation.paymentTotal - conversation.paymentPaid).toLocaleString()}</span>
                         </div>
                     </div>
                     
                     <div className="mt-4 flex gap-2">
                         <div className="flex-1 bg-slate-50 rounded-lg p-2 text-center">
                             <span className="block text-[10px] text-slate-400 uppercase tracking-wide">Paid</span>
                             <span className="text-xs font-bold text-green-600">${conversation.paymentPaid.toLocaleString()}</span>
                         </div>
                         <button className="flex-1 bg-slate-900 text-white rounded-lg py-2 text-xs font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
                             Send Invoice
                         </button>
                     </div>
                </div>

                {/* Status Timeline */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Application Progress</h3>
                    <div className="relative pl-2">
                         <div className="absolute top-0 bottom-0 left-[5px] w-0.5 bg-slate-100"></div>
                         <div className="space-y-4">
                             {PROGRESS_STEPS.map((step, i) => {
                                 const isActive = conversation.currentStep === step;
                                 const isCompleted = i < activeStepIndex;
                                 
                                 return (
                                     <div key={step} className="flex items-center gap-3 relative">
                                         <div className={`w-3 h-3 rounded-full ring-4 ring-white z-10 ${isActive ? 'bg-messenger-blue' : (isCompleted ? 'bg-green-500' : 'bg-slate-200')}`}></div>
                                         <span className={`text-xs ${isActive ? 'font-bold text-slate-800' : 'font-medium text-slate-500'}`}>{step}</span>
                                         {isActive && <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-bold rounded ml-auto">Current</span>}
                                     </div>
                                 );
                             })}
                         </div>
                    </div>
                </div>

                {/* AI Document Monitor */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-5 shadow-lg shadow-indigo-200 text-white relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                    
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="flex items-center gap-2">
                            <Bot className="w-5 h-5 text-indigo-200" />
                            <h3 className="font-bold text-sm">AI Agent</h3>
                        </div>
                        <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-medium backdrop-blur-sm">Active</span>
                    </div>

                    <div className="space-y-3 relative z-10">
                        <div className="flex justify-between items-center text-xs text-indigo-100">
                            <span>Document Check</span>
                            <span className="text-white font-bold">{conversation.documents.filter(d => d.status === 'verified').length}/{conversation.documents.length}</span>
                        </div>
                        <div className="w-full bg-black/20 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-white h-full rounded-full w-3/5"></div>
                        </div>
                        <p className="text-[11px] text-indigo-100 leading-relaxed mt-1">
                            Waiting for <span className="font-bold text-white">USI Transcript</span>. Auto-reminder scheduled for 2:00 PM.
                        </p>
                    </div>

                    <button className="mt-4 w-full bg-white text-indigo-600 py-2 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors">
                        View Analysis
                    </button>
                </div>

                {/* Source/Upstream Info */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 border-dashed">
                     <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                         <span>Source</span>
                         <span className="font-semibold text-slate-700">{conversation.source === 'sub_agent' ? 'B2B Partner' : 'Direct Lead'}</span>
                     </div>
                     <div className="flex items-center justify-between text-xs text-slate-500">
                         <span>Upstream RTO</span>
                         <span className="font-semibold text-indigo-600">StudyPath RTO</span>
                     </div>
                </div>

            </div>
        </div>
    );
};

export default ClientIntelligence;