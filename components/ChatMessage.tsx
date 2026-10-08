'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, Copy, Check, Volume2, Square, Cpu } from 'lucide-react';
import { Message } from '@/types/chat';

interface ChatMessageProps {
  message: Message;
  isCurrentlySpeaking?: boolean;
  onSpeakMessage?: (text: string) => void;
  onStopSpeaking?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isCurrentlySpeaking = false,
  onSpeakMessage,
  onStopSpeaking,
}) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleSpeak = () => {
    if (isCurrentlySpeaking) {
      onStopSpeaking?.();
    } else {
      onSpeakMessage?.(message.content);
    }
  };

  const formattedTime = (() => {
    try {
      const d = new Date(message.timestamp);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  })();

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 my-4 group">
        <div className="max-w-[85%] md:max-w-[75%] lg:max-w-[65%] flex flex-col items-end">
          <div className="rounded-2xl rounded-tr-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 shadow-md shadow-blue-900/20 text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
          {formattedTime && (
            <span suppressHydrationWarning className="text-[11px] text-slate-400 mt-1 px-1 font-mono">
              {formattedTime}
            </span>
          )}
        </div>

        <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-300 flex-shrink-0 mt-0.5 shadow-sm">
          <User className="w-4 h-4" />
        </div>
      </div>
    );
  }

  // NEXUS Assistant Message
  return (
    <div className="flex items-start justify-start gap-3 my-5 group">
      {/* NEXUS Reactor Avatar Icon */}
      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-950 via-slate-900 to-blue-950 border border-cyan-400/40 flex items-center justify-center text-cyan-300 flex-shrink-0 shadow-md shadow-cyan-500/20 mt-1">
        <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
      </div>

      <div className="flex-1 max-w-[95%] md:max-w-[88%] lg:max-w-[82%] flex flex-col">
        {/* Name, time and actions */}
        <div className="flex items-center justify-between pb-1.5 px-1 font-mono">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-300 tracking-wider">
              NEXUS
            </span>
            <span className="text-[10px] text-cyan-500/60">//</span>
            <span className="text-[10px] text-slate-400 tracking-wide">
              JARVIS PROTOCOL
            </span>
            {formattedTime && (
              <span suppressHydrationWarning className="text-[10px] text-slate-400 ml-1">
                {formattedTime}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Read out loud button */}
            {onSpeakMessage && (
              <button
                onClick={handleToggleSpeak}
                title={isCurrentlySpeaking ? 'Detener voz' : 'Escuchar respuesta de NEXUS'}
                className={`p-1.5 rounded-md transition-all flex items-center gap-1 text-[11px] ${
                  isCurrentlySpeaking
                    ? 'text-cyan-300 bg-cyan-500/20 border border-cyan-400/40'
                    : 'text-slate-400 hover:text-cyan-300 hover:bg-white/5 opacity-80 group-hover:opacity-100'
                }`}
              >
                {isCurrentlySpeaking ? (
                  <>
                    <Square className="w-3 h-3 fill-current text-rose-400" />
                    <span className="text-rose-300 text-[10px]">Pausar</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[10px]">Voz</span>
                  </>
                )}
              </button>
            )}

            {/* Copy button */}
            <button
              onClick={handleCopy}
              title="Copiar respuesta"
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all flex items-center gap-1 text-[11px] opacity-80 group-hover:opacity-100"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium text-[10px]">Copiado</span>
                </>
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Message Bubble */}
        <div
          className={`rounded-2xl rounded-tl-sm bg-[#0e1626]/90 border transition-all p-4 md:p-5 shadow-lg ${
            isCurrentlySpeaking
              ? 'border-cyan-400/50 shadow-cyan-950/40 ring-1 ring-cyan-500/30'
              : 'border-cyan-950/60 hover:border-cyan-500/30'
          }`}
        >
          <div className="markdown-content text-sm text-slate-100">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};
