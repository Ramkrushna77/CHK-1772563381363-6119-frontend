import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
    CheckCircle,
    Clock,
    XCircle,
    MessageSquare,
    Calendar,
    User as UserIcon,
    ShieldCheck,
    ArrowRight,
    Mic,
    Activity,
    FileText,
    ChevronRight,
    Download,
    BrainCircuit
} from 'lucide-react';
import apiClient from '../services/api';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000');

const PatientDashboard = () => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const fetchMyReports = async () => {
            try {
                const res = await apiClient.get('/api/reports');
                setReports(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching reports:', err);
                setLoading(false);
            }
        };
        fetchMyReports();

        if (user?.id) {
            socket.emit('join', user.id);
        }

        socket.on('reportUpdated', (updatedReport) => {
            setReports(prev => prev.map(r => r._id === updatedReport._id ? updatedReport : r));
        });

        return () => {
            socket.off('reportUpdated');
        };
    }, []);

    const pendingCount = reports.filter(r => r.status === 'pending').length;
    const verifiedCount = reports.filter(r => r.status === 'verified').length;
    const lastReport = reports[0];

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            <Sidebar role="patient" />

            <main className="flex-1 p-8 overflow-y-auto">
                {/* Welcome Header */}
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">Welcome back, {user?.name?.split(' ')[0] || 'Patient'}! 👋</h2>
                        <p className="text-slate-500 mt-2">Track your mental wellbeing and review your reports below.</p>
                    </div>
                    <div className="hidden md:flex items-center gap-4 bg-white p-2 pr-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                            <ShieldCheck size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Privacy Status</p>
                            <p className="text-sm font-bold text-slate-700">Encrypted & Secure</p>
                        </div>
                    </div>
                </header>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-violet-600 bg-violet-50">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Total Reports</p>
                            <p className="text-2xl font-bold text-slate-900">{reports.length}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-amber-600 bg-amber-50">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Pending Review</p>
                            <p className="text-2xl font-bold text-slate-900">{pendingCount}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-emerald-600 bg-emerald-50">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Doctor Verified</p>
                            <p className="text-2xl font-bold text-slate-900">{verifiedCount}</p>
                        </div>
                    </div>
                </div>

                {/* Action Banners */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Voice Assessment */}
                    <div className="bg-gradient-to-br from-purple-50 to-primary-50 rounded-2xl p-6 border border-purple-100 shadow-sm flex items-center gap-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-28 h-28 bg-purple-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-primary-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-purple-200">
                            <Mic size={26} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900">Voice Assessment</h3>
                            <p className="text-slate-500 text-sm mt-1">Express yourself with voice for AI-powered insights.</p>
                            <button
                                onClick={() => navigate('/voice-response')}
                                className="mt-3 flex items-center gap-1 text-sm font-bold text-purple-700 hover:gap-2 transition-all"
                            >
                                Start Now <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>

                    {/* AI Assistant */}
                    <div className="bg-white rounded-2xl p-6 border border-primary-100 shadow-sm flex items-center gap-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-28 h-28 bg-primary-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
                        <div className="w-16 h-16 rounded-2xl bg-primary-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-primary-100">
                            <MessageSquare size={26} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900">MindPulse AI Assistant</h3>
                            <p className="text-slate-500 text-sm mt-1">A safe 24/7 space to talk and get mental health support.</p>
                            <button
                                onClick={() => navigate('/chatbot')}
                                className="mt-3 flex items-center gap-1 text-sm font-bold text-primary-700 hover:gap-2 transition-all"
                            >
                                Open Assistant <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Grid: Reports + Profile */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Reports List */}
                    <div className="lg:col-span-2 space-y-6">
                        <h3 className="text-xl font-bold text-slate-900">Recent Analysis Reports</h3>

                        {loading ? (
                            <div className="bg-white p-12 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-slate-400">
                                <div className="w-12 h-12 border-4 border-slate-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
                                <p>Loading your reports...</p>
                            </div>
                        ) : reports.length === 0 ? (
                            <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center">
                                <BrainCircuit className="w-12 h-12 text-primary-200 mx-auto mb-4" />
                                <p className="text-slate-500 mb-4">No reports yet. Start your first assessment!</p>
                                <button
                                    onClick={() => navigate('/voice-response')}
                                    className="px-6 py-2 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-colors"
                                >
                                    Start AI Assessment
                                </button>
                            </div>
                        ) : (
                            reports.map(report => (
                                <div key={report._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">AI INSIGHT</p>
                                            <h4 className="text-xl font-extrabold text-slate-900">{report.aiPrediction}</h4>
                                        </div>
                                        {report.status === 'verified' ? (
                                            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl font-bold text-sm shadow-sm border border-emerald-100">
                                                <CheckCircle size={18} />
                                                <span>Doctor Verified</span>
                                            </div>
                                        ) : report.status === 'rejected' ? (
                                            <div className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold text-sm">
                                                <XCircle size={18} />
                                                <span>Rejected</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-2 rounded-xl font-bold text-sm">
                                                <Clock size={18} />
                                                <span>⏳ Awaiting Review</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                        <div className="bg-slate-50 p-3 rounded-2xl">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Analysis Date</p>
                                            <p className="text-sm font-bold text-slate-700">{new Date(report.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-2xl">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Status</p>
                                            <p className="text-sm font-bold text-slate-700 capitalize">{report.status}</p>
                                        </div>
                                        {report.emotionScores && (
                                            <div className="bg-slate-50 p-3 rounded-2xl">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Top Emotion</p>
                                                <p className="text-sm font-bold text-slate-700 capitalize">
                                                    {Object.entries(report.emotionScores).sort((a, b) => b[1] - a[1])[0]?.[0] || '—'}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {report.status === 'verified' && (
                                        <div className="bg-emerald-50/30 border border-emerald-100 p-5 rounded-2xl">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
                                                    <UserIcon size={16} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-emerald-600 uppercase">Doctor Recommendation</p>
                                                    <p className="text-sm font-bold text-slate-900">{report.verifiedBy?.name || 'Your Doctor'}</p>
                                                </div>
                                                <div className="ml-auto text-xs text-slate-400 font-medium">
                                                    {new Date(report.verifiedAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-700 italic bg-white p-4 rounded-xl shadow-sm leading-relaxed">
                                                {`"${report.doctorComment}"`}
                                            </p>
                                        </div>
                                    )}

                                    {report.status === 'rejected' && report.doctorComment && (
                                        <div className="bg-red-50/30 border border-red-100 p-5 rounded-2xl">
                                            <p className="text-[10px] font-bold text-red-500 uppercase mb-2">Doctor Feedback</p>
                                            <p className="text-sm text-slate-700 italic bg-white p-4 rounded-xl shadow-sm leading-relaxed">
                                                {`"${report.doctorComment}"`}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Right Sidebar: Profile + Quick Links */}
                    <div className="space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6">
                            <h4 className="font-extrabold text-slate-900 mb-4 flex items-center gap-2">
                                <UserIcon size={18} className="text-primary-600" />
                                My Profile
                            </h4>
                            <ul className="space-y-3 text-sm text-slate-700">
                                <li className="flex justify-between py-2 border-b border-slate-50">
                                    <span className="text-slate-500">Name</span>
                                    <span className="font-medium">{user?.name || '—'}</span>
                                </li>
                                <li className="flex justify-between py-2 border-b border-slate-50">
                                    <span className="text-slate-500">Email</span>
                                    <span className="font-medium truncate max-w-[140px]">{user?.email || '—'}</span>
                                </li>
                                <li className="flex justify-between py-2 border-b border-slate-50">
                                    <span className="text-slate-500">Role</span>
                                    <span className="font-medium capitalize">{user?.role || 'patient'}</span>
                                </li>
                                <li className="flex justify-between py-2">
                                    <span className="text-slate-500">Reports</span>
                                    <span className="font-medium">{reports.length} total</span>
                                </li>
                            </ul>
                            <button
                                onClick={() => navigate('/profile-setup')}
                                className="mt-4 w-full py-2.5 text-sm font-bold text-primary-600 border border-primary-200 rounded-xl hover:bg-primary-50 transition-colors"
                            >
                                Edit Profile →
                            </button>
                        </div>

                        {/* Quick Insights */}
                        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                            <h4 className="font-extrabold text-slate-900 mb-4">Quick Insights</h4>
                            <div className="space-y-4">
                                <div className="flex gap-4 items-center">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase">Last Report</p>
                                        <p className="text-sm font-bold text-slate-700">
                                            {lastReport ? new Date(lastReport.createdAt).toLocaleDateString() : 'None yet'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                        <MessageSquare size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase">Verified Reports</p>
                                        <p className="text-sm font-bold text-slate-700">{verifiedCount} verified</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase">Awaiting Review</p>
                                        <p className="text-sm font-bold text-slate-700">{pendingCount} pending</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Card */}
                        <div className="bg-gradient-to-br from-primary-600 to-indigo-700 p-8 rounded-[32px] text-white shadow-xl shadow-primary-200">
                            <h4 className="text-xl font-bold mb-2">MindPulse AI</h4>
                            <p className="text-primary-100 text-sm mb-6 leading-relaxed">
                                Your personal mental health assistant is ready to help you navigate your day.
                            </p>
                            <button
                                onClick={() => navigate('/chatbot')}
                                className="w-full py-4 bg-white text-primary-700 rounded-2xl font-bold flex items-center justify-center gap-2 group transition-all hover:bg-primary-50"
                            >
                                Try AI Chatbot
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default PatientDashboard;
