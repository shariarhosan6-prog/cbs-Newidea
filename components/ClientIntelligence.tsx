
import React, { useState } from 'react';
import { Conversation, DocumentStatus, EducationEntry } from '../types';
import { PROGRESS_STEPS } from '../constants';
import { 
    User, FileText, CreditCard, Bot, ChevronDown, ChevronUp, 
    CheckCircle, XCircle, Clock, Send, FileCheck, ArrowRight, Sparkles, MoreHorizontal, Building2, Globe, Mail, FileBarChart, Zap, ShoppingCart, UploadCloud, Eye, Download, AlertCircle, Plus, GraduationCap, AlertTriangle, X
} from 'lucide-react';

interface Props {
  conversation: Conversation;
  isOpen: boolean;
  onAddDocument: (name: string) => void;
  onAddEducation: (edu: EducationEntry) => void;
}

const ClientIntelligence: React.FC<Props> = ({ conversation, isOpen, onAddDocument, onAddEducation }) => {
    const [isAddingEdu, setIsAddingEdu] = useState(false);
    const [newEdu, setNewEdu] = useState<Partial<EducationEntry>>({
        level: 'Year 12',
        institution: '',
        startYear: new Date().getFullYear() - 3,
        endYear: new Date().getFullYear()
    });
    
    // Calculate stats
    const verifiedCount = conversation.documents.filter(d => d.status === 'verified').length;
    const totalDocs = conversation.documents.length;
    const progressPercent = Math.round((verifiedCount / totalDocs) * 100) || 0;

    // Study Gap Analysis Logic
    const educationHistory = conversation.client.educationHistory || [];
    let hasGapIssue = false;
    let totalGapYears = 0;

    const handleSaveEdu = () => {
        if (!newEdu.institution || !newEdu.startYear || !newEdu.endYear) return;
        
        onAddEducation({
            id: `edu_${Date.now()}`,
            level: newEdu.level as any,
            institution: newEdu.institution,
            startYear: newEdu.startYear,
            endYear: newEdu.endYear
        });
        
        setIsAddingEdu(false);
        setNewEdu({
             level: 'Year 12',
             institution: '',
             startYear: new Date().getFullYear() - 3,
             endYear: new Date().getFullYear()
        });
    };

    const handleRequestExplanation = (prevEnd: number, currentStart: number) => {
        onAddDocument(`Gap Explanation (${prevEnd}-${currentStart})`);
    };

    const timelineItems = educationHistory.sort((a, b) => a.endYear - b.endYear).map((edu, index) => {
        let gapDisplay = null;
        if (index > 0) {
            const prevEnd = educationHistory[index - 1].endYear;
            const currentStart = edu.startYear;
            const gap = currentStart - prevEnd;
            
            // Logic: Gap is relevant if the difference > 1 year (e.g. 2018 -> 2020)
            if (gap > 1) { 
                hasGapIssue = true;
                totalGapYears += gap;
                const isRequested = conversation.documents.some(d => d.name === `Gap Explanation (${prevEnd}-${currentStart})`);
                
                gapDisplay = (
                    <div className="ml-8 pl-6 border-l-2 border-dashed border-red-300 py-3 relative my-1 animate-in slide-in-from-left-2 fade-in">
                         <div className="absolute -left-[17px] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-500 z-10">
                             <AlertTriangle className="w-4 h-4" />
                         </div>
                         <div className="flex items-center justify-between">
                             <div>
                                 <p className="text-[10px] font-bold text-red-500 uppercase tracking-wide">Study Gap Detected</p>
                                 <p className="text-xs font-semibold text-slate-700">{gap - 1} Year(s) Unaccounted ({prevEnd} - {currentStart})</p>
                             </div>
                             {isRequested ? (
                                 <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md font-bold border border-emerald-100 flex items-center gap-1">
                                     <CheckCircle className="w-3 h-3" /> Requested
                                 </span>
                             ) : (
                                 <button 
                                     onClick={() => handleRequestExplanation(prevEnd, currentStart)}
                                     className="text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded-md font-bold hover:bg-red-100 border border-red-100 transition-colors"
                                 >
                                     + Request Evidence
                                 </button>
                             )}
                         </div>
                    </div>
                );
            }
        }

        return (
            <React.Fragment key={edu.id}>
                {gapDisplay}
                <div className="relative pl-8 py-2 group">
                    <div className="absolute left-[7px] top-3 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-white shadow-sm z-10"></div>
                    <div className="absolute left-[12px] top-6 bottom-[-8px] w-0.5 bg-indigo-100 group-last:hidden"></div>
                    
                    <div className="flex justify-between items-start">
                        <div>
                            <h4 className="text-xs font-bold text-slate-800">{edu.level}</h4>
                            <p className="text-[10px] text-slate-500">{edu.institution}</p>
                        </div>
                        <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{edu.startYear} - {edu.endYear}</span>
                    </div>
                </div>
            </React.Fragment>
        );
    });


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

                {/* 2. ACADEMIC TIMELINE & GAP ANALYSIS */}
                <div className={`rounded-2xl border overflow-hidden transition-all duration-300 ${hasGapIssue ? 'bg-red-50/50 border-red-100' : 'bg-white border-slate-200'}`}>
                    <div className={`p-3 flex items-center justify-between ${hasGapIssue ? 'bg-red-50 border-b border-red-100' : 'bg-slate-50 border-b border-slate-100'}`}>
                            <div className="flex items-center gap-2">
                                <div className={`p-1.5 rounded-lg ${hasGapIssue ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                    <GraduationCap className="w-3.5 h-3.5" />
                                </div>
                                <span className={`text-xs font-bold ${hasGapIssue ? 'text-red-800' : 'text-slate-700'}`}>Academic History</span>
                            </div>
                            {hasGapIssue && (
                                <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" /> Risk Detected
                                </span>
                            )}
                    </div>
                    
                    <div className="p-4">
                            {/* The Timeline */}
                            <div className="relative">
                                {timelineItems}
                                {educationHistory.length === 0 && !isAddingEdu && (
                                    <p className="text-xs text-slate-400 text-center italic py-2">No education history recorded.</p>
                                )}
                            </div>

                            {/* Add Entry Form or Button */}
                            {isAddingEdu ? (
                                <div className="mt-4 bg-white border border-slate-200 rounded-xl p-3 shadow-sm animate-in zoom-in-95">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-slate-700">New Entry</span>
                                        <button onClick={() => setIsAddingEdu(false)} className="text-slate-400 hover:text-slate-600"><X className="w-3 h-3" /></button>
                                    </div>
                                    <div className="space-y-2">
                                        <select 
                                            value={newEdu.level} 
                                            onChange={(e) => setNewEdu({...newEdu, level: e.target.value as any})}
                                            className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50"
                                        >
                                            <option>Year 10</option>
                                            <option>Year 12</option>
                                            <option>Diploma</option>
                                            <option>Bachelor</option>
                                            <option>Masters</option>
                                        </select>
                                        <input 
                                            type="text" 
                                            placeholder="Institution Name"
                                            value={newEdu.institution}
                                            onChange={(e) => setNewEdu({...newEdu, institution: e.target.value})}
                                            className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50"
                                        />
                                        <div className="flex gap-2">
                                            <input 
                                                type="number" 
                                                placeholder="Start"
                                                value={newEdu.startYear}
                                                onChange={(e) => setNewEdu({...newEdu, startYear: parseInt(e.target.value)})}
                                                className="w-1/2 text-xs p-2 rounded-lg border border-slate-200 bg-slate-50"
                                            />
                                            <input 
                                                type="number" 
                                                placeholder="End"
                                                value={newEdu.endYear}
                                                onChange={(e) => setNewEdu({...newEdu, endYear: parseInt(e.target.value)})}
                                                className="w-1/2 text-xs p-2 rounded-lg border border-slate-200 bg-slate-50"
                                            />
                                        </div>
                                        <button 
                                            onClick={handleSaveEdu}
                                            className="w-full mt-2 bg-indigo-600 text-white py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-700"
                                        >
                                            Save Entry
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => setIsAddingEdu(true)}
                                    className="w-full mt-4 flex items-center justify-center gap-1.5 py-2 text-[10px] font-bold text-slate-400 hover:text-slate-600 border border-dashed border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    <Plus className="w-3 h-3" /> Add Education
                                </button>
                            )}
                    </div>
                </div>

                {/* 3. Smart Documentation Checklist */}
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
                    </div>
                </div>

                {/* 4. Financial Cart Summary */}
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

            </div>
        </div>
    );
};

export default ClientIntelligence;
