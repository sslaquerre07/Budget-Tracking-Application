import { Link, useNavigate } from 'react-router-dom';
import './chatList.css'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'

function ChatList() {
    const navigate = useNavigate();

    return (
        <div className="ChatList">
            <span className='title'>DASHBOARD</span>
            <Link to="/dashboard">Create a New Budget</Link>
            <hr />
            <span className='title'>RECENT BUDGETS</span>
            <div className="list">
                <Link to="/">My Budget title</Link>
                <Link to="/">My Budget title</Link>
                <Link to="/">My Budget title</Link>
                <Link to="/">My Budget title</Link>
                <Link to="/">My Budget title</Link>
                <Link to="/">My Budget title</Link>
            </div>
            <hr />
            <div className="profile">
                <SignedOut>
                    <button onClick={() => navigate('/sign-in')}>
                        Sign In
                    </button>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </div>
    );
}

export default ChatList; 