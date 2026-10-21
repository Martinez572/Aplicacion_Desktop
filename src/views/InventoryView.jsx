import React, { useState, useEffect } from 'react';
import { Search, Plus, ChevronRight, Activity, ShieldCheck, Tag, Inbox } from 'lucide-react';
import { AddAnimalModal } from '../components/inventory/AddAnimalModal';

export const InventoryView = ({ onNotify, texts }) => {
  // CERO DATOS POR DEFECTO: Inicializa vacío si no hay nada guardado
  const [animals, setAnimals] = useState(() => {
    const user = JSON.parse(localStorage.getItem('rebanopro_user'));
    const storageKey = `rebanopro_animals_${user?.email || 'default'}`;
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('rebanopro_user'));
    const storageKey = `rebanopro_animals_${user?.email || 'default'}`;
    localStorage.setItem(storageKey, JSON.stringify(animals));
  }, [animals]);

  const filteredAnimals = animals.filter(animal => {
    const matchesSearch = animal.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          animal.breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || animal.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSaveAnimal = (newAnimal) => {
    setAnimals([newAnimal, ...animals]);
    if (onNotify) {
      onNotify(`Espécimen ${newAnimal.name} (${newAnimal.id}) registrado exitosamente.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold tracking-wider text-emerald-600 uppercase bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            {texts.invTag}
          </span>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight mt-1">{texts.invTitle}</h1>
          <p className="text-sm text-slate-500 mt-1">{texts.invSub}</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> {texts.invAddBtn}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{texts.invTotalHeads}</span>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{animals.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Tag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{texts.invHerdStatus}</span>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{animals.length > 0 ? 'Activo' : 'Clean'}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{texts.invSanitary}</span>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">{animals.length > 0 ? '100%' : 'N/A'}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder={texts.invSearch}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 shadow-sm transition-all"
            />
          </div>
        </div>

        {animals.length === 0 ? (
          <div className="py-16 px-6 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
              <Inbox className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">{texts.invEmptyTitle}</h3>
            <p className="text-xs text-slate-400 max-w-sm">{texts.invEmptySub}</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer border border-emerald-200/50"
            >
              {texts.invFirstBtn}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Tabla estándar de animales */}
          </div>
        )}
      </div>

      <AddAnimalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAnimal}
      />
    </div>
  );
};