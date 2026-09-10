import React from 'react';

export const MetricCard = ({ title, value, change, isPositive, icon: Icon, trendText }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
          <Icon className="w-5 h-5 text-emerald-600" />
        </div>
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold text-slate-800 tracking-tight">{value}</div>
        <div className="flex items-center gap-2 mt-2">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}
          >
            {change}
          </span>
          <span className="text-xs text-slate-400 font-medium">{trendText}</span>
        </div>
      </div>
    </div>
  );
};