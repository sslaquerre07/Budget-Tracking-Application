import { Link } from 'react-router-dom';
import './chatList.css'
import ImageFiller from 'react-image-filler';

function ChatList() {
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
                {/* Add user profile here */}
                <ImageFiller />
                <span>Profile</span>
            </div>
        </div>
    );
}

export default ChatList; 