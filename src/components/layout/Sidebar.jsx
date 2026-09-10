import React from 'react';
import { LayoutDashboard, Users, MapPin, DollarSign, Activity } from 'lucide-react';

const navigationItems = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'inventory', name: 'Inventario Animal', icon: Users },
  { id: 'hectares', name: 'Hectáreas y Pasto', icon: MapPin },
  { id: 'finance', name: 'Costos y Finanzas', icon: DollarSign },
  { id: 'ai-health', name: 'Salud e IA', icon: Activity },
];

export const Sidebar = ({ currentView, onViewChange }) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between h-screen fixed left-0 top-0 z-20 shadow-sm">
      {/* Logo y Marca */}
      <div>
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shadow-md shadow-emerald-600/20 text-white font-bold text-lg">
              R
            </div>
            <div>
              <h1 className="font-bold text-slate-800 tracking-tight text-base">RebañoPro</h1>
              <p className="text-xs text-slate-400 font-medium">Gestión Agropecuaria</p>
            </div>
          </div>
        </div>

        {/* Navegación Interactiva */}
        <nav className="p-4 space-y-1.5">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                {item.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer del Sidebar / Usuario */}
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50/70">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold text-xs">
            KA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">Kevin Martínez</p>
            <p className="text-[11px] text-slate-400 truncate">Administrador</p>
          </div>
        </div>
      </div>
    </aside>
  );
};