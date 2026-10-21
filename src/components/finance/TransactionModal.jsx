import React, { useState } from 'react';
import { X, DollarSign, Check, FileText, UserCheck, Tag } from 'lucide-react';

export const TransactionModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: `TR-${Math.floor(1000 + Math.random() * 9000)}`,
    concept: '',
    type: 'expense', // 'expense' o 'income'
    category: 'Alimentación',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    // Campos detallados opcionales
    provider: '',
    associatedEntity: '', // Ej. Areta de animal o lote de terreno
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.concept || !formData.amount) return;

    const numericAmount = parseFloat(formData.amount);
    const formattedAmount = `${formData.type === 'income' ? '+' : '-'}$${numericAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    onSave({
      ...formData,
      amount: formattedAmount,
      rawAmount: numericAmount
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
      <div className="bg-white border border-slate-100 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabecera */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shadow-inner">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider text-emerald-600 uppercase bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                Registro Contable
              </span>
              <h3 className="text-base font-bold text-slate-800 tracking-tight mt-0.5">Nueva Transacción Detallada</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tipo de Movimiento *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  type: e.target.value, 
                  category: e.target.value === 'income' ? 'Venta de Leche / Ganado' : 'Alimentación' 
                })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 shadow-sm font-semibold"
              >
                <option value="expense">🔴 Gasto Operativo (Egreso)</option>
                <option value="income">🟢 Venta / Ingreso</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Categoría Contable *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 shadow-sm"
              >
                {formData.type === 'expense' ? (
                  <>
                    <option value="Alimentación">Alimentación y Suplementos</option>
                    <option value="Sanidad">Sanidad y Vacunación</option>
                    <option value="Infraestructura">Infraestructura y Mantenimiento</option>
                    <option value="Mano de Obra">Mano de Obra y Salarios</option>
                  </>
                ) : (
                  <>
                    <option value="Venta de Leche / Ganado">Venta de Leche y Ganado</option>
                    <option value="Subsidios y Apoyos">Subsidios e Incentivos</option>
                    <option value="Otros Ingresos">Otros Ingresos</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Concepto o Descripción General *</label>
            <input
              type="text"
              required
              placeholder="Ej. Compra de 10 bultos de sal mineralizada"
              value={formData.concept}
              onChange={(e) => setFormData({ ...formData, concept: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 shadow-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Monto Total ($) *</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 shadow-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Fecha del Movimiento *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 shadow-sm"
              />
            </div>
          </div>

          {/* Sección de Campos Opcionales Detallados */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Detalles Opcionales de Trazabilidad
            </span>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Proveedor / Cliente</label>
                <input
                  type="text"
                  placeholder="Ej. Agroinsumos del Sur"
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Areta o Lote Asociado</label>
                <input
                  type="text"
                  placeholder="Ej. Lote Norte / Vaca BV-1024"
                  value={formData.associatedEntity}
                  onChange={(e) => setFormData({ ...formData, associatedEntity: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Notas u Observaciones Adicionales</label>
              <textarea
                rows="2"
                placeholder="Detalles de facturación, condiciones de pago, etc."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 shadow-sm resize-none"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" /> Registrar Transacción
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};