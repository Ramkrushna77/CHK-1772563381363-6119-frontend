import { MessageSquare } from 'lucide-react';

export default function SuggestedPrompts({ onPromptClick }) {
    const prompts = [
        "I feel stressed today",
        "Help me relax",
        "I can't sleep",
        "How can I reduce anxiety?",
        "I need someone to talk to",
        "Give me a positive quote"
    ];

    return (
        <div className="flex flex-wrap gap-2 px-6 py-4 bg-white/50 border-t border-slate-100 overflow-x-auto no-scrollbar">
            {prompts.map((prompt, index) => (
                <button
                    key={index}
                    onClick={() => onPromptClick(prompt)}
                    className="flex-shrink-0 flex items-center px-4 py-2 bg-white border border-slate-200 rounded-full text-[13px] font-medium text-slate-600 hover:border-[#204E4A] hover:text-[#204E4A] hover:bg-[#EAF6F6] transition-all duration-200 shadow-sm"
                >
                    <MessageSquare className="w-3.5 h-3.5 mr-2 opacity-60" />
                    {prompt}
                </button>
            ))}
        </div>
    );
}
