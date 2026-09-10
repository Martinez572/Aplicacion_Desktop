import React from 'react';
import { MetricCard } from '../components/dashboard/MetricCard';
import { AIAlertCard } from '../components/dashboard/AIAlertCard';
import { Users, MapPin, DollarSign, Activity, Plus } from 'lucide-react';

export const DashboardView = () => {
  return (
    <div>
      {/* Cabecera de la Vista */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Panel de Control General</h1>
          <p className="text-sm text-slate-500 mt-1">Bienvenido de nuevo. Aquí tienes el estado actual de tu operación agropecuaria.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2">
            Generar Reporte
          </button>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> Registrar Animal / Lote
          </button>
        </div>
      </div>

      {/* Grid de Métricas Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <MetricCard
          title="Total de Animales"
          value="1,248"
          change="+4.2%"
          isPositive={true}
          icon={Users}
          trendText="vs. mes anterior"
        />
        <MetricCard
          title="Hectáreas Activas"
          value="340 ha"
          change="85%"
          isPositive={true}
          icon={MapPin}
          trendText="Ocupación actual"
        />
        <MetricCard
          title="Costos Mensuales"
          value="$12,450"
          change="-2.1%"
          isPositive={true}
          icon={DollarSign}
          trendText="Optimizado"
        />
        <MetricCard
          title="Alertas Sanitarias"
          value="3 Activas"
          change="+1"
          isPositive={false}
          icon={Activity}
          trendText="Requieren atención"
        />
      </div>

      {/* Sección Inferior: Grid Principal y Panel de Alertas IA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Principal: Ocupación de Potreros */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-800">Distribución de Carga por Potrero</h3>
                <p className="text-xs text-slate-400 mt-0.5">Porcentaje de ocupación actual y capacidad de rebrote</p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                Vista en tiempo real
              </span>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Potrero 1 - Lote Bovinos A', percentage: 78 },
                { name: 'Potrero 2 - Descanso y Rebrote', percentage: 42 },
                { name: 'Potrero 3 - Cría y Levante', percentage: 92 },
                { name: 'Potrero 4 - Zona Norte', percentage: 60 },
              ].map((potrero, index) => (
                <div key={index} className="p-3.5 rounded-xl bg-slate-50/50 border border-slate-100">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="font-semibold text-slate-700">{potrero.name}</span>
                    <span className="font-bold text-slate-900">{potrero.percentage}% Ocupación</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        potrero.percentage > 85 ? 'bg-amber-500' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${potrero.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Última actualización: Hace 5 minutos</span>
            <a href="#" className="font-semibold text-emerald-600 hover:text-emerald-700">Ver todos los potreros →</a>
          </div>
        </div>

        {/* Columna Lateral: Alertas Inteligentes */}
        <div className="lg:col-span-1">
          <AIAlertCard />
        </div>
      </div>
    </div>
  );
};