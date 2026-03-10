import React from 'react';
import { Send } from 'lucide-react';
import VoiceInputButton from './VoiceInputButton';

const ChatInput = ({ value, onChange, onSend, onVoiceResult }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (value.trim()) {
            onSend();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-primary-100 transition-all duration-200">
            <VoiceInputButton onResult={onVoiceResult} />

            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="How can I help you?"
                className="flex-1 bg-transparent border-none outline-none text-slate-700 text-sm py-1 px-1 placeholder:text-slate-400"
            />

            <button
                type="submit"
                disabled={!value.trim()}
                className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all 
          ${value.trim()
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-slate-50 text-slate-300 cursor-not-allowed'}`}
            >
                <Send size={16} />
            </button>
        </form>
    );
};

export default ChatInput;
