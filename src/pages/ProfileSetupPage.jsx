import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Activity, HeartPulse, Stethoscope, ArrowRight, BrainCircuit, Sparkles, ShieldCheck } from 'lucide-react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function ProfileSetupPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '', age: '', gender: '', occupation: '', city: '', maritalStatus: '',
        sleepPattern: '', stressLevel: '', exerciseHabits: '', smokingAlcohol: '',
        relativeName: '', relationship: '', contactNumber: '',
        pastHistory: '', currentMedications: '', therapyHistory: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) navigate('/login');
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const user = auth.currentUser;
            if (!user) throw new Error("Authentication failure.");
            const userDocRef = doc(db, 'users', user.uid);
            await setDoc(userDocRef, {
                profile: formData,
                profileCompleted: true,
                updatedAt: new Date().toISOString()
            }, { merge: true });
            setLoading(false);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const SectionHeader = ({ icon: Icon, title, description }) => (
        <div className="mb-8 border-b border-slate-50 pb-6 relative">
            <h3 className="text-xl font-black flex items-center text-slate-900 italic tracking-tighter uppercase text-[10px] mb-2">
                <Icon className="w-5 h-5 mr-3 text-primary-600" />
                {title}
            </h3>
            <p className="text-sm text-slate-500 font-medium italic">{description}</p>
            <div className="absolute bottom-0 left-0 w-24 h-0.5 bg-primary-600"></div>
        </div>
    );

    if (authLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <BrainCircuit className="w-16 h-16 text-primary-600 mx-auto mb-6 animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Session</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 relative selection:bg-primary-100 italic-text-none overflow-x-hidden py-24">
            {/* Ambient Premium Glows */}
            <div className="fixed top-[-10%] right-[-10%] w-[800px] h-[800px] bg-primary-100/10 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-emerald-100/10 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-slate-100 shadow-sm text-primary-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Clinical Onboarding Vector</span>
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic mb-4 uppercase">Profile Calibration</h1>
                    <p className="text-slate-500 max-w-lg mx-auto font-medium leading-relaxed italic">Align your clinical metrics to optimize neural analysis.</p>
                </div>

                <div className="glass-panel rounded-[4rem] p-10 md:p-20 shadow-2xl relative overflow-hidden group border-none bg-white/70 premium-glow">
                    {error && (
                        <div className="mb-10 bg-red-50 border border-red-100 text-red-600 rounded-3xl p-6 text-sm font-bold text-center italic">
                            Error: {error}
                        </div>
                    )}

                    <form className="space-y-16" onSubmit={handleSubmit}>
                        {/* Section 1: Demographics */}
                        <div>
                            <SectionHeader
                                icon={User}
                                title="Demographic Metrics"
                                description="Baseline identity parameters for contextual mapping."
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Legal Designation</label>
                                    <input name="fullName" type="text" required value={formData.fullName} onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white border-2 border-slate-50 rounded-2xl font-bold italic focus:ring-4 focus:ring-primary-100 focus:border-primary-600 outline-none transition-all placeholder-slate-200" placeholder="Full Name" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Temporal Age</label>
                                    <input name="age" type="number" required value={formData.age} onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white border-2 border-slate-50 rounded-2xl font-bold italic focus:ring-4 focus:ring-primary-100 focus:border-primary-600 outline-none transition-all placeholder-slate-200" placeholder="Years" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Biological Gender</label>
                                    <select name="gender" required value={formData.gender} onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white border-2 border-slate-50 rounded-2xl font-bold italic focus:ring-4 focus:ring-primary-100 focus:border-primary-600 outline-none transition-all">
                                        <option value="">Select Protocol</option>
                                        <option value="Male">Alpha (Male)</option>
                                        <option value="Female">Beta (Female)</option>
                                        <option value="Other">Non-Binary</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Marital Matrix</label>
                                    <select name="maritalStatus" required value={formData.maritalStatus} onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white border-2 border-slate-50 rounded-2xl font-bold italic focus:ring-4 focus:ring-primary-100 focus:border-primary-600 outline-none transition-all">
                                        <option value="">Status</option>
                                        <option value="Single">Uncoupled (Single)</option>
                                        <option value="Married">Coupled (Married)</option>
                                        <option value="Divorced">Separated</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Somatic Intelligence */}
                        <div>
                            <SectionHeader
                                icon={Activity}
                                title="Somatic Intelligence"
                                description="Real-time lifestyle inputs for stress-state correlation."
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Circadian Rhythm</label>
                                    <select name="sleepPattern" required value={formData.sleepPattern} onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white border-2 border-slate-50 rounded-2xl font-bold italic">
                                        <option value="">Calibration</option>
                                        <option value="Deep Sleep">Optimal (7-9h)</option>
                                        <option value="Moderate">Normal (6-7h)</option>
                                        <option value="Sleep Deprived">Critical (<6h)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Cortisol Vector</label>
                                    <select name="stressLevel" required value={formData.stressLevel} onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white border-2 border-slate-50 rounded-2xl font-bold italic">
                                        <option value="">Intensity</option>
                                        <option value="Low">Low Friction</option>
                                        <option value="Moderate">Moderate Drag</option>
                                        <option value="High">Hyper-Stress</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Kinetic Links */}
                        <div>
                            <SectionHeader
                                icon={HeartPulse}
                                title="Kinetic Links"
                                description="Physical exertion and substance intake metrics."
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Exertion Frequency</label>
                                    <select name="exerciseHabits" required value={formData.exerciseHabits} onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white border-2 border-slate-50 rounded-2xl font-bold italic">
                                        <option value="">Cycle</option>
                                        <option value="Daily">Daily Sync</option>
                                        <option value="Weekly">Weekly Probe</option>
                                        <option value="Never">Stagnant</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Bio-Toxins</label>
                                    <input name="smokingAlcohol" type="text" value={formData.smokingAlcohol} onChange={handleChange}
                                        className="w-full px-6 py-4 bg-white border-2 border-slate-50 rounded-2xl font-bold italic" placeholder="Nicotine / Alcohol Intake" />
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Clinical History */}
                        <div>
                            <SectionHeader
                                icon={Stethoscope}
                                title="Clinical Trace"
                                description="Historical medical data for comprehensive profile building."
                            />
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Historical Anomalies</label>
                                    <textarea name="pastHistory" value={formData.pastHistory} onChange={handleChange} rows="3"
                                        className="w-full px-6 py-4 bg-white border-2 border-slate-50 rounded-3xl font-bold italic focus:ring-4 focus:ring-primary-100 focus:border-primary-600 outline-none transition-all placeholder-slate-200" placeholder="Major medical events..." />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Active Chemical Protocols</label>
                                    <textarea name="currentMedications" value={formData.currentMedications} onChange={handleChange} rows="3"
                                        className="w-full px-6 py-4 bg-white border-2 border-slate-50 rounded-3xl font-bold italic focus:ring-4 focus:ring-primary-100 focus:border-primary-600 outline-none transition-all placeholder-slate-200" placeholder="Current medications..." />
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 flex border-t border-slate-50">
                            <button type="submit" disabled={loading}
                                className="w-full bg-primary-600 text-white py-6 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-[12px] hover:bg-primary-700 transition-all shadow-2xl shadow-primary-200 active:scale-[0.98] flex items-center justify-center gap-4 disabled:opacity-50">
                                {loading ? (
                                    <Activity className="animate-spin h-6 w-6" />
                                ) : (
                                    <>Finalize Calibration <ArrowRight size={20} /></>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
