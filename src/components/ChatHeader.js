import React from 'react';
import { Bot, Circle } from 'lucide-react';

const ChatHeader = () => {
    return (
        <header className="bg-white border-b border-slate-100 py-4 px-6 flex items-center justify-between sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <Bot size={24} />
                </div>
                <div>
                    <h1 className="text-lg font-semibold text-slate-800 leading-none">Mental Health Assistant</h1>
                    <div className="flex items-center gap-1.5 mt-1">
                        <Circle size={8} className="fill-emerald-500 text-emerald-500 animate-pulse" />
                        <span className="text-xs text-slate-500 font-medium tracking-wide">AI Assistant Active</span>
                    </div>
                </div>
            </div>

            <div className="hidden md:block">
                <div className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-100">
                    Secure & Private
                </div>
            </div>
        </header>
    );
};

export default ChatHeader;
