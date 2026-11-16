import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabaseClient';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './views/DashboardView';
import { InventoryView } from './views/InventoryView';
import { HectaresView } from './views/HectaresView';
import { FinanceView } from './views/FinanceView';
import { AIHealthView } from './views/AIHealthView';
import { AuthView } from './views/AuthView';
import { Toast } from './components/common/Toast';
import { Sun, Moon, Globe, Loader2 } from 'lucide-react';

export default function App() {
  // Estados de autenticación conectados a Supabase
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  
  const [currentView, setCurrentView] = useState('dashboard');
  const [toast, setToast] = useState(null);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('rebanopro_theme') === 'dark';
  });
  
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('rebanopro_lang') || 'es';
  });

  // Sincronizar sesión con Supabase al cargar la app
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setCurrentUser(session?.user || null);
      setLoadingSession(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setCurrentUser(session?.user || null);
      setLoadingSession(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('rebanopro_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('rebanopro_lang', language);
  }, [language]);

  const triggerToast = (message, type = 'success') => {
    setToastedState({ message, type });
  };
  // (Mantenemos tu función original de toast tal como la tenías)
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // --- DICCIONARIO GLOBAL COMPLETO (ES / EN) ---
  const t = {
    es: {
      activePanel: 'Panel Activo',
      dashboard: 'Dashboard General',
      inventory: 'Inventario Animal',
      hectares: 'Hectáreas y Pasto',
      finance: 'Costos y Finanzas',
      aiHealth: 'Salud e IA',
      logout: 'Cerrar Sesión',
      
      // Dashboard
      dbWelcome: 'Panel de Control General',
      dbWelcomeSub: 'Bienvenido de nuevo. Aquí tienes el estado actual de tu operación agropecuaria.',
      dbReport: 'Generar Reporte',
      dbRegister: 'Registrar Animal / Lote',
      totalAnimals: 'Total de Animales',
      vsMonth: 'vs. mes anterior',
      activeHectares: 'Hectáreas Activas',
      occupancy: 'Ocupación actual',
      monthlyCosts: 'Costos Mensuales',
      optimized: 'Optimizado',
      sanitaryAlerts: 'Alertas Sanitarias',
      requiresAttention: 'Requieren atención',
      loadDistribution: 'Distribución de Carga por Potrero',
      occupancyPercent: 'Porcentaje de ocupación actual y capacidad de rebrote',
      realTime: 'Vista en tiempo real',
      viewAll: 'Ver todos los potreros',
      iaAssistant: 'Asistente Predictivo IA',
      active: 'ACTIVO',
      iaMonitoring: 'Monitoreo en tiempo real basado en variables climáticas, consumo histórico y métricas de salud.',
      pastureRisk: 'Riesgo de escasez de pasto',
      pastureDetail: 'El POTRERO 4 muestra una reducción del 15% en la regeneración de biomasa proyectada para los próximos 7 días.',
      rotatePaddock: 'Rotar ganado al Potrero 2',
      sanitaryAlert: 'Alerta sanitaria preventiva',
      sanitaryDetail: 'Se detectó tendencia al alza en revisiones de control en ganado joven. Vacunación recomendada.',
      viewProtocol: 'Ver protocolo',

      // Inventario
      invTag: 'Gestión de Hato Ganadero',
      invTitle: 'Inventario Animal',
      invSub: 'Monitoreo individual de peso, trazabilidad genética, estado sanitario y asignación de potreros.',
      invAddBtn: 'Registrar Nuevo Animal',
      invTotalHeads: 'Total Cabezas',
      invHerdStatus: 'Estado del Hato',
      invSanitary: 'Estado Sanitario',
      invSearch: 'Buscar por código, nombre o raza...',
      invEmptyTitle: 'No hay animales registrados en el hato',
      invEmptySub: 'Tu inventario está completamente limpio. Comienza a registrar tus primeros especímenes usando el botón superior.',
      invFirstBtn: 'Registrar mi primer animal',

      // Hectáreas
      hecTag: 'Cartografía y Pasturas',
      hecTitle: 'Gestión de Hectáreas y Potreros',
      hecSub: 'Control de aforos, rotación de pastoreo, tipos de biomasa y delimitación de lotes.',
      hecAddBtn: 'Registrar Nuevo Potrero',
      hecTotalArea: 'Superficie Total',
      hecActiveLots: 'Potreros Activos',
      hecGrassQuality: 'Calidad de Pastura',
      hecEmptyTitle: 'No hay potreros registrados todavía',
      hecEmptySub: 'Comienza a mapear la superficie de tu finca agregando tu primer sector o potrero.',
      hecFirstBtn: 'Crear primer potrero',

      // Finanzas
      finTag: 'Módulo Contable Enterprise',
      finTitle: 'Costos y Finanzas Operativas',
      finSub: 'Control de flujo de caja, balance de ingresos, gastos por categoría y rentabilidad del hato.',
      finAddBtn: 'Registrar Transacción',
      finReportBtn: 'Generar Reporte PDF',
      netBalance: 'Balance Neto',
      totalIncome: 'Ingresos Totales',
      totalExpense: 'Gastos Operativos',
      finRecords: 'Total Movimientos',
      finEmptyTitle: 'No hay transacciones registradas',
      finEmptySub: 'Tu módulo contable está limpio. Comienza a registrar ingresos o gastos operativos con el botón superior.',
      finFirstBtn: 'Registrar primera transacción',

      // IA
      aiTag: 'Inteligencia Artificial Pecuaria',
      aiTitle: 'Centro de Decisiones e IA',
      aiSub: 'Asistencia experta en diagnóstico veterinario, optimización de costos y consultoría integral de hato.',
      aiTabVet: 'Asistencia Veterinaria',
      aiTabFin: 'Ayuda Financiera y Costos',
      aiTabGen: 'Consultor General de Hato',
      aiSend: 'Enviar Consulta'
    },
    en: {
      activePanel: 'Active Panel',
      dashboard: 'General Dashboard',
      inventory: 'Animal Inventory',
      hectares: 'Hectares & Pasture',
      finance: 'Costs & Finance',
      aiHealth: 'Health & AI',
      logout: 'Sign Out',
      
      // Dashboard
      dbWelcome: 'General Control Panel',
      dbWelcomeSub: 'Welcome back. Here is the current status of your agricultural operation.',
      dbReport: 'Generate Report',
      dbRegister: 'Register Animal / Lot',
      totalAnimals: 'Total Animals',
      vsMonth: 'vs. previous month',
      activeHectares: 'Active Hectares',
      occupancy: 'Current occupancy',
      monthlyCosts: 'Monthly Costs',
      optimized: 'Optimized',
      sanitaryAlerts: 'Sanitary Alerts',
      requiresAttention: 'Require attention',
      loadDistribution: 'Paddock Load Distribution',
      occupancyPercent: 'Current occupancy percentage and regrowth capacity',
      realTime: 'Real-time view',
      viewAll: 'View all paddocks',
      iaAssistant: 'AI Predictive Assistant',
      active: 'ACTIVE',
      iaMonitoring: 'Real-time monitoring based on climate variables, historical consumption, and health metrics.',
      pastureRisk: 'Pasture shortage risk',
      pastureDetail: 'PADDOCK 4 shows a 15% reduction in projected biomass regeneration for the next 7 days.',
      rotatePaddock: 'Rotate cattle to Paddock 2',
      sanitaryAlert: 'Preventive sanitary alert',
      sanitaryDetail: 'Upward trend detected in control checks in young cattle. Recommended vaccination.',
      viewProtocol: 'View protocol',

      // Inventory
      invTag: 'Herd Management',
      invTitle: 'Animal Inventory',
      invSub: 'Individual weight monitoring, genetic traceability, sanitary status, and paddock assignment.',
      invAddBtn: 'Register New Animal',
      invTotalHeads: 'Total Heads',
      invHerdStatus: 'Herd Status',
      invSanitary: 'Sanitary Status',
      invSearch: 'Search by code, name, or breed...',
      invEmptyTitle: 'No animals registered in the herd',
      invEmptySub: 'Your inventory is completely clean. Start registering your first specimens using the button above.',
      invFirstBtn: 'Register my first animal',

      // Hectares
      hecTag: 'Cartography & Pastures',
      hecTitle: 'Hectares & Paddocks Management',
      hecSub: 'Control of gauges, grazing rotation, biomass types, and lot delimitation.',
      hecAddBtn: 'Register New Paddock',
      hecTotalArea: 'Total Surface',
      hecActiveLots: 'Active Paddocks',
      hecGrassQuality: 'Pasture Quality',
      hecEmptyTitle: 'No paddocks registered yet',
      hecEmptySub: 'Start mapping your farm surface by adding your first sector or paddock.',
      hecFirstBtn: 'Create first paddock',

      // Finance
      finTag: 'Enterprise Accounting Module',
      finTitle: 'Operational Costs & Finance',
      finSub: 'Cash flow control, income balance, expenses by category, and herd profitability.',
      finAddBtn: 'Register Transaction',
      finReportBtn: 'Generate PDF Report',
      netBalance: 'Net Balance',
      totalIncome: 'Total Income',
      totalExpense: 'Operating Expenses',
      finRecords: 'Total Records',
      finEmptyTitle: 'No transactions registered',
      finEmptySub: 'Your accounting module is clean. Start registering income or operating expenses using the button above.',
      finFirstBtn: 'Register first transaction',

      // IA
      aiTag: 'Livestock Artificial Intelligence',
      aiTitle: 'Decision & AI Center',
      aiSub: 'Expert assistance in veterinary diagnosis, cost optimization, and comprehensive herd consulting.',
      aiTabVet: 'Veterinary Assistance',
      aiTabFin: 'Financial & Cost Help',
      aiTabGen: 'General Herd Consultant',
      aiSend: 'Send Query'
    }
  };

  const texts = t[language];

  // Pantalla de carga mientras Supabase verifica la sesión activa
  if (loadingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/30 animate-pulse">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
            Cargando RebañoPro Cloud...
          </p>
        </div>
      </div>
    );
  }

  // Si no hay sesión en Supabase, mostramos la vista de Autenticación
  if (!session) {
    return (
      <AuthView 
        onLoginSuccess={(user) => {
          showToast(language === 'es' ? `¡Bienvenido de nuevo, ${user?.email || 'Productor'}!` : `Welcome back, ${user?.email || 'Producer'}!`);
        }} 
      />
    );
  }

  return (
    <div className={`min-h-screen flex font-sans antialiased w-full overflow-x-hidden relative transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        isDarkMode={isDarkMode} 
        texts={texts} 
      />

      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        <header className={`h-16 backdrop-blur-md border-b sticky top-0 z-10 px-8 flex items-center justify-between transition-colors duration-300 ${
          isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-100'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-wider text-emerald-600 uppercase bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/50">
              {texts.activePanel}
            </span>
            <h2 className={`text-sm font-medium capitalize ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              / {currentView === 'dashboard' ? texts.dashboard : currentView === 'inventory' ? texts.inventory : currentView === 'hectares' ? texts.hectares : currentView === 'finance' ? texts.finance : texts.aiHealth}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const newLang = language === 'es' ? 'en' : 'es';
                setLanguage(newLang);
                showToast(newLang === 'es' ? 'Idioma cambiado a Español' : 'Language switched to English', 'info');
              }}
              className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' 
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>{language.toUpperCase()}</span>
            </button>

            <button
              onClick={() => {
                setIsDarkMode(!isDarkMode);
                showToast(!isDarkMode ? 'Modo Oscuro activado' : 'Modo Claro activado', 'info');
              }}
              className={`p-2 rounded-xl transition-all cursor-pointer border ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' 
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200/60'
              }`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className={`h-4 w-[1px] ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>

            <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {currentUser?.email || 'Productor'}
            </span>

            <button
              onClick={async () => {
                await supabase.auth.signOut();
                showToast(texts.logout, 'info');
              }}
              className={`text-xs font-semibold transition-colors cursor-pointer border-l pl-4 ${
                isDarkMode ? 'border-slate-800 text-slate-400 hover:text-rose-400' : 'border-slate-200 text-slate-400 hover:text-rose-600'
              }`}
            >
              {texts.logout}
            </button>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-7xl w-full mx-auto">
         {currentView === 'dashboard' && (
            <DashboardView 
              isDarkMode={isDarkMode} 
              texts={texts} 
              onNavigate={setCurrentView}
              onGenerateReport={() => {
                setCurrentView('finance');
                showToast(language === 'es' ? 'Redirigiendo a Finanzas para generar el reporte' : 'Redirecting to Finance to generate report', 'info');
              }}
            />
          )}
          {currentView === 'inventory' && <InventoryView onNotify={showToast} texts={texts} />}
          {currentView === 'hectares' && <HectaresView onNotify={showToast} texts={texts} />}
          {currentView === 'finance' && <FinanceView onNotify={showToast} texts={texts} />}
          {currentView === 'ai-health' && <AIHealthView texts={texts} />}
        </main>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}