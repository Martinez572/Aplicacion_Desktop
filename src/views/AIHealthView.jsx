import React, { useState } from 'react';
import { Activity, ShieldAlert, Sparkles, AlertTriangle, CheckCircle2, Send, Bot, User, Thermometer, Stethoscope } from 'lucide-react';

export const AIHealthView = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hola Kevin. He analizado los datos biométricos recientes del Hato. El Potrero 3 muestra un índice de humedad elevado que podría propiciar parásitos en los terneros. ¿Deseas que genere una recomendación de rotación preventiva?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: inputMessage };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    // Simulando respuesta de la IA de RebañoPro
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Entendido. He registrado la instrucción en el sistema y actualizado las alertas sanitarias para el lote correspondiente.'
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Cabecera de la Vista */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold tracking-wider text-emerald-600 uppercase bg-emerald-50 px-2.5 py-1 rounded-full">
            Motor de Inteligencia Artificial
          </span>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight mt-1">Salud e Inteligencia Artificial</h1>
          <p className="text-sm text-slate-500 mt-1">Diagnósticos predictivos, alertas sanitarias automatizadas y asistente inteligente para el hato.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            IA Activa y Sincronizada
          </span>
        </div>
      </div>

      {/* Grid Superior: Tarjetas de Alertas Sanitarias Críticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Riesgo Sanitario Detectado</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-bold text-slate-800">Alerta de Parásitos (Lote 3)</h3>
            <p className="text-xs text-slate-500 mt-1">Detectado por correlación de humedad en suelo y comportamiento de consumo.</p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-rose-600 font-semibold">Acción requerida</span>
            <button className="text-emerald-600 font-bold hover:underline">Ver protocolo →</button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Vacunación Próxima</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Thermometer className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-bold text-slate-800">Fiebre Aftosa (Ciclo B)</h3>
            <p className="text-xs text-slate-500 mt-1">Programado para el 15 de Octubre de 2026. 100% del hato por inocular.</p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-amber-600 font-semibold">En 34 días</span>
            <button className="text-emerald-600 font-bold hover:underline">Programar lote →</button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estado General del Hato</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-bold text-slate-800">96.8% Saludable</h3>
            <p className="text-xs text-slate-500 mt-1">Solo 4 animales bajo seguimiento veterinario secundario.</p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-semibold">Estable</span>
            <span className="text-slate-400">Actualizado hace 1h</span>
          </div>
        </div>

      </div>

      {/* Sección Inferior: Asistente IA Interactivo */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[500px]">
        
        {/* Cabecera del Chat */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800">Asistente Predictivo Veterinario RebañoPro</h3>
            <p className="text-[11px] text-slate-400">Entrenado con métricas de biomasa, clima e historiales sanitarios.</p>
          </div>
        </div>

        {/* Cuerpo de Mensajes */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/30">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 max-w-xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                msg.sender === 'ai' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-800 text-white'
              }`}>
                {msg.sender === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div className={`p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${
                msg.sender === 'ai' 
                  ? 'bg-white text-slate-700 border border-slate-100 rounded-tl-none' 
                  : 'bg-emerald-600 text-white rounded-tr-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Barra de Entrada de Texto */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white flex items-center gap-3">
          <input
            type="text"
            placeholder="Pregúntale a la IA sobre síntomas, rotación de potreros o planes de vacunación..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 transition-all"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> Enviar
          </button>
        </form>

      </div>

    </div>
  );
};