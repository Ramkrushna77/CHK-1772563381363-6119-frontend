import React from 'react';
import { Bot, Circle, Shield } from 'lucide-react';

const ChatHeader = () => {
    return (
        <div className="bg-white/40 backdrop-blur-md py-5 px-8 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-md border border-white/50 group-hover:rotate-6 transition-transform">
                        <Bot size={28} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-[3px] border-white shadow-sm ring-1 ring-emerald-500/20"></div>
                </div>
                <div>
                    <h1 className="text-lg font-bold text-slate-900 leading-tight">MindCare AI</h1>
                    <div className="flex items-center gap-1.5 opacity-70">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Supportive Session</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white/80 border border-white/60 text-slate-600 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl shadow-sm">
                <Shield size={12} className="text-emerald-500" />
                Secure
            </div>
        </div>
    );
};

export default ChatHeader;
