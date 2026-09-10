import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './views/DashboardView';
import { InventoryView } from './views/InventoryView';
import { HectaresView } from './views/HectaresView';
import { FinanceView } from './views/FinanceView';
import { AIHealthView } from './views/AIHealthView';
import { Toast } from './components/common/Toast';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [toast, setToast] = useState(null);

  // Disparador global de notificaciones seguras
  const triggerToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans antialiased text-slate-900 w-full overflow-x-hidden relative">
      
      {/* Barra Lateral Fija */}
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      {/* Contenedor Principal */}
      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        
        {/* Barra Superior Estándar */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-10 px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-wider text-emerald-600 uppercase bg-emerald-50 px-2.5 py-1 rounded-full">
              Panel Activo
            </span>
            <h2 className="text-sm font-medium text-slate-600 capitalize">
              / {currentView === 'dashboard' ? 'Dashboard General' : currentView === 'inventory' ? 'Inventario Animal' : currentView === 'hectares' ? 'Hectáreas y Pasto' : currentView === 'finance' ? 'Costos y Finanzas' : currentView === 'ai-health' ? 'Salud e Inteligencia Artificial' : currentView}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs text-slate-500 font-medium">RebañoPro Desktop v1.2</span>
          </div>
        </header>

        {/* Zona de Renderizado de Vistas */}
        <main className="flex-1 p-8 max-w-7xl w-full mx-auto">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'inventory' && <InventoryView onNotify={triggerToast} />}
          {currentView === 'hectares' && <HectaresView onNotify={triggerToast} />}
          {currentView === 'finance' && <FinanceView onNotify={triggerToast} />}
          {currentView === 'ai-health' && <AIHealthView />}
        </main>
      </div>

      {/* Sistema de Notificaciones Flotantes (Toasts) */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}