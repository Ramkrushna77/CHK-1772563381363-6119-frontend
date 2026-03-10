import { FileText, AlertCircle } from 'lucide-react';

export default function TranscriptDisplay({ transcript, isRecording, error }) {
    if (error) {
        return (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="text-lg font-semibold text-red-800 mb-1">Error</h3>
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border-2 border-slate-200 rounded-xl p-6 min-h-[200px]">
            <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-slate-800">Your Response</h3>
                {isRecording && (
                    <span className="ml-auto flex items-center gap-2 text-sm font-medium text-red-600">
                        <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                        Recording...
                    </span>
                )}
            </div>
            
            {transcript ? (
                <div className="prose prose-slate max-w-none">
                    <p className="text-base text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {transcript}
                    </p>
                </div>
            ) : (
                <div className="flex items-center justify-center h-32 text-slate-400">
                    <p className="text-sm italic">
                        {isRecording 
                            ? 'Listening... Start speaking now' 
                            : 'Click the microphone button to start recording'
                        }
                    </p>
                </div>
            )}
        </div>
    );
}
