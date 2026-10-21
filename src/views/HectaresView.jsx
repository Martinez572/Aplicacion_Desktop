import React, { useState, useEffect } from 'react';
import { InteractiveFarmMap } from '../components/hectares/InteractiveFarmMap';
import { TerrainCanvasModal } from '../components/hectares/TerrainCanvasModal';
import { Sparkles, MapPin, Layers, ShieldCheck } from 'lucide-react';

export const HectaresView = ({ onNotify, texts, isDarkMode }) => {
  // Cero datos por defecto: Se inicializa vacío leyendo del almacenamiento local del usuario activo
  const [potreros, setPotreros] = useState(() => {
    const user = JSON.parse(localStorage.getItem('rebanopro_user'));
    const storageKey = `rebanopro_potreros_${user?.email || 'default'}`;
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sincronización automática de potreros en localStorage por usuario
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('rebanopro_user'));
    const storageKey = `rebanopro_potreros_${user?.email || 'default'}`;
    localStorage.setItem(storageKey, JSON.stringify(potreros));
  }, [potreros]);

  // Función que recibe los potreros generados en el modal de dibujo/división
  const handleSavePotreros = (newPotreros) => {
    setPotreros(newPotreros);
    if (onNotify) {
      onNotify(texts?.hecNotifySuccess || 'Cartografía de potreros actualizada con éxito.');
    }
  };

  const totalArea = potreros.reduce((acc, curr) => acc + (parseFloat(curr.area) || parseFloat(curr.size) || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Cabecera de la Vista */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/50">
            {texts?.hecTag || 'Cartografía y Pasturas'}
          </span>
          <h1 className={`text-2xl font-bold tracking-tight mt-1 ${isDarkMode ? 'text-slate-100' : 'text-slate-800'}`}>
            {texts?.hecTitle || 'Cartografía y Gestión de Potreros'}
          </h1>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {texts?.hecSub || 'Monitoreo satelital en tiempo real, control de ganado por lote y rotación de biomasa.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-4.5 py-3 rounded-2xl shadow-md shadow-emerald-600/25 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4" /> {texts?.hecDrawBtn || 'Dibujar / Redividir Terreno'}
          </button>
        </div>
      </div>

      {/* Tarjetas de Resumen KPI (Superficie y Lotes) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className={`p-6 rounded-3xl border shadow-sm flex items-center justify-between transition-colors ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-100 text-slate-800'
        }`}>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{texts?.hecTotalArea || 'Superficie Total'}</span>
            <h3 className="text-2xl font-extrabold mt-1">{totalArea.toFixed(1)} ha</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50">
            <MapPin className="w-6 h-6" />
          </div>
        </div>

        <div className={`p-6 rounded-3xl border shadow-sm flex items-center justify-between transition-colors ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-100 text-slate-800'
        }`}>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{texts?.hecActiveLots || 'Potreros Activos'}</span>
            <h3 className="text-2xl font-extrabold mt-1">{potreros.length} Lotes</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/50">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className={`p-6 rounded-3xl border shadow-sm flex items-center justify-between transition-colors ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-100 text-slate-800'
        }`}>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{texts?.hecGrassQuality || 'Calidad de Pastura'}</span>
            <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{potreros.length > 0 ? 'Óptima' : 'Sin datos'}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/50">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Componente del Mapa Interactivo (Muestra el plano y los potreros reales creados) */}
      <InteractiveFarmMap 
        potreros={potreros} 
        onOpenModal={() => setIsModalOpen(true)} 
        isDarkMode={isDarkMode}
        texts={texts}
      />

      {/* Modal Asistente de Creación y División por Pasos (Canvas interactivo) */}
      <TerrainCanvasModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSavePotreros={handleSavePotreros}
        initialPotreros={potreros}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};