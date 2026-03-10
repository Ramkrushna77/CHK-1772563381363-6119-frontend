import { Brain, Sparkles } from 'lucide-react';

export default function ChatHeader() {
    return (
        <header className="bg-white border-b border-slate-100 py-4 px-6 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md bg-white/80">
            <div className="flex items-center space-x-3">
                <div className="bg-[#204E4A] p-2 rounded-xl">
                    <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Mental Health Assistant</h1>
                    <div className="flex items-center text-xs font-medium text-green-600">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                        AI Assistant Active
                    </div>
                </div>
            </div>

            <div className="hidden sm:flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                <Sparkles className="w-4 h-4 text-[#204E4A]" />
                <span className="text-xs text-slate-500 font-medium tracking-wide">Calm Mode Enabled</span>
            </div>
        </header>
    );
}
