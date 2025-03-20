import { Link } from "react-router-dom";
import "./home.css";

function Home() {
    return (
        <div className="Home">
            <div className="home-container">
                {/* Navigation Bar */}
                <header className="navbar">
                <div className="logoH">
                    <span>A</span><span>u</span><span>t</span><span>o</span>
                    <span>B</span><span>u</span><span>d</span><span>g</span><span>e</span><span>t</span>
                </div>

                    <nav>
                        <ul className="nav-links">
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/sign-up">Sign Up</Link></li>
                            <li><Link to="/settings">Settings</Link></li>
                        </ul>
                    </nav>
                </header>

                {/* Hero Section */}
                <div className="hero">
                    <div className="hero-text">
                        <h1>Smart Finance 💰</h1>
                        <p>
                            Simplify your financial planning with our intuitive budgeting tool.
                            Organize your expenses, track your income, and stay in control!
                        </p>
                        <Link to="/dashboard" className="explore-button">Get Started</Link>
                    </div>

                    {/* Illustration Section */}
                    <div className="hero-image">
                        <img src="/images/test.WEBP" alt="Budget Planning" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;