import React from 'react';
import { Bot, User } from 'lucide-react';

const ChatMessage = ({ message, isAI, timestamp }) => {
    return (
        <div className={`flex w-full mb-4 animate-in fade-in slide-in-from-bottom-1 duration-300 ${isAI ? 'justify-start' : 'justify-end'}`}>
            <div className={`flex max-w-[85%] ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-auto mb-1 
          ${isAI ? 'bg-primary-100 text-primary-600 mr-2' : 'bg-slate-100 text-slate-600 ml-2'}`}>
                    {isAI ? <Bot size={16} /> : <User size={16} />}
                </div>

                {/* Bubble */}
                <div className="flex flex-col">
                    <div className={`px-3 py-2 rounded-2xl shadow-sm border text-sm
            ${isAI
                            ? 'bg-white border-slate-100 text-slate-700 rounded-bl-sm'
                            : 'bg-primary-600 border-primary-600 text-white rounded-br-sm'}`}>
                        <p className="leading-relaxed whitespace-pre-wrap">{message}</p>
                    </div>
                    <span className={`text-[9px] mt-0.5 font-medium text-slate-400 uppercase
            ${isAI ? 'text-left' : 'text-right'}`}>
                        {timestamp}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
