import React, { useState } from 'react';
import { Search, Plus, ChevronRight, Activity, ShieldCheck, Tag } from 'lucide-react';
import { AddAnimalModal } from '../components/inventory/AddAnimalModal'; // Ajusta la ruta si tu modal está en otra carpeta

const initialAnimals = [
  { id: 'BV-1024', name: 'Rosilla', category: 'Lechería', breed: 'Holstein', weight: '540 kg', age: '3.5 años', status: 'Saludable', potrero: 'Sector 1 (Norte)' },
  { id: 'BV-1025', name: 'Manta Rayas', category: 'Doble Propósito', breed: 'Normando', weight: '490 kg', age: '2.8 años', status: 'En Observación', potrero: 'Sector 2 (Central)' },
  { id: 'BV-1026', name: 'Sultán', category: 'Reproductor', breed: 'Brahman', weight: '780 kg', age: '4.2 años', status: 'Saludable', potrero: 'Sector 3 (Sur)' },
];

export const InventoryView = ({ onNotify }) => {
  const [animals, setAnimals] = useState(initialAnimals);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  
  // Estado fundamental para controlar la visibilidad del modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filtrado en tiempo real
  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = animal.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          animal.breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || animal.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Función que maneja el guardado del nuevo animal desde el modal
  const handleSaveAnimal = (newAnimal) => {
    setAnimals([newAnimal, ...animals]);
    if (onNotify) {
      onNotify(`Espécimen ${newAnimal.name} (${newAnimal.id}) registrado exitosamente.`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold tracking-wider text-emerald-600 uppercase bg-emerald-50 px-2.5 py-1 rounded-full">
            Gestión de Hato Ganadero
          </span>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight mt-1">Inventario Animal</h1>
          <p className="text-sm text-slate-500 mt-1">Monitoreo individual de peso, trazabilidad genética, estado sanitario y asignación de potreros.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* BOTÓN CONECTADO AL ESTADO DEL MODAL */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Registrar Nuevo Animal
          </button>
        </div>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Cabezas</span>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{animals.length} Animales</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Tag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Peso Promedio Hato</span>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">510 kg</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estado Sanitario Óptimo</span>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">98.4%</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabla y Filtros */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por código, nombre o raza..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 shadow-sm transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            {['Todos', 'Lechería', 'Doble Propósito', 'Reproductor', 'Levante'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat 
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-6">Identificador / Nombre</th>
                <th className="py-3 px-4">Categoría / Raza</th>
                <th className="py-3 px-4">Peso / Edad</th>
                <th className="py-3 px-4">Potrero Asignado</th>
                <th className="py-3 px-4">Estado Sanitario</th>
                <th className="py-3 px-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredAnimals.map((animal) => (
                <tr key={animal.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center text-xs border border-emerald-100">
                        {animal.id.split('-')[1] || 'BV'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{animal.name}</p>
                        <span className="text-[11px] text-slate-400 font-mono">{animal.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-semibold text-slate-800">{animal.category}</p>
                    <span className="text-[11px] text-slate-500">{animal.breed}</span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-bold text-slate-800">{animal.weight}</p>
                    <span className="text-[11px] text-slate-500">{animal.age}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-lg text-[11px]">
                      {animal.potrero}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                      animal.status === 'Saludable' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200/50'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${animal.status === 'Saludable' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                      {animal.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => onNotify && onNotify(`Viendo expediente de ${animal.name} (${animal.id}).`)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 transition-colors inline-flex items-center justify-center cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RENDERIZADO DEL MODAL EXISTENTE (AddAnimalModal) */}
      <AddAnimalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAnimal}
      />

    </div>
  );
};