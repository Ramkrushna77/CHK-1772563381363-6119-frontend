import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

const ProfileCreationPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        fullName: '',
        age: '',
        gender: '',
        occupation: '',
        city: '',
        maritalStatus: '',
        sleepPattern: '',
        stressLevel: '',
        exerciseHabits: '',
        smokingAlcohol: '',
        emergencyName: '',
        emergencyRelationship: '',
        emergencyContact: '',
        pastHistory: '',
        currentMedications: '',
        therapyHistory: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error("No authenticated user found. Please login briefly first.");
            }

            await setDoc(doc(db, "users", user.uid), {
                profileComplete: true,
                ...formData
            }, { merge: true });

            console.log('Profile Data Submitted');
            navigate('/assessment');
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Container */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold text-[#204E4A] mb-8 text-center">Complete Your Profile</h2>

                <form onSubmit={handleSubmit} className="bg-[#EAF6F6] p-8 rounded-2xl shadow-sm space-y-8">
                    {error && <div className="p-3 bg-red-100 text-red-600 rounded-md text-sm">{error}</div>}

                    {/* Personal Information */}
                    <section>
                        <h3 className="text-xl font-semibold text-[#204E4A] mb-4 border-b border-[#BED6D3] pb-2">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#204E4A] focus:border-[#204E4A] bg-white text-gray-900" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                                <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#204E4A] focus:border-[#204E4A] bg-white text-gray-900" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#204E4A] focus:border-[#204E4A] bg-white text-gray-900" required>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                                <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#204E4A] focus:border-[#204E4A] bg-white text-gray-900" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City / Location</label>
                                <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#204E4A] focus:border-[#204E4A] bg-white text-gray-900" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                                <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#204E4A] focus:border-[#204E4A] bg-white text-gray-900" required>
                                    <option value="">Select Status</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Divorced">Divorced</option>
                                    <option value="Widowed">Widowed</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Lifestyle Information */}
                    <section>
                        <h3 className="text-xl font-semibold text-[#204E4A] mb-4 border-b border-[#BED6D3] pb-2">Lifestyle Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sleep Pattern (hrs/night)</label>
                                <select name="sleepPattern" value={formData.sleepPattern} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#204E4A] focus:border-[#204E4A] bg-white text-gray-900" required>
                                    <option value="">Select Sleep Pattern</option>
                                    <option value="Less than 4">Less than 4 hours</option>
                                    <option value="4-6">4-6 hours</option>
                                    <option value="6-8">6-8 hours</option>
                                    <option value="More than 8">More than 8 hours</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stress Level (1-10)</label>
                                <input type="number" min="1" max="10" name="stressLevel" value={formData.stressLevel} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#204E4A] focus:border-[#204E4A] bg-white text-gray-900" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Exercise Habits</label>
                                <select name="exerciseHabits" value={formData.exerciseHabits} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#204E4A] focus:border-[#204E4A] bg-white text-gray-900" required>
                                    <option value="">Select Exercise Habit</option>
                                    <option value="None">None</option>
                                    <option value="Rarely">Rarely</option>
                                    <option value="1-3 times/week">1-3 times a week</option>
                                    <option value="Daily">Daily</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Smoking / Alcohol Habits</label>
                                <select name="smokingAlcohol" value={formData.smokingAlcohol} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#204E4A] focus:border-[#204E4A] bg-white text-gray-900" required>
                                    <option value="">Select Habit</option>
                                    <option value="None">None</option>
                                    <option value="Occasional">Occasional</option>
                                    <option value="Frequent">Frequent</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Emergency Contact */}
                    <section>
                        <h3 className="text-xl font-semibold text-[#204E4A] mb-4 border-b border-[#BED6D3] pb-2">Emergency Contact</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Relative Name</label>
                                <input type="text" name="emergencyName" value={formData.emergencyName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#204E4A] focus:border-[#204E4A] bg-white text-gray-900" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                                <input type="text" name="emergencyRelationship" value={formData.emergencyRelationship} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#204E4A] focus:border-[#204E4A] bg-white text-gray-900" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                <input type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#204E4A] focus:border-[#204E4A] bg-white text-gray-900" required />
                            </div>
                        </div>
                    </section>

                    {/* Medical Information */}
                    <section>
                        <h3 className="text-xl font-semibold text-[#204E4A] mb-4 border-b border-[#BED6D3] pb-2">Medical Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Past Mental Health History</label>
                                <textarea name="pastHistory" value={formData.pastHistory} onChange={handleChange} rows="2" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#204E4A] focus:border-[#204E4A] bg-white text-gray-900" placeholder="Optional"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Medications</label>
                                <textarea name="currentMedications" value={formData.currentMedications} onChange={handleChange} rows="2" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#204E4A] focus:border-[#204E4A] bg-white text-gray-900" placeholder="Optional"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Therapy History</label>
                                <textarea name="therapyHistory" value={formData.therapyHistory} onChange={handleChange} rows="2" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#204E4A] focus:border-[#204E4A] bg-white text-gray-900" placeholder="Optional"></textarea>
                            </div>
                        </div>
                    </section>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#204E4A] text-white py-3 rounded-lg font-semibold hover:bg-[#153431] transition-colors focus:ring-4 focus:ring-[#BED6D3] disabled:opacity-50"
                        >
                            {loading ? 'Saving Profile...' : 'Save Profile & Continue to Assessment'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ProfileCreationPage;
