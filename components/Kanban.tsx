import React from 'react';
import { ApplicationStage } from '../types';
import { MoreHorizontal, Plus, Search, Filter, CalendarClock, FileText, User } from 'lucide-react';

const Kanban: React.FC = () => {
  const stages: { id: ApplicationStage; label: string; color: string; count: number; value: string }[] = [
    { id: 'lead', label: 'New Leads', color: 'bg-slate-100', count: 4, value: '$12.5k' },
    { id: 'evidence_collection', label: 'Evidence Collection', color: 'bg-blue-50', count: 8, value: '$24.0k' },
    { id: 'mediator_review', label: 'Mediator Review', color: 'bg-purple-50', count: 3, value: '$9.5k' },
    { id: 'rto_submission', label: 'RTO Processing', color: 'bg-orange-50', count: 5, value: '$18.0k' },
    { id: 'certified', label: 'Certified', color: 'bg-green-50', count: 12, value: '$42.0k' },
  ];

  // Enhanced Mock data
  const cards = [
    { 
        id: '1', name: 'Sarah Jenkins', qual: 'Diploma Project Mgmt', stage: 'mediator_review', 
        tags: ['Direct'], value: '$2,500', daysInStage: 2, missingDocs: 1, counselor: 'Jessica Wu' 
    },
    { 
        id: '2', name: 'Michael Chen', qual: 'Cert IV Cookery', stage: 'evidence_collection', 
        tags: ['Global Ed'], value: '$3,200', daysInStage: 14, missingDocs: 4, counselor: 'David Kim' 
    },
    { 
        id: '3', name: 'Elena Rodriguez', qual: 'Diploma ECE', stage: 'rto_submission', 
        tags: ['Direct'], value: '$1,800', daysInStage: 5, missingDocs: 0, counselor: 'Amanda Lee' 
    },
    { 
        id: '4', name: 'John Smith', qual: 'Adv Diploma Leadership', stage: 'lead', 
        tags: ['StudyNet'], value: '$4,000', daysInStage: 0, missingDocs: 0, counselor: 'Jessica Wu' 
    },
    { 
        id: '5', name: 'Raj Patel', qual: 'Cert III Automotive', stage: 'evidence_collection', 
        tags: ['Direct'], value: '$2,800', daysInStage: 8, missingDocs: 2, counselor: 'Tom Hardy' 
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden font-sans">
        {/* Toolbar */}
        <div className="h-20 border-b border-slate-200 flex items-center justify-between px-8 bg-white shadow-sm z-10">
            <div>
                <h2 className="text-xl font-bold text-slate-800">Application Pipeline</h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">32 Active deals • Total Pipeline Value: $106,000</p>
            </div>
            <div className="flex items-center gap-3">
                 <div className="relative group">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input type="text" placeholder="Search pipeline..." className="pl-9 pr-4 py-2 bg-slate-50 rounded-xl text-sm border border-transparent focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-200 w-64 transition-all outline-none" />
                 </div>
                 <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl border border-transparent hover:border-slate-200 transition-all">
                    <Filter className="w-4 h-4" />
                 </button>
                 <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all transform hover:scale-105 active:scale-95">
                    <Plus className="w-4 h-4" /> New App
                 </button>
            </div>
        </div>

        {/* Board */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-8">
            <div className="flex h-full gap-6 min-w-[1400px]">
                {stages.map(stage => (
                    <div key={stage.id} className="w-80 flex flex-col h-full rounded-2xl bg-slate-100/50 border border-slate-200/60 backdrop-blur-sm">
                        {/* Column Header */}
                        <div className="p-4 bg-white/50 rounded-t-2xl border-b border-slate-100">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                                    <span className={`w-2.5 h-2.5 rounded-full ${stage.color.replace('bg-', 'bg-').replace('50', '400')}`}></span>
                                    {stage.label}
                                </h3>
                                <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="w-4 h-4" /></button>
                            </div>
                            <div className="flex justify-between items-center text-xs text-slate-400 font-medium px-1">
                                <span>{stage.count} Deals</span>
                                <span>{stage.value}</span>
                            </div>
                            {/* Visual Progress Line */}
                             <div className="w-full h-1 bg-slate-200 rounded-full mt-3 overflow-hidden">
                                <div className={`h-full ${stage.color.replace('bg-', 'bg-').replace('50', '400')} w-3/4`}></div>
                            </div>
                        </div>

                        {/* Cards Area */}
                        <div className="flex-1 p-3 space-y-3 overflow-y-auto custom-scrollbar">
                            {cards.filter(c => c.stage === stage.id).map(card => (
                                <div key={card.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_16px_-6px_rgba(0,0,0,0.1)] cursor-grab active:cursor-grabbing transition-all group relative">
                                    {/* Drag Handle Visual */}
                                    <div className="absolute top-0 left-0 w-full h-1 rounded-t-xl group-hover:bg-blue-500/20 transition-colors"></div>

                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex flex-wrap gap-1">
                                            {card.tags.map(tag => (
                                                <span key={tag} className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 uppercase tracking-wide border border-slate-200">{tag}</span>
                                            ))}
                                        </div>
                                        {/* Days in stage indicator - Turns red if stalled */}
                                        <div className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-md ${card.daysInStage > 10 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'}`}>
                                            <CalendarClock className="w-3 h-3" /> {card.daysInStage}d
                                        </div>
                                    </div>

                                    {/* Main Info */}
                                    <h4 className="font-bold text-slate-800 text-sm mb-1">{card.name}</h4>
                                    <p className="text-xs text-slate-500 mb-3 truncate font-medium">{card.qual}</p>
                                    
                                    {/* Footer Stats */}
                                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-50">
                                        <div className="flex items-center gap-2">
                                            <img src={`https://ui-avatars.com/api/?name=${card.counselor.replace(' ', '+')}&background=random`} className="w-5 h-5 rounded-full" title={`Counselor: ${card.counselor}`} alt="" />
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
                ))}
            </div>
        </div>
    </div>
  );
};

export default Kanban;