import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BrainCircuit, AlertTriangle, CheckCircle, Activity, ChevronRight, RotateCcw, MessageSquare, Bot, Circle } from 'lucide-react';
import { generateReport } from '../services/api';
import PrescriptionReport from '../components/PrescriptionReport';

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
    const [backendReport, setBackendReport] = useState(null);
    const [reportError, setReportError] = useState('');

    const { answers = {}, emotion = 'Neutral', speechEmotion = 'neutral' } = location.state || {};

    // Memoize to avoid infinite loop — analyzeResults creates a new object every render
    const result = useMemo(() => analyzeResults(answers, emotion), [JSON.stringify(answers), emotion]);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                setReportError('');
                const report = await generateReport({
                    face_emotion: emotion || 'neutral',
                    speech_emotion: speechEmotion || 'neutral',
                    sentiment: result.riskLevel === 'Low' ? 'POSITIVE' : 'NEGATIVE',
                });
                setBackendReport(report);
            } catch (error) {
                setReportError(error.message || 'Failed to generate backend report.');
            } finally {
                setShowReport(true);
            }
        };

        fetchReport();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only once on mount — all deps are from location.state which doesn't change

    if (!showReport) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
                <div className="text-center space-y-6">
                    <BrainCircuit className="w-16 h-16 text-primary-400 mx-auto animate-pulse" />
                    <div>
                        <h2 className="text-2xl font-bold">Analyzing your responses...</h2>
                        <p className="text-slate-400 mt-2 text-sm">Our AI is generating your personalized mental health report with chatbot analysis.</p>
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

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 mb-4">
                        <BrainCircuit className="w-8 h-8 text-primary-600" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900">Your Mental Health Report</h1>
                    <p className="text-slate-500 mt-2 text-sm">Formatted prescription-style report with AI-powered recommendations for your wellness journey</p>
                </div>

                {/* Risk & Stress Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Risk Level */}
                    <div className={`rounded-2xl p-6 border-2 ${result.riskColor === 'emerald' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                            result.riskColor === 'amber' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                                result.riskColor === 'orange' ? 'bg-orange-50 border-orange-200 text-orange-700' :
                                    'bg-red-50 border-red-200 text-red-700'
                        }`}>
                        <div className="flex items-center gap-3 mb-3">
                            <AlertTriangle className="w-6 h-6" />
                            <h3 className="font-bold text-lg">Risk Level</h3>
                        </div>
                        <p className="text-4xl font-extrabold">{result.riskLevel}</p>
                        <p className="text-sm mt-1 opacity-75">Based on comprehensive assessment.</p>
                    </div>

                    {/* Stress Level */}
                    <div className="rounded-2xl p-6 border-2 bg-white border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-3 text-slate-700">
                            <Activity className="w-6 h-6" />
                            <h3 className="font-bold text-lg">Stress Level</h3>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-4 mb-2">
                            <div
                                className={`h-4 rounded-full transition-all duration-1000 ${result.stressColor === 'emerald' ? 'bg-emerald-500' :
                                        result.stressColor === 'amber' ? 'bg-amber-500' :
                                            result.stressColor === 'orange' ? 'bg-orange-500' :
                                                'bg-red-500'
                                    }`}
                                style={{ width: `${result.score}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-sm text-slate-500">
                            <span>{result.stressLabel} ({result.score}%)</span>
                            <span>Emotion: <strong>{emotion}</strong></span>
                        </div>
                    </div>
                </div>

                {/* NEW: Prescription-Style Report with PDF and Chatbot Analysis */}
                <PrescriptionReport
                    answers={answers}
                    emotion={emotion}
                    speechEmotion={speechEmotion}
                    result={result}
                    backendReport={backendReport}
                />

                {/* Wellness Tips */}
                <div className="bg-gradient-to-br from-primary-50 to-emerald-50 rounded-2xl p-6 border border-primary-100">
                    <h3 className="font-bold text-lg text-slate-900 mb-4">Daily Wellness Tips</h3>
                    <ul className="space-y-3">
                        {[
                            'Practice deep breathing or meditation for 10 minutes daily.',
                            'Maintain a consistent sleep schedule — aim for 7–9 hours.',
                            'Exercise at least 3 times per week.',
                            'Limit screen time 1 hour before bed.',
                            'Stay connected with supportive friends and family.',
                            'Journaling your thoughts daily can reduce anxiety.'
                        ].map((tip, i) => (
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

                {/* Professional Assistant Suggestion */}
                <div className="bg-white border-2 border-primary-100 rounded-3xl p-8 shadow-sm relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                        <BrainCircuit size={120} className="text-primary-600" />
                    </div>

                    <div className="flex flex-col md:flex-row items-start gap-8 relative z-10">
                        <div className="w-20 h-20 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center shrink-0 shadow-inner">
                            <Bot size={40} />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 bg-primary-50 text-primary-600 text-[11px] font-bold rounded-full uppercase tracking-widest border border-primary-100">
                                    MindCare Assistant
                                </span>
                                <span className="flex items-center gap-1.5 text-[11px] text-emerald-500 font-bold uppercase tracking-widest">
                                    <Circle size={6} className="fill-emerald-500" /> Online
                                </span>
                            </div>

                            <h4 className="text-2xl font-bold text-slate-900 mb-4">My Personal Advice for You</h4>

                            <div className="space-y-4 text-slate-700 leading-relaxed mb-6 bg-slate-50 p-6 rounded-2xl border border-slate-100 italic">
                                {result.riskLevel === 'Severe' || result.riskLevel === 'High' ? (
                                    <p>"I can see you're going through a very difficult time. It's important to remember that you don't have to carry this alone. I'm here to listen right now, and I highly recommend speaking with one of our specialized professionals who can offer the deep support you deserve."</p>
                                ) : result.riskLevel === 'Moderate' ? (
                                    <p>"You've been under a fair amount of pressure lately. Let's work together on some grounding exercises and stress management techniques. Talking through these feelings can prevent them from becoming overwhelming."</p>
                                ) : (
                                    <p>"It's great to see you're in a relatively stable place! Maintaining this wellbeing requires consistent self-care. I'd love to help you build a daily mindfulness routine to keep your mind healthy and resilient."</p>
                                )}
                            </div>

                            <button
                                onClick={() => navigate('/chatbot')}
                                className="w-full md:w-auto bg-primary-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-3 group"
                            >
                                <MessageSquare size={20} className="group-hover:scale-110 transition-transform" />
                                Start a Conversation with Me
                            </button>
                        </div>
                    </div>
                </div>

                {/* Disclaimer */}
                <p className="text-center text-xs text-slate-400">
                    ⚠️ This report is for informational purposes only and is not a substitute for professional medical diagnosis or treatment.
                </p>
            </div>
        </div>
    );
}
