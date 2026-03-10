import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import {
    Brain, Activity, FileText, Download, ChevronRight,
    LogOut, User, TrendingDown, TrendingUp, Minus
} from 'lucide-react';

// Mock assessment history for display
const mockHistory = [
    { date: '2026-03-05', stressLevel: 65, riskLevel: 'Moderate', primaryEmotion: 'Anxious' },
    { date: '2026-03-02', stressLevel: 80, riskLevel: 'High', primaryEmotion: 'Stressed' },
    { date: '2026-02-26', stressLevel: 50, riskLevel: 'Low', primaryEmotion: 'Neutral' }
];

function TrendIcon({ current, prev }) {
    if (current < prev) return <TrendingDown className="w-4 h-4 text-green-500" />;
    if (current > prev) return <TrendingUp className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-slate-400" />;
}

function RiskBadge({ level }) {
    const colors = {
        Low: 'bg-green-100 text-green-700',
        Moderate: 'bg-orange-100 text-orange-700',
        High: 'bg-red-100 text-red-700'
    };
    return (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors[level] ?? 'bg-slate-100 text-slate-600'}`}>
            {level}
        </span>
    );
}

export default function DashboardPage() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                navigate('/login');
                return;
            }
            try {
                const snap = await getDoc(doc(db, 'users', user.uid));
                if (snap.exists()) setProfile(snap.data());
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#EAF6F6]">
                <Brain className="w-12 h-12 text-[#204E4A] animate-pulse" />
            </div>
        );
    }

    const latest = mockHistory[0];
    const prevResult = mockHistory[1];

    return (
        <div className="min-h-screen bg-slate-50">

            {/* Top Navigation */}
            <nav className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Brain className="w-7 h-7 text-[#204E4A]" />
                    <span className="font-bold text-xl text-slate-900">MindCare AI</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-slate-500 hidden sm:block">
                        {profile?.fullName || profile?.email || 'User'}
                    </span>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-500 transition-colors"
                    >
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-10">

                {/* Greeting */}
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900">
                        Welcome back, {profile?.fullName?.split(' ')[0] || 'there'} 👋
                    </h1>
                    <p className="mt-1 text-slate-500">Here is your mental wellness overview.</p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <StatCard
                        label="Latest Stress Level"
                        value={`${latest.stressLevel}%`}
                        icon={<Activity className="w-6 h-6 text-red-500" />}
                        bg="bg-red-50"
                        trend={<TrendIcon current={latest.stressLevel} prev={prevResult.stressLevel} />}
                    />
                    <StatCard
                        label="Current Risk Level"
                        value={latest.riskLevel}
                        icon={<Brain className="w-6 h-6 text-violet-500" />}
                        bg="bg-violet-50"
                    />
                    <StatCard
                        label="Total Assessments"
                        value={mockHistory.length}
                        icon={<FileText className="w-6 h-6 text-blue-500" />}
                        bg="bg-blue-50"
                    />
                </div>

                {/* Profile Summary */}
                <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <User className="w-5 h-5 text-[#204E4A]" />
                        <h2 className="text-lg font-bold text-slate-900">Profile Summary</h2>
                    </div>
                    {profile ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                            <ProfileField label="Age" value={profile.age} />
                            <ProfileField label="Gender" value={profile.gender} />
                            <ProfileField label="Occupation" value={profile.occupation} />
                            <ProfileField label="City" value={profile.city} />
                            <ProfileField label="Sleep" value={profile.sleepPattern} />
                            <ProfileField label="Stress (self)" value={`${profile.stressLevel}/10`} />
                            <ProfileField label="Exercise" value={profile.exerciseHabits} />
                            <ProfileField label="Marital" value={profile.maritalStatus} />
                        </div>
                    ) : (
                        <p className="text-slate-500 text-sm">
                            Profile not complete.{' '}
                            <button onClick={() => navigate('/profile-creation')} className="text-[#204E4A] underline">
                                Complete it now
                            </button>
                        </p>
                    )}
                </section>

                {/* Assessment History */}
                <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 flex items-center justify-between border-b border-slate-100">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-[#204E4A]" /> Assessment History
                        </h2>
                        <button
                            onClick={() => navigate('/assessment')}
                            className="flex items-center gap-1 text-sm text-[#204E4A] font-medium hover:underline"
                        >
                            New Assessment <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {mockHistory.map((h, idx) => (
                            <div key={idx} className="flex flex-wrap items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                                <div>
                                    <p className="font-medium text-slate-800">{h.date}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Primary emotion: {h.primaryEmotion}</p>
                                </div>
                                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-slate-700">{h.stressLevel}%</p>
                                        <p className="text-xs text-slate-400">Stress</p>
                                    </div>
                                    <RiskBadge level={h.riskLevel} />
                                    <button className="p-1.5 text-slate-400 hover:text-[#204E4A] transition-colors" title="Download report">
                                        <Download className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Mental Health Trend Chart (simple visual) */}
                <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
                    <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <TrendingDown className="w-5 h-5 text-[#204E4A]" /> Stress Trend
                    </h2>
                    <div className="space-y-4">
                        {mockHistory.map((h, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                                <span className="text-xs text-slate-400 w-20 flex-shrink-0">{h.date}</span>
                                <div className="flex-1 bg-slate-100 rounded-full h-3">
                                    <div
                                        className={`h-3 rounded-full transition-all duration-700 ${h.stressLevel >= 70 ? 'bg-red-400' : h.stressLevel >= 50 ? 'bg-orange-400' : 'bg-green-400'
                                            }`}
                                        style={{ width: `${h.stressLevel}%` }}
                                    />
                                </div>
                                <span className="text-xs font-medium text-slate-600 w-10 text-right">{h.stressLevel}%</span>
                            </div>
                        ))}
                    </div>
                </section>

            </main>
        </div>
    );
}

// Sub-components
function StatCard({ label, value, icon, bg, trend }) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-start gap-4">
            <div className={`${bg} rounded-xl p-3`}>{icon}</div>
            <div className="flex-1">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</p>
                <div className="flex items-center gap-2">
                    <p className="text-2xl font-extrabold text-slate-900">{value}</p>
                    {trend}
                </div>
            </div>
        </div>
    );
}

function ProfileField({ label, value }) {
    return (
        <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
            <p className="font-medium text-slate-800">{value || '—'}</p>
        </div>
    );
}
