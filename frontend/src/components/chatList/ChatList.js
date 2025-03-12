import { Link } from 'react-router-dom';
import './chatList.css';
import { useQuery } from '@tanstack/react-query';

function ChatList() {
    const apiUrl = process.env.REACT_APP_BUDGETS_API;
    // const apiUrl = "http://localhost:8080"

    const { isPending, error, data } = useQuery({
        queryKey: ['budgets'],
        queryFn: () =>
            fetch(`${apiUrl}/user/budgets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: "jane.smith@example.com", // !TEST
                }),
            }).then((res) => res.json()),
    });


    const budgets = data?.response || [];

    return (
        <div className="ChatList">
            <span className="title">DASHBOARD</span>
            <Link to="/dashboard">Create a New Budget</Link>
            <hr />
            <span className="title">RECENT BUDGETS</span>
            <div className="list">
                {isPending
                    ? "Loading..."
                    : error
                        ? "Something went wrong!"
                        : budgets.map((budget) => (
                            <Link to={`/dashboard/budgets/${budget.budgetId}`} key={budget.budgetId}>
                                {budget.budgetTitle}
                            </Link>
                        ))}
            </div>
        </div>
    );
}

export default ChatList;