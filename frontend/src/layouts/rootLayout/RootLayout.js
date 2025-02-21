import { Link, Outlet } from "react-router-dom";
import "./rootLayout.css"

function RootLayout() {
    return (
        <div className="RootLayout">
            <header>
                <Link to="/">
                    {/* Change when we have a logo */}
                    <img
                        src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D"
                        width="0"
                        height="0"
                        alt=""
                    />

                    <span> Budget Tracker</span>
                </Link>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default RootLayout;