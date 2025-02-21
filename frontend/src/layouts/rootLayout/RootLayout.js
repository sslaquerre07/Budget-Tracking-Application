import { Link, Outlet } from "react-router-dom";
import ImageFiller from 'react-image-filler';
import "./rootLayout.css"
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function RootLayout() {
    return (
        <div className="RootLayout">
            <header>
                <Link to="/" className="logo">
                    {/* Change when we have a logo */}
                    <ImageFiller />
                    <span>AutoBudget</span>
                </Link>
                <div className="profile">
                    <SignedOut>
                        <Link to="/sign-in">
                            <AccountCircleIcon />
                        </Link>
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default RootLayout;