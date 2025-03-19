import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import "./LoginPage.css"; 

function LoginPage() {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        const userData = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_BUDGETS_API}/user/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("User logged in:", data);
                alert("Login successful!");

                // Store the email in localStorage/sessionStorage for session management
                localStorage.setItem("userEmail", userData.email);

                // Redirect to dashboard or home page
                navigate("/dashboard");
            } else {
                const errorData = await response.json();
                setError(errorData.response || "Invalid credentials, please try again.");
            }
        } catch (error) {
            setError("Server error. Please try again later.");
        }
    };

    return (
        <div className="loginPage">
            <div className="loginPage-container">
                <h1>Login</h1>
                {error && <p className="error-message">{error}</p>}
                <form className="loginPage-form" onSubmit={handleLogin}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        ref={emailRef}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        ref={passwordRef}
                        required
                    />
                    <button type="submit">Log In</button>
                </form>
                <p className="loginPage-link">
                    Don't have an account? <Link to="/sign-up">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
