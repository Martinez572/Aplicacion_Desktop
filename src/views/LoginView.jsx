import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

export const LoginView = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('productor@rebanopro.com');
  const [password, setPassword] = useState('••••••••');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Acceso directo y libre sin requerir registro previo
    onLoginSuccess({ email });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans antialiased relative overflow-hidden">
      
      {/* Efectos de iluminación ambiental SaaS corporativa */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl shadow-2xl p-8 relative z-10 flex flex-col">
        
        {/* Cabecera del Brand */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-600/20 mb-4">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-bold tracking-wider text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Escritorio SaaS Enterprise
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-2">RebañoPro</h1>
          <p className="text-xs text-slate-500 mt-1">Sistema inteligente de gestión pecuaria</p>
        </div>

        {/* Formulario de Inicio de Sesión Rápido y Limpio */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Correo Electrónico del Hato</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 shadow-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Contraseña de Acceso</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 shadow-sm transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3.5 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            Iniciar Sesión al Sistema <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Nota informativa */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Acceso directo habilitado. No requiere registro previo en servidores externos.
          </p>
        </div>

      </div>
    </div>
  );
};