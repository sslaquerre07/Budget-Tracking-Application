import { SignUp } from "@clerk/clerk-react";
import "./signUpPage.css"

function SignUpPage() {
    return (
        <div className="SignUpPage">
            <SignUp path="/sign-up" signInUrl="/sign-in" />
        </div>
    );
}

export default SignUpPage;