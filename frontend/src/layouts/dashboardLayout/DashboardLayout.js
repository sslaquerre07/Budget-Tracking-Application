import { Outlet } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import './dashboardLayout.css';
import ChatList from '../../components/chatList/ChatList';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation } from 'react-router-dom';

function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // Toggle sidebar open/closed
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // Close sidebar when clicking overlay
    const handleOverlayClick = () => {
        setSidebarOpen(false);
    };

    // Close sidebar on route change
    useEffect(() => {
        setSidebarOpen(false);
    }, [location.pathname]);

    // Close sidebar when screen size becomes larger than mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="dashboard-container">
            {/* Mobile sidebar toggle button */}
            <button className="sidebar-toggle" onClick={toggleSidebar}>
                <MenuIcon />
            </button>

            {/* Overlay for mobile */}
            <div
                className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
                onClick={handleOverlayClick}
            ></div>

            <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : ''}`}>
                <ChatList />
            </div>
            <div className="dashboard-content">
                <Outlet />
            </div>
        </div>
    );
}

export default DashboardLayout;