import React from 'react';
import { Bot, Circle, ShieldCheck } from 'lucide-react';

const ChatHeader = () => {
    return (
        <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 py-4 px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm rounded-t-3xl">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200/50 rotate-3">
                        <Bot size={22} className="-rotate-3" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                        <Circle size={8} className="fill-emerald-500 text-emerald-500 animate-pulse" />
                    </div>
                </div>
                <div>
                    <h1 className="text-base font-bold text-slate-800 tracking-tight leading-none">MindCare AI</h1>
                    <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Assistant</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className="text-[11px] text-emerald-600 font-bold uppercase tracking-wider">Online</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50/50 text-emerald-700 text-[11px] font-bold rounded-xl border border-emerald-100/50 backdrop-blur-sm">
                <ShieldCheck size={14} />
                <span className="uppercase tracking-wide">Secure & Private</span>
            </div>
        </div>
    );
};

export default ChatHeader;
