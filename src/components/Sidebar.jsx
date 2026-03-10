import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    CheckSquare,
    BarChart3,
    LogOut,
    User,
    ShieldCheck,
    BrainCircuit
} from 'lucide-react';

const Sidebar = ({ role }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const navItems = {
        doctor: [
            { name: 'Reports Overview', path: '/doctor-dashboard', icon: LayoutDashboard },
            { name: 'MindPulse AI', path: '/chatbot', icon: BrainCircuit },
        ],
        patient: [
            { name: 'Dashboard', path: '/patient-dashboard', icon: LayoutDashboard },
            { name: 'MindPulse AI', path: '/chatbot', icon: BrainCircuit },
            { name: 'Voice Assessment', path: '/voice-response', icon: FileText },
            { name: 'Profile Setup', path: '/profile-setup', icon: User },
        ],
        admin: [
            { name: 'Admin Dashboard', path: '/admin-dashboard', icon: ShieldCheck },
            { name: 'System Settings', path: '/admin-settings', icon: LayoutDashboard },
        ]
    };

    const currentItems = navItems[role] || [];

    return (
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
            <div className="p-6 flex items-center gap-3">
                <div className="bg-primary-600 p-2 rounded-xl text-white">
                    <BrainCircuit size={24} />
                </div>
                <div>
                    <h1 className="font-bold text-slate-900 leading-tight">MindPulse</h1>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">{role} Portal</p>
                </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1">
                {currentItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                ? 'bg-primary-50 text-primary-700 font-medium'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`
                        }
                    >
                        <item.icon size={20} />
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
