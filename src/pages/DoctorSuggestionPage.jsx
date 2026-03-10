import { useLocation, useNavigate } from 'react-router-dom';
import { UserCheck, CheckCircle, ArrowLeft, PhoneCall, Calendar, Heart, ShieldCheck, BrainCircuit, Sparkles, Activity } from 'lucide-react';

const SUGGESTIONS = {
    Low: {
        specialist: 'General Wellness Counselor',
        urgency: 'Routine Calibration',
        urgencyColor: 'emerald',
        message: 'Neural metrics indicate optimal balance. Recommended focus: Maintenance and prophylactic wellness.',
        actions: [
            'Practice daily mindfulness or meditation (10–15 min)',
            'Maintain a regular sleep schedule (7–9 hours)',
            'Keep a gratitude journal',
            'Stay socially active with friends and family',
            'Consider a monthly wellness check-in',
        ],
        tips: [
            'Try yoga or light aerobic exercise 3x per week.',
            'Limit caffeine and alcohol consumption.',
            'Spend time in nature — even a 20-minute walk helps.',
        ],
    },
    Moderate: {
        specialist: 'Licensed Clinical Therapist',
        urgency: 'Scheduled Sync',
        urgencyColor: 'amber',
        message: 'Mild to moderate neural drag detected. External counseling synthesis is advised for optimization.',
        actions: [
            'Schedule an appointment with a therapist or counselor',
            'Practice progressive muscle relaxation exercises',
            'Identify and minimize stress triggers in your daily routine',
            'Engage in a hobby or creative activity weekly',
            'Consider joining a mental health support group',
        ],
        tips: [
            'Cognitive Behavioral Therapy (CBT) is highly effective for moderate stress.',
            'Apps like Calm or Headspace provide guided meditation.',
            'Talk to someone you trust about how you are feeling.',
        ],
    },
    High: {
        specialist: 'Clinical Psychiatrist',
        urgency: 'Priority Intervention',
        urgencyColor: 'orange',
        message: 'Elevated stress vectors and risk indicators observed. Immediate clinical consultation required.',
        actions: [
            'Book an appointment with a psychiatrist or psychologist this week',
            'Inform a trusted family member or friend about your feelings',
            'Reduce workload and practice daily stress relief routines',
            'Avoid alcohol, tobacco, or any recreational substances',
            'Establish an emergency support contact',
        ],
        tips: [
            'Dialectical Behavior Therapy (DBT) can help manage intense emotions.',
            'Speak openly with your doctor about your current symptoms.',
            'Don\'t isolate — social support is critical to recovery.',
        ],
    },
    Severe: {
        specialist: 'Urgent Psychiatric Intake',
        urgency: 'Critical Sync (Immediate)',
        urgencyColor: 'red',
        message: 'High-distress state detected. Immediate emergency clinical verification is MANDATORY. You are not alone.',
        actions: [
            '🚨 Contact a trusted person immediately',
            'Call a mental health helpline: iCall (India): 9152987821',
            'Book an urgent appointment with a psychiatrist',
            'If feeling unsafe, go to your nearest emergency room',
            'Do not be alone — stay with a trusted person today',
        ],
        tips: [
            'National crisis helpline (India): VANDREVALA FOUNDATION: 1860-2662-345',
            'iCall Helpline: 9152987821',
            'Remember: seeking help is a sign of strength, not weakness.',
        ],
    },
};

