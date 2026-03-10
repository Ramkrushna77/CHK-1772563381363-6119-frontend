import { User, Brain } from 'lucide-react';

export default function ChatMessage({ message, isAi, timestamp }) {
    return (
        <div className={`flex w-full mb-6 ${isAi ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`flex max-w-[85%] sm:max-w-[75%] ${isAi ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center shadow-sm ${isAi ? 'bg-[#204E4A] mr-3' : 'bg-blue-600 ml-3'
                    }`}>
                    {isAi ? (
                        <Brain className="w-5 h-5 text-white" />
                    ) : (
                        <User className="w-5 h-5 text-white" />
                    )}
                </div>

                {/* Bubble Container */}
                <div className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}>
                    <div className={`px-5 py-3.5 rounded-2xl shadow-sm text-[15px] leading-relaxed ${isAi
                            ? 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                            : 'bg-blue-600 text-white rounded-tr-none'
                        }`}>
                        {message}
                    </div>

                    <span className="text-[11px] font-medium text-slate-400 mt-1.5 px-1 tracking-wider uppercase">
                        {timestamp}
                    </span>
                </div>
            </div>
        </div>
    );
}
