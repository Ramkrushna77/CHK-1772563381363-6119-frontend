import { useNavigate } from 'react-router-dom';
import {
    UserCheck, BrainCircuit, Heart, ChevronRight,
    Lightbulb, Phone, Star
} from 'lucide-react';

const specialists = [
    {
        type: 'Psychologist',
        icon: <BrainCircuit className="w-7 h-7 text-violet-600" />,
        bg: 'bg-violet-50',
        border: 'border-violet-200',
        description:
            'Specializes in diagnosing and treating emotional and behavioural disorders through counselling and therapy without medication.',
        suitableFor: ['Anxiety', 'Depression', 'Stress Management', 'Behavioural Issues'],
        recommendation: 'Highly Recommended'
    },
    {
        type: 'Psychiatrist',
        icon: <UserCheck className="w-7 h-7 text-blue-600" />,
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        description:
            'A medical doctor who can prescribe medication alongside therapy for more severe mental health conditions.',
        suitableFor: ['Severe Depression', 'Bipolar Disorder', 'Schizophrenia', 'Medication Management'],
        recommendation: 'If symptoms persist'
    },
    {
        type: 'Counsellor',
        icon: <Heart className="w-7 h-7 text-rose-500" />,
        bg: 'bg-rose-50',
        border: 'border-rose-200',
        description:
            'Provides professional guidance through life challenges, relationship issues, and mild mental health concerns.',
        suitableFor: ['Life Transitions', 'Relationship Issues', 'Grief', 'Mild Stress'],
        recommendation: 'Good Starting Point'
    }
];

const wellnessTips = [
    { title: 'Practice Mindfulness', desc: 'Take 10 minutes daily to meditate, focusing on your breath to ground yourself in the present moment.' },
    { title: 'Prioritise Sleep', desc: 'Aim for 7–8 hours of quality sleep. Keep a consistent sleep schedule even on weekends.' },
    { title: 'Stay Physically Active', desc: 'Even a 20-minute walk releases endorphins. Exercise is one of the most effective natural mood boosters.' },
    { title: 'Connect with Others', desc: 'Reach out to friends or family. Social connection is a powerful buffer against stress and anxiety.' },
    { title: 'Limit Screen Time', desc: 'Reduce exposure to news and social media, especially before bedtime, to improve mental clarity.' },
    { title: 'Journaling', desc: 'Write down three things you are grateful for each day to shift focus towards positive experiences.' }
];

export default function DoctorSuggestionPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center">
                    <span className="inline-block px-4 py-1.5 bg-[#EAF6F6] text-[#204E4A] rounded-full text-sm font-medium mb-4">
                        Personalised Guidance
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                        Your Recommended Next Steps
                    </h1>
                    <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
                        Based on your assessment results, here are the types of mental health professionals and actions that may help you the most.
                    </p>
                </div>

                {/* Specialist Cards */}
                <section>
                    <h2 className="text-xl font-bold text-slate-700 mb-5 flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-[#204E4A]" />
                        Consult a Specialist
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {specialists.map((spec) => (
                            <div
                                key={spec.type}
                                className={`relative bg-white rounded-2xl border ${spec.border} p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col`}
                            >
                                {/* Recommendation badge */}
                                <span className={`absolute top-4 right-4 text-xs font-semibold px-2 py-0.5 rounded-full ${spec.bg} text-slate-600`}>
                                    {spec.recommendation}
                                </span>

                                <div className={`${spec.bg} rounded-xl p-3 w-fit mb-4`}>
                                    {spec.icon}
                                </div>

                                <h3 className="text-lg font-bold text-slate-900 mb-2">{spec.type}</h3>
                                <p className="text-sm text-slate-500 flex-1">{spec.description}</p>

                                <div className="mt-4">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Suitable for</p>
                                    <ul className="flex flex-wrap gap-1.5">
                                        {spec.suitableFor.map((tag) => (
                                            <li key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{tag}</li>
                                        ))}
                                    </ul>
                                </div>

                                <button className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 bg-[#204E4A] text-white rounded-lg text-sm font-medium hover:bg-[#153431] transition-colors">
                                    <Phone className="w-4 h-4" /> Find a {spec.type}
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Recommended Actions */}
                <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
                    <h2 className="text-xl font-bold text-slate-700 mb-6 flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        Recommended Actions
                    </h2>
                    <ol className="space-y-4">
                        {[
                            'Schedule an appointment with a psychologist or counsellor within the next 2 weeks.',
                            'Share this AI-generated report with your chosen specialist at the first session.',
                            'Fill in an emergency contact if you haven\'t done so already.',
                            'Practice the mental wellness tips below daily.',
                            'Retake this assessment every month to track your progress.'
                        ].map((action, idx) => (
                            <li key={idx} className="flex items-start gap-4">
                                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#EAF6F6] text-[#204E4A] font-bold text-sm flex items-center justify-center">
                                    {idx + 1}
                                </span>
                                <p className="text-slate-600 pt-0.5">{action}</p>
                            </li>
                        ))}
                    </ol>
                </section>

                {/* Mental Wellness Tips */}
                <section>
                    <h2 className="text-xl font-bold text-slate-700 mb-5 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-amber-500" />
                        Mental Wellness Tips
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {wellnessTips.map((tip) => (
                            <div key={tip.title} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="font-semibold text-slate-800 mb-2">{tip.title}</h3>
                                <p className="text-sm text-slate-500">{tip.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer CTA */}
                <div className="bg-[#204E4A] rounded-2xl p-8 text-center text-white">
                    <h2 className="text-2xl font-bold mb-2">You are not alone.</h2>
                    <p className="text-[#BED6D3] mb-6 max-w-lg mx-auto">
                        Seeking help is a sign of strength. Your mental health journey starts with this first step.
                    </p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="inline-flex items-center gap-2 bg-white text-[#204E4A] px-6 py-3 rounded-xl font-semibold hover:bg-[#EAF6F6] transition-colors shadow"
                    >
                        Go to Dashboard <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

            </div>
        </div>
    );
}
