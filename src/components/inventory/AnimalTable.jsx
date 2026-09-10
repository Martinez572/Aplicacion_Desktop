import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';

const initialAnimals = [
  { id: 'BOV-1042', name: 'Margarita', category: 'Vacas Lecheras', age: '3.5 años', weight: '540 kg', status: 'Gestación', statusType: 'warning', location: 'Potrero 2' },
  { id: 'BOV-1043', name: 'Sultán', category: 'Toros Reproductores', age: '4.0 años', weight: '780 kg', status: 'Pastando', statusType: 'success', location: 'Potrero 1' },
  { id: 'BOV-1044', name: 'Lucero', category: 'Terneros de Levante', age: '8 meses', weight: '220 kg', status: 'En Tratamiento', statusType: 'danger', location: 'Corral Principal' },
  { id: 'BOV-1045', name: 'Gitana', category: 'Vacas Lecheras', age: '2.8 años', weight: '490 kg', status: 'Pastando', statusType: 'success', location: 'Potrero 3' },
  { id: 'BOV-1046', name: 'Rayito', category: 'Terneros de Levante', age: '10 meses', weight: '250 kg', status: 'Pastando', statusType: 'success', location: 'Potrero 3' },
];

export const AnimalTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Todos');

  const filteredAnimals = initialAnimals.filter((animal) => {
    const matchesSearch = animal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          animal.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'Todos') return matchesSearch;
    return matchesSearch && animal.status === selectedFilter;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      {/* Barra superior de Búsqueda y Filtros */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Buscador */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por código, nombre o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>

        {/* Filtros rápidos por estado */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['Todos', 'Pastando', 'Gestación', 'En Tratamiento'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedFilter === filter
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Datos */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-6">Identificador / Nombre</th>
              <th className="py-3.5 px-4">Categoría</th>
              <th className="py-3.5 px-4">Edad / Peso</th>
              <th className="py-3.5 px-4">Ubicación Actual</th>
              <th className="py-3.5 px-4">Estado</th>
              <th className="py-3.5 px-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {filteredAnimals.length > 0 ? (
              filteredAnimals.map((animal) => (
                <tr key={animal.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-xs shrink-0 border border-emerald-100">
                        {animal.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{animal.name}</p>
                        <p className="text-[11px] text-slate-400 font-medium">{animal.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 font-medium text-slate-600">{animal.category}</td>
                  <td className="py-4 px-4">
                    <span className="font-semibold text-slate-800">{animal.weight}</span>
                    <span className="text-slate-400 ml-1.5 font-normal">({animal.age})</span>
                  </td>
                  <td className="py-4 px-4 font-medium text-slate-600">{animal.location}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        animal.statusType === 'success'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                          : animal.statusType === 'warning'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200/50'
                          : 'bg-rose-50 text-rose-700 border border-rose-200/50'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          animal.statusType === 'success'
                            ? 'bg-emerald-500'
                            : animal.statusType === 'warning'
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                        }`}
                      ></span>
                      {animal.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 ml-auto transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-400">
                  No se encontraron animales que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación inferior */}
      <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Mostrando <strong>{filteredAnimals.length}</strong> de <strong>1,248</strong> animales registrados</span>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-slate-700 px-2">Página 1 de 125</span>
          <button className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};