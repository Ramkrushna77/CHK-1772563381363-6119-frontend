import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BrainCircuit, AlertTriangle, CheckCircle, Activity, ChevronRight, RotateCcw, MessageSquare } from 'lucide-react';
import Chatbot from '../components/Chatbot';

// Simple scoring logic based on answers
function analyzeResults(answers, emotion) {
    const weightMap = { Never: 0, Rarely: 1, Sometimes: 2, Often: 3, Constantly: 4, 'Not at all': 0, 'Several days': 1, 'More than half the days': 3, 'Nearly every day': 4, 'Very Good': 0, Good: 1, Fair: 2, Poor: 3, 'Very Poor': 4, Excellent: 0, Normal: 0, 'Slightly changed': 1, 'Moderately changed': 2, 'Significantly changed': 3, 'Very Often': 4, Always: 4 };

    let total = 0;
    const qKeys = Object.values(answers);
    qKeys.forEach(val => { total += (weightMap[val] || 0); });
    const maxScore = Object.keys(answers).length * 4;
    const percentage = Math.round((total / maxScore) * 100);

    // Adjust based on detected negative emotion
    const negativeEmotions = ['sad', 'fearful', 'angry', 'disgusted'];
    const emotionBump = negativeEmotions.some(e => emotion?.toLowerCase().includes(e)) ? 10 : 0;
    const finalScore = Math.min(percentage + emotionBump, 100);

    let riskLevel, riskColor, stressLabel, stressColor;
    if (finalScore <= 20) { riskLevel = 'Low'; riskColor = 'emerald'; stressLabel = 'Minimal'; stressColor = 'emerald'; }
    else if (finalScore <= 45) { riskLevel = 'Moderate'; riskColor = 'amber'; stressLabel = 'Mild'; stressColor = 'amber'; }
    else if (finalScore <= 70) { riskLevel = 'High'; riskColor = 'orange'; stressLabel = 'Moderate'; stressColor = 'orange'; }
    else { riskLevel = 'Severe'; riskColor = 'red'; stressLabel = 'Severe'; stressColor = 'red'; }

    return { score: finalScore, riskLevel, riskColor, stressLabel, stressColor };
}

export default function ReportPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [showReport, setShowReport] = useState(false);

    const { answers = {}, emotion = 'Neutral' } = location.state || {};
    const result = analyzeResults(answers, emotion);

    const tips = [
        'Practice deep breathing or meditation for 10 minutes daily.',
        'Maintain a consistent sleep schedule — aim for 7–9 hours.',
        'Exercise at least 3 times per week.',
        'Limit screen time 1 hour before bed.',
        'Stay connected with supportive friends and family.',
        'Journaling your thoughts daily can reduce anxiety.',
    ];

    useEffect(() => {
        // Simulate AI report generation delay
        const timer = setTimeout(() => setShowReport(true), 2200);
        return () => clearTimeout(timer);
    }, []);

    if (!showReport) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
                <div className="text-center space-y-6">
                    <BrainCircuit className="w-16 h-16 text-primary-400 mx-auto animate-pulse" />
                    <div>
                        <h2 className="text-2xl font-bold">Analyzing your responses...</h2>
                        <p className="text-slate-400 mt-2 text-sm">Our AI is generating your personalized mental health report.</p>
                    </div>
                    <div className="flex justify-center gap-2">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const riskBg = {
        emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        amber: 'bg-amber-50 border-amber-200 text-amber-700',
        orange: 'bg-orange-50 border-orange-200 text-orange-700',
        red: 'bg-red-50 border-red-200 text-red-700',
    }[result.riskColor];

    const stressBg = {
        emerald: 'bg-emerald-500',
        amber: 'bg-amber-500',
        orange: 'bg-orange-500',
        red: 'bg-red-500',
    }[result.stressColor];

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 mb-4">
                        <BrainCircuit className="w-8 h-8 text-primary-600" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900">Your Mental Health Report</h1>
                    <p className="text-slate-500 mt-2 text-sm">Generated on {new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
                </div>

                {/* Risk & Stress Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Risk Level */}
                    <div className={`rounded-2xl p-6 border-2 ${riskBg}`}>
                        <div className="flex items-center gap-3 mb-3">
                            <AlertTriangle className="w-6 h-6" />
                            <h3 className="font-bold text-lg">Risk Level</h3>
                        </div>
                        <p className="text-4xl font-extrabold">{result.riskLevel}</p>
                        <p className="text-sm mt-1 opacity-75">Based on your questionnaire responses and emotional analysis.</p>
                    </div>

                    {/* Stress Level */}
                    <div className="rounded-2xl p-6 border-2 bg-white border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-3 text-slate-700">
                            <Activity className="w-6 h-6" />
                            <h3 className="font-bold text-lg">Stress Level</h3>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-4 mb-2">
                            <div
                                className={`h-4 rounded-full transition-all duration-1000 ${stressBg}`}
                                style={{ width: `${result.score}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-sm text-slate-500">
                            <span>{result.stressLabel} ({result.score}%)</span>
                            <span>Detected emotion: <strong>{emotion}</strong></span>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-primary-600" /> Assessment Summary
                    </h3>
                    <ul className="space-y-3">
                        {Object.entries(answers).map(([qId, answer], i) => (
                            <li key={qId} className="flex justify-between py-2 border-b border-slate-50 text-sm">
                                <span className="text-slate-500">Q{i + 1}</span>
                                <span className="font-medium text-slate-800">{answer}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Wellness Tips */}
                <div className="bg-gradient-to-br from-primary-50 to-emerald-50 rounded-2xl p-6 border border-primary-100">
                    <h3 className="font-bold text-lg text-slate-900 mb-4">Mental Wellness Tips</h3>
                    <ul className="space-y-3">
                        {tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                                <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">{i + 1}</span>
                                {tip}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => navigate('/doctors', { state: { riskLevel: result.riskLevel } })}
                        className="flex-1 flex justify-center items-center gap-2 py-4 px-6 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-md transition-colors"
                    >
                        View Doctor Suggestions <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => navigate('/assessment')}
                        className="flex items-center justify-center gap-2 py-4 px-6 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl transition-colors shadow-sm"
                    >
                        <RotateCcw className="w-4 h-4" /> Retake Assessment
                    </button>
                </div>

                {/* AI Chat Suggestion */}
                {(result.riskLevel === 'High' || result.riskLevel === 'Severe' || result.riskLevel === 'Moderate') && (
                    <div className="bg-white border-2 border-primary-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center gap-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
                        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                            <MessageSquare className="w-8 h-8 text-primary-600" />
                        </div>
                        <div className="text-center md:text-left">
                            <h4 className="font-bold text-slate-900">Need someone to talk to right now?</h4>
                            <p className="text-sm text-slate-500 mt-1">Our AI Assistant is available 24/7 to provide support and listening.</p>
                        </div>
                        <div className="md:ml-auto">
                            <button
                                onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))}
                                className="bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-sm"
                            >
                                Start AI Chat
                            </button>
                        </div>
                    </div>
                )}

                {/* Disclaimer */}
                <p className="text-center text-xs text-slate-400">
                    ⚠️ This report is for informational purposes only and is not a substitute for professional medical diagnosis or treatment.
                </p>
            </div>
            <Chatbot />
        </div>
    );
}
