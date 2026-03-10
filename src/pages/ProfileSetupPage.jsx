import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Activity, HeartPulse, Stethoscope, ArrowRight } from 'lucide-react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function ProfileSetupPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        // Personal
        fullName: '', age: '', gender: '', occupation: '', city: '', maritalStatus: '',
        // Lifestyle
        sleepPattern: '', stressLevel: '', exerciseHabits: '', smokingAlcohol: '',
        // Emergency
        relativeName: '', relationship: '', contactNumber: '',
        // Medical
        pastHistory: '', currentMedications: '', therapyHistory: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);

    // Ensure we have a user session before allowing form submission
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate('/login');
            }
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
            if (!user) {
                throw new Error("No user is currently logged in. Please sign in first.");
            }

            // Reference to the user's document in the "users" collection
            const userDocRef = doc(db, 'users', user.uid);

            // Use setDoc with merge: true to ensure the document exists
            await setDoc(userDocRef, {
                profile: formData,
                profileCompleted: true,
                updatedAt: new Date().toISOString()
            }, { merge: true });

            console.log('Profile setup saved successfully!');
            setLoading(false);
            navigate('/dashboard');
        } catch (err) {
            console.error('Error saving profile data:', err);
            setError(err.message || "Failed to save profile. Please try again.");
            setLoading(false);
        }
    };

    // eslint-disable-next-line react/prop-types
    const SectionHeader = ({ icon: Icon, title, description }) => (
        <div className="mb-6 border-b border-primary-100 pb-4">
            <h3 className="text-xl font-bold flex items-center text-primary-800">
                <Icon className="w-5 h-5 mr-2 text-primary-600" />
                {title}
            </h3>
            <p className="text-sm text-slate-500 mt-1">{description}</p>
        </div>
    );

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center">
                    <Activity className="w-12 h-12 text-primary-600 mx-auto mb-4 animate-pulse" />
                    <p className="text-slate-600 font-medium">Verifying session...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-extrabold text-slate-900">Complete Your Profile</h2>
                    <p className="mt-2 text-slate-600">Help us personalize your mental health assessment experience.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 text-sm">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-10">

                        {/* 1. Personal Information */}
                        <section>
                            <SectionHeader icon={User} title="Personal Information" description="Basic details to help us know you better." />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                    <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="w-full border-slate-300 rounded-xl py-2.5 px-3 border focus:ring-primary-500 focus:border-primary-500 bg-slate-50 focus:bg-white" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                                        <input type="number" name="age" required value={formData.age} onChange={handleChange} className="w-full border-slate-300 rounded-xl py-2.5 px-3 border focus:ring-primary-500 focus:border-primary-500 bg-slate-50 focus:bg-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                                        <select name="gender" required value={formData.gender} onChange={handleChange} className="w-full border-slate-300 rounded-xl py-2.5 px-3 border focus:ring-primary-500 focus:border-primary-500 bg-slate-50 focus:bg-white">
                                            <option value="">Select...</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Occupation</label>
                                    <input type="text" name="occupation" required value={formData.occupation} onChange={handleChange} className="w-full border-slate-300 rounded-xl py-2.5 px-3 border focus:ring-primary-500 focus:border-primary-500 bg-slate-50 focus:bg-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">City / Location</label>
                                    <input type="text" name="city" required value={formData.city} onChange={handleChange} className="w-full border-slate-300 rounded-xl py-2.5 px-3 border focus:ring-primary-500 focus:border-primary-500 bg-slate-50 focus:bg-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Marital Status</label>
                                    <select name="maritalStatus" required value={formData.maritalStatus} onChange={handleChange} className="w-full border-slate-300 rounded-xl py-2.5 px-3 border focus:ring-primary-500 focus:border-primary-500 bg-slate-50 focus:bg-white">
                                        <option value="">Select...</option>
                                        <option value="single">Single</option>
                                        <option value="married">Married</option>
                                        <option value="divorced">Divorced</option>
                                        <option value="widowed">Widowed</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* 2. Lifestyle Information */}
                        <section>
                            <SectionHeader icon={Activity} title="Lifestyle Information" description="Your daily habits and stress levels." />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Average Sleep (Hours/Night)</label>
                                    <select name="sleepPattern" required value={formData.sleepPattern} onChange={handleChange} className="w-full border-slate-300 rounded-xl py-2.5 px-3 border focus:ring-primary-500 focus:border-primary-500 bg-slate-50 focus:bg-white">
                                        <option value="">Select...</option>
                                        <option value="less-than-4">&lt; 4 hours</option>
                                        <option value="4-6">4 - 6 hours</option>
                                        <option value="6-8">6 - 8 hours</option>
                                        <option value="more-than-8">&gt; 8 hours</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">General Stress Level</label>
                                    <select name="stressLevel" required value={formData.stressLevel} onChange={handleChange} className="w-full border-slate-300 rounded-xl py-2.5 px-3 border focus:ring-primary-500 focus:border-primary-500 bg-slate-50 focus:bg-white">
                                        <option value="">Select...</option>
                                        <option value="low">Low</option>
                                        <option value="moderate">Moderate</option>
                                        <option value="high">High</option>
                                        <option value="severe">Severe</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Exercise Habits</label>
                                    <select name="exerciseHabits" required value={formData.exerciseHabits} onChange={handleChange} className="w-full border-slate-300 rounded-xl py-2.5 px-3 border focus:ring-primary-500 focus:border-primary-500 bg-slate-50 focus:bg-white">
                                        <option value="">Select...</option>
                                        <option value="none">None</option>
                                        <option value="rarely">Rarely (1-2 times/month)</option>
                                        <option value="sometimes">Sometimes (1-2 times/week)</option>
                                        <option value="regularly">Regularly (3+ times/week)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Smoking / Alcohol Habits</label>
                                    <select name="smokingAlcohol" required value={formData.smokingAlcohol} onChange={handleChange} className="w-full border-slate-300 rounded-xl py-2.5 px-3 border focus:ring-primary-500 focus:border-primary-500 bg-slate-50 focus:bg-white">
                                        <option value="">Select...</option>
                                        <option value="neither">Neither</option>
                                        <option value="smoking">Smoking</option>
                                        <option value="alcohol">Alcohol</option>
                                        <option value="both">Both</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* 3. Emergency Contact */}
                        <section>
                            <SectionHeader icon={HeartPulse} title="Emergency Contact" description="Who should we reach out to in case of an emergency." />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Relative/Friend Name</label>
                                    <input type="text" name="relativeName" required value={formData.relativeName} onChange={handleChange} className="w-full border-slate-300 rounded-xl py-2.5 px-3 border focus:ring-primary-500 focus:border-primary-500 bg-slate-50 focus:bg-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Relationship</label>
                                    <input type="text" name="relationship" required value={formData.relationship} onChange={handleChange} className="w-full border-slate-300 rounded-xl py-2.5 px-3 border focus:ring-primary-500 focus:border-primary-500 bg-slate-50 focus:bg-white" placeholder="e.g. Spouse, Parent" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number</label>
                                    <input type="tel" name="contactNumber" required value={formData.contactNumber} onChange={handleChange} className="w-full border-slate-300 rounded-xl py-2.5 px-3 border focus:ring-primary-500 focus:border-primary-500 bg-slate-50 focus:bg-white" />
                                </div>
                            </div>
                        </section>

                        {/* 4. Medical Information */}
                        <section>
                            <SectionHeader icon={Stethoscope} title="Medical Information" description="Previous history to tailor your assessment accurately." />
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Past Mental Health History</label>
                                    <textarea name="pastHistory" rows="2" value={formData.pastHistory} onChange={handleChange} className="w-full border-slate-300 rounded-xl py-2.5 px-3 border focus:ring-primary-500 focus:border-primary-500 bg-slate-50 focus:bg-white" placeholder="Any previously diagnosed conditions? If none, leave blank."></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Current Medications</label>
                                    <textarea name="currentMedications" rows="2" value={formData.currentMedications} onChange={handleChange} className="w-full border-slate-300 rounded-xl py-2.5 px-3 border focus:ring-primary-500 focus:border-primary-500 bg-slate-50 focus:bg-white" placeholder="Mention any ongoing medications."></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Therapy History</label>
                                    <select name="therapyHistory" required value={formData.therapyHistory} onChange={handleChange} className="w-full border-slate-300 rounded-xl py-2.5 px-3 border focus:ring-primary-500 focus:border-primary-500 bg-slate-50 focus:bg-white">
                                        <option value="">Select...</option>
                                        <option value="never">Never had therapy</option>
                                        <option value="past">Had therapy in the past</option>
                                        <option value="current">Currently in therapy</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-base font-bold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Saving Profile...' : 'Complete Profile & Continue'}
                                {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
