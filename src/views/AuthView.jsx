import React, { useState } from 'react';
import { ShieldCheck, Mail, Lock, User, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export const AuthView = ({ onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Manejar el envío del formulario (Registro o Login)
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password || (isRegistering && !name)) {
      setErrorMsg('Por favor, completa todos los campos obligatorios.');
      return;
    }

    if (isRegistering) {
      // Lógica de Registro: Guardar cuenta en localStorage
      const existingUser = localStorage.getItem('rebanopro_user');
      if (existingUser) {
        // Si ya hay una cuenta registrada, la actualizamos o validamos
      }

      const userData = { name, email, password };
      localStorage.setItem('rebanopro_user', JSON.stringify(userData));
      
      setSuccessMsg('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.');
      setTimeout(() => {
        setIsRegistering(false); // Cambiar a la vista de login automáticamente
        setSuccessMsg('');
      }, 1500);

    } else {
      // Lógica de Login: Validar contra la cuenta guardada
      const savedUserJSON = localStorage.getItem('rebanopro_user');
      
      if (!savedUserJSON) {
        setErrorMsg('No existe ninguna cuenta registrada. Por favor, crea una cuenta primero.');
        return;
      }

      const savedUser = JSON.parse(savedUserJSON);

      if (savedUser.email.trim().toLowerCase() === email.trim().toLowerCase() && savedUser.password === password) {
        // Login exitoso
        onLoginSuccess(savedUser);
      } else {
        setErrorMsg('Correo electrónico o contraseña incorrectos. Verifica tus datos.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans antialiased relative overflow-hidden">
      
      {/* Efectos de iluminación ambiental SaaS corporativa */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl shadow-2xl p-8 relative z-10 flex flex-col">
        
        {/* Cabecera del Brand */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-600/20 mb-4">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-bold tracking-wider text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Escritorio SaaS Enterprise
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-2">RebañoPro</h1>
          <p className="text-xs text-slate-500 mt-1">
            {isRegistering ? 'Crea tu cuenta de administrador del hato' : 'Inicia sesión con tus credenciales'}
          </p>
        </div>

        {/* Alertas de Error o Éxito */}
        {errorMsg && (
          <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200/60 rounded-2xl flex items-center gap-2.5 text-rose-700 text-xs animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200/60 rounded-2xl flex items-center gap-2.5 text-emerald-700 text-xs animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isRegistering && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nombre del Propietario / Administrador</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  required={isRegistering}
                  placeholder="Ej. Kevin Martínez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 shadow-sm transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="productor@rebanopro.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 shadow-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 shadow-sm transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3.5 rounded-xl shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
          >
            {isRegistering ? 'Registrar Cuenta de Usuario' : 'Iniciar Sesión al Sistema'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Alternar entre Registro y Login */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            {isRegistering ? '¿Ya tienes una cuenta creada?' : '¿Aún no tienes una cuenta?'}{' '}
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="text-emerald-600 font-bold hover:underline cursor-pointer ml-1"
            >
              {isRegistering ? 'Inicia Sesión aquí' : 'Regístrate aquí'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};