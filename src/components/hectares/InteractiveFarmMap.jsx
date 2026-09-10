import React, { useState, useEffect } from 'react';
import { Layers, Users, ShieldAlert, Sparkles, Plus, ArrowUpRight, MapPin } from 'lucide-react';

export const InteractiveFarmMap = ({ potreros = [], onOpenModal }) => {
  // Seleccionar por defecto el primer potrero si existe
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [mapMode, setMapMode] = useState('satellital');

  useEffect(() => {
    if (potreros.length > 0) {
      setSelectedParcel(potreros[0]);
    } else {
      setSelectedParcel(null);
    }
  }, [potreros]);

  // Si no hay potreros creados, mostramos un diseño limpio y profesional de "Estado Vacío"
  if (potreros.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[500px]">
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100 shadow-inner">
          <MapPin className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">No hay terrenos ni potreros registrados</h3>
        <p className="text-sm text-slate-400 max-w-md mt-1 mb-6">
          Tu espacio de trabajo está limpio. Inicia el asistente de cartografía para delimitar tu terreno y dividirlo en secciones personalizadas.
        </p>
        <button
          onClick={onOpenModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-5 py-3 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" /> Crear y Dibujar mi Primer Terreno
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-10rem)]">
      
      {/* Cabecera del Mapa */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white z-20">
        <div>
          <span className="text-[11px] font-semibold tracking-wider text-emerald-600 uppercase bg-emerald-50 px-2.5 py-1 rounded-full">
            Cartografía Interactiva SaaS
          </span>
          <h2 className="text-base font-bold text-slate-800 tracking-tight mt-1">Mapa Satelital y Control de Parcelas</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setMapMode('satellital')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mapMode === 'satellital' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Vista Satelital
            </button>
            <button
              onClick={() => setMapMode('vector')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mapMode === 'vector' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Plano Vectorial
            </button>
          </div>
          <button 
            onClick={onOpenModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-4 py-2 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Redividir Terreno
          </button>
        </div>
      </div>

      {/* Contenedor Principal: Mapa y Panel Lateral */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 relative overflow-hidden bg-slate-950">
        
        {/* Lienzo del Mapa */}
        <div className="lg:col-span-8 relative overflow-hidden flex items-center justify-center p-6">
          <div className={`absolute inset-0 transition-opacity duration-500 ${mapMode === 'satellital' ? 'opacity-70 bg-[radial-gradient(#15803d_1px,transparent_1px)] bg-[size:20px_20px]' : 'opacity-30 bg-[linear-gradient(to_right,#334155_1px,transparent_1px)]'}`}></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-emerald-950/40 to-slate-900 pointer-events-none"></div>

          <div className="absolute inset-4 rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-gradient-to-br from-emerald-900/60 via-green-900/40 to-slate-950 flex items-center justify-center p-6">
            
            {/* Renderizado dinámico de las parcelas creadas por el usuario */}
            <div className="w-full h-full relative grid grid-cols-2 gap-4 items-center justify-center">
              {potreros.map((parcel) => {
                const isSelected = selectedParcel?.id === parcel.id;
                return (
                  <div
                    key={parcel.id}
                    onClick={() => setSelectedParcel(parcel)}
                    className={`rounded-2xl border-2 transition-all duration-300 cursor-pointer backdrop-blur-xs flex flex-col justify-between p-4 group min-h-[140px] ${
                      parcel.statusType === 'warning'
                        ? 'bg-amber-950/40 border-amber-500/80 shadow-lg shadow-amber-900/20'
                        : 'bg-emerald-950/50 border-emerald-500/60 shadow-lg shadow-emerald-900/20 hover:border-emerald-400'
                    } ${isSelected ? 'ring-4 ring-white/30 scale-105 z-20' : 'hover:scale-[1.02] z-10'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-emerald-500 text-slate-950">
                        ZONA ACTIVA
                      </span>
                      <span className="text-[11px] font-semibold text-white/90 bg-slate-900/60 px-2 py-0.5 rounded-lg">
                        {parcel.area}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white mt-2">{parcel.name}</h4>
                      <p className="text-[10px] text-slate-300 mt-0.5">Pasto: {parcel.grassType}</p>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-300 bg-slate-900/40 px-2 py-1 rounded-lg mt-2">
                      <span>Ocupación: <strong className="text-white">{parcel.occupation}%</strong></span>
                      <span className="text-emerald-400 font-semibold">{parcel.soilStatus}</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Panel Lateral de Datos Agrícolas del Lote Seleccionado */}
        <div className="lg:col-span-4 bg-slate-900 border-l border-white/10 p-6 flex flex-col justify-between relative overflow-hidden z-20">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" /> Datos Agrícolas y Ganaderos
              </h3>
              <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full uppercase">
                Seleccionado
              </span>
            </div>

            {selectedParcel ? (
              <div className="bg-slate-800/80 border border-white/10 rounded-2xl p-5 mb-6 backdrop-blur-sm shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{selectedParcel.name}</h4>
                    <p className="text-xs text-slate-400">Extensión: {selectedParcel.area}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    {selectedParcel.soilStatus.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5">
                    <span className="text-[11px] text-slate-400 block">Tipo de Pasto</span>
                    <strong className="text-xs text-white mt-1 block truncate">{selectedParcel.grassType}</strong>
                  </div>
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-white/10">
                    <span className="text-[11px] text-slate-400 block">Ocupación</span>
                    <strong className="text-sm text-emerald-400 mt-1 block">{selectedParcel.occupation}%</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs">
                Selecciona una parcela en el mapa para ver sus detalles técnicos.
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/10">
            <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2">
              Gestionar Lote Completo <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};