export default function DoctorSuggestionPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const riskLevel = location.state?.riskLevel || 'Moderate';
    const suggestion = SUGGESTIONS[riskLevel] || SUGGESTIONS.Moderate;

    const urgencyBg = {
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        amber: 'bg-amber-50 text-amber-600 border-amber-100',
        orange: 'bg-orange-50 text-orange-600 border-orange-100',
        red: 'bg-red-50 text-red-600 border-red-100',
    }[suggestion.urgencyColor];

    return (
        <div className="min-h-screen bg-slate-50 relative selection:bg-primary-100 italic-text-none overflow-x-hidden py-24 px-4">
            {/* Ambient Premium Glows */}
            <div className="fixed top-[-10%] right-[-10%] w-[800px] h-[800px] bg-primary-100/10 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-emerald-100/10 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="group mb-12 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-primary-600 transition-all active:scale-95"
                >
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center group-hover:bg-primary-50 transition-colors shadow-sm">
                        <ArrowLeft size={16} />
                    </div>
                    Return to Trace
                </button>

                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-slate-100 shadow-sm text-primary-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Clinical Directive Vector</span>
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic mb-4 uppercase">Optimization Protocol</h1>
                    <p className="text-slate-500 max-w-lg mx-auto font-medium leading-relaxed italic">Strategic clinical recommendations based on your neural telemetry.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Main Recommendation */}
                    <div className="lg:col-span-12">
                        <div className="glass-panel rounded-[4rem] p-10 md:p-16 shadow-2xl relative overflow-hidden border-none bg-white/70 premium-glow">
                            <div className="flex flex-col md:flex-row gap-12 items-start">
                                <div className="shrink-0 relative">
                                    <div className="w-32 h-32 rounded-[2.5rem] bg-primary-600 flex items-center justify-center shadow-2xl rotate-3 group-hover:-rotate-3 transition-transform duration-500">
                                        <UserCheck className="w-16 h-16 text-white" />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-white border-4 border-slate-50 flex items-center justify-center shadow-lg">
                                        <Sparkles className="w-6 h-6 text-primary-600" />
                                    </div>
                                </div>
                                <div className="space-y-6 flex-1">
                                    <div className="space-y-2">
                                        <div className={`inline-flex px-4 py-1.5 rounded-xl border font-black text-[10px] uppercase tracking-widest ${urgencyBg}`}>
                                            {suggestion.urgency}
                                        </div>
                                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter italic">{suggestion.specialist}</h2>
                                    </div>
                                    <p className="text-lg md:text-xl text-slate-600 font-bold italic leading-relaxed leading-[1.1]">
                                        "{suggestion.message}"
                                    </p>
                                    <div className="flex flex-wrap gap-4 pt-4">
                                        <button className="flex-1 min-w-[200px] bg-slate-900 text-white px-8 py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.2em] hover:bg-black transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 italic">
                                            <Calendar size={18} /> Schedule Sync
                                        </button>
                                        <button className="flex-1 min-w-[200px] bg-white border-2 border-slate-100 text-slate-900 px-8 py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.2em] hover:border-primary-600 hover:text-primary-600 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-3 italic">
                                            <PhoneCall size={18} /> Direct Link
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Items */}
                    <div className="lg:col-span-7">
                        <div className="glass-panel rounded-[3rem] p-10 md:p-12 shadow-xl border-none bg-white/60">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-10 flex items-center gap-4 italic">
                                <Activity className="w-5 h-5 text-primary-600" /> Immediate Protocols
                            </h3>
                            <div className="space-y-4">
                                {suggestion.actions.map((action, i) => (
                                    <div key={i} className="flex items-start gap-5 p-6 rounded-3xl bg-white border border-slate-50 hover:border-primary-100 transition-all group shadow-sm">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 font-black text-xs flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-all shrink-0">
                                            0{i + 1}
                                        </div>
                                        <p className="text-sm font-bold text-slate-700 leading-relaxed italic">{action}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Wellness Synthesis */}
                    <div className="lg:col-span-5">
                        <div className="bg-gradient-to-br from-indigo-900 to-primary-800 rounded-[3rem] p-10 md:p-12 shadow-2xl h-full text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                                <Heart size={140} />
                            </div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary-300 mb-10 flex items-center gap-4 italic relative z-10">
                                <Sparkles className="w-5 h-5" /> Synthesis Directives
                            </h3>
                            <div className="space-y-8 relative z-10">
                                {suggestion.tips.map((tip, i) => (
                                    <div key={i} className="flex items-start gap-4 group/tip">
                                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-1 opacity-60 group-hover/tip:opacity-100 transition-opacity" />
                                        <p className="text-sm font-bold leading-relaxed italic text-primary-50/80 group-hover/tip:text-white transition-colors">
                                            {tip}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-20 pt-10 border-t border-white/10 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center p-3">
                                        <BrainCircuit className="w-full h-full text-primary-200" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-300">Sync Status</p>
                                        <p className="font-bold text-white italic">Localized Matrix Active</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
