import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Download, Plus, Filter, ArrowUpRight, PieChart } from 'lucide-react';

const initialTransactions = [
  { id: 'TR-8901', concept: 'Compra de Suplemento Nutricional (Lote A)', category: 'Alimentación', date: '08 Sep 2026', amount: '-$1,250.00', type: 'expense' },
  { id: 'TR-8902', concept: 'Venta de Leche - Comercializadora Láctea', category: 'Ingresos', date: '06 Sep 2026', amount: '+$3,840.00', type: 'income' },
  { id: 'TR-8903', concept: 'Servicios Veterinarios y Vacunación Hato', category: 'Sanidad', date: '02 Sep 2026', amount: '-$820.00', type: 'expense' },
  { id: 'TR-8904', concept: 'Mantenimiento de Cercas Eléctricas Sector Sur', category: 'Infraestructura', date: '30 Ago 2026', amount: '-$350.00', type: 'expense' },
  { id: 'TR-8905', concept: 'Venta de Ganro de Levante (4 Cabezas)', category: 'Ingresos', date: '25 Ago 2026', amount: '+$5,600.00', type: 'income' },
];

export const FinanceView = () => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [filterType, setFilterType] = useState('todos'); // 'todos', 'income', 'expense'

  const filteredTransactions = transactions.filter(tx => {
    if (filterType === 'todos') return true;
    return tx.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Cabecera de la Vista */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Costos y Finanzas Operativas</h1>
          <p className="text-sm text-slate-500 mt-1">Control de flujo de caja, balance de ingresos, gastos por categoría y rentabilidad del hato.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2">
            <Download className="w-4 h-4" /> Exportar Reporte Contable
          </button>
          <button 
          onClick={() => onNotify && onNotify('Formulario de registro de transaccion abierto.')}
          clasName="bg-emerald-600 hover: bg-emerald-700 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
          >
          
            <Plus className="w-4 h-4" /> Registrar Transacción
          </button>
        </div>
      </div>

      {/* Grid de Tarjetas de Resumen Financiero */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Balance Netos (Mes)</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800">+$7,020.00</h3>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +12.4% vs mes anterior
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ingresos Totales</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800">+$9,440.00</h3>
            <span className="text-xs text-slate-400 mt-1 block">Leche y venta de ganado</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gastos Operativos</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800">-$2,420.00</h3>
            <span className="text-xs text-slate-400 mt-1 block">Alimento, sanidad e infraestructura</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Costo por Cabezal (Prom)</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800">$19.40 / mes</h3>
            <span className="text-xs text-emerald-600 font-semibold mt-1 block">Optimizado por IA (-3.1%)</span>
          </div>
        </div>

      </div>

      {/* Sección Inferior: Desglose de Gastos por Categoría y Tabla de Movimientos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Distribución de Costos */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold text-slate-800">Distribución de Gastos</h3>
              <PieChart className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-4">
              {[
                { category: 'Alimentación y Suplementos', percentage: '52%', amount: '$1,250.00', color: 'bg-emerald-500' },
                { category: 'Sanidad y Vacunación', percentage: '34%', amount: '$820.00', color: 'bg-blue-500' },
                { category: 'Infraestructura y Mantenimiento', percentage: '14%', amount: '$350.00', color: 'bg-amber-500' },
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700">{item.category}</span>
                    <span className="font-bold text-slate-900">{item.amount}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: item.percentage }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Análisis automático de costos</span>
            <span className="text-emerald-600 font-semibold">Saludable</span>
          </div>
        </div>

        {/* Columna Derecha: Historial de Transacciones */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="text-sm font-bold text-slate-800">Movimientos y Transacciones Recientes</h3>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {['todos', 'income', 'expense'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                    filterType === type ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {type === 'todos' ? 'Todas' : type === 'income' ? 'Ingresos' : 'Gastos'}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-6">Concepto / Descripción</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Fecha</th>
                  <th className="py-3 px-6 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-800">{tx.concept}</td>
                    <td className="py-4 px-4">
                      <span className="bg-slate-100 text-slate-600 font-semibold px-2.5 py-1 rounded-lg text-[11px]">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-500">{tx.date}</td>
                    <td className={`py-4 px-6 text-right font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {tx.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>
  );
};