import { Outlet } from 'react-router-dom';
import './dashboardLayout.css'
import ChatList from '../../components/chatList/ChatList';

function DashboardLayout() {
    return (
        <div className="DashboardLayout">
            <div className="menu">
                <ChatList />
            </div>
            <div className="content">
                <Outlet />
            </div>
        </div>
    );
}

export default DashboardLayout;