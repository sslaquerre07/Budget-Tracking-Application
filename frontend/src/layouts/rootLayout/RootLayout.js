import { Link, Outlet } from "react-router-dom";
import ImageFiller from 'react-image-filler';
import "./rootLayout.css"
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useEffect } from "react";

function RootLayout() {
    const { isLoaded, isSignedIn, user } = useUser();

    useEffect(() => {
        if (isLoaded && isSignedIn) {
            console.log("User ID:", user.id);
            console.log("User Email:", user.primaryEmailAddress?.emailAddress)

            fetch('http://localhost:8080/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    email: user.primaryEmailAddress?.emailAddress,
                })
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Success:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    }, [isLoaded, isSignedIn, user]);

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