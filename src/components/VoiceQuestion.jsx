import { MessageCircle } from 'lucide-react';

export default function VoiceQuestion({ question }) {
    return (
        <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-8 shadow-md border border-primary-100">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Voice Assessment</h2>
                    <p className="text-lg text-slate-700 leading-relaxed">
                        {question}
                    </p>
                </div>
            </div>
        </div>
    );
}
