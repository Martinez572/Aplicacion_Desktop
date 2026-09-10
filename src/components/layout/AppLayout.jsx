import React from 'react';
import { Sidebar } from './Sidebar';

export const AppLayout = ({ children, currentView, onViewChange }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex font-sans antialiased text-slate-900 w-full">
      {/* 1. Barra lateral fija con ancho exacto (w-64) */}
      <Sidebar currentView={currentView} onViewChange={onViewChange} />

      {/* 2. Contenedor principal que empuja el contenido a la derecha del sidebar (ml-64) y ocupa el resto (flex-1) */}
      <div className="ml-64 flex-1 flex flex-col min-h-screen min-w-0">
        {/* Cabecera translúcida */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-10 px-8 flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-wider text-emerald-600 uppercase bg-emerald-50 px-2.5 py-1 rounded-full">
              Panel Activo
            </span>
            <h2 className="text-sm font-medium text-slate-600 capitalize">/ {currentView}</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs text-slate-500 font-medium">Sistema Sincronizado</span>
          </div>
        </header>

        {/* Área de contenido flexible que se expande por completo */}
        <main className="flex-1 p-8 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};