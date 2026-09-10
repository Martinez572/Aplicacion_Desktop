import React, { useState } from 'react';
import { InteractiveFarmMap } from '../components/hectares/InteractiveFarmMap';
import { TerrainCanvasModal } from '../components/hectares/TerrainCanvasModal';
import { Sparkles, Plus, MapPin } from 'lucide-react';

export const HectaresView = ({onNotify}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Iniciamos la lista vacía (o con un array vacío) para que el sistema arranque limpio
  const [potreros, setPotreros] = useState([]);

  // Función que recibe los potreros generados en el modal de pasos
  const handleSavePotreros = (newPotreros) => {
    setPotreros(newPotreros);
    if (onNotify){
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecera de la Vista */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Cartografía y Gestión de Potreros</h1>
          <p className="text-sm text-slate-500 mt-1">Monitoreo satelital en tiempo real, control de ganado por lote y rotación de biomasa.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> Dibujar / Redividir Terreno
          </button>
        </div>
      </div>

      {/* Componente del Mapa Interactivo (Recibe los potreros reales creados por el usuario) */}
      <InteractiveFarmMap potreros={potreros} onOpenModal={() => setIsModalOpen(true)} />

      {/* Modal Asistente de Creación por Pasos */}
      <TerrainCanvasModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSavePotreros={handleSavePotreros}
      />
    </div>
  );
};