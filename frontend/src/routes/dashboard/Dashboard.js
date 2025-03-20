import React, { useRef, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import BudgetType from "../../components/budgetType/BudgetType";
import Expenses from "../../components/expenses/Expenses";
import Income from "../../components/income/Income";
import "./dashboard.css";
import Paper from '@mui/material/Paper';
import FinancialNotes from '../../components/financialGoals/FinancialNotes';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

function Dashboard({ budgetData }) {
    const budgetTypeRef = useRef();
    const incomeRef = useRef();
    const expensesRef = useRef();
    const financialNotesRef = useRef();
    const [activeTab, setActiveTab] = useState('form');
    const [llmResponse, setLlmResponse] = useState('');
    const [hasLlmResponse, setHasLlmResponse] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Get user authentication state
    const userToken = localStorage.getItem("userToken");
    const userEmail = localStorage.getItem("userEmail");
    const isGuest = !userToken;

    const [budgetId, setBudgetId] = useState(budgetData?.response?.budgetId || null);
    const [title, setTitle] = useState(budgetData?.response?.title || 'New Budget Title');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editTitle, setEditTitle] = useState('');

    // Fetch budgets - Only logged-in users should retrieve their own budgets
    const { data: budgetsList } = useQuery({
        queryKey: ['budgets', userEmail],  // Query key depends on user email
        queryFn: () =>
            fetch(`${process.env.REACT_APP_BUDGETS_API || 'http://localhost:8080'}/user/budgets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail }),
            }).then(res => res.json()),
        enabled: !!userEmail, // Only run this query if the user is logged in
    });

    useEffect(() => {
        if (budgetId && budgetsList?.response) {
            const currentBudget = budgetsList.response.find(b => b.budgetId === budgetId);
            if (currentBudget && currentBudget.budgetTitle) {
                setTitle(currentBudget.budgetTitle);
            }
        }
    }, [budgetsList, budgetId]);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userEmail");
        navigate("/login");
    };

    const handleGenerateBudget = () => {
        setIsGenerating(true);

        const budgetData = budgetTypeRef.current.getBudgetData();
        const incomeData = incomeRef.current.getIncomeData();
        const expensesData = expensesRef.current.getExpenseData();

        const budgetDTO = {
            budgetType:
                budgetData.selectedType === "weekly" ? 0 :
                    budgetData.selectedType === "monthly" ? 1 :
                        budgetData.selectedType === "yearly" ? 2 : 1,
            budgetTitle: title,
            categories: []
        };

        const saveBudgetUrl = isGuest
            ? 'http://localhost:8080/budget/generate' // Guests don't save budgets
            : 'http://localhost:8080/budget/save';

        fetch(saveBudgetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(budgetDTO)
        })
            .then(response => response.json())
            .then(generateData => {
                setIsGenerating(false);

                if (generateData.response) {
                    setLlmResponse(generateData.response);
                    setHasLlmResponse(true);
                    setActiveTab('response');

                    if (!isGuest) {
                        // If user is logged in, update state with the new budget
                        queryClient.invalidateQueries({ queryKey: ['budgets', userEmail] });
                    } else {
                        alert("As a guest, you can't save your budget history. Sign up to access saved budgets.");
                    }
                }
            })
            .catch(error => {
                console.error("Error in budget operation:", error);
                setIsGenerating(false);
            });
    };

    return (
        <div className="Dashboard">
            <Paper elevation={3}>
                <div className="dashboard-tabs">
                    <button
                        className={`tab-button ${activeTab === 'form' ? 'active' : ''}`}
                        onClick={() => setActiveTab('form')}
                    >
                        Enter Info
                    </button>

                    <h1 className="budget-title">{title}</h1>

                    <button
                        className={`tab-button ${activeTab === 'response' ? 'active' : ''}`}
                        onClick={() => setActiveTab('response')}
                        disabled={!hasLlmResponse}
                    >
                        LLM Budget Response
                    </button>

                    {!isGuest && (
                        <button className="logout-button" onClick={handleLogout}>
                            Logout
                        </button>
                    )}
                </div>
            </Paper>

            <div className="dashboard-content">
                {activeTab === 'form' && (
                    <>
                        <Paper elevation={3}>
                            <BudgetType ref={budgetTypeRef} />
                        </Paper>
                        <Paper elevation={3}>
                            <Income ref={incomeRef} />
                        </Paper>
                        <Paper elevation={3}>
                            <Expenses ref={expensesRef} />
                        </Paper>
                        <Paper elevation={3}>
                            <FinancialNotes ref={financialNotesRef} />
                        </Paper>
                        <div className="action-buttons">
                            <button type="button" onClick={handleGenerateBudget} disabled={isGenerating}>
                                {isGenerating ? 'Generating...' : 'Generate Budget'}
                            </button>
                        </div>
                    </>
                )}

                {activeTab === 'response' && (
                    <Paper elevation={3} className="llm-response">
                        <h2>Budget Analysis</h2>
                        <div className="response-content markdown-content">
                            {llmResponse ? (
                                <ReactMarkdown>{llmResponse}</ReactMarkdown>
                            ) : (
                                <p>No budget analysis available yet. Please generate a budget first.</p>
                            )}
                        </div>
                    </Paper>
                )}
            </div>

            {isGenerating && (
                <div className="loading-overlay">
                    <div className="loading-spinner">Generating your budget...</div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;
