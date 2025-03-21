import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./LoginPage.css";

function LoginPage() {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const loginPageRef = useRef(null);

    // Add visibility animation effect similar to home page
    useEffect(() => {
        const timer = setTimeout(() => {
            if (loginPageRef.current) {
                loginPageRef.current.classList.add("visible");
            }
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    // Redirect logged-in users to Dashboard immediately
    useEffect(() => {
        const userToken = localStorage.getItem("userToken");
        if (userToken) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        const userData = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_BUDGETS_API || 'http://localhost:8080'}/user/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                const data = await response.json();

                // Store user authentication details
                localStorage.setItem("userToken", data.token);
                localStorage.setItem("userEmail", userData.email);
                localStorage.setItem("userRole", "authenticated");

                window.dispatchEvent(new Event('loginStatusChanged'));


                navigate("/dashboard"); // Redirect logged-in user to Dashboard
            } else {
                const errorData = await response.json();
                setError(errorData.response || "Invalid credentials, please try again.");
            }
        } catch (error) {
            setError("Server error. Please try again later.");
        }
    };

    // Guest Access: Allow users to try the app but NOT see saved budgets
    const handleGuestAccess = () => {
        // Store "guest" role in localStorage
        localStorage.setItem("userRole", "guest");
        navigate("/dashboard"); // Redirect guest to a limited dashboard
    };

    // Sign Out function
    const handleSignOut = () => {
        localStorage.clear();
        navigate("/");
    };

    return (
        <div className="loginPage" ref={loginPageRef}>
            <div className="loginPage-container">
                <h1>Welcome Back</h1>
                {error && <p className="error-message">{error}</p>}
                <form className="loginPage-form" onSubmit={handleLogin}>
                    <input type="email" name="email" placeholder="Email" ref={emailRef} required />
                    <input type="password" name="password" placeholder="Password" ref={passwordRef} required />
                    <button type="submit">Log In</button>
                </form>

                <p className="forgot-password">
                    <Link to="/settings">Forgot Password?</Link>
                </p>

                <button className="guest-access-button" onClick={handleGuestAccess}>
                    Continue as a guest
                </button>

                <p className="loginPage-link">
                    Don't have an account? <Link to="/sign-up">Sign Up</Link>
                </p>

                {localStorage.getItem("userToken") && (
                    <button className="signout-button" onClick={handleSignOut}>
                        Sign Out
                    </button>
                )}
            </div>
        </div>
    );
}

export default LoginPage;