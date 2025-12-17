import React from 'react';
import { TrendingUp, Users, AlertCircle, CheckCircle2, DollarSign, Briefcase, ArrowRight } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="flex-1 bg-slate-50 h-full overflow-y-auto p-8">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 mt-1">Welcome back, Alex. Here's what's happening in your ecosystem today.</p>
        </div>
        <div className="flex gap-3">
             <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50">Download Report</button>
             <button className="px-4 py-2 bg-messenger-blue text-white rounded-lg text-sm font-semibold shadow-lg shadow-blue-200 hover:bg-blue-600">+ New Application</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Revenue (MTD)', value: '$124,500', change: '+12%', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Active Pipeline', value: '42 Candidates', change: '+5', icon: Briefcase, color: 'text-messenger-blue', bg: 'bg-blue-50' },
          { label: 'RTO Approvals', value: '18 This Week', change: 'On Track', icon: CheckCircle2, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Pending Compliance', value: '7 Critical', change: 'Action Req', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.includes('+') || stat.change.includes('Track') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {stat.change}
                </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Pipeline Velocity (Chart Placeholder) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Pipeline Velocity</h3>
                <select className="text-sm bg-slate-50 border-none rounded-lg text-slate-600 font-medium px-3 py-1">
                    <option>Last 30 Days</option>
                </select>
            </div>
            {/* Mock Chart Visual */}
            <div className="h-64 flex items-end justify-between gap-2 px-4">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                    <div key={i} className="w-full bg-blue-50 rounded-t-lg relative group overflow-hidden">
                        <div 
                            style={{ height: `${h}%` }} 
                            className="absolute bottom-0 w-full bg-messenger-blue rounded-t-lg opacity-80 group-hover:opacity-100 transition-all duration-500"
                        ></div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between text-xs text-slate-400 mt-4 px-2">
                <span>Jan 1</span>
                <span>Jan 15</span>
                <span>Jan 30</span>
            </div>
        </div>

        {/* Right: Needs Attention */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Needs Attention</h3>
            <div className="space-y-3">
                {[
                    { title: "Sarah Jenkins", desc: "Missing USI for RTO submission", urgency: "high" },
                    { title: "Global Ed Agency", desc: "Commission invoice pending", urgency: "medium" },
                    { title: "Michael Chen", desc: "Video evidence rejected by AI", urgency: "high" },
                    { title: "StudyPath RTO", desc: "New compliance requirement update", urgency: "low" },
                ].map((item, i) => (
                    <div key={i} className="p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-sm text-slate-800">{item.title}</span>
                            <span className={`w-2 h-2 rounded-full ${item.urgency === 'high' ? 'bg-red-500' : 'bg-orange-400'}`}></span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                        <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-messenger-blue opacity-0 group-hover:opacity-100 transition-opacity">
                            Resolve <ArrowRight className="w-3 h-3" />
                        </div>
                    </div>
                ))}
            </div>
            <button className="w-full mt-4 py-2 text-sm text-slate-500 font-medium border border-dashed border-slate-300 rounded-xl hover:text-messenger-blue hover:border-messenger-blue transition-colors">
                View All Tasks
            </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;