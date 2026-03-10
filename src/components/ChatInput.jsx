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
        <form onSubmit={handleSubmit} className="relative group">
            <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm p-2 pl-4 rounded-[28px] border border-slate-200 shadow-lg shadow-slate-200/50 focus-within:ring-4 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all duration-300 group-hover:border-slate-300">
                <button type="button" className="text-slate-400 hover:text-blue-500 transition-colors">
                    <Smile size={20} />
                </button>

                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Type your message here..."
                    className="flex-1 bg-transparent border-none outline-none text-slate-700 text-sm py-2 font-medium placeholder:text-slate-400"
                />

                <div className="flex items-center gap-2">
                    <VoiceInputButton onResult={onVoiceResult} />

                    <button
                        type="submit"
                        disabled={!value.trim()}
                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 shadow-md
              ${value.trim()
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-200/80 hover:scale-105 active:scale-95'
                                : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
                    >
                        <Send size={18} className={value.trim() ? "translate-x-0.5" : ""} />
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ChatInput;
