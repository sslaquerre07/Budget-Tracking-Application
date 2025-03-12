import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import './budget.css';

function Budget() {
    const params = useParams();

    const budgetId = params.budgetId || params.id || Object.values(params)[0];

    const apiUrl = process.env.REACT_APP_BUDGETS_API;
    const [budget, setBudget] = useState(null);

    const { isPending, error, data } = useQuery({
        queryKey: ['budget', budgetId],
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

    useEffect(() => {
        if (data && data.response && budgetId) {
            const budgetIdNumber = parseInt(budgetId, 10);
            const foundBudget = data.response.find(b => b.budgetId === budgetIdNumber);
            setBudget(foundBudget);
        }
    }, [data, budgetId]);

    if (isPending) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    if (!budgetId) {
        return <div className="Budget">
            <h1>Missing Budget ID</h1>
            <p>No budget ID was found in the URL parameters.</p>
            <p>Check your route configuration in your router setup.</p>
        </div>;
    }

    if (!budget) {
        return (
            <div className="Budget">
                <h1>Budget not found</h1>
                <p>No budget found with ID: {budgetId}</p>
                <p>Please check the URL and try again.</p>
            </div>
        );
    }

    return (
        <div className="Budget">
            <h1>{budget.budgetTitle}</h1>
            <span className="creation-date">Created on: {budget.creationDate}</span>
            <div className="budget-details">
                <p>Budget ID: {budgetId}</p>
            </div>
        </div>
    );
}

export default Budget;