'use client';

import React from 'react';
import { Brain, Code, PenTool, Lightbulb, Sparkles, ChevronRight } from 'lucide-react';
import { PROMPT_SUGGESTIONS } from '@/lib/presets';

interface EmptyStateProps {
  onSelectPrompt: (promptText: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectPrompt }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Brain':
        return <Brain className="w-5 h-5 text-[#00F5A0]" />;
      case 'Code':
        return <Code className="w-5 h-5 text-[#34D399]" />;
      case 'PenTool':
        return <PenTool className="w-5 h-5 text-[#6EE7B7]" />;
      case 'Lightbulb':
      default:
        return <Lightbulb className="w-5 h-5 text-[#A7F3D0]" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto my-auto animate-in fade-in duration-300">
      {/* Central Bio-Emblem */}
      <div className="relative mb-5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#061D12] to-[#0E3D26] border border-[#00F5A0]/50 flex items-center justify-center text-[#00F5A0] shadow-xl shadow-[#00F5A0]/25">
          <Sparkles className="w-7 h-7 fill-current animate-pulse" />
        </div>
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#00F5A0] shadow-[0_0_8px_#00F5A0] animate-ping" />
      </div>

      <div className="font-mono text-xs uppercase tracking-widest text-[#00F5A0] mb-1">
        NEXUS // COMPA AI
      </div>

      <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-2">
        ¡Qué onda bro! ¿En qué te tiro paro hoy?
      </h2>
      <p className="text-sm text-slate-300 max-w-md mb-8 leading-relaxed font-sans">
        Échame tus dudas de código, tareas de la escuela, ideas chidas o lo que traigas atorado. Sin rollos raros, al grano y en corto.
      </p>

      {/* Suggested Prompts Cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        {PROMPT_SUGGESTIONS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(item.prompt)}
            className="group p-4 rounded-2xl bg-[#081A12]/90 hover:bg-[#0E281C] border border-[#00F5A0]/15 hover:border-[#00F5A0]/50 transition-all flex flex-col gap-1.5 shadow-sm hover:shadow-emerald-950/40 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#0A2619] border border-[#00F5A0]/20 group-hover:border-[#00F5A0]/40 transition-colors">
                  {getIcon(item.icon)}
                </div>
                <span className="text-xs font-semibold text-slate-100 group-hover:text-[#00F5A0] transition-colors">
                  {item.title}
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-600 group-hover:text-[#00F5A0] transition-colors" />
            </div>
            <p className="text-[12px] text-slate-400 leading-snug line-clamp-2 mt-1">
              {item.desc}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
