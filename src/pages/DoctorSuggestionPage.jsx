import { useLocation, useNavigate } from 'react-router-dom';
import { UserCheck, CheckCircle, ArrowLeft, PhoneCall, Calendar, Heart } from 'lucide-react';

const SUGGESTIONS = {
    Low: {
        specialist: 'General Wellness Counselor',
        urgency: 'Routine',
        urgencyColor: 'emerald',
        message: 'Your mental health looks good! Regular self-care and mindfulness practices will help you maintain this balance.',
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
        specialist: 'Licensed Counselor or Therapist',
        urgency: 'Within a Month',
        urgencyColor: 'amber',
        message: 'You are experiencing mild to moderate stress. Speaking with a counselor can help you develop better coping strategies.',
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
        specialist: 'Psychiatrist or Clinical Psychologist',
        urgency: 'Within a Week',
        urgencyColor: 'orange',
        message: 'Your assessment indicates elevated stress and risk. Please seek professional help promptly.',
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
        specialist: 'Psychiatrist (Urgent Consultation)',
        urgency: 'Immediate',
        urgencyColor: 'red',
        message: 'Your results indicate a high level of distress. Please seek professional medical help immediately. You are not alone.',
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
        emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        amber: 'bg-amber-100 text-amber-700 border-amber-200',
        orange: 'bg-orange-100 text-orange-700 border-orange-200',
        red: 'bg-red-100 text-red-700 border-red-200',
    }[suggestion.urgencyColor];

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Header */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-100 mb-4">
                        <UserCheck className="w-8 h-8 text-primary-600" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900">Doctor Suggestions</h1>
                    <p className="text-slate-500 mt-2 text-sm">Personalized recommendations based on your assessment results.</p>
                </div>

                {/* Specialist Card */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <p className="text-sm text-slate-500 mb-1">Recommended Specialist</p>
                            <h2 className="text-xl font-bold text-slate-900">{suggestion.specialist}</h2>
                            <p className="text-slate-600 mt-2 text-sm">{suggestion.message}</p>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border shrink-0 ${urgencyBg}`}>
                            <Calendar className="w-4 h-4" />
                            {suggestion.urgency}
                        </div>
                    </div>
                </div>

                {/* Recommended Actions */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-primary-600" /> Recommended Actions
                    </h3>
                    <ul className="space-y-3">
                        {suggestion.actions.map((action, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-slate-700 p-3 bg-slate-50 rounded-xl">
                                <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 font-bold flex items-center justify-center shrink-0 text-xs">{i + 1}</span>
                                {action}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Wellness Tips */}
                <div className="bg-gradient-to-br from-emerald-50 to-primary-50 rounded-2xl p-6 border border-emerald-100">
                    <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                        <Heart className="w-5 h-5 text-emerald-600" /> Mental Wellness Tips
                    </h3>
                    <ul className="space-y-3">
                        {suggestion.tips.map((tip, i) => (
                            <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                                <span className="text-emerald-500 mt-0.5">✦</span> {tip}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Emergency */}
                {(riskLevel === 'High' || riskLevel === 'Severe') && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-4">
                        <PhoneCall className="w-6 h-6 text-red-600 shrink-0 mt-1" />
                        <div>
                            <p className="font-semibold text-red-700">Emergency Resources</p>
                            <p className="text-sm text-red-600 mt-1">iCall (India): <strong>9152987821</strong> | Vandrevala Foundation: <strong>1860-2662-345</strong></p>
                            <p className="text-xs text-red-500 mt-1">Available 24/7. Help is always just a call away.</p>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex-1 flex justify-center items-center gap-2 py-4 px-6 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-md transition-colors"
                    >
                        Go to Dashboard
                    </button>
                    <button
                        onClick={() => navigate('/report', { state: location.state })}
                        className="flex items-center justify-center gap-2 py-4 px-6 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl transition-colors shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4" /> View Report
                    </button>
                </div>

                <p className="text-center text-xs text-slate-400">
                    ⚠️ This is for informational purposes only and does not replace professional medical advice.
                </p>
            </div>
        </div>
    );
}
