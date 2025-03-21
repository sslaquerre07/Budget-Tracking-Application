import { Link, Outlet, useNavigate } from "react-router-dom";
import "./rootLayout.css";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState, useEffect } from 'react';

function RootLayout() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        checkLoginStatus();

        window.addEventListener('storage', handleStorageChange);

        window.addEventListener('loginStatusChanged', checkLoginStatus);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('loginStatusChanged', checkLoginStatus);
        };
    }, []);

    const checkLoginStatus = () => {
        const userToken = localStorage.getItem("userToken");
        setIsLoggedIn(!!userToken);
    };

    const handleStorageChange = (event) => {
        if (event.key === "userToken") {
            checkLoginStatus();
        }
    };

    return (
        <div className="RootLayout">
            <header>
                <Link to="/" className="logo">
                    <img src="/images/logo.webp" alt="AutoBudget Logo" />
                    <span>AutoBudget</span>
                </Link>
                <div className="profile">
                    {isLoggedIn ? (
                        <Link to="/settings">
                            <SettingsIcon />
                        </Link>
                    ) : (
                        <Link to="/login">
                            <AccountCircleIcon />
                        </Link>
                    )}
                </div>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default RootLayout;