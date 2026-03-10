import React from 'react';
import { Bot, User, CheckCheck } from 'lucide-react';

const ChatMessage = ({ message, isAI, timestamp }) => {
    return (
        <div className={`flex w-full mb-6 pb-2 animate-in fade-in slide-in-from-bottom-2 duration-500 ${isAI ? 'justify-start' : 'justify-end'}`}>
            <div className={`flex max-w-[85%] md:max-w-[75%] ${isAI ? 'flex-row' : 'flex-row-reverse'} items-end gap-3`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center shadow-sm 
          ${isAI ? 'bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-600 border border-blue-100' : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 border border-slate-300'}`}>
                    {isAI ? <Bot size={18} /> : <User size={18} />}
                </div>

                {/* Bubble Container */}
                <div className={`flex flex-col ${isAI ? 'items-start' : 'items-end'}`}>
                    <div className={`px-4 py-3 rounded-2xl shadow-sm md:shadow-md border transition-all duration-300
            ${isAI
                            ? 'bg-white/90 backdrop-blur-sm border-slate-100 text-slate-700 rounded-bl-none hover:shadow-lg'
                            : 'bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 border-blue-500 text-white rounded-br-none hover:shadow-blue-200/50 hover:shadow-xl'}`}>
                        <p className="text-[14px] leading-relaxed whitespace-pre-wrap font-medium select-text">{message}</p>
                    </div>

                    {/* Meta info */}
                    <div className="flex items-center gap-1.5 mt-1.5 px-1">
                        <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                            {timestamp}
                        </span>
                        {!isAI && (
                            <span className="text-blue-500">
                                <CheckCheck size={12} />
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
