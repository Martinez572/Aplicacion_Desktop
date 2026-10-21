import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Download, Plus, Trash2, FileText } from 'lucide-react';
import { TransactionModal } from '../components/finance/TransactionModal';
import { ReportModal } from '../components/finance/ReportModal';

export const FinanceView = ({ onNotify, texts }) => {
  // Cero datos por defecto: Arranca en vacío []
  const [transactions, setTransactions] = useState(() => {
    const user = JSON.parse(localStorage.getItem('rebanopro_user'));
    const storageKey = `rebanopro_finance_${user?.email || 'default'}`;
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  });

  const [filterType, setFilterType] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('rebanopro_user'));

  // Sincronizar automáticamente con localStorage por usuario
  useEffect(() => {
    const storageKey = `rebanopro_finance_${currentUser?.email || 'default'}`;
    localStorage.setItem(storageKey, JSON.stringify(transactions));
  }, [transactions, currentUser]);

  const filteredTransactions = transactions.filter(tx => {
    if (filterType === 'todos') return true;
    return tx.type === filterType;
  });

  const handleSaveTransaction = (newTx) => {
    setTransactions([newTx, ...transactions]);
    if (onNotify) {
      onNotify(`Transacción "${newTx.concept}" registrada con éxito.`);
    }
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
    if (onNotify) {
      onNotify('Transacción eliminada correctamente.', 'info');
    }
  };

  // Cálculos reales basados en los datos ingresados
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + (curr.rawAmount || parseFloat(curr.amount.replace(/[^0-9.-]+/g, "")) || 0), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + Math.abs(curr.rawAmount || parseFloat(curr.amount.replace(/[^0-9.-]+/g, "")) || 0), 0);

  const netBalance = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold tracking-wider text-emerald-600 uppercase bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            {texts.finTag}
          </span>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight mt-1">{texts.finTitle}</h1>
          <p className="text-sm text-slate-500 mt-1">{texts.finSub}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsReportOpen(true)}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" /> {texts.finReportBtn}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> {texts.finAddBtn}
          </button>
        </div>
      </div>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{texts.netBalance}</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className={`text-2xl font-bold ${netBalance >= 0 ? 'text-slate-800' : 'text-rose-600'}`}>
              {netBalance >= 0 ? `+$${netBalance.toLocaleString()}` : `-$${Math.abs(netBalance).toLocaleString()}`}
            </h3>
            <span className="text-xs text-slate-400 mt-1 block">Flujo de caja real</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{texts.totalIncome}</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800">+${totalIncome.toLocaleString()}</h3>
            <span className="text-xs text-slate-400 mt-1 block">Leche y ventas</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{texts.totalExpense}</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800">-${totalExpense.toLocaleString()}</h3>
            <span className="text-xs text-slate-400 mt-1 block">Insumos y sanidad</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{texts.finRecords}</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800">{transactions.length} Registros</h3>
            <span className="text-xs text-emerald-600 font-semibold mt-1 block">Sincronizado</span>
          </div>
        </div>
      </div>

      {/* Tabla y Filtros */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-800">Historial Financiero</h3>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {['todos', 'income', 'expense'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                  filterType === type ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {type === 'todos' ? 'Todas' : type === 'income' ? 'Ingresos' : 'Gastos'}
              </button>
            ))}
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="py-16 px-6 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
              <DollarSign className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">{texts.finEmptyTitle}</h3>
            <p className="text-xs text-slate-400 max-w-sm">{texts.finEmptySub}</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer border border-emerald-200/50"
            >
              {texts.finFirstBtn}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-6">Concepto / Descripción</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Proveedor / Entidad</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-4 text-right">Monto</th>
                  <th className="py-3 px-6 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-800">{tx.concept}</p>
                      {tx.notes && <span className="text-[11px] text-slate-400">{tx.notes}</span>}
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-slate-100 text-slate-600 font-semibold px-2.5 py-1 rounded-lg text-[11px]">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-500">{tx.provider || 'N/A'}</td>
                    <td className="py-4 px-4 text-slate-500 font-mono">{tx.date}</td>
                    <td className={`py-4 px-4 text-right font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {tx.amount}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(tx.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer inline-flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modales */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTransaction}
      />

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        transactions={transactions}
        currentUser={currentUser}
      />

    </div>
  );
};