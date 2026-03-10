import React from 'react';
import { Bot, User, Clock } from 'lucide-react';

const ChatMessage = ({ message, isAI, timestamp }) => {
    return (
        <div className={`flex w-full mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out ${isAI ? 'justify-start' : 'justify-end'}`}>
            <div className={`flex max-w-[85%] md:max-w-[75%] group ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Avatar with Ring Effect */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center mt-auto mb-1 relative overflow-hidden shadow-sm transition-transform duration-300 group-hover:scale-110
          ${isAI ? 'bg-white border border-slate-100 text-primary-600 mr-3' : 'bg-primary-600 text-white ml-3 shadow-primary-200 shadow-md'}`}>
                    {isAI ? <Bot size={20} /> : <User size={20} />}
                    {isAI && (
                        <div className="absolute inset-0 bg-primary-600/5 pointer-events-none"></div>
                    )}
                </div>

                {/* Bubble with Glassmorphism / Gradients */}
                <div className="flex flex-col">
                    <div className={`px-5 py-3.5 rounded-3xl shadow-sm border transition-all duration-300
            ${isAI
                            ? 'bg-white border-slate-100/80 text-slate-700 rounded-bl-none hover:shadow-md'
                            : 'bg-gradient-to-br from-primary-600 to-primary-700 border-primary-500 text-white rounded-br-none shadow-lg shadow-primary-100 hover:shadow-primary-200'}`}>
                        <p className="text-[14px] leading-relaxed whitespace-pre-wrap font-medium">{message}</p>
                    </div>
                    <div className={`flex items-center gap-1.5 mt-1.5 px-1 font-bold text-[9px] uppercase tracking-widest text-slate-400
            ${isAI ? 'justify-start' : 'justify-end'}`}>
                        <Clock size={10} className="opacity-60" />
                        <span>{timestamp}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
