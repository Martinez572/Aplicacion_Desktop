import React from 'react';
import { MapPin, ShieldAlert, CheckCircle2, ArrowUpRight } from 'lucide-react';

export const HectareCard = ({ potrero }) => {
  const { name, area, occupation, grassType, soilStatus, statusType, lastRotation } = potrero;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Cabecera de la tarjeta */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm tracking-tight">{name}</h3>
              <p className="text-xs text-slate-400 font-medium">Extensión: {area}</p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
              statusType === 'success'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                : statusType === 'warning'
                ? 'bg-amber-50 text-amber-700 border border-amber-200/50'
                : 'bg-rose-50 text-rose-700 border border-rose-200/50'
            }`}
          >
            {statusType === 'success' ? <CheckCircle2 className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
            {soilStatus}
          </span>
        </div>

        {/* Detalles técnicos */}
        <div className="space-y-3 mb-6 bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Tipo de Pasto:</span>
            <span className="font-semibold text-slate-700">{grassType}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Última Rotación:</span>
            <span className="font-semibold text-slate-700">{lastRotation}</span>
          </div>
        </div>

        {/* Barra de progreso de Ocupación */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-600">Ocupación de Biomasa</span>
            <span className="font-bold text-slate-900">{occupation}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                occupation > 85 ? 'bg-amber-500' : occupation < 40 ? 'bg-blue-500' : 'bg-emerald-600'
              }`}
              style={{ width: `${occupation}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Botón de acción inferior */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">Monitoreo satelital activo</span>
        <button className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
          Gestionar Potrero <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};