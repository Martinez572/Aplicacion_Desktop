import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Plus, DollarSign, TrendingUp, TrendingDown, Wallet, Loader2, Trash2 } from 'lucide-react';

export const FinanceView = ({ onNotify, texts }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Formulario para nueva transacción
  const [formData, setFormData] = useState({
    type: 'Ingreso',
    category: 'Venta de Ganado',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Cargar transacciones desde Supabase al montar
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error al cargar transacciones:', error.message);
      onNotify('Error al cargar la contabilidad desde la nube', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Registrar nueva transacción en Supabase
  const handleCreateTransaction = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const newTx = {
        user_id: user?.id,
        type: formData.type,
        category: formData.category,
        amount: parseFloat(formData.amount) || 0,
        description: formData.description,
        date: formData.date
      };

      const { data, error } = await supabase
        .from('transactions')
        .insert([newTx])
        .select();

      if (error) throw error;

      setTransactions([data[0], ...transactions]);
      setIsModalOpen(false);
      setFormData({
        type: 'Ingreso',
        category: 'Venta de Ganado',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      onNotify('Transacción registrada exitosamente en la nube', 'success');
    } catch (error) {
      console.error('Error al registrar transacción:', error.message);
      onNotify('Error al guardar el movimiento contable', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Eliminar transacción
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este registro contable?')) return;

    try {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      if (error) throw error;

      setTransactions(transactions.filter(t => t.id !== id));
      onNotify('Registro eliminado correctamente', 'info');
    } catch (error) {
      console.error('Error al eliminar transacción:', error.message);
      onNotify('No se pudo eliminar el registro', 'error');
    }
  };

  // Cálculos financieros globales
  const totalIncome = transactions
    .filter(t => t.type === 'Ingreso')
    .reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'Gasto')
    .reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

  const netBalance = totalIncome - totalExpense;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Cabecera de la Vista */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors">
        <div>
          <span className="text-xs font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/50">
            {texts?.finTag || 'Módulo Contable Enterprise'}
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
            {texts?.finTitle || 'Costos y Finanzas Operativas'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            {texts?.finSub || 'Control de flujo de caja, balance de ingresos y gastos sincronizados en tiempo real.'}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-2xl shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{texts?.finAddBtn || 'Registrar Transacción'}</span>
        </button>
      </div>

      {/* Tarjetas de Métricas Financieras */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{texts?.netBalance || 'Balance Neto'}</span>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${netBalance >= 0 ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600' : 'bg-rose-50 dark:bg-rose-950/50 text-rose-600'}`}>
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className={`text-3xl font-black ${netBalance >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-600'}`}>
            ${netBalance.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 font-semibold mt-1">Flujo operativo consolidado</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{texts?.totalIncome || 'Ingresos Totales'}</span>
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl flex items-center justify-center text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            ${totalIncome.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 font-semibold mt-1">Ventas y entradas registradas</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-colors">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{texts?.totalExpense || 'Gastos Operativos'}</span>
            <div className="w-10 h-10 bg-rose-50 dark:bg-rose-950/50 rounded-2xl flex items-center justify-center text-rose-600">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-rose-600 dark:text-rose-400">
            ${totalExpense.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400 font-semibold mt-1">Insumos, personal y mantenimiento</p>
        </div>
      </div>

      {/* Contenido Principal: Listado de Transacciones */}
      {loading ? (
        <div className="flex items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl text-center">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 shadow-inner">
            <DollarSign className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {texts?.finEmptyTitle || 'No hay transacciones registradas'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mb-6">
            {texts?.finEmptySub || 'Tu módulo contable está limpio. Comienza a registrar ingresos o gastos operativos.'}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            {texts?.finFirstBtn || 'Registrar primera transacción'}
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Tipo</th>
                  <th className="py-4 px-6">Categoría</th>
                  <th className="py-4 px-6">Descripción</th>
                  <th className="py-4 px-6">Fecha</th>
                  <th className="py-4 px-6">Monto</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                        tx.type === 'Ingreso' 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-900' 
                          : 'bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-950/40 dark:border-rose-900'
                      }`}>
                        {tx.type === 'Ingreso' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">{tx.category}</td>
                    <td className="py-4 px-6 text-slate-500 dark:text-slate-400">{tx.description || 'Sin descripción'}</td>
                    <td className="py-4 px-6">{tx.date}</td>
                    <td className={`py-4 px-6 font-black ${tx.type === 'Ingreso' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {tx.type === 'Ingreso' ? '+' : '-'}${Math.abs(tx.amount).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(tx.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 transition-colors rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                        title="Eliminar transacción"
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
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Registrar Transacción</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Tipo de Movimiento</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Ingreso">Ingreso</option>
                  <option value="Gasto">Gasto Operativo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Categoría</label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Ej. Venta de Leche, Alimento, Vacunas"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Monto ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="Ej. 1500000"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Fecha</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">Descripción (Opcional)</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalles adicionales..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
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
                  <span>Guardar Transacción</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};