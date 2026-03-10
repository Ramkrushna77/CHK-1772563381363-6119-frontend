import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import AssessmentPage from './pages/AssessmentPage';
import DashboardPage from './pages/DashboardPage';
import ReportPage from './pages/ReportPage';
import DoctorSuggestionPage from './pages/DoctorSuggestionPage';
import ChatbotPage from './pages/ChatbotPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/profile-setup" element={<ProfileSetupPage />} />
                <Route path="/assessment" element={<AssessmentPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/report" element={<ReportPage />} />
                <Route path="/doctors" element={<DoctorSuggestionPage />} />
                <Route path="/chatbot" element={<ChatbotPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
