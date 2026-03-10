import React from 'react';
import { Sparkles } from 'lucide-react';

const SuggestedPrompts = ({ onPromptClick }) => {
    const prompts = [
        { text: "I feel stressed today", icon: "🧘" },
        { text: "Help me relax", icon: "✨" },
        { text: "I can't sleep", icon: "🌙" },
        { text: "Reduce anxiety", icon: "🌿" }
    ];

    return (
        <div className="flex flex-wrap gap-2.5 mb-4 animate-in fade-in slide-in-from-bottom-3 duration-700">
            {prompts.map((prompt, index) => (
                <button
                    key={index}
                    onClick={() => onPromptClick(prompt.text)}
                    className="group bg-white/70 backdrop-blur-sm border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-slate-600 hover:text-blue-700 transition-all duration-300 px-4 py-2 rounded-full text-[12px] font-semibold shadow-sm hover:shadow-md hover:-translate-y-0.5 flex items-center gap-2"
                >
                    <span className="text-sm group-hover:scale-110 transition-transform">{prompt.icon}</span>
                    {prompt.text}
                </button>
            ))}
        </div>
    );
};

export default SuggestedPrompts;
