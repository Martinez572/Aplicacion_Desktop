import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Plus, Search, ShieldAlert, CheckCircle2, Activity, Loader2, Trash2 } from 'lucide-react';

export const InventoryView = ({ onNotify, texts }) => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Formulario para nuevo animal
  const [formData, setFormData] = useState({
    tag: '',
    category: 'Vaca',
    weight: '',
    health_status: 'Sano'
  });

  // 1. Cargar animales desde Supabase al montar el componente
  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('animals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnimals(data || []);
    } catch (error) {
      console.error('Error al cargar inventario:', error.message);
      onNotify('Error al cargar el inventario desde la nube', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 2. Registrar nuevo animal en Supabase
  const handleCreateAnimal = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const newAnimal = {
        user_id: user?.id,
        tag: formData.tag,
        category: formData.category,
        weight: parseFloat(formData.weight) || 0,
        health_status: formData.health_status
      };

      const { data, error } = await supabase
        .from('animals')
        .insert([newAnimal])
        .select();

      if (error) throw error;

      setAnimals([data[0], ...animals]);
      setIsModalOpen(false);
      setFormData({ tag: '', category: 'Vaca', weight: '', health_status: 'Sano' });
      onNotify('Animal registrado exitosamente en la nube', 'success');
    } catch (error) {
      console.error('Error al registrar animal:', error.message);
      onNotify('Error al guardar el animal', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Eliminar animal
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este registro del hato?')) return;

    try {
      const { error } = await supabase.from('animals').delete().eq('id', id);
      if (error) throw error;

      setAnimals(animals.filter(a => a.id !== id));
      onNotify('Registro eliminado correctamente', 'info');
    } catch (error) {
      console.error('Error al eliminar:', error.message);
      onNotify('No se pudo eliminar el registro', 'error');
    }
  };

  // Filtrado por buscador
  const filteredAnimals = animals.filter(animal => 
    animal.tag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Cabecera de la Vista */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors">
        <div>
          <span className="text-xs font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/50">
            {texts?.invTag || 'Gestión de Hato Ganadero'}
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
            {texts?.invTitle || 'Inventario Animal'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            {texts?.invSub || 'Monitoreo individual en tiempo real sincronizado con tu base de datos en la nube.'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{texts?.invAddBtn || 'Registrar Nuevo Animal'}</span>
        </button>
      </div>

      {/* Barra de Búsqueda y Métricas Rápidas */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={texts?.invSearch || 'Buscar por código o categoría...'}
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm transition-all"
          />
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <Activity className="w-4 h-4 text-emerald-600" />
          <span>Total Cabezas en Nube: <strong className="text-slate-900 dark:text-white">{animals.length}</strong></span>
        </div>
      </div>

      {/* Contenido Principal: Tabla o Estados Vacíos */}
      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
      ) : filteredAnimals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl text-center">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 shadow-inner">
            <Activity className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {texts?.invEmptyTitle || 'No hay animales registrados'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mb-6">
            {texts?.invEmptySub || 'Tu hato en Supabase está vacío. Comienza agregando tu primer espécimen.'}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            {texts?.invFirstBtn || 'Registrar mi primer animal'}
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Código / Tag</th>
                  <th className="py-4 px-6">Categoría</th>
                  <th className="py-4 px-6">Peso (kg)</th>
                  <th className="py-4 px-6">Estado Sanitario</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                {filteredAnimals.map((animal) => (
                  <tr key={animal.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      {animal.tag}
                    </td>
                    <td className="py-4 px-6">{animal.category}</td>
                    <td className="py-4 px-6 font-semibold">{animal.weight} kg</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                        animal.health_status === 'Sano' 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-900' 
                          : 'bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-950/40 dark:border-amber-900'
                      }`}>
                        {animal.health_status === 'Sano' ? <CheckCircle2 className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
                        {animal.health_status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(animal.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                        title="Eliminar registro"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Flotante de Registro con Estética SaaS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl p-8 transition-colors">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Registrar Nuevo Animal</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAnimal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Código / Tag</label>
                <input
                  type="text"
                  required
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  placeholder="Ej. V-001"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Categoría</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Vaca">Vaca</option>
                  <option value="Toro">Toro</option>
                  <option value="Ternero">Ternero / Ternera</option>
                  <option value="Novillo">Novillo</option>
                  <option value="Ceba">Lote de Ceba</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Peso Promedio (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="Ej. 450"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Estado Sanitario</label>
                <select
                  value={formData.health_status}
                  onChange={(e) => setFormData({ ...formData, health_status: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Sano">Sano</option>
                  <option value="En observación">En observación</option>
                  <option value="Tratamiento">En tratamiento</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-600/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Guardar en la Nube</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};