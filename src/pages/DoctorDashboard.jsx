import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import {
    Search,
    Filter,
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    TrendingUp,
    AlertCircle
} from 'lucide-react';
import apiClient from '../services/api';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000');

const DoctorDashboard = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);
    const [comment, setComment] = useState('');
    const [filter, setFilter] = useState('all');

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchReports();

        socket.on('reportSubmitted', (newReport) => {
            setReports(prev => [newReport, ...prev]);
        });

        return () => {
            socket.off('reportSubmitted');
        };
    }, []);

    const fetchReports = async () => {
        try {
            const res = await apiClient.get('/api/reports');
            setReports(res.data || []);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching reports:', err);
            setLoading(false);
        }
    };

    const handleVerify = async (reportId) => {
        try {
            await apiClient.post('/api/reports/verify', { reportId, comment });
            fetchReports();
            setSelectedReport(null);
            setComment('');
        } catch (err) {
            console.error('Error verifying report:', err);
        }
    };

    const handleReject = async (reportId) => {
        try {
            await apiClient.post('/api/reports/reject', { reportId, comment });
            fetchReports();
            setSelectedReport(null);
            setComment('');
        } catch (err) {
            console.error('Error rejecting report:', err);
        }
    };

    const filteredReports = reports.filter(r => filter === 'all' || r.status === filter);

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            <Sidebar role="doctor" />

            <main className="flex-1 p-8">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Patient Reports</h2>
                        <p className="text-slate-500">Review and verify AI-generated patient assessments.</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search patients..."
                                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none w-64"
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors">
                            <Filter size={18} />
                            <span>Filters</span>
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Total Reports</p>
                            <h3 className="text-2xl font-bold text-slate-900">{reports.length}</h3>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                            <FileText size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Pending Review</p>
                            <h3 className="text-2xl font-bold text-slate-900">{reports.filter(r => r.status === 'pending').length}</h3>
                        </div>
                        <div className="bg-amber-50 p-3 rounded-xl text-amber-600">
                            <Clock size={24} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">AI Accuracy Score</p>
                            <h3 className="text-2xl font-bold text-slate-900">98.2%</h3>
                        </div>
                        <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Patient Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Report Type</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Prediction</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredReports.map((report) => (
                                <tr key={report._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                                                {report.userId?.name?.charAt(0) || 'P'}
                                            </div>
                                            <span className="font-medium text-slate-900">{report.userId?.name || 'Unknown Patient'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">Mental Health Assessment</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${report.aiPrediction.toLowerCase().includes('high')
                                            ? 'bg-red-50 text-red-600'
                                            : 'bg-indigo-50 text-indigo-600'
                                            }`}>
                                            {report.aiPrediction}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-sm">
                                        {new Date(report.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`flex items-center gap-1.5 text-xs font-semibold ${report.status === 'verified' ? 'text-emerald-600' :
                                            report.status === 'rejected' ? 'text-red-600' : 'text-amber-600'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${report.status === 'verified' ? 'bg-emerald-600' :
                                                report.status === 'rejected' ? 'bg-red-600' : 'bg-amber-600'
                                                }`}></span>
                                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setSelectedReport(report)}
                                            className="px-3 py-1.5 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                                        >
                                            View Report
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {selectedReport && (
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="text-xl font-bold text-slate-900">Patient Analysis Report</h3>
                                <button onClick={() => setSelectedReport(null)} className="text-slate-400 hover:text-slate-600">
                                    <XCircle size={24} />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto flex-1 bg-white">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    <div className="bg-primary-50/50 p-6 rounded-2xl border border-primary-100">
                                        <h4 className="text-sm font-bold text-primary-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <CheckCircle size={18} />
                                            AI Diagnosis Summary
                                        </h4>
                                        <p className="text-2xl font-bold text-primary-800 mb-2">{selectedReport.aiPrediction}</p>
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-primary-100">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs font-semibold text-slate-600">CONFIDENCE SCORE</span>
                                                <span className="text-xs font-bold text-primary-600">92%</span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                <div className="bg-primary-600 h-full w-[92%]"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Emotional Analysis</h4>
                                        <div className="space-y-3">
                                            {Object.entries(selectedReport.emotionScores).map(([emotion, score]) => (
                                                <div key={emotion}>
                                                    <div className="flex justify-between text-xs font-medium mb-1">
                                                        <span className="text-slate-600 capitalize">{emotion}</span>
                                                        <span className="text-slate-900">{score}%</span>
                                                    </div>
                                                    <div className="w-full bg-slate-100 h-1.5 rounded-full">
                                                        <div className="bg-blue-500 h-full rounded-full" style={{ width: `${score}%` }}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <AlertCircle size={18} />
                                        Doctor Verification Panel
                                    </h4>
                                    <label className="block text-xs font-semibold text-slate-500 mb-2">DOCTOR RECOMMENDATION</label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Add clinical observations and recommended next steps..."
                                        className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none h-32 mb-6"
                                    ></textarea>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => handleVerify(selectedReport._id)}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                                        >
                                            <CheckCircle size={20} />
                                            Verify Report
                                        </button>
                                        <button
                                            onClick={() => handleReject(selectedReport._id)}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                                        >
                                            <XCircle size={20} />
                                            Reject Report
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default DoctorDashboard;
