import { Link } from "react-router-dom";
import "./signUpPage.css";
import { useRef } from "react";

function SignUpPage() {
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const userData = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };

        console.log("User Signed Up:", userData);
        // Add sign-up logic (API call, authentication, etc.)
    };

    return (
        <div className="signUpPage">
            <div className="signUpPage-container">
                <h1>Sign Up</h1>
                <form className="signUpPage-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        ref={nameRef}
                        required
                    />
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
