import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrainCircuit, Mail, Lock, User, Phone } from 'lucide-react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function SignupPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: ''
    });
    const navigate = useNavigate();

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Navigation logic moved to handleSubmit for better control during signup flow
    // (onAuthStateChanged still used in Login for session persistence)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            // Save additional user info to Firestore
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                createdAt: new Date().toISOString()
            });

            console.log('Signup successful!');
            navigate('/profile-setup', { replace: true });
        } catch (err) {
            console.error('Signup error:', err);
            setError(err.message || 'Failed to create account.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="flex justify-center items-center gap-2 mb-6">
                    <BrainCircuit className="h-10 w-10 text-primary-600" />
                    <span className="font-bold text-2xl text-slate-900">MindCare AI</span>
                </Link>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
                    Create an account
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                        Sign in here
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
                    {error && (
                        <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 text-sm">
                            {error}
                        </div>
                    )}
                    <form className="space-y-6" onSubmit={handleSubmit}>

                        {/* Full Name */}
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">
                                Full Name
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    required
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-xl py-3 border bg-slate-50 transition-colors focus:bg-white"
                                    placeholder="Name"
                                />
                            </div>
                        </div>

                        {/* Email Address */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                Email Address
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-xl py-3 border bg-slate-50 transition-colors focus:bg-white"
                                    placeholder="Email address"
                                />
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                                Phone Number
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-xl py-3 border bg-slate-50 transition-colors focus:bg-white"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                Password
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-xl py-3 border bg-slate-50 transition-colors focus:bg-white"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
