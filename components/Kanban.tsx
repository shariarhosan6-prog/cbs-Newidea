
import React, { useState } from 'react';
import { ApplicationStage, ApplicationCard, ApplicationType } from '../types';
import { MoreHorizontal, Plus, Search, Filter, CalendarClock, FileText, User, GraduationCap, Briefcase, ChevronDown } from 'lucide-react';

const Kanban: React.FC = () => {
  const [activePipeline, setActivePipeline] = useState<ApplicationType>('rpl');

  // --- CONFIGURATION: RPL PIPELINE ---
  const RPL_STAGES: { id: ApplicationStage; label: string; color: string }[] = [
    { id: 'lead', label: 'New Leads', color: 'bg-slate-100' },
    { id: 'evidence_collection', label: 'Evidence Collection', color: 'bg-blue-50' },
    { id: 'mediator_review', label: 'Mediator Review', color: 'bg-indigo-50' },
    { id: 'rto_submission', label: 'RTO Processing', color: 'bg-orange-50' },
    { id: 'certified', label: 'Certified', color: 'bg-emerald-50' },
  ];

  // --- CONFIGURATION: ADMISSION PIPELINE ---
  const ADMISSION_STAGES: { id: ApplicationStage; label: string; color: string }[] = [
    { id: 'lead', label: 'Uni Enquiries', color: 'bg-slate-100' },
    { id: 'app_lodged', label: 'App Lodged', color: 'bg-purple-50' },
    { id: 'conditional_offer', label: 'Conditional Offer', color: 'bg-fuchsia-50' },
    { id: 'gte_assessment', label: 'GTE / GS Check', color: 'bg-pink-50' },
    { id: 'coe_issued', label: 'CoE Issued', color: 'bg-green-50' },
  ];

  // --- MOCK DATA (Mixed) ---
  const allCards: ApplicationCard[] = [
    // RPL CARDS
    { 
        id: '1', type: 'rpl', clientName: 'Sarah Jenkins', qualification: 'Dip. Project Mgmt', stage: 'mediator_review', 
        tags: ['Direct'], value: '$2,500', daysInStage: 2, missingDocs: 1, counselor: 'Jessica Wu' 
    },
    { 
        id: '2', type: 'rpl', clientName: 'Michael Chen', qualification: 'Cert IV Cookery', stage: 'evidence_collection', 
        tags: ['Global Ed'], value: '$3,200', daysInStage: 14, missingDocs: 4, counselor: 'David Kim' 
    },
    { 
        id: '3', type: 'rpl', clientName: 'Elena Rodriguez', qualification: 'Dip. ECE', stage: 'rto_submission', 
        tags: ['Direct'], value: '$1,800', daysInStage: 5, missingDocs: 0, counselor: 'Amanda Lee' 
    },
    { 
        id: '5', type: 'rpl', clientName: 'Raj Patel', qualification: 'Cert III Automotive', stage: 'evidence_collection', 
        tags: ['Direct'], value: '$2,800', daysInStage: 8, missingDocs: 2, counselor: 'Tom Hardy' 
    },
    // ADMISSION CARDS
    { 
        id: 'a1', type: 'admission', clientName: 'Kenji Tanaka', qualification: 'Master of IT (Monash)', stage: 'conditional_offer', 
        tags: ['Sub-Agent'], value: '$35,000', daysInStage: 3, missingDocs: 1, counselor: 'Jessica Wu' 
    },
    { 
        id: 'a2', type: 'admission', clientName: 'Sophie Martin', qualification: 'Bachelor of Design (RMIT)', stage: 'app_lodged', 
        tags: ['Direct'], value: '$28,000', daysInStage: 1, missingDocs: 0, counselor: 'Amanda Lee' 
    },
    { 
        id: 'a3', type: 'admission', clientName: 'Priya Sharma', qualification: 'MBA (Torrens)', stage: 'gte_assessment', 
        tags: ['VisaFast'], value: '$22,000', daysInStage: 6, missingDocs: 2, counselor: 'David Kim' 
    },
    { 
        id: 'a4', type: 'admission', clientName: 'Liam Wilson', qualification: 'Bachelor of Business', stage: 'lead', 
        tags: ['Direct'], value: '$26,000', daysInStage: 0, missingDocs: 0, counselor: 'Tom Hardy' 
    },
    { 
        id: 'a5', type: 'admission', clientName: 'Wei Zhang', qualification: 'Master of Eng.', stage: 'coe_issued', 
        tags: ['Global Ed'], value: '$38,000', daysInStage: 1, missingDocs: 0, counselor: 'Jessica Wu' 
    },
  ];

  // Logic to determine active view
  const currentStages = activePipeline === 'rpl' ? RPL_STAGES : ADMISSION_STAGES;
  const filteredCards = allCards.filter(card => card.type === activePipeline);

  // Calculate Pipeline Value
  const totalValue = filteredCards.reduce((acc, card) => {
      const val = parseFloat(card.value.replace(/[^0-9.-]+/g,""));
      return acc + val;
  }, 0);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden font-sans">
        {/* Toolbar */}
        <div className="h-20 border-b border-slate-200 flex items-center justify-between px-8 bg-white shadow-sm z-10">
            <div className="flex items-center gap-6">
                
                {/* PIPELINE SWITCHER */}
                <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
                    <button 
                        onClick={() => setActivePipeline('rpl')}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all
                            ${activePipeline === 'rpl' 
                                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' 
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}
                        `}
                    >
                        <Briefcase className="w-3.5 h-3.5" />
                        RPL Pipeline
                    </button>
                    <button 
                        onClick={() => setActivePipeline('admission')}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all
                            ${activePipeline === 'admission' 
                                ? 'bg-white text-purple-600 shadow-sm ring-1 ring-black/5' 
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}
                        `}
                    >
                        <GraduationCap className="w-3.5 h-3.5" />
                        Admissions
                    </button>
                </div>

                <div className="h-8 w-px bg-slate-200"></div>

                <div>
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        {activePipeline === 'rpl' ? 'RPL Applications' : 'University Admissions'}
                        <span className="bg-slate-100 text-slate-500 text-[10px] px-2 py-0.5 rounded-full font-bold">
                            {filteredCards.length}
                        </span>
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">Pipeline Value: ${totalValue.toLocaleString()}</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                 <div className="relative group">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input type="text" placeholder="Search pipeline..." className="pl-9 pr-4 py-2 bg-slate-50 rounded-xl text-sm border border-transparent focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-200 w-64 transition-all outline-none" />
                 </div>
                 <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all transform hover:scale-105 active:scale-95">
                    <Plus className="w-4 h-4" /> New {activePipeline === 'rpl' ? 'Application' : 'Student'}
                 </button>
            </div>
        </div>

        {/* Board */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-8">
            <div className="flex h-full gap-6 min-w-[1400px]">
                {currentStages.map(stage => {
                    const stageCards = filteredCards.filter(c => c.stage === stage.id);
                    const stageValue = stageCards.reduce((acc, card) => acc + parseFloat(card.value.replace(/[^0-9.-]+/g,"")), 0);
                    
                    // Dynamic accent color based on pipeline
                    const barColor = activePipeline === 'rpl' 
                        ? stage.color.replace('bg-', 'bg-').replace('50', '400')
                        : stage.color.replace('bg-', 'bg-').replace('50', '400');

                    return (
                        <div key={stage.id} className="w-80 flex flex-col h-full rounded-2xl bg-slate-100/50 border border-slate-200/60 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-300">
                            {/* Column Header */}
                            <div className="p-4 bg-white/50 rounded-t-2xl border-b border-slate-100">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                                        <span className={`w-2.5 h-2.5 rounded-full ${barColor}`}></span>
                                        {stage.label}
                                    </h3>
                                    <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="w-4 h-4" /></button>
                                </div>
                                <div className="flex justify-between items-center text-xs text-slate-400 font-medium px-1">
                                    <span>{stageCards.length} Deals</span>
                                    <span>${stageValue.toLocaleString()}</span>
                                </div>
                                {/* Visual Progress Line */}
                                 <div className="w-full h-1 bg-slate-200 rounded-full mt-3 overflow-hidden">
                                    <div className={`h-full ${barColor} w-3/4`}></div>
                                </div>
                            </div>

                            {/* Cards Area */}
                            <div className="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar">
                                {stageCards.map(card => (
                                    <div key={card.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_16px_-6px_rgba(0,0,0,0.1)] cursor-grab active:cursor-grabbing transition-all group relative">
                                        {/* Drag Handle Visual */}
                                        <div className={`absolute top-0 left-0 w-full h-1 rounded-t-xl transition-colors ${activePipeline === 'rpl' ? 'group-hover:bg-blue-500/20' : 'group-hover:bg-purple-500/20'}`}></div>

                                        {/* Header */}
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex flex-wrap gap-1">
                                                {card.tags.map(tag => (
                                                    <span key={tag} className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 uppercase tracking-wide border border-slate-200">{tag}</span>
                                                ))}
                                            </div>
                                            {/* Days in stage indicator */}
                                            <div className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${card.daysInStage > 10 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'}`}>
                                                <CalendarClock className="w-3 h-3" /> {card.daysInStage}d
                                            </div>
                                        </div>

                                        {/* Main Info */}
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm
                                                ${activePipeline === 'rpl' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}
                                            `}>
                                                {card.clientName.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 text-sm leading-tight">{card.clientName}</h4>
                                                <p className="text-[10px] text-slate-500 font-medium truncate max-w-[150px] mt-0.5">{card.qualification}</p>
                                            </div>
                                        </div>
                                        
                                        {/* Footer Stats */}
                                        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-50">
                                            <div className="flex items-center gap-2">
                                                <User className="w-3 h-3 text-slate-300" />
                                                <span className="text-[10px] font-semibold text-slate-500 truncate">{card.counselor}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs font-bold text-slate-800">{card.value}</span>
                                            </div>
                                        </div>

                                        {/* Missing Docs Warning */}
                                        {card.missingDocs > 0 && (
                                            <div className="mt-2 text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md flex items-center justify-center gap-1">
                                                <FileText className="w-3 h-3" /> {card.missingDocs} Docs Missing
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <button className="w-full py-3 text-xs text-slate-400 font-bold uppercase tracking-wide hover:bg-white hover:shadow-sm rounded-xl border border-transparent hover:border-slate-200 transition-all flex items-center justify-center gap-2 group">
                                    <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" /> Add Deal
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
  );
};

export default Kanban;
