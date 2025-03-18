import { Link } from "react-router-dom";
import "./home.css";

function Home() {
    return (
        <div className="Home">
            <div className="left">
                <h1>AutoBudget</h1>
                <h2>Create your budget here!</h2>
                <h3>AutoBudget simplifies budgeting by organizing your income and expenses into clear categories. With AI-generated recommendations and intuitive visualizations, you get a structured, personalized budget—without the hassle of manual calculations.</h3>

                <Link to="/dashboard" className="button3">Get Started</Link>
                <Link to="/settings" className="button3">Settings</Link>

                <div className="auth-buttons">
                    <Link to="/sign-up" className="button">Sign Up</Link>
                    <Link to="/login" className="button">Login</Link>
                </div>
            </div>
        </div>
    );
}

export default Home;
