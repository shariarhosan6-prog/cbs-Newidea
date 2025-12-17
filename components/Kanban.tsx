import React from 'react';
import { ApplicationStage } from '../types';
import { MoreHorizontal, Plus, Search, Filter } from 'lucide-react';

const Kanban: React.FC = () => {
  const stages: { id: ApplicationStage; label: string; color: string }[] = [
    { id: 'lead', label: 'New Leads', color: 'bg-slate-100' },
    { id: 'evidence_collection', label: 'Evidence Collection', color: 'bg-blue-50' },
    { id: 'mediator_review', label: 'Mediator Review', color: 'bg-purple-50' },
    { id: 'rto_submission', label: 'RTO Processing', color: 'bg-orange-50' },
    { id: 'certified', label: 'Certified', color: 'bg-green-50' },
  ];

  // Mock data for visual purpose
  const cards = [
    { id: '1', name: 'Sarah Jenkins', qual: 'Diploma Project Mgmt', stage: 'mediator_review', tags: ['Direct'], value: '$2,500' },
    { id: '2', name: 'Michael Chen', qual: 'Cert IV Cookery', stage: 'evidence_collection', tags: ['Global Ed'], value: '$3,200' },
    { id: '3', name: 'Elena Rodriguez', qual: 'Diploma ECE', stage: 'rto_submission', tags: ['Direct'], value: '$1,800' },
    { id: '4', name: 'John Smith', qual: 'Adv Diploma Leadership', stage: 'lead', tags: ['StudyNet'], value: '$4,000' },
    { id: '5', name: 'Raj Patel', qual: 'Cert III Automotive', stage: 'evidence_collection', tags: ['Direct'], value: '$2,800' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden">
        {/* Toolbar */}
        <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-white">
            <h2 className="text-lg font-bold text-slate-800">Application Pipeline</h2>
            <div className="flex items-center gap-3">
                 <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input type="text" placeholder="Filter applications..." className="pl-9 pr-4 py-2 bg-slate-50 rounded-lg text-sm border-none focus:ring-1 focus:ring-messenger-blue w-64" />
                 </div>
                 <button className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg border border-slate-200">
                    <Filter className="w-4 h-4" />
                 </button>
                 <button className="flex items-center gap-2 bg-messenger-blue text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 shadow-md shadow-blue-200">
                    <Plus className="w-4 h-4" /> New App
                 </button>
            </div>
        </div>

        {/* Board */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
            <div className="flex h-full gap-6 min-w-[1200px]">
                {stages.map(stage => (
                    <div key={stage.id} className="w-72 flex flex-col h-full rounded-2xl bg-slate-50/80 border border-slate-200/60">
                        {/* Column Header */}
                        <div className="p-4 flex items-center justify-between sticky top-0 bg-transparent">
                            <div className="flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full ${stage.color.replace('bg-', 'bg-').replace('50', '400')}`}></span>
                                <h3 className="font-bold text-slate-700 text-sm">{stage.label}</h3>
                                <span className="text-xs text-slate-400 font-medium px-2 py-0.5 bg-white rounded-md border border-slate-200">
                                    {cards.filter(c => c.stage === stage.id).length}
                                </span>
                            </div>
                            <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal className="w-4 h-4" /></button>
                        </div>

                        {/* Cards Area */}
                        <div className="flex-1 p-2 space-y-3 overflow-y-auto custom-scrollbar">
                            {cards.filter(c => c.stage === stage.id).map(card => (
                                <div key={card.id} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-all group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex flex-wrap gap-1">
                                            {card.tags.map(tag => (
                                                <span key={tag} className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase tracking-wide">{tag}</span>
                                            ))}
                                        </div>
                                        <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-messenger-blue"><MoreHorizontal className="w-4 h-4" /></button>
                                    </div>
                                    <h4 className="font-bold text-slate-800 text-sm mb-0.5">{card.name}</h4>
                                    <p className="text-xs text-slate-500 mb-3 truncate">{card.qual}</p>
                                    
                                    <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                        <img src={`https://ui-avatars.com/api/?name=${card.name.replace(' ', '+')}&background=random`} className="w-6 h-6 rounded-full" alt="" />
                                        <span className="text-xs font-semibold text-slate-700">{card.value}</span>
                                    </div>
                                </div>
                            ))}
                            <button className="w-full py-2 text-xs text-slate-400 font-medium hover:bg-slate-100 rounded-lg border border-transparent hover:border-slate-200 border-dashed transition-all">
                                + Add Card
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