import { SignIn } from "@clerk/clerk-react";
import "./signInPage.css"

function SignInPage() {
    return (
        <div className="SignInPage">
            <SignIn path="/sign-in" signUpUrl="/sign-up" />
        </div>
    );
}

export default SignInPage;