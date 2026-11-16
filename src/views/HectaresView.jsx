import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Plus, MapPin, Layers, Sprout, Loader2, Trash2, CheckCircle2 } from 'lucide-react';

export const HectaresView = ({ onNotify, texts }) => {
  const [pastures, setPastures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Formulario para nuevo potrero
  const [formData, setFormData] = useState({
    name: '',
    hectares: '',
    grass_type: 'Brachiaria',
    status: 'Activo'
  });

  // Cargar potreros desde Supabase al montar
  useEffect(() => {
    fetchPastures();
  }, []);

  const fetchPastures = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pastures')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPastures(data || []);
    } catch (error) {
      console.error('Error al cargar potreros:', error.message);
      onNotify('Error al cargar la cartografía desde la nube', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Registrar nuevo potrero en Supabase
  const handleCreatePasture = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const newPasture = {
        user_id: user?.id,
        name: formData.name,
        hectares: parseFloat(formData.hectares) || 0,
        grass_type: formData.grass_type,
        status: formData.status
      };

      const { data, error } = await supabase
        .from('pastures')
        .insert([newPasture])
        .select();

      if (error) throw error;

      setPastures([data[0], ...pastures]);
      setIsModalOpen(false);
      setFormData({ name: '', hectares: '', grass_type: 'Brachiaria', status: 'Activo' });
      onNotify('Potrero registrado exitosamente en la nube', 'success');
    } catch (error) {
      console.error('Error al registrar potrero:', error.message);
      onNotify('Error al guardar el potrero', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Eliminar potrero
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este potrero de la cartografía?')) return;

    try {
      const { error } = await supabase.from('pastures').delete().eq('id', id);
      if (error) throw error;

      setPastures(pastures.filter(p => p.id !== id));
      onNotify('Potrero eliminado correctamente', 'info');
    } catch (error) {
      console.error('Error al eliminar potrero:', error.message);
      onNotify('No se pudo eliminar el registro', 'error');
    }
  };

  // Calcular área total de la finca
  const totalHectares = pastures.reduce((acc, curr) => acc + (parseFloat(curr.hectares) || 0), 0);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Cabecera de la Vista con estilo SaaS de alta gama */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors">
        <div>
          <span className="text-xs font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/50">
            {texts?.hecTag || 'Cartografía y Pasturas'}
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
            {texts?.hecTitle || 'Gestión de Hectáreas y Potreros'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            {texts?.hecSub || 'Control de superficie, rotación de pastoreo y tipos de biomasa sincronizados en la nube.'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{texts?.hecAddBtn || 'Registrar Nuevo Potrero'}</span>
        </button>
      </div>

      {/* Tarjetas de Métricas Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{texts?.hecTotalArea || 'Superficie Total'}</span>
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl flex items-center justify-center text-emerald-600">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{totalHectares} <span className="text-sm font-bold text-slate-400">ha</span></div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">Superficie productiva activa</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{texts?.hecActiveLots || 'Potreros Activos'}</span>
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl flex items-center justify-center text-emerald-600">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{pastures.length}</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-1">Lotes delimitados en Supabase</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{texts?.hecGrassQuality || 'Calidad de Pastura'}</span>
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl flex items-center justify-center text-emerald-600">
              <Sprout className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">Óptima</div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-1">Basado en índices de rebrote</p>
        </div>
      </div>

      {/* Contenido Principal: Listado o Estado Vacío */}
      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
      ) : pastures.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl text-center">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 shadow-inner">
            <MapPin className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {texts?.hecEmptyTitle || 'No hay potreros registrados'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mb-6">
            {texts?.hecEmptySub || 'Comienza a mapear la superficie de tu finca agregando tu primer sector.'}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            {texts?.hecFirstBtn || 'Crear primer potrero'}
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Nombre del Potrero</th>
                  <th className="py-4 px-6">Superficie (Hectáreas)</th>
                  <th className="py-4 px-6">Tipo de Pasto</th>
                  <th className="py-4 px-6">Estado Actual</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                {pastures.map((pasture) => (
                  <tr key={pasture.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      {pasture.name}
                    </td>
                    <td className="py-4 px-6 font-semibold">{pasture.hectares} ha</td>
                    <td className="py-4 px-6">{pasture.grass_type}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-900">
                        <CheckCircle2 className="w-3 h-3" />
                        {pasture.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(pasture.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                        title="Eliminar potrero"
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

      {/* Modal Flotante de Registro */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-2xl p-8 transition-colors">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Registrar Nuevo Potrero</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePasture} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Nombre / Identificador</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej. Potrero San José"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Superficie (Hectáreas)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.hectares}
                  onChange={(e) => setFormData({ ...formData, hectares: e.target.value })}
                  placeholder="Ej. 12.5"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Tipo de Pasto / Biomasa</label>
                <select
                  value={formData.grass_type}
                  onChange={(e) => setFormData({ ...formData, grass_type: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Brachiaria">Brachiaria</option>
                  <option value="Kikuyo">Kikuyo</option>
                  <option value="Estrella">Pasto Estrella</option>
                  <option value="Mombasa">Mombasa</option>
                  <option value="Saboya">Saboya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Estado Operativo</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Activo">Activo (Pastoreo)</option>
                  <option value="En Descanso">En Descanso / Rebrote</option>
                  <option value="Mantenimiento">En Mantenimiento</option>
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
                  <span>Guardar Potrero</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};