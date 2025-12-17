import React, { useState } from 'react';
import { Conversation, DocumentStatus } from '../types';
import { PROGRESS_STEPS } from '../constants';
import { 
    User, FileText, CreditCard, Bot, ChevronDown, ChevronUp, 
    CheckCircle, XCircle, Clock, Mail, FileCheck, ArrowRight, Sparkles
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
  <div className="border-b border-gray-100">
    <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
    >
        <div className="flex items-center gap-3 text-gray-700 font-semibold text-sm">
            {icon}
            {title}
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
    </button>
    {isOpen && <div className="p-4 pt-0 text-sm animate-in fade-in slide-in-from-top-2 duration-200">{children}</div>}
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
            case 'verified': return <CheckCircle className="w-4 h-4 text-messenger-green" />;
            case 'missing': return <XCircle className="w-4 h-4 text-messenger-red" />;
            case 'pending': return <Clock className="w-4 h-4 text-messenger-orange" />;
            default: return <Clock className="w-4 h-4 text-gray-400" />;
        }
    };

    const activeStepIndex = PROGRESS_STEPS.indexOf(conversation.currentStep);

    return (
        <div className={`
            ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
            fixed lg:static inset-y-0 right-0 z-40
            w-96 h-full bg-white border-l border-gray-200 flex flex-col transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none overflow-y-auto
        `}>
            {/* Header */}
            <div className="p-6 border-b border-gray-100 text-center">
                <div className="relative inline-block mb-3">
                     <img src={conversation.client.avatar} alt="" className="w-20 h-20 rounded-full mx-auto object-cover ring-4 ring-gray-50" />
                     <div className="absolute bottom-1 right-1 bg-messenger-green text-white text-[10px] font-bold px-1.5 py-0.5 rounded border border-white">98%</div>
                </div>
                <h2 className="text-lg font-bold text-gray-900">{conversation.client.name}</h2>
                <p className="text-sm text-gray-500">{conversation.client.location}</p>
                <div className="mt-3 flex justify-center gap-2">
                    <button className="text-xs bg-messenger-blue text-white px-4 py-1.5 rounded-full font-medium shadow-sm hover:shadow-md transition-shadow">
                        Generate Report
                    </button>
                    <button className="text-xs bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full font-medium hover:bg-gray-200 transition-colors">
                        Edit
                    </button>
                </div>
            </div>

            {/* Accordions */}
            <div className="flex-1">
                {/* 1. Status Overview */}
                <AccordionItem 
                    title="Status Overview" 
                    icon={<div className="w-5 h-5 rounded-full bg-blue-100 text-messenger-blue flex items-center justify-center text-xs font-bold">%</div>}
                    isOpen={openSections.overview}
                    onToggle={() => toggleSection('overview')}
                >
                    <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1 font-medium text-gray-600">
                            <span>Progress</span>
                            <span>{conversation.progressStage}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 mb-4 relative overflow-hidden">
                            <div 
                                className="bg-messenger-blue h-2 rounded-full transition-all duration-1000 ease-out relative" 
                                style={{ width: `${conversation.progressStage}%` }}
                            >
                                <div className="absolute inset-0 bg-white/30 animate-[pulse_2s_infinite]"></div>
                            </div>
                        </div>
                        <div className="flex justify-between items-start text-xs text-gray-500">
                             {PROGRESS_STEPS.map((step, i) => {
                                 const isActive = conversation.currentStep === step;
                                 const isCompleted = i < activeStepIndex;
                                 
                                 return (
                                     <div key={step} className={`flex flex-col items-center gap-1 transition-all duration-500 ${isActive ? 'text-messenger-blue font-bold scale-105' : (isCompleted ? 'text-gray-700 font-medium' : 'text-gray-300')}`}>
                                         <div className="relative flex items-center justify-center h-4 w-4 my-0.5">
                                             {isActive && (
                                                <>
                                                    <span className="absolute h-full w-full rounded-full bg-messenger-blue opacity-20 animate-ping"></span>
                                                    <span className="absolute h-3 w-3 rounded-full bg-messenger-blue opacity-40 animate-pulse"></span>
                                                </>
                                             )}
                                             <div className={`relative w-2 h-2 rounded-full transition-colors duration-500 ${isActive || isCompleted ? 'bg-messenger-blue' : 'bg-gray-200'}`}></div>
                                         </div>
                                         <span className="scale-75 origin-top whitespace-nowrap">{step}</span>
                                     </div>
                                 );
                             })}
                        </div>
                    </div>
                </AccordionItem>

                 {/* 2. AI Task Monitor */}
                 <AccordionItem 
                    title="AI Task Monitor" 
                    icon={<Bot className="w-4 h-4 text-messenger-purple" />}
                    isOpen={openSections.ai}
                    onToggle={() => toggleSection('ai')}
                >
                    <div className="space-y-3">
                        <div className="bg-messenger-purple/5 border border-messenger-purple/10 rounded-lg p-3">
                             <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-messenger-purple flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" /> Auto-Analysis
                                </span>
                                <span className="text-[10px] bg-white text-messenger-purple px-1.5 rounded border border-messenger-purple/20">Active</span>
                             </div>
                             <p className="text-xs text-gray-600 mb-2">Analyzing conversation for qualification gaps.</p>
                             <div className="flex gap-2">
                                 <button className="flex-1 text-[10px] py-1 bg-white border border-gray-200 rounded text-gray-600 hover:border-messenger-purple transition-colors">
                                    View Insights
                                 </button>
                             </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quick Actions</h4>
                            <button className="w-full text-left flex items-center gap-2 p-2 hover:bg-gray-50 rounded text-xs text-gray-700 transition-colors border border-dashed border-gray-200">
                                <Mail className="w-3 h-3 text-messenger-blue" />
                                Email StudyPath RTO
                            </button>
                            <button className="w-full text-left flex items-center gap-2 p-2 hover:bg-gray-50 rounded text-xs text-gray-700 transition-colors border border-dashed border-gray-200">
                                <FileCheck className="w-3 h-3 text-messenger-green" />
                                Validate Visa Status
                            </button>
                        </div>
                    </div>
                </AccordionItem>

                {/* 3. Document Tracker */}
                <AccordionItem 
                    title={`Documents (${conversation.documents.filter(d => d.status === 'verified').length}/${conversation.documents.length})`} 
                    icon={<FileText className="w-4 h-4 text-gray-500" />}
                    isOpen={openSections.docs}
                    onToggle={() => toggleSection('docs')}
                >
                    <div className="space-y-2">
                        {conversation.documents.map(doc => (
                            <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg group">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    {getStatusIcon(doc.status)}
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-xs font-medium truncate text-gray-700">{doc.name}</span>
                                        {doc.status === 'verified' && (
                                            <span className="text-[10px] text-green-600 flex items-center gap-0.5">
                                                AI Conf: {doc.confidence}%
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-messenger-blue">
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                         <button className="w-full py-2 text-xs text-messenger-blue font-medium hover:bg-blue-50 rounded border border-dashed border-blue-200 mt-2">
                            + Request New Document
                        </button>
                    </div>
                </AccordionItem>

                {/* 4. Client Profile */}
                <AccordionItem 
                    title="Client Profile" 
                    icon={<User className="w-4 h-4 text-gray-500" />}
                    isOpen={openSections.profile}
                    onToggle={() => toggleSection('profile')}
                >
                    <div className="space-y-3 text-xs">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-gray-400">Target Qual</label>
                                <p className="font-medium">{conversation.client.qualificationTarget}</p>
                            </div>
                            <div>
                                <label className="text-gray-400">Experience</label>
                                <p className="font-medium">{conversation.client.experienceYears} Years</p>
                            </div>
                            <div>
                                <label className="text-gray-400">Visa</label>
                                <p className="font-medium">{conversation.client.visaStatus}</p>
                            </div>
                             <div>
                                <label className="text-gray-400">Expires</label>
                                <p className="font-medium text-messenger-red">{conversation.client.visaExpiry}</p>
                            </div>
                        </div>
                    </div>
                </AccordionItem>

                 {/* 5. Payment */}
                 <AccordionItem 
                    title="Payment Status" 
                    icon={<CreditCard className="w-4 h-4 text-gray-500" />}
                    isOpen={openSections.payment}
                    onToggle={() => toggleSection('payment')}
                >
                    <div className="space-y-3 text-xs">
                       <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                           <span className="text-gray-500">Total Fee</span>
                           <span className="font-bold text-gray-900">${conversation.paymentTotal.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg border border-green-100">
                           <span className="text-green-700">Paid</span>
                           <span className="font-bold text-green-700">${conversation.paymentPaid.toLocaleString()}</span>
                       </div>
                        <div className="flex justify-between items-center bg-red-50 p-3 rounded-lg border border-red-100">
                           <span className="text-red-700">Balance</span>
                           <span className="font-bold text-red-700">${(conversation.paymentTotal - conversation.paymentPaid).toLocaleString()}</span>
                       </div>
                       <button className="w-full bg-messenger-blue text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-sm">
                           Send Payment Link
                       </button>
                    </div>
                </AccordionItem>
            </div>
        </div>
    );
};

export default ClientIntelligence;