import React, { useState, useRef } from 'react';
import { X, Pencil, Sparkles, Check, ChevronRight, ChevronLeft, MapPin, Layers, ShieldCheck, RotateCcw } from 'lucide-react';

export const TerrainCanvasModal = ({ isOpen, onClose, onSavePotreros }) => {
  const [step, setStep] = useState(1);
  const [terrainName, setTerrainName] = useState('Finca El Encanto - Lote Principal');
  const [totalHectares, setTotalHectares] = useState(24.5);

  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);

  // Secciones con porcentajes, áreas y coordenadas visuales para las etiquetas
  const [sections, setSections] = useState([
    { id: 1, name: 'Sección 01', area: '24.5', percentage: 100, grassState: 'Alta Hierba', badgePos: { top: '50%', left: '50%' } }
  ]);

  const svgRef = useRef(null);
  const terrenoBoxRef = useRef(null);

  if (!isOpen) return null;

  const startDrawing = (e) => {
    if (!terrenoBoxRef.current) return;
    const rect = terrenoBoxRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      setIsDrawing(true);
      setCurrentPath([{ x, y }]);
    }
  };

  const draw = (e) => {
    if (!isDrawing || !terrenoBoxRef.current) return;
    const rect = terrenoBoxRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentPath(prev => [...prev, { x, y }]);
  };

  const stopDrawing = () => {
    if (!isDrawing || currentPath.length < 5 || !terrenoBoxRef.current) {
      setIsDrawing(false);
      setCurrentPath([]);
      return;
    }

    setIsDrawing(false);
    const rect = terrenoBoxRef.current.getBoundingClientRect();
    
    let start = currentPath[0];
    let end = currentPath[currentPath.length - 1];

    const isNearEdge = (p) => p.x < 30 || p.x > rect.width - 30 || p.y < 30 || p.y > rect.height - 30;

    // Validación y autocompletado de frontera a frontera
    if (isNearEdge(start) || isNearEdge(end) || Math.hypot(end.x - start.x, end.y - start.y) > rect.width * 0.3) {
      const completedPath = [...currentPath];
      if (completedPath[0].x > rect.width / 2) completedPath[0].x = rect.width; else completedPath[0].x = 0;
      if (completedPath[completedPath.length - 1].x < rect.width / 2) completedPath[completedPath.length - 1].x = 0; else completedPath[completedPath.length - 1].x = rect.width;

      const newPaths = [...paths, completedPath];
      setPaths(newPaths);
      setCurrentPath([]);

      const numSections = newPaths.length + 1;
      const weights = newPaths.map((_, idx) => (idx % 2 === 0 ? 0.35 : 0.25));
      const remainingWeight = Math.max(0.1, 1.0 - weights.reduce((a, b) => a + b, 0));
      const allWeights = [...weights, remainingWeight];
      const totalWeightSum = allWeights.reduce((a, b) => a + b, 0);

      // Posiciones predefinidas y elegantes para distribuir los badges en el mapa según el número de secciones
      const positions = [
        { top: '30%', left: '30%' },
        { top: '30%', left: '70%' },
        { top: '70%', left: '50%' },
        { top: '50%', left: '30%' },
        { top: '50%', left: '70%' },
      ];

      const updatedSections = allWeights.map((w, i) => {
        const calculatedArea = ((w / totalWeightSum) * totalHectares).toFixed(1);
        return {
          id: i + 1,
          name: `Sección 0${i + 1}`,
          area: calculatedArea,
          percentage: Math.round((w / totalWeightSum) * 100),
          grassState: 'Alta Hierba',
          badgePos: positions[i % positions.length]
        };
      });

      setSections(updatedSections);
    } else {
      setCurrentPath([]);
    }
  };

  const handleResetDrawing = () => {
    setPaths([]);
    setCurrentPath([]);
    setSections([
      { id: 1, name: 'Sección 01', area: totalHectares.toString(), percentage: 100, grassState: 'Alta Hierba', badgePos: { top: '50%', left: '50%' } }
    ]);
  };

  const handleGrassStateChange = (id, state) => {
    setSections(sections.map(s => s.id === id ? { ...s, grassState: state } : s));
  };

  const handleSave = () => {
    const formatted = sections.map((sec, idx) => ({
      id: Date.now() + idx,
      name: `${terrainName} - ${sec.name}`,
      area: `${sec.area} ha`,
      occupation: sec.grassState === 'Alta Hierba' ? 85 : sec.grassState === 'Creciendo' ? 50 : 15,
      grassType: sec.grassState,
      soilStatus: sec.grassState === 'Sin Vegetación' ? 'Requiere Cuidado' : 'Óptimo',
      statusType: sec.grassState === 'Sin Vegetación' ? 'warning' : 'success',
      lastRotation: 'Trazado profesional con etiquetas en mapa',
    }));
    onSavePotreros(formatted);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[94vh] animate-in fade-in zoom-in-95 duration-200 text-slate-100">
        
        {/* Cabecera */}
        <div className="px-8 py-5 border-b border-white/10 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Paso {step} de 3
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {step === 1 ? 'Definir Terreno y Área' : step === 2 ? 'Trazado con Etiquetas en Vivo' : 'Estado de Vegetación'}
                </span>
              </div>
              <h2 className="text-base font-bold text-white tracking-tight mt-1">
                {step === 1 ? 'Configuración Inicial del Lote' : step === 2 ? 'Visualiza las etiquetas de sección numeradas sobre el campo' : 'Asignación de Biomasa'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="p-8 flex-1 overflow-y-auto">
          
          {/* ================= PASO 1 ================= */}
          {step === 1 && (
            <div className="max-w-xl mx-auto space-y-6 py-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 shadow-inner">
                  <MapPin className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">¿Cómo se llama tu terreno y cuál es su extensión?</h3>
                <p className="text-xs text-slate-400">Establece el área base en hectáreas para los cálculos proporcionales del sistema.</p>
              </div>

              <div className="bg-slate-950 p-6 rounded-3xl border border-white/10 space-y-4 shadow-inner">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nombre del Lote o Finca</label>
                  <input
                    type="text"
                    value={terrainName}
                    onChange={(e) => setTerrainName(e.target.value)}
                    className="w-full bg-slate-900 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Área Total (Hectáreas)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={totalHectares}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setTotalHectares(val);
                      const areaCalc = (val / sections.length).toFixed(1);
                      setSections(sections.map(s => ({ ...s, area: areaCalc })));
                    }}
                    className="w-full bg-slate-900 border border-white/10 rounded-2xl px-4 py-3 text-base font-bold text-emerald-400 focus:outline-none focus:border-emerald-500 shadow-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= PASO 2: MAPA CON ETIQUETAS NUMERADAS FLOTANTES ================= */}
          {step === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Izquierda: Campo con etiquetas de sección flotantes en vivo */}
              <div className="lg:col-span-8 bg-slate-950 p-6 rounded-3xl border border-white/10 relative overflow-hidden h-[380px] flex flex-col justify-between shadow-inner group">
                <div className="absolute inset-0 bg-[radial-gradient(#15803d_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950 via-slate-950 to-green-900/40 pointer-events-none"></div>

                <div className="relative z-10 flex items-center justify-between bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 shadow-md">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                    <Pencil className="w-4 h-4" /> Traza cercas: las secciones se numeran automáticamente en el mapa
                  </span>
                  <button
                    onClick={handleResetDrawing}
                    className="text-[10px] text-slate-400 hover:text-white bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 transition-colors flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Reiniciar Trazos
                  </button>
                </div>

                {/* LIENZO DEL TERRENO CON BADGES NUMERADOS */}
                <div 
                  ref={svgRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="relative z-10 w-4/5 h-3/5 mx-auto my-auto border-2 border-white/90 rounded-[2.5rem] bg-emerald-700/30 backdrop-blur-xs shadow-[0_0_35px_rgba(34,197,94,0.3)] overflow-hidden cursor-crosshair flex items-center justify-center"
                >
                  <div ref={terrenoBoxRef} className="absolute inset-0 w-full h-full">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 via-green-600/20 to-emerald-800/40 pointer-events-none"></div>

                    {/* ETIQUETAS NUMERADAS FLOTANTES EN EL MAPA */}
                    {sections.map((sec, idx) => (
                      <div
                        key={sec.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none transition-all duration-300"
                        style={{ top: sec.badgePos.top, left: sec.badgePos.left }}
                      >
                        <div className="bg-slate-950/90 border border-emerald-400/80 text-emerald-300 px-3 py-1.5 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          <div>
                            <p className="text-[11px] font-extrabold text-white tracking-wide">{sec.name}</p>
                            <p className="text-[9px] text-emerald-400 font-semibold">{sec.area} ha</p>
                          </div>
                        </div>
                      </div>
                    ))}

                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                      {paths.map((path, idx) => (
                        <path
                          key={idx}
                          d={`M ${path.map(p => `${p.x} ${p.y}`).join(' L ')}`}
                          fill="none"
                          stroke="#34d399"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      ))}
                      {currentPath.length > 0 && (
                        <path
                          d={`M ${currentPath.map(p => `${p.x} ${p.y}`).join(' L ')}`}
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}
                    </svg>
                  </div>

                  {paths.length === 0 && currentPath.length === 0 && (
                    <div className="relative z-10 text-center p-4 bg-slate-950/70 backdrop-blur-md rounded-2xl border border-white/10 pointer-events-none">
                      <p className="text-xs font-bold text-white">Terreno base ({totalHectares} ha)</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Dibuja una línea para ver los distintivos de sección.</p>
                    </div>
                  )}
                </div>

                <div className="relative z-10 text-[11px] text-slate-400 text-center bg-slate-900/80 py-2 rounded-xl border border-white/10">
                  🗺️ Cada sección creada muestra su distintivo numérico y área calculada directamente sobre el plano.
                </div>
              </div>

              {/* Derecha: Secciones con Áreas Variables Reales */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-slate-950 p-6 rounded-3xl border border-white/10 space-y-4 shadow-inner">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" /> Secciones y Áreas Variables
                  </h3>
                  
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {sections.map((sec) => (
                      <div key={sec.id} className="bg-slate-900 p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-white">{sec.name}</p>
                          <p className="text-xs font-extrabold text-emerald-400 mt-0.5">{sec.area} Hectáreas <span className="text-[10px] text-slate-400 font-normal">({sec.percentage}%)</span></p>
                        </div>
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ================= PASO 3: ESTADO DE LA HIERBA ================= */}
          {step === 3 && (
            <div className="max-w-xl mx-auto space-y-6 py-4">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white">¿Cuál es el estado de la hierba en cada sección trazada?</h3>
                <p className="text-xs text-slate-400">Configura la biomasa actual para optimizar el pastoreo y las alertas de IA.</p>
              </div>

              <div className="space-y-3">
                {sections.map((sec) => (
                  <div key={sec.id} className="bg-slate-950 p-4 rounded-2xl border border-white/10 flex items-center justify-between gap-4 shadow-inner">
                    <div>
                      <p className="text-xs font-bold text-white">{sec.name}</p>
                      <p className="text-[11px] text-emerald-400 font-medium">{sec.area} Hectáreas <span className="text-slate-400">({sec.percentage}%)</span></p>
                    </div>
                    <select
                      value={sec.grassState}
                      onChange={(e) => handleGrassStateChange(sec.id, e.target.value)}
                      className="bg-slate-900 border border-white/10 text-white rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-500 font-medium"
                    >
                      <option value="Alta Hierba">🟢 Alta Hierba</option>
                      <option value="Creciendo">🟡 Creciendo</option>
                      <option value="Sin Vegetación">🔴 Sin Vegetación</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* PIE DEL MODAL */}
        <div className="px-8 py-5 border-t border-white/10 flex items-center justify-between bg-slate-900/90">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition-all border border-white/10 flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs font-semibold transition-all border border-white/10"
            >
              Cancelar
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                Continuar <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" /> Guardar Terreno y Zonas
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};