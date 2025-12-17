import React, { useState } from 'react';
import { Conversation, DocumentStatus } from '../types';
import { PROGRESS_STEPS } from '../constants';
import { 
    User, FileText, CreditCard, Bot, ChevronDown, ChevronUp, 
    CheckCircle, XCircle, Clock, Mail, FileCheck, ArrowRight, Sparkles, MoreHorizontal
} from 'lucide-react';

interface Props {
  conversation: Conversation;
  isOpen: boolean;
}

const AccordionItem: React.FC<{
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, icon, isOpen, onToggle, children }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
    <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors text-left"
    >
        <div className="flex items-center gap-3 text-slate-700 font-semibold text-sm">
            {icon}
            {title}
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
    </button>
    {isOpen && <div className="p-4 pt-0 text-sm animate-in fade-in slide-in-from-top-2 duration-300">{children}</div>}
  </div>
);

const ClientIntelligence: React.FC<Props> = ({ conversation, isOpen }) => {
    // Accordion State
    const [openSections, setOpenSections] = useState({
        overview: true,
        docs: true,
        profile: false,
        payment: false,
        ai: true
    });

    const toggleSection = (key: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

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
        <div className={`
            ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
            fixed lg:static inset-y-0 right-0 z-40
            w-96 h-full bg-slate-50/50 border-l border-slate-200/60 flex flex-col transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none overflow-y-auto
        `}>
            {/* Header */}
            <div className="p-8 pb-6 text-center bg-white border-b border-slate-100">
                <div className="relative inline-block mb-4 group">
                     <div className="absolute inset-0 bg-blue-500 rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                     <img src={conversation.client.avatar} alt="" className="relative w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-white shadow-lg" />
                     <div className="absolute bottom-1 right-1 bg-gradient-to-tr from-green-500 to-emerald-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm">98%</div>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">{conversation.client.name}</h2>
                <p className="text-sm text-slate-500 font-medium">{conversation.client.location}</p>
                <div className="mt-5 flex justify-center gap-3">
                    <button className="text-xs bg-slate-900 text-white px-5 py-2 rounded-xl font-semibold shadow-lg shadow-slate-200 hover:bg-slate-800 hover:scale-105 transition-all">
                        Generate Report
                    </button>
                    <button className="p-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-5 space-y-4">
                {/* 1. Status Overview */}
                <AccordionItem 
                    title="Status Overview" 
                    icon={<div className="w-6 h-6 rounded-lg bg-blue-50 text-messenger-blue flex items-center justify-center text-xs font-bold ring-1 ring-blue-100">%</div>}
                    isOpen={openSections.overview}
                    onToggle={() => toggleSection('overview')}
                >
                    <div className="mt-2">
                        <div className="flex justify-between text-xs mb-2 font-semibold text-slate-600">
                            <span>Progress</span>
                            <span>{conversation.progressStage}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 mb-6 relative overflow-hidden shadow-inner">
                            <div 
                                className="bg-gradient-to-r from-messenger-blue to-cyan-400 h-2.5 rounded-full transition-all duration-1000 ease-out relative shadow-sm" 
                                style={{ width: `${conversation.progressStage}%` }}
                            >
                                <div className="absolute inset-0 bg-white/30 animate-[pulse_2s_infinite]"></div>
                            </div>
                        </div>
                        <div className="flex justify-between items-start text-xs text-slate-400 relative">
                             {/* Connecting Line */}
                             <div className="absolute top-2 left-0 w-full h-0.5 bg-slate-100 -z-10"></div>
                             
                             {PROGRESS_STEPS.map((step, i) => {
                                 const isActive = conversation.currentStep === step;
                                 const isCompleted = i < activeStepIndex;
                                 
                                 return (
                                     <div key={step} className={`flex flex-col items-center gap-2 transition-all duration-500 ${isActive ? 'text-messenger-blue font-bold' : (isCompleted ? 'text-slate-600 font-medium' : '')}`}>
                                         <div className="relative flex items-center justify-center h-4 w-4">
                                             {isActive && (
                                                <>
                                                    <span className="absolute h-full w-full rounded-full bg-messenger-blue opacity-20 animate-ping"></span>
                                                    <span className="absolute h-3 w-3 rounded-full bg-messenger-blue opacity-40 animate-pulse"></span>
                                                </>
                                             )}
                                             <div className={`w-2.5 h-2.5 rounded-full ring-4 ring-white transition-colors duration-500 ${isActive || isCompleted ? 'bg-messenger-blue shadow-sm' : 'bg-slate-200'}`}></div>
                                         </div>
                                         <span className={`text-[10px] whitespace-nowrap px-2 py-0.5 rounded-md ${isActive ? 'bg-blue-50' : ''}`}>{step}</span>
                                     </div>
                                 );
                             })}
                        </div>
                    </div>
                </AccordionItem>

                 {/* 2. AI Task Monitor */}
                 <AccordionItem 
                    title="AI Task Monitor" 
                    icon={<div className="w-6 h-6 rounded-lg bg-purple-50 text-messenger-purple flex items-center justify-center ring-1 ring-purple-100"><Bot className="w-4 h-4" /></div>}
                    isOpen={openSections.ai}
                    onToggle={() => toggleSection('ai')}
                >
                    <div className="space-y-3">
                        <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-xl p-3 shadow-sm">
                             <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-messenger-purple flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5" /> Auto-Analysis
                                </span>
                                <span className="text-[10px] font-semibold bg-white text-messenger-purple px-2 py-0.5 rounded-full border border-purple-100 shadow-sm">Active</span>
                             </div>
                             <p className="text-xs text-slate-600 mb-3 leading-relaxed">Analyzing conversation for qualification gaps against updated standards.</p>
                             <div className="flex gap-2">
                                 <button className="flex-1 text-[10px] font-medium py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:border-messenger-purple hover:text-messenger-purple transition-all shadow-sm">
                                    View Insights
                                 </button>
                             </div>
                        </div>

                        <div className="space-y-2 pt-1">
                            <button className="w-full text-left flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-xl text-xs font-medium text-slate-700 transition-colors border border-dashed border-slate-200 hover:border-messenger-blue group">
                                <div className="p-1.5 bg-blue-50 text-messenger-blue rounded-lg group-hover:bg-blue-100 transition-colors"><Mail className="w-3.5 h-3.5" /></div>
                                Email StudyPath RTO
                            </button>
                            <button className="w-full text-left flex items-center gap-3 p-2.5 hover:bg-slate-50 rounded-xl text-xs font-medium text-slate-700 transition-colors border border-dashed border-slate-200 hover:border-green-500 group">
                                <div className="p-1.5 bg-green-50 text-green-600 rounded-lg group-hover:bg-green-100 transition-colors"><FileCheck className="w-3.5 h-3.5" /></div>
                                Validate Visa Status
                            </button>
                        </div>
                    </div>
                </AccordionItem>

                {/* 3. Document Tracker */}
                <AccordionItem 
                    title={`Documents (${conversation.documents.filter(d => d.status === 'verified').length}/${conversation.documents.length})`} 
                    icon={<div className="w-6 h-6 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center ring-1 ring-orange-100"><FileText className="w-4 h-4" /></div>}
                    isOpen={openSections.docs}
                    onToggle={() => toggleSection('docs')}
                >
                    <div className="space-y-2">
                        {conversation.documents.map(doc => (
                            <div key={doc.id} className="flex items-center justify-between p-2.5 bg-slate-50/50 border border-slate-100 rounded-xl group hover:border-slate-200 hover:bg-slate-50 transition-all">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    {getStatusIcon(doc.status)}
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-xs font-semibold text-slate-700 truncate">{doc.name}</span>
                                        {doc.status === 'verified' && (
                                            <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                                                AI Conf: {doc.confidence}%
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-messenger-blue shadow-sm">
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                         <button className="w-full py-2.5 text-xs text-messenger-blue font-semibold hover:bg-blue-50 rounded-xl border border-dashed border-blue-200 mt-2 transition-colors">
                            + Request New Document
                        </button>
                    </div>
                </AccordionItem>

                {/* 4. Client Profile */}
                <AccordionItem 
                    title="Client Profile" 
                    icon={<div className="w-6 h-6 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center ring-1 ring-slate-200"><User className="w-4 h-4" /></div>}
                    isOpen={openSections.profile}
                    onToggle={() => toggleSection('profile')}
                >
                    <div className="space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                <label className="text-slate-400 font-medium block mb-1">Target Qual</label>
                                <p className="font-semibold text-slate-700">{conversation.client.qualificationTarget}</p>
                            </div>
                            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                <label className="text-slate-400 font-medium block mb-1">Experience</label>
                                <p className="font-semibold text-slate-700">{conversation.client.experienceYears} Years</p>
                            </div>
                            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                                <label className="text-slate-400 font-medium block mb-1">Visa</label>
                                <p className="font-semibold text-slate-700">{conversation.client.visaStatus}</p>
                            </div>
                             <div className="p-2.5 bg-red-50 rounded-xl border border-red-100">
                                <label className="text-red-400 font-medium block mb-1">Expires</label>
                                <p className="font-bold text-red-600">{conversation.client.visaExpiry}</p>
                            </div>
                        </div>
                    </div>
                </AccordionItem>

                 {/* 5. Payment */}
                 <AccordionItem 
                    title="Payment Status" 
                    icon={<div className="w-6 h-6 rounded-lg bg-green-50 text-green-600 flex items-center justify-center ring-1 ring-green-100"><CreditCard className="w-4 h-4" /></div>}
                    isOpen={openSections.payment}
                    onToggle={() => toggleSection('payment')}
                >
                    <div className="space-y-3 text-xs">
                       <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                           <span className="text-slate-500 font-medium">Total Fee</span>
                           <span className="font-bold text-slate-900 text-sm">${conversation.paymentTotal.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                           <span className="text-emerald-700 font-medium">Paid</span>
                           <span className="font-bold text-emerald-700 text-sm">${conversation.paymentPaid.toLocaleString()}</span>
                       </div>
                        <div className="flex justify-between items-center bg-red-50 p-3 rounded-xl border border-red-100">
                           <span className="text-red-700 font-medium">Balance</span>
                           <span className="font-bold text-red-700 text-sm">${(conversation.paymentTotal - conversation.paymentPaid).toLocaleString()}</span>
                       </div>
                       <button className="w-full bg-messenger-blue text-white py-2.5 rounded-xl font-semibold hover:bg-blue-600 transition-all shadow-lg shadow-blue-200 mt-1">
                           Send Payment Link
                       </button>
                    </div>
                </AccordionItem>
            </div>
        </div>
    );
};

export default ClientIntelligence;