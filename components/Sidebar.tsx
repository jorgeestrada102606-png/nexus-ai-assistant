'use client';

import React from 'react';
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Settings, 
  X,
  Cpu,
  Radio
} from 'lucide-react';
import { ChatSession } from '@/types/chat';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onClearAll: () => void;
  onOpenSettings: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isCollapsedDesktop: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onClearAll,
  onOpenSettings,
  isOpenMobile,
  onCloseMobile,
  isCollapsedDesktop,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 bg-[#080D15] border-r border-cyan-950/70 flex flex-col justify-between select-none transition-all duration-200 ${
          isOpenMobile
            ? 'translate-x-0 w-72'
            : '-translate-x-full lg:translate-x-0'
        } ${
          isCollapsedDesktop ? 'lg:hidden' : 'lg:w-64 xl:w-72'
        }`}
      >
        {/* Top Header & New Chat */}
        <div className="p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between lg:hidden pb-1">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span className="font-mono font-bold text-sm text-cyan-300">NEXUS PROTOCOL</span>
            </div>
            <button
              onClick={onCloseMobile}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* System Status Pill */}
          <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#0c1422] border border-cyan-950 text-[11px] font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#00f0ff]" />
              <span className="text-cyan-300 font-semibold">NEXUS // ONLINE</span>
            </div>
            <Radio className="w-3 h-3 text-cyan-400" />
          </div>

          <button
            onClick={onNewSession}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-cyan-950/40 hover:bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold transition-all shadow-sm active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>+ Nueva Conversación</span>
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto px-3 py-1 flex flex-col gap-1 font-mono">
          <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            REGISTROS RECIENTES
          </div>

          {sessions.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500 font-mono">
              Sin registros activos
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              return (
                <div
                  key={session.id}
                  onClick={() => onSelectSession(session.id)}
                  className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer text-xs transition-all ${
                    isActive
                      ? 'bg-cyan-950/40 text-cyan-200 font-medium border border-cyan-400/50 shadow-[0_0_12px_rgba(0,240,255,0.1)]'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <MessageSquare
                      className={`w-3.5 h-3.5 flex-shrink-0 ${
                        isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-400'
                      }`}
                    />
                    <span className="truncate">{session.title}</span>
                  </div>

                  {sessions.length > 1 && (
                    <button
                      onClick={(e) => onDeleteSession(session.id, e)}
                      title="Eliminar conversación"
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 rounded transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-cyan-950/70 flex flex-col gap-1 text-xs font-mono">
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-colors w-full text-left"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Configuración</span>
          </button>

          {sessions.length > 1 && (
            <button
              onClick={onClearAll}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors w-full text-left"
            >
              <Trash2 className="w-4 h-4 text-slate-400 hover:text-rose-400" />
              <span>Limpiar registros</span>
            </button>
          )}

          <div className="px-3 pt-2 text-[10px] text-slate-500 flex items-center justify-between">
            <span>JARVIS CORE</span>
            <span className="text-cyan-500/60 font-semibold">v4.5</span>
          </div>
        </div>
      </aside>
    </>
  );
};
