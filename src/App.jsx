import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import AssessmentPage from './pages/AssessmentPage';
import ReportPage from './pages/ReportPage';
import DoctorSuggestionPage from './pages/DoctorSuggestionPage';
import ChatbotPage from './pages/ChatbotPage';
import VoiceResponsePage from './pages/VoiceResponsePage';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

import { Navigate } from 'react-router-dom';

function App() {
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

    const DashboardRedirect = () => {
        if (!user) return <Navigate to="/login" replace />;
        if (user.role === 'doctor') return <Navigate to="/doctor-dashboard" replace />;
        if (user.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
        return <Navigate to="/patient-dashboard" replace />;
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/profile-setup" element={<ProfileSetupPage />} />
                <Route path="/assessment" element={<AssessmentPage />} />
                <Route path="/dashboard" element={<DashboardRedirect />} />
                <Route path="/report" element={<ReportPage />} />
                <Route path="/doctors" element={<DoctorSuggestionPage />} />
                <Route path="/chatbot" element={<ChatbotPage />} />
                <Route path="/voice-response" element={<VoiceResponsePage />} />
                <Route
                    path="/doctor-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['doctor']}>
                            <DoctorDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/patient-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['patient']}>
                            <PatientDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin-dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
