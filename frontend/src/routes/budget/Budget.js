import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Dashboard from '../dashboard/Dashboard';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

function Budget() {
    const { id } = useParams();
    const [budgetData, setBudgetData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBudget = async () => {
            try {
                setLoading(true);
                setError(null);

                const budgetId = id;

                const response = await fetch(`http://localhost:8080/budget/${budgetId}`);

                if (!response.ok) {
                    throw new Error(`Error fetching budget: ${response.statusText}`);
                }

                const data = await response.json();
                setBudgetData(data);
            } catch (err) {
                console.error("Error fetching budget data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBudget();
    }, [id]);

    if (loading) {
        return (
            <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container" style={{ padding: '20px' }}>
                <Alert severity="error">
                    Failed to load budget data: {error}
                </Alert>
            </div>
        );
    }

    if (!budgetData) {
        return (
            <div className="error-container" style={{ padding: '20px' }}>
                <Alert severity="warning">
                    No budget data found.
                </Alert>
            </div>
        );
    }

    return (
        <div className="budget-page">
            <Dashboard budgetData={budgetData} />
        </div>
    );
}

export default Budget;