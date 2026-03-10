import React from 'react';
import { Bot, User } from 'lucide-react';

const ChatMessage = ({ message, isAI, timestamp }) => {
    return (
        <div className={`flex w-full mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300 ${isAI ? 'justify-start' : 'justify-end'}`}>
            <div className={`flex max-w-[85%] md:max-w-[70%] group ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-auto mb-1 shadow-sm
          ${isAI ? 'bg-blue-100 text-blue-600 mr-2' : 'bg-slate-100 text-slate-600 ml-2'}`}>
                    {isAI ? <Bot size={18} /> : <User size={18} />}
                </div>

                {/* Bubble */}
                <div className="flex flex-col">
                    <div className={`px-4 py-3 rounded-2xl shadow-sm border
            ${isAI
                            ? 'bg-white border-slate-100 text-slate-700 rounded-bl-sm'
                            : 'bg-blue-600 border-blue-600 text-white rounded-br-sm'}`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
                    </div>
                    <span className={`text-[10px] mt-1 font-medium text-slate-400 uppercase tracking-wider
            ${isAI ? 'text-left' : 'text-right'}`}>
                        {timestamp}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
