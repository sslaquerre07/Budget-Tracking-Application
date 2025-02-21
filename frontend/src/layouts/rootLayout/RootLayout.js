import { Link, Outlet } from "react-router-dom";
import ImageFiller from 'react-image-filler';
import "./rootLayout.css"

function RootLayout() {
    return (
        <div className="RootLayout">
            <header>
                <Link to="/" className="logo">
                    {/* Change when we have a logo */}
                    <ImageFiller />
                    <span>AutoBudget</span>
                </Link>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default RootLayout;