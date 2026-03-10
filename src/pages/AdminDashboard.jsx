import React from 'react';
import Sidebar from '../components/Sidebar';
import {
    Users,
    ShieldCheck,
    Activity,
    Settings,
    Bell,
    Database,
    Search,
    CheckCircle,
    AlertTriangle
} from 'lucide-react';

const AdminDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            <Sidebar role="admin" />

            <main className="flex-1 p-8">
                {/* Header */}
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">System Overview</h2>
                        <p className="text-slate-500">Manage platform users, doctors, and system health.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="bg-white p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-primary-600 transition-colors">
                            <Bell size={20} />
                        </button>
                        <div className="h-8 w-[1px] bg-slate-200"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-900">{user.name}</p>
                                <p className="text-[10px] text-slate-500 font-medium">Platform Admin</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold">
                                A
                            </div>
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                                <Users size={24} />
                            </div>
                            <span className="text-emerald-500 text-xs font-bold">+12%</span>
                        </div>
                        <p className="text-sm font-medium text-slate-500">Total Patients</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1">1,284</h3>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
                                <ShieldCheck size={24} />
                            </div>
                            <span className="text-emerald-500 text-xs font-bold">+2%</span>
                        </div>
                        <p className="text-sm font-medium text-slate-500">Active Doctors</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1">42</h3>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-amber-50 p-3 rounded-2xl text-amber-600">
                                <Activity size={24} />
                            </div>
                            <span className="text-slate-400 text-xs font-bold">Optimal</span>
                        </div>
                        <p className="text-sm font-medium text-slate-500">System Health</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1">99.9%</h3>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-purple-50 p-3 rounded-2xl text-purple-600">
                                <Database size={24} />
                            </div>
                            <span className="text-primary-500 text-xs font-bold">Encrypted</span>
                        </div>
                        <p className="text-sm font-medium text-slate-500">Data Stored</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1">4.2 GB</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Registrations */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                            <h4 className="font-bold text-slate-900">Recent Doctor Registrations</h4>
                            <button className="text-xs font-bold text-primary-600 hover:text-primary-700">View All</button>
                        </div>
                        <div className="p-4 space-y-4">
                            {[
                                { name: 'Dr. Emily Watson', specialty: 'Psychology', status: 'verified', date: '2 hours ago' },
                                { name: 'Dr. Marcus Thorne', specialty: 'Psychiatry', status: 'pending', date: '5 hours ago' },
                                { name: 'Dr. Sarah Jenkins', specialty: 'Mental Health Specialist', status: 'verified', date: '1 day ago' }
                            ].map((doc, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                            {doc.name.charAt(4)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{doc.name}</p>
                                            <p className="text-[10px] text-slate-500 font-medium">{doc.specialty}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${doc.status === 'verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                            }`}>
                                            {doc.status}
                                        </span>
                                        <p className="text-[10px] text-slate-400 mt-1">{doc.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* System Notifications/Alerts */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                        <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <ShieldCheck className="text-primary-600" size={20} />
                            System Security Log
                        </h4>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Backup completed successfully</p>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">System database backup was completed and encrypted at 12:00 AM UTC.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0"></div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">Spike in report submissions</p>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">Identified a 20% increase in patient self-assessments over the last 4 hours.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0"></div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">New security patch applied</p>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">Version 1.2.4 update deployed successfully across all client clusters.</p>
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-8 py-3 bg-slate-50 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-colors">
                            Access Full Logs
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
