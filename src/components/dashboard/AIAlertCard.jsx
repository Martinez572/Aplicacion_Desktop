import React from 'react';
import { AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';

export const AIAlertCard = () => {
  const alerts = [
    {
      id: 1,
      title: 'Riesgo de escasez de pasto',
      description: 'El POTRERO 4 muestra una reducción del 15% en la regeneración de biomasa proyectada para los próximos 7 días.',
      type: 'warning',
      action: 'Rotar ganado al Potrero 2',
    },
    {
      id: 2,
      title: 'Alerta sanitaria preventiva',
      description: 'Se detectó tendencia al alza en revisiones de control en ganado joven. Vacunación recomendada.',
      type: 'danger',
      action: 'Ver protocolo sugerido',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between">
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm tracking-wide text-slate-100">Asistente Predictivo IA</h3>
          </div>
          <span className="text-[10px] font-semibold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
            Activo
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Monitoreo en tiempo real basado en variables climáticas, consumo histórico y métricas de salud.
        </p>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="bg-white/5 border border-white/10 p-3.5 rounded-xl backdrop-blur-sm">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${alert.type === 'danger' ? 'text-rose-400' : 'text-amber-400'}`} />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-slate-200">{alert.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{alert.description}</p>
                  <button className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                    {alert.action}
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};