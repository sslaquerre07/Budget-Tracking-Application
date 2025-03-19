import { Link } from "react-router-dom";
import "./signUpPage.css";
import { useRef, useState } from "react";

function SignUpPage() {
    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const [error, setError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordValid, setPasswordValid] = useState(true);
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const validatePassword = (password) => {
        if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters long.");
            setPasswordValid(false);
        } else {
            setPasswordError("");
            setPasswordValid(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setConfirmPasswordError("");

        const password = passwordRef.current.value;
        const confirmPassword = confirmPasswordRef.current.value;

        if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match.");
            return;
        }

        const userData = {
            firstName: firstNameRef.current.value,
            lastName: lastNameRef.current.value,
            email: emailRef.current.value,
            password: password,
        };

        validatePassword(userData.password);
        if (!passwordValid) return; // Prevent submission if password is invalid

        try {
            const response = await fetch(`${process.env.REACT_APP_BUDGETS_API}/user/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                console.log("User signed up:", userData);
                alert("Signup successful! Redirecting to login...");
                window.location.href = "/login";
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Signup failed. Try again.");
            }
        } catch (error) {
            setError("Server error. Please try again later.");
        }
    };

    return (
        <div className="signUpPage">
            <div className="signUpPage-container">
                <h1>Sign Up</h1>
                {error && <p className="error-message">{error}</p>}
                <form className="signUpPage-form" onSubmit={handleSubmit}>
                    <input type="text" name="firstName" placeholder="First Name" ref={firstNameRef} required />
                    <input type="text" name="lastName" placeholder="Last Name" ref={lastNameRef} required />
                    <input type="email" name="email" placeholder="Email" ref={emailRef} required />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        ref={passwordRef} 
                        onChange={(e) => validatePassword(e.target.value)}
                        className={!passwordValid ? "invalid-input" : ""}
                        required 
                    />
                    {passwordError && <p className="error-message">{passwordError}</p>}
                    <input 
                        type="password" 
                        name="confirmPassword" 
                        placeholder="Confirm Password" 
                        ref={confirmPasswordRef} 
                        required 
                    />
                    {confirmPasswordError && <p className="error-message">{confirmPasswordError}</p>}
                    <button type="submit">Sign Up</button>
                </form>
                <p className="signUpPage-link">
                    Already have an account? <Link to="/login">Log In</Link>
                </p>
            </div>
        </div>
    );
}

export default SignUpPage;
