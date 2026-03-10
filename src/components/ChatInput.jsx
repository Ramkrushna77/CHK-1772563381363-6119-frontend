import React from 'react';
import { Send, Smile } from 'lucide-react';
import VoiceInputButton from './VoiceInputButton';

const ChatInput = ({ value, onChange, onSend, onVoiceResult }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (value.trim()) {
            onSend();
        }
    };

    return (
        <form onSubmit={handleSubmit}
            className="flex items-center gap-3 bg-slate-50/50 backdrop-blur-sm p-2 shadow-inner rounded-3xl border border-slate-200/50 focus-within:bg-white focus-within:ring-4 focus-within:ring-primary-100/50 transition-all duration-300">
            <div className="flex items-center gap-1 pl-1">
                <VoiceInputButton onResult={onVoiceResult} />
                <button type="button" className="p-2 text-slate-400 hover:text-primary-600 transition-colors hidden sm:block">
                    <Smile size={20} />
                </button>
            </div>

            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 bg-transparent border-none outline-none text-slate-700 text-[15px] font-medium py-3 px-1 placeholder:text-slate-400 placeholder:font-normal"
            />

            <button
                type="submit"
                disabled={!value.trim()}
                className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 shadow-sm
          ${value.trim()
                        ? 'bg-primary-600 text-white hover:bg-primary-700 hover:scale-105 active:scale-95 shadow-primary-200'
                        : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
            >
                <Send size={20} className={value.trim() ? 'translate-x-0.5 -translate-y-0.5' : ''} />
            </button>
        </form>
    );
};

export default ChatInput;
