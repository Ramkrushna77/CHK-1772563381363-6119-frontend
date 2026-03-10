import React from 'react';
import { Send } from 'lucide-react';
import VoiceInputButton from './VoiceInputButton';

const ChatInput = ({ value, onChange, onSend, onVoiceResult, isListening }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (value.trim()) {
            onSend();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative flex items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all duration-200">
            <VoiceInputButton onResult={onVoiceResult} isListening={isListening} />

            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-transparent border-none outline-none text-slate-700 text-sm py-2 px-1 placeholder:text-slate-400"
            />

            <button
                type="submit"
                disabled={!value.trim()}
                className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 
          ${value.trim()
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100 shadow-lg'
                        : 'bg-slate-50 text-slate-300 cursor-not-allowed'}`}
            >
                <Send size={18} />
            </button>
        </form>
    );
};

export default ChatInput;
