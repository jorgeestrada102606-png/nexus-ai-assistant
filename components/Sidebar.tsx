'use client';

import React from 'react';
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Settings, 
  X,
  Sparkles
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
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 bg-[#06100B] border-r border-[#00F5A0]/15 flex flex-col justify-between select-none transition-all duration-200 ${
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
              <Sparkles className="w-4 h-4 text-[#00F5A0]" />
              <span className="font-bold text-sm text-white">NEXUS AI</span>
            </div>
            <button
              onClick={onCloseMobile}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* "+ Nuevo Chat" Button inspired by the screenshot's "+ Nuevo Brote" */}
          <button
            onClick={onNewSession}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#00F5A0] hover:bg-[#05DF72] text-[#04160E] text-xs font-bold transition-all shadow-lg shadow-[#00F5A0]/25 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Nuevo Chat</span>
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto px-3 py-1 flex flex-col gap-1.5">
          <div className="px-2 py-1 text-[11px] font-semibold text-emerald-400/80 uppercase tracking-wider flex items-center justify-between">
            <span>Conversaciones</span>
            <span className="text-[10px] text-emerald-400/60 font-mono">{sessions.length} activas</span>
          </div>

          {sessions.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              Sin conversaciones aún
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              return (
                <div
                  key={session.id}
                  onClick={() => onSelectSession(session.id)}
                  className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer text-xs transition-all ${
                    isActive
                      ? 'bg-[#0E261A] text-white font-medium border border-[#00F5A0]/40 shadow-sm shadow-[#00F5A0]/10'
                      : 'text-slate-300 hover:bg-[#0A1A12] hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        isActive
                          ? 'bg-[#00F5A0] shadow-[0_0_8px_#00F5A0]'
                          : 'bg-emerald-900'
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
        <div className="p-3 border-t border-[#00F5A0]/15 flex flex-col gap-1 text-xs">
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-[#00F5A0] hover:bg-[#00F5A0]/10 transition-colors w-full text-left"
          >
            <Settings className="w-4 h-4 text-emerald-400" />
            <span>Configuración</span>
          </button>

          {sessions.length > 1 && (
            <button
              onClick={onClearAll}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors w-full text-left"
            >
              <Trash2 className="w-4 h-4 text-slate-400 hover:text-rose-400" />
              <span>Limpiar historial</span>
            </button>
          )}

          <div className="px-3 pt-2 text-[11px] text-emerald-500/60 flex items-center justify-between font-mono">
            <span>NEXUS // GEMINI</span>
            <span className="text-[#00F5A0] font-semibold">Online</span>
          </div>
        </div>
      </aside>
    </>
  );
};
