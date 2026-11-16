import React, { useState } from 'react';
import { Sparkles, Stethoscope, DollarSign, Send, Bot, User, Loader2, AlertCircle } from 'lucide-react';
import { consultClaudeAI } from '../services/claudeService'; // Importamos el servicio centralizado

export const AIHealthView = ({ texts }) => {
  const [activeTab, setActiveTab] = useState('veterinary'); // 'veterinary' | 'financial' | 'general'
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Historial de chat independiente por cada subsección
  const [chats, setChats] = useState({
    veterinary: [
      { role: 'assistant', content: 'Hola. Soy tu Asistente Veterinario IA de RebañoPro (respaldado por Claude). Describe los síntomas o el comportamiento anómalo de algún espécimen para recibir un protocolo preliminar de evaluación clínica.' }
    ],
    financial: [
      { role: 'assistant', content: 'Hola. Soy tu Asesor Financiero Pecuario. Puedo analizar los costos de alimentación, sanidad y márgenes de rentabilidad de tu hato.' }
    ],
    general: [
      { role: 'assistant', content: 'Hola. Soy el núcleo de Inteligencia de RebañoPro. ¿En qué aspecto estratégico de la gestión de tu finca te puedo colaborar hoy?' }
    ]
  });

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userMsg = prompt.trim();
    setPrompt('');

    // Añadir mensaje del usuario al chat activo
    const updatedHistory = [...chats[activeTab], { role: 'user', content: userMsg }];
    setChats({ ...chats, [activeTab]: updatedHistory });
    setLoading(true);

    try {
      // Llamada limpia al servicio modular de Claude
      const aiResponse = await consultClaudeAI(activeTab, userMsg);

      setChats({
        ...chats,
        [activeTab]: [...updatedHistory, { role: 'assistant', content: aiResponse }]
      });

    } catch (error) {
      console.error("Error en llamada IA Claude:", error);
      setChats({
        ...chats,
        [activeTab]: [
          ...updatedHistory, 
          { 
            role: 'assistant', 
            content: `⚠️ Error de conexión con Anthropic: ${error.message}. Por favor, verifica tu clave de API (VITE_ANTHROPIC_API_KEY) en el archivo .env y reinicia el servidor.` 
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Cabecera corporativa */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold tracking-wider text-emerald-600 uppercase bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            {texts?.aiTag || 'Inteligencia Artificial Pecuaria'}
          </span>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight mt-1">{texts?.aiTitle || 'Centro de Decisiones e IA'}</h1>
          <p className="text-sm text-slate-500 mt-1">{texts?.aiSub || 'Asistencia experta en diagnóstico veterinario y consultoría integral.'}</p>
        </div>
      </div>

      {/* Pestañas de Navegación del Centro de IA */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('veterinary')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'veterinary' 
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Stethoscope className="w-4 h-4" /> {texts?.aiTabVet || 'Asistencia Veterinaria'}
        </button>
        <button
          onClick={() => setActiveTab('financial')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'financial' 
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <DollarSign className="w-4 h-4" /> {texts?.aiTabFin || 'Ayuda Financiera y Costos'}
        </button>
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'general' 
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-4 h-4" /> {texts?.aiTabGen || 'Consultor General de Hato'}
        </button>
      </div>

      {/* Contenedor Principal del Chat IA */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[550px]">
        
        {/* Barra superior de estado */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border border-emerald-100">
              {activeTab === 'veterinary' ? <Stethoscope className="w-5 h-5" /> : activeTab === 'financial' ? <DollarSign className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-800">
                {activeTab === 'veterinary' ? 'Módulo de Diagnóstico Clínico y Sanidad Animal' : activeTab === 'financial' ? 'Módulo de Análisis de Costos y Márgenes de Ganancia' : 'Consultor General de Gestión Pecuaria'}
              </h3>
              <p className="text-[11px] text-slate-400">Modelo conectado: Claude 3.5 Sonnet (Anthropic)</p>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> IA Activa Online
          </span>
        </div>

        {/* Historial de Mensajes */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/40">
          {chats[activeTab].map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-slate-800 text-white' : 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                msg.role === 'user' 
                  ? 'bg-slate-800 text-white rounded-tr-none' 
                  : 'bg-white border border-slate-100 text-slate-700 shadow-sm rounded-tl-none font-medium'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-100 p-3.5 rounded-2xl shadow-sm flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" /> Claude está analizando tu consulta pecuaria...
              </div>
            </div>
          )}
        </div>

        {/* Formulario de Envío de Pregunta */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex items-center gap-3">
          <input
            type="text"
            placeholder={
              activeTab === 'veterinary' 
                ? 'Ej. Vaca Holstein con decaimiento, fiebre y baja ingesta de agua...' 
                : activeTab === 'financial' 
                ? 'Ej. ¿Cómo puedo optimizar los costos en suplementos este mes?' 
                : 'Escribe tu consulta general sobre el hato...'
            }
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-none focus:border-emerald-500 shadow-sm transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" /> {texts?.aiSend || 'Enviar Consulta'}
          </button>
        </form>

      </div>

    </div>
  );
};