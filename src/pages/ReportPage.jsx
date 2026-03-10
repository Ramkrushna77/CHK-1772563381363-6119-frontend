import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BrainCircuit, AlertTriangle, CheckCircle, Activity, ChevronRight, RotateCcw, MessageSquare, Bot, Circle } from 'lucide-react';

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
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-1000">
                <div className="relative group mb-12">
                    <div className="absolute inset-0 bg-primary-100/50 rounded-[3rem] blur-3xl group-hover:bg-primary-200/50 transition-all duration-1000"></div>
                    <div className="relative w-28 h-28 rounded-[2.5rem] bg-white border border-slate-100 flex items-center justify-center shadow-2xl rotate-12 group-hover:rotate-0 transition-transform duration-700">
                        <BrainCircuit size={56} className="text-primary-600 animate-pulse" />
                    </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 italic tracking-tighter mb-4">Generating Analysis...</h2>
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const riskBg = {
        emerald: 'bg-emerald-50 border-emerald-200 text-emerald-700 shadow-emerald-100/50',
        amber: 'bg-amber-50 border-amber-200 text-amber-700 shadow-amber-100/50',
        orange: 'bg-orange-50 border-orange-200 text-orange-700 shadow-orange-100/50',
        red: 'bg-red-50 border-red-200 text-red-700 shadow-red-100/50',
    }[result.riskColor];

    const stressBg = {
        emerald: 'bg-emerald-500',
        amber: 'bg-amber-500',
        orange: 'bg-orange-500',
        red: 'bg-red-500',
    }[result.stressColor];

    return (
        <div className="min-h-screen bg-slate-50 py-16 px-4 md:px-8 selection:bg-primary-100 print:bg-white print:py-0">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6 group">
                        <div className="w-20 h-20 rounded-[2rem] bg-white text-primary-600 flex items-center justify-center shadow-xl border border-slate-100 group-hover:rotate-6 transition-transform">
                            <BrainCircuit size={40} />
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic mb-1 uppercase">Mental Analysis</h1>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Captured on {new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
                        </div>
                    </div>
                    <button onClick={() => window.print()} className="print:hidden px-8 py-4 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase text-slate-600 hover:text-primary-600 hover:border-primary-200 transition-all flex items-center gap-3 shadow-sm">
                        <Download size={16} /> Download Report
                    </button>
                </div>

                {/* Risk & Stress Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Risk Level */}
                    <div className={`rounded-[3rem] p-10 border shadow-2xl flex flex-col justify-center ${riskBg}`}>
                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-black/5">
                            <AlertTriangle className="w-5 h-5 opacity-50" />
                            <h3 className="font-black text-[10px] uppercase tracking-[0.3em] opacity-60">Neural Risk Threshold</h3>
                        </div>
                        <p className="text-6xl font-black italic tracking-tighter mb-2">{result.riskLevel}</p>
                        <p className="text-[11px] font-bold opacity-70 uppercase tracking-wider">Calibration based on {Object.keys(answers).length} probe vectors.</p>
                    </div>

                    {/* Stress Level */}
                    <div className="glass-card rounded-[3rem] p-10 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
                            <Activity className="w-5 h-5 text-primary-600 opacity-50" />
                            <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-slate-400">Stress Intensity Gauge</h3>
                        </div>
                        <div className="flex justify-between items-end mb-6">
                            <span className="text-4xl font-black text-slate-900 italic tracking-tighter">{result.score}%</span>
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Sink: {emotion}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-8 p-1.5 border border-slate-200/50 flex items-center">
                            <div
                                className={`h-full rounded-full transition-all duration-[2000ms] shadow-lg ${stressBg}`}
                                style={{ width: `${result.score}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="glass-card rounded-[3rem] p-10 mt-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                        <CheckCircle className="w-40 h-40 text-primary-600" />
                    </div>
                    <h3 className="font-black text-[10px] uppercase tracking-[0.4em] text-slate-400 mb-10 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-primary-600" /> Assessment Trace
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(answers).map(([qId, answer], i) => (
                            <div key={qId} className="flex justify-between items-center py-4 px-6 rounded-2xl bg-slate-50 border border-slate-100/50 text-[11px] font-bold">
                                <span className="text-slate-400 uppercase tracking-widest leading-none">Probe {i + 1}</span>
                                <span className="text-slate-900 italic">{answer}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Wellness Tips */}
                <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none font-black text-8xl italic">TIPS</div>
                    <h3 className="font-black text-[10px] uppercase tracking-[0.4em] text-primary-200 mb-10">Neural Optimization Directives</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {tips.map((tip, i) => (
                            <div key={i} className="flex items-start gap-4 p-6 bg-white/10 rounded-[2rem] border border-white/10 hover:bg-white/20 transition-all group/tip">
                                <span className="w-10 h-10 rounded-xl bg-white/10 text-white font-black flex items-center justify-center shrink-0 text-sm italic group-hover/tip:rotate-12 transition-transform">0{i + 1}</span>
                                <p className="text-sm font-bold leading-relaxed italic">{tip}</p>
                            </div>
                        ))}
                    </div>
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
                                    <p>"I can see you're going through a very difficult time. It's important to remember that you don't have to carry this alone. I'm here to listen right now, and I highly recommend speaking with one of our specialized professionals who can offer the deep Support you deserve."</p>
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
