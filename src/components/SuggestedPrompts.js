import React from 'react';
import { Sparkles } from 'lucide-react';

const SuggestedPrompts = ({ onPromptClick }) => {
    const prompts = [
        { text: "I feel stressed today", icon: "😫" },
        { text: "Help me relax", icon: "🌿" },
        { text: "I can't sleep", icon: "🌙" },
        { text: "How can I reduce anxiety?", icon: "🧘" }
    ];

    return (
        <div className="flex flex-wrap gap-2 mb-4 animate-in fade-in slide-in-from-bottom-1 duration-500">
            <div className="w-full flex items-center gap-2 mb-1 px-1">
                <Sparkles size={14} className="text-blue-500" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Suggested for you</span>
            </div>
            {prompts.map((prompt, index) => (
                <button
                    key={index}
                    onClick={() => onPromptClick(prompt.text)}
                    className="bg-white border border-slate-100 hover:border-blue-200 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-all duration-200 px-4 py-2 rounded-xl text-xs font-medium shadow-sm flex items-center gap-2 group"
                >
                    <span className="opacity-70 group-hover:scale-110 transition-transform">{prompt.icon}</span>
                    {prompt.text}
                </button>
            ))}
        </div>
    );
};

export default SuggestedPrompts;
