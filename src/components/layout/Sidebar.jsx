import React from 'react';
import { LayoutDashboard, Tag, MapPin, DollarSign, Stethoscope, ShieldCheck } from 'lucide-react';
// Importación directa de tu logotipo generado y guardado en la carpeta assets
import logoImage from '../../assets/logo-rebanopro.png';

export const Sidebar = ({ currentView, onViewChange, isDarkMode, texts }) => {
  // Mapeo de elementos de navegación utilizando el diccionario global de textos (ES / EN)
  const menuItems = [
    { id: 'dashboard', label: texts?.dashboard || 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: texts?.inventory || 'Animal Inventory', icon: Tag },
    { id: 'hectares', label: texts?.hectares || 'Hectares & Pasture', icon: MapPin },
    { id: 'finance', label: texts?.finance || 'Costs & Finance', icon: DollarSign },
    { id: 'ai-health', label: texts?.aiHealth || 'Health & AI', icon: Stethoscope },
  ];

  return (
    <aside className={`w-64 h-screen fixed left-0 top-0 border-r flex flex-col z-20 transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
    }`}>
      
      {/* --- CABECERA DE MARCA / LOGOTIPO INTEGRADO (SIN CAJAS BLANCAS) --- */}
      <div className="p-6 flex flex-col items-center justify-center border-b border-inherit space-y-2">
        <div className="w-full flex items-center justify-center px-4">
          {/* Imagen real del logotipo adaptada con object-contain y efecto hover sutil */}
          <img 
            src={logoImage} 
            alt="RebañoPro Logo" 
            className="w-36 h-auto object-contain filter drop-shadow-sm transition-transform duration-300 hover:scale-105 select-none pointer-events-none"
          />
        </div>
        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold uppercase tracking-widest mt-1">
          Desktop SaaS
        </span>
      </div>

      {/* --- NAVEGACIÓN PRINCIPAL (UX FLUIDA) --- */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                isActive 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25' 
                  : isDarkMode 
                    ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* --- FOOTER DEL SIDEBAR (ARQUITECTURA LOCAL) --- */}
      <div className="p-4 border-t border-inherit">
        <div className={`p-3.5 rounded-2xl border transition-colors ${
          isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-100'
        }`}>
          <p className={`text-[11px] font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Arquitectura Local</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Sincronizado y Offline-Ready</p>
        </div>
      </div>

    </aside>
  );
};