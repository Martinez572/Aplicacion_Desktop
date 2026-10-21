import React from 'react';
import { X, Printer, ShieldCheck, Download } from 'lucide-react';

export const ReportModal = ({ isOpen, onClose, transactions, currentUser }) => {
  if (!isOpen) return null;

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + (curr.rawAmount || parseFloat(curr.amount.replace(/[^0-9.-]+/g, "")) || 0), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + Math.abs(curr.rawAmount || parseFloat(curr.amount.replace(/[^0-9.-]+/g, "")) || 0), 0);

  const netBalance = totalIncome - totalExpense;
  const currentDate = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-white border border-slate-100 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Cabecera de la Modal (No se imprime) */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-800">Vista Previa de Reporte Financiero Oficial</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs px-3.5 py-2 rounded-xl shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Imprimir / Guardar PDF
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Contenido del Documento Impresible */}
        <div className="p-8 overflow-y-auto space-y-6 bg-white text-slate-800 font-sans">
          
          {/* Membrete del Documento */}
          <div className="border-b border-slate-200 pb-6 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold">
                  RP
                </div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">RebañoPro Enterprise</h1>
              </div>
              <p className="text-xs text-slate-500 mt-1">Sistema de Gestión e Inteligencia Pecuaria</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-800">Reporte de Balance Operativo</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Fecha de emisión: {currentDate}</p>
              <p className="text-[11px] text-slate-500">Administrador: {currentUser?.name || currentUser?.email || 'Propietario'}</p>
            </div>
          </div>

          {/* Resumen Ejecutivo de Cifras */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Ingresos Totales</span>
              <p className="text-lg font-bold text-emerald-600 mt-1">+${totalIncome.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Gastos Operativos</span>
              <p className="text-lg font-bold text-rose-600 mt-1">-${totalExpense.toLocaleString()}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Balance Neto Final</span>
              <p className={`text-lg font-bold mt-1 ${netBalance >= 0 ? 'text-slate-800' : 'text-rose-600'}`}>
                {netBalance >= 0 ? `+$${netBalance.toLocaleString()}` : `-$${Math.abs(netBalance).toLocaleString()}`}
              </p>
            </div>
          </div>

          {/* Tabla de Movimientos Detallados */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Detalle de Movimientos Contables Registrados</h4>
            {transactions.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center border border-dashed border-slate-200 rounded-xl">
                No hay transacciones registradas en este período.
              </p>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50">
                    <th className="py-2.5 px-3">Fecha</th>
                    <th className="py-2.5 px-3">Concepto</th>
                    <th className="py-2.5 px-3">Categoría</th>
                    <th className="py-2.5 px-3">Proveedor / Entidad</th>
                    <th className="py-2.5 px-3 text-right">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="py-3 px-3 text-slate-500 font-mono">{tx.date}</td>
                      <td className="py-3 px-3 font-medium text-slate-800">{tx.concept}</td>
                      <td className="py-3 px-3 text-slate-600">{tx.category}</td>
                      <td className="py-3 px-3 text-slate-500">{tx.provider || 'N/A'}</td>
                      <td className={`py-3 px-3 text-right font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-800'}`}>
                        {tx.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pie de Firma del Reporte */}
          <div className="pt-12 mt-12 border-t border-slate-200 flex justify-between items-end text-xs text-slate-500">
            <div>
              <p className="font-semibold text-slate-800">RebañoPro Enterprise - Módulo Financiero</p>
              <p className="text-[10px] text-slate-400">Documento generado de forma autónoma desde el entorno local.</p>
            </div>
            <div className="text-center">
              <div className="w-40 border-b border-slate-400 mb-1"></div>
              <p className="font-bold text-slate-700">Firma Autorizada / Administrador</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};