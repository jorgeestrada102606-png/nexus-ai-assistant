'use client';

import React from 'react';
import { Brain, Code, PenTool, Lightbulb, Cpu, ChevronRight } from 'lucide-react';
import { PROMPT_SUGGESTIONS } from '@/lib/presets';

interface EmptyStateProps {
  onSelectPrompt: (promptText: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectPrompt }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Brain':
        return <Brain className="w-5 h-5 text-cyan-400" />;
      case 'Code':
        return <Code className="w-5 h-5 text-blue-400" />;
      case 'PenTool':
        return <PenTool className="w-5 h-5 text-indigo-400" />;
      case 'Lightbulb':
      default:
        return <Lightbulb className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto my-auto animate-in fade-in duration-300">
      {/* Central Holographic Emblem */}
      <div className="relative mb-5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-950 via-slate-900 to-blue-950 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-xl shadow-cyan-500/20">
          <Cpu className="w-7 h-7 text-cyan-400 animate-pulse" />
        </div>
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff] animate-ping" />
      </div>

      <div className="font-mono text-xs uppercase tracking-widest text-cyan-400 mb-1">
        SISTEMAS OPERATIVOS // PROTOCOLO JARVIS
      </div>

      <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight mb-2">
        A su entera disposición, señor.
      </h2>
      <p className="text-sm text-slate-400 max-w-md mb-8 leading-relaxed font-sans">
        Soy <strong className="text-cyan-300">NEXUS</strong>. He sincronizado los módulos de cálculo y síntesis de voz. Indíqueme la directiva o seleccione una directiva rápida:
      </p>

      {/* Suggested Prompts Cards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        {PROMPT_SUGGESTIONS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(item.prompt)}
            className="group p-4 rounded-2xl bg-[#0c1422]/90 hover:bg-[#111c30] border border-cyan-950/70 hover:border-cyan-400/50 transition-all flex flex-col gap-1.5 shadow-sm hover:shadow-cyan-950/30 hover:-translate-y-0.5 active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/20 group-hover:border-cyan-400/40 transition-colors">
                  {getIcon(item.icon)}
                </div>
                <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
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
