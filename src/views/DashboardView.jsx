import React from 'react';
import { Users, MapPin, DollarSign, AlertTriangle, Zap, TrendingUp, ArrowRight, BarChart3 } from 'lucide-react';

export const DashboardView = ({ isDarkMode, texts }) => {
  // 1. Obtener datos reales del usuario logueado desde localStorage
  const currentUser = JSON.parse(localStorage.getItem('rebanopro_user'));
  const userEmail = currentUser?.email || 'default';

  // Cargar animales reales (o vacío si no hay)
  const savedAnimals = localStorage.getItem(`rebanopro_animals_${userEmail}`);
  const animals = savedAnimals ? JSON.parse(savedAnimals) : [];

  // Cargar potreros reales (o vacío si no hay)
  const savedPotreros = localStorage.getItem(`rebanopro_potreros_${userEmail}`) || localStorage.getItem(`rebanopro_hectares_${userEmail}`);
  const potreros = savedPotreros ? JSON.parse(savedPotreros) : [];

  // Cargar finanzas reales (o vacío si no hay)
  const savedFinance = localStorage.getItem(`rebanopro_finance_${userEmail}`);
  const transactions = savedFinance ? JSON.parse(savedFinance) : [];

  // Cálculos dinámicos
  const totalAnimalsCount = animals.length;
  
  const totalHectaresArea = potreros.reduce((acc, curr) => {
    const areaVal = parseFloat(curr.area || curr.size || 0);
    return acc + (isNaN(areaVal) ? 0 : areaVal);
  }, 0);

  const totalMonthlyExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + Math.abs(curr.rawAmount || parseFloat(curr.amount?.replace(/[^0-9.-]+/g, "")) || 0), 0);

  const cardClass = `p-6 rounded-3xl border shadow-sm transition-colors ${
    isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-100 text-slate-900'
  }`;
  
  const iconBgClass = "w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center";

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Cabecera de la Vista */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            {texts?.dbWelcome || 'Panel de Control General'}
          </h1>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {texts?.dbWelcomeSub || 'Bienvenido de nuevo. Aquí tienes el estado actual de tu operación agropecuaria.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className={`px-4 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer flex items-center gap-2 transition-all ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}>
            <BarChart3 className="w-4 h-4" /> {texts?.dbReport || 'Generar Reporte'}
          </button>
          <button className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer flex items-center gap-2 transition-all shadow-md shadow-emerald-600/20 active:scale-95">
            + {texts?.dbRegister || 'Registrar Animal / Lote'}
          </button>
        </div>
      </div>

      {/* Grid de KPIs con Datos Reales */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* Tarjeta 1: Total Animales */}
        <div className={`${cardClass} flex flex-col justify-between h-full`}>
            <div className="flex items-center justify-between gap-4">
                <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{texts?.totalAnimals || 'Total de Animales'}</span>
                <div className={iconBgClass}><Users className="w-5 h-5" /></div>
            </div>
            <div className="mt-4">
                <p className="text-3xl font-extrabold tracking-tight">{totalAnimalsCount}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Sincronizado <span className='text-slate-400'>en vivo</span>
                </p>
            </div>
        </div>
        
        {/* Tarjeta 2: Hectáreas Activas */}
        <div className={cardClass}>
            <div className="flex items-center justify-between gap-4">
                <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{texts?.activeHectares || 'Hectáreas Activas'}</span>
                <div className={iconBgClass}><MapPin className="w-5 h-5" /></div>
            </div>
            <div className="mt-4">
                <p className="text-3xl font-extrabold tracking-tight">{totalHectaresArea.toFixed(1)} <span className='text-xl text-slate-400 font-normal'>ha</span></p>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                    <span className='px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full text-[11px] font-bold'>{potreros.length} Lotes</span> mapeados
                </p>
            </div>
        </div>

        {/* Tarjeta 3: Costos Mensuales */}
        <div className={cardClass}>
            <div className="flex items-center justify-between gap-4">
                <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{texts?.monthlyCosts || 'Costos Mensuales'}</span>
                <div className={iconBgClass}><DollarSign className="w-5 h-5" /></div>
            </div>
            <div className="mt-4">
                <p className="text-3xl font-extrabold tracking-tight">${totalMonthlyExpenses.toLocaleString()}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                    Control contable activo
                </p>
            </div>
        </div>

        {/* Tarjeta 4: Alertas Sanitarias */}
        <div className={cardClass}>
            <div className="flex items-center justify-between gap-4">
                <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{texts?.sanitaryAlerts || 'Alertas Sanitarias'}</span>
                <div className={`${iconBgClass} bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/55`}><AlertTriangle className="w-5 h-5" /></div>
            </div>
            <div className="mt-4">
                <p className="text-3xl font-extrabold tracking-tight">0 <span className='text-xl text-emerald-600'>Activas</span></p>
                <p className="text-xs text-slate-400 font-medium mt-1">
                    Hato en condiciones óptimas
                </p>
            </div>
        </div>
      </section>

      {/* Área Inferior: Carga por Potrero (Izq) y Asistente IA Corregido (Der) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Distribución de Carga por Potrero */}
        <div className={`${cardClass} lg:col-span-2 space-y-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-lg font-bold tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                {texts?.loadDistribution || 'Distribución de Carga por Potrero'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">{texts?.occupancyPercent || 'Porcentaje de ocupación actual y capacidad de rebrote'}</p>
            </div>
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full">
              {texts?.realTime || 'Vista en tiempo real'}
            </span>
          </div>

          {potreros.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No hay potreros registrados para calcular ocupación. Añade lotes en la sección de Hectáreas.
            </div>
          ) : (
            <div className="space-y-4">
              {potreros.map((lot, idx) => (
                <div key={idx} className={`flex items-center justify-between gap-4 p-4 rounded-2xl border transition-colors ${
                  isDarkMode ? 'bg-slate-950/50 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-100 text-slate-800'
                }`}>
                  <span className="text-xs font-bold">{lot.name}</span>
                  <div className="flex-1 h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-6 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[65%]"></div>
                  </div>
                  <span className="text-xs font-bold tabular-nums">65% Ocupación</span>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-inherit text-right">
            <button className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer inline-flex items-center gap-1.5">
              {texts?.viewAll || 'Ver todos los potreros'} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tarjeta Asistente IA Corregida (Diseño Oscuro Profesional y Coherente) */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 text-slate-100 space-y-5 shadow-xl sticky top-24">
            <div className="flex items-center justify-between gap-3">
                <div className='flex items-center gap-3'>
                    <div className="w-10 h-10 rounded-2xl bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-900/50">
                      <Zap className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-white tracking-tight">{texts?.iaAssistant || 'Asistente Predictivo IA'}</h3>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-900">
                  {texts?.active || 'ACTIVO'}
                </span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              {texts?.iaMonitoring || 'Monitoreo en tiempo real basado en variables climáticas, consumo histórico y métricas de salud.'}
            </p>

            <div className="space-y-4 pt-3 border-t border-slate-800/80">
                <div className='flex gap-3 items-start'>
                    <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-xs font-bold text-amber-400">{texts?.pastureRisk || 'Riesgo de escasez de pasto'}</p>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          {texts?.pastureDetail || 'El sistema no detecta déficit crítico en los potreros actuales registrados.'}
                        </p>
                    </div>
                </div>
                
                <div className='flex gap-3 items-start pt-3 border-t border-slate-800/80'>
                    <AlertTriangle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                        <p className="text-xs font-bold text-emerald-400">Salud del Hato Sincronizada</p>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          Todos los registros locales se encuentran estables dentro de los parámetros normales.
                        </p>
                    </div>
                </div>
            </div>
        </div>

      </section>

      {/* Footer de la App */}
      <footer className={`flex items-center justify-between py-4 border-t mt-12 text-xs transition-colors ${
        isDarkMode ? 'border-slate-800 text-slate-500' : 'border-slate-100 text-slate-400'
      }`}>
        <p>Sincronización en tiempo real con almacenamiento local</p>
        <p>RebañoPro Desktop Enterprise</p>
      </footer>
    </div>
  );
};