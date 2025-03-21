import { Link, Outlet } from "react-router-dom";
import ImageFiller from 'react-image-filler';
import "./rootLayout.css";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function RootLayout() {
    return (
        <div className="RootLayout">
            <header>
                <Link to="/" className="logo">
                    {/* Change when we have a logo */}
                    <img src="/images/logo.webp" alt="AutoBudget Logo" />

                    <span>AutoBudget</span>
                </Link>
                <div className="profile">
                    <Link to="/login">  {/* Changed from sign-in to login */}
                        <AccountCircleIcon />
                    </Link>
                </div>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default RootLayout;