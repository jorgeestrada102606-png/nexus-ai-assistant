'use client';

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { ArrowUp, Loader2, Volume2, VolumeX } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
  voiceEnabled?: boolean;
  onToggleVoice?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  disabled = false,
  voiceEnabled = true,
  onToggleVoice,
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim() && !isLoading && !disabled) {
      onSendMessage(input.trim());
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-4 pt-1 flex flex-col gap-2">
      <div className="relative flex items-end gap-2 bg-[#091A12] border border-[#00F5A0]/20 hover:border-[#00F5A0]/40 focus-within:border-[#00F5A0]/60 focus-within:ring-2 focus-within:ring-[#00F5A0]/20 rounded-2xl p-2.5 shadow-xl shadow-black/50 transition-all">
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading || disabled}
          placeholder="Escribe tu mensaje, bro... (Shift + Enter para nueva línea)"
          className="flex-1 bg-transparent text-slate-100 placeholder-emerald-400/40 text-sm focus:outline-none resize-none leading-relaxed py-1.5 px-2 max-h-44 disabled:opacity-50"
        />

        <div className="flex items-center gap-1.5 pb-0.5">
          {onToggleVoice && (
            <button
              onClick={onToggleVoice}
              type="button"
              className={`p-2 rounded-xl transition-all ${
                voiceEnabled
                  ? 'text-[#00F5A0] hover:bg-[#00F5A0]/15'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`}
              title={voiceEnabled ? 'Voz activada: Nexus hablará la respuesta' : 'Voz silenciada'}
            >
              {voiceEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
          )}

          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || disabled}
            className="w-9 h-9 rounded-xl bg-[#00F5A0] hover:bg-[#05DF72] disabled:bg-slate-800 text-[#04160E] disabled:text-slate-500 flex items-center justify-center transition-all flex-shrink-0 active:scale-95 shadow-md shadow-[#00F5A0]/30 disabled:shadow-none"
            title="Enviar a NEXUS"
            aria-label="Enviar a NEXUS"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#04160E]" />
            ) : (
              <ArrowUp className="w-4 h-4 stroke-[3]" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-emerald-400/60 px-1 font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00F5A0] animate-pulse" />
          <span>NEXUS // COMPA AI</span>
        </span>
        <span>Enter para mandar</span>
      </div>
    </div>
  );
};
