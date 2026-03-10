import React from 'react';
import { Bot, Circle } from 'lucide-react';

const ChatHeader = () => {
    return (
        <div className="bg-white border-b border-slate-100 py-3 px-4 flex items-center justify-between sticky top-0 z-10 shadow-sm rounded-t-2xl">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center text-primary-600">
                    <Bot size={20} />
                </div>
                <div>
                    <h1 className="text-sm font-semibold text-slate-800 leading-none">MindCare Assistant</h1>
                    <div className="flex items-center gap-1 mt-0.5">
                        <Circle size={6} className="fill-emerald-500 text-emerald-500 animate-pulse" />
                        <span className="text-[10px] text-slate-500 font-medium">Assistant Active</span>
                    </div>
                </div>
            </div>

            <div className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-medium rounded-full border border-emerald-100">
                Private
            </div>
        </div>
    );
};

export default ChatHeader;
