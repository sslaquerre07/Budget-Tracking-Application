import { Link } from "react-router-dom";
import { useRef } from "react";
import "./LoginPage.css"; // Make sure to create this CSS file

function LoginPage() {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const handleLogin = (e) => {
        e.preventDefault();

        const userData = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };

        console.log("User Logging In:", userData);
        // Add authentication logic here (e.g., API call)
    };

    return (
        <div className="loginPage">
            <div className="loginPage-container">
                <h1>Login</h1>
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
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
