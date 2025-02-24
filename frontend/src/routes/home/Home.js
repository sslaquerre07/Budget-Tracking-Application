import { Link } from "react-router-dom";
import "./home.css";
import { ExpenseWrapper } from "../../components/chatList/budgetComponents/ExpenseWrapper";

function Home() {
    return (
        <div className="Home">
            <div className="left">
                <h1>AutoBudget</h1>
                <h2>Create your budget here!</h2>
                <h3>description?</h3>
                <Link to="/dashboard">Get Started</Link>
            </div>
        </div>
    );
}

export default Home;