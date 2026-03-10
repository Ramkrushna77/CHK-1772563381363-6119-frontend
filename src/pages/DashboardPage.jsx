import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { BrainCircuit, Activity, FileText, Calendar, Download, ChevronRight, MessageSquare, AlertCircle } from 'lucide-react';

const weightMap = {
    Never: 0, Rarely: 1, Sometimes: 2, Often: 3, Constantly: 4,
    'Not at all': 0, 'Several days': 1, 'More than half the days': 3, 'Nearly every day': 4,
    'Very Good': 0, Good: 1, Fair: 2, Poor: 3, 'Very Poor': 4,
    Excellent: 0, Normal: 0, 'Slightly changed': 1, 'Moderately changed': 2, 'Significantly changed': 3,
    'Very Often': 4, Always: 4
};

export default function DashboardPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, avgStress: 0, lastDate: 'Never' });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!firebaseUser) {
                navigate('/login');
                return;
            }
            setUser(firebaseUser);

            try {
                // Fetch Profile
                const docRef = doc(db, 'users', firebaseUser.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setProfile(docSnap.data());
                }

                // Fetch Assessments
                const q = query(
                    collection(db, 'assessments'),
                    where('userId', '==', firebaseUser.uid),
                    orderBy('completedAt', 'desc')
                );
                const querySnapshot = await getDocs(q);
                const fetchedAssessments = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAssessments(fetchedAssessments);

                // Calculate Stats
                if (fetchedAssessments.length > 0) {
                    let totalScore = 0;
                    fetchedAssessments.forEach(ass => {
                        let score = 0;
                        const answers = Object.values(ass.answers || {});
                        answers.forEach(val => { score += (weightMap[val] || 0); });
                        const maxScore = answers.length * 4;
                        const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
                        totalScore += percentage;
                    });

                    const lastAss = fetchedAssessments[0];
                    const date = new Date(lastAss.completedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                    });

                    setStats({
                        total: fetchedAssessments.length,
                        avgStress: Math.round(totalScore / fetchedAssessments.length),
                        lastDate: date
                    });
                }
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <BrainCircuit className="w-12 h-12 text-primary-600 mx-auto mb-4 animate-pulse" />
                    <p className="text-slate-600 font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    const displayName = profile?.fullName || profile?.profile?.fullName || user?.email || 'Patient';

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Top Navigation Bar */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
                    <div className="flex items-center gap-2">
                        <BrainCircuit className="h-8 w-8 text-primary-600" />
                        <span className="font-bold text-xl text-slate-900">MindCare AI</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-600">Welcome, <strong>{displayName.split(' ')[0]}</strong></span>
                        <button
                            onClick={() => { auth.signOut(); navigate('/login'); }}
                            className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                {/* Welcome Banner */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white mb-8 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/4 pointer-events-none"></div>
                    <div className="relative z-10">
                        <h1 className="text-3xl font-bold">Hello, {displayName.split(' ')[0]}! 👋</h1>
                        <p className="mt-2 text-primary-200">Track your mental wellbeing and take your next assessment below.</p>
                        <button
                            onClick={() => navigate('/assessment')}
                            className="mt-5 flex items-center gap-2 bg-white text-primary-700 font-semibold py-3 px-6 rounded-xl hover:bg-primary-50 transition-colors shadow-md"
                        >
                            Start New Assessment <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[
                        { label: 'Total Assessments', value: stats.total, icon: FileText, color: 'text-violet-600 bg-violet-50' },
                        { label: 'Avg Stress Level', value: stats.total > 0 ? `${stats.avgStress}%` : '—', icon: Activity, color: 'text-emerald-600 bg-emerald-50' },
                        { label: 'Last Assessment', value: stats.lastDate, icon: Calendar, color: 'text-amber-600 bg-amber-50' },
                    ].map(({ label, value, icon: Icon, color }) => (
                        <div key={label} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">{label}</p>
                                <p className="text-2xl font-bold text-slate-900">{value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Assistant Embedded Section */}
                <div className="bg-white rounded-2xl p-8 border border-primary-100 shadow-sm mb-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
                    <div className="w-20 h-20 rounded-2xl bg-primary-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-primary-100 group-hover:rotate-3 transition-transform">
                        <MessageSquare size={32} />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-bold text-slate-900">MindCare AI Assistant</h2>
                        <p className="text-slate-600 mt-2 max-w-xl">
                            Need a safe space to talk? Your personal assistant is available 24/7 to listen,
                            provide relaxation techniques, and help you navigate your mental wellbeing.
                        </p>
                    </div>
                    <div className="relative z-10">
                        <button
                            onClick={() => navigate('/chatbot')}
                            className="bg-primary-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-md active:scale-95 flex items-center gap-2 text-nowrap"
                        >
                            Open Assistant <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Profile Summary + History */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Profile Summary */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-full">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Profile Summary</h2>
                        {profile?.profile ? (
                            <ul className="space-y-3 text-sm text-slate-700">
                                {[
                                    ['Name', profile.fullName || profile.profile.fullName],
                                    ['Age', profile.profile.age],
                                    ['Gender', profile.profile.gender],
                                    ['Occupation', profile.profile.occupation],
                                    ['City', profile.profile.city],
                                    ['Stress Level', profile.profile.stressLevel],
                                ].map(([k, v]) => v && (
                                    <li key={k} className="flex justify-between py-2 border-b border-slate-50">
                                        <span className="text-slate-500">{k}</span>
                                        <span className="font-medium capitalize">{v}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-slate-500 text-sm mb-3">Your profile is incomplete.</p>
                                <button
                                    onClick={() => navigate('/profile-setup')}
                                    className="text-primary-600 text-sm font-medium hover:underline"
                                >
                                    Complete Profile →
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Assessment History */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-full flex flex-col">
                        <div className="flex justify-between items-center mb-4 text-nowrap">
                            <h2 className="text-lg font-bold text-slate-900">Recent Assessments</h2>
                            <button className="text-slate-400 hover:text-primary-600 transition-colors">
                                <Download className="w-5 h-5" />
                            </button>
                        </div>

                        {assessments.length > 0 ? (
                            <div className="flex-1 space-y-4 overflow-y-auto max-h-[300px] pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                                {assessments.map((ass) => (
                                    <div key={ass.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary-200 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-600 shadow-sm">
                                                <Activity size={18} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">
                                                    Emotion: {ass.dominantEmotion || 'Neutral'}
                                                </p>
                                                <p className="text-[11px] text-slate-500">
                                                    {new Date(ass.completedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate('/report', { state: { answers: ass.answers, emotion: ass.dominantEmotion } })}
                                            className="text-primary-600 hover:text-primary-700 p-1"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-slate-400 flex-1 flex flex-col justify-center">
                                <Activity className="w-10 h-10 mx-auto mb-3 opacity-40" />
                                <p className="text-sm">No assessments yet.</p>
                                <p className="text-xs mt-1">Take your first assessment to see your history here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

