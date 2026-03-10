import React from 'react';
import { Sparkles } from 'lucide-react';

const SuggestedPrompts = ({ onPromptClick }) => {
    const prompts = ["I feel stressed today", "Help me relax", "I can't sleep", "Reduce anxiety"];

    return (
        <div className="flex flex-wrap gap-2 mb-3">
            {prompts.map((prompt, index) => (
                <button
                    key={index}
                    onClick={() => onPromptClick(prompt)}
                    className="bg-white border border-slate-100 hover:border-primary-200 hover:bg-primary-50 text-slate-600 hover:text-primary-600 transition-all px-3 py-1.5 rounded-lg text-[11px] font-medium shadow-sm"
                >
                    {prompt}
                </button>
            ))}
        </div>
    );
};

export default SuggestedPrompts;
