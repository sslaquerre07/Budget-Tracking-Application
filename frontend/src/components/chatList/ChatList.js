import { Link } from 'react-router-dom';
import './chatList.css';

function ChatList() {

    return (
        <div className="ChatList">
            <span className="title">DASHBOARD</span>
            <Link to="/dashboard">Create a New Budget</Link>
            <hr />
            <span className="title">RECENT BUDGETS</span>
            <div className="list">
                <Link to="/">My Budget title</Link>
                <Link to="/">My Budget title</Link>
                <Link to="/">My Budget title</Link>
                <Link to="/">My Budget title</Link>
                <Link to="/">My Budget title</Link>
                <Link to="/">My Budget title</Link>
            </div>
        </div>
    );
}

export default ChatList;
