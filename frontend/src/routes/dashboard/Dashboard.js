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

function Dashboard({ budgetData }) {
    const budgetTypeRef = useRef();
    const incomeRef = useRef();
    const expensesRef = useRef();
    const financialNotesRef = useRef();
    const [activeTab, setActiveTab] = useState('form');
    const [llmResponse, setLlmResponse] = useState('');
    const [hasLlmResponse, setHasLlmResponse] = useState(false);
    const queryClient = useQueryClient();

    // Extract budgetId from the provided budgetData
    const initialBudgetId = budgetData?.response?.budgetId;
    const [budgetId, setBudgetId] = useState(initialBudgetId || null);

    // Use React Query to fetch and monitor budget data
    const { data: currentBudgetData } = useQuery({
        queryKey: ['budget', budgetId],
        queryFn: () =>
            fetch(`${process.env.REACT_APP_BUDGETS_API || 'http://localhost:8080'}/budget/${budgetId}`)
                .then(res => res.json()),
        enabled: !!budgetId, // Only run query when budgetId exists
    });

    // Title editing state - now derived from React Query data when available
    const [title, setTitle] = useState(budgetData?.response?.title || 'New Budget Title');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editTitle, setEditTitle] = useState('');

    // Update title when budget data changes (including cache updates)
    useEffect(() => {
        if (currentBudgetData?.response?.budgetTitle) {
            setTitle(currentBudgetData.response.budgetTitle);
        }
    }, [currentBudgetData]);

    const { data: budgetsList } = useQuery({
        queryKey: ['budgets'],
        queryFn: () =>
            fetch(`${process.env.REACT_APP_BUDGETS_API || 'http://localhost:8080'}/user/budgets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: "jane.smith@example.com", // Replace with actual user email when ready
                }),
            }).then(res => res.json()),
        enabled: !!budgetId, // Only enable if we have a budgetId
    });

    // Update title when it changes in the budgets list
    useEffect(() => {
        if (budgetId && budgetsList?.response) {
            const currentBudget = budgetsList.response.find(b => b.budgetId === budgetId);
            if (currentBudget && currentBudget.budgetTitle) {
                setTitle(currentBudget.budgetTitle);
            }
        }
    }, [budgetsList, budgetId]);

    // Store the processed data to preserve it across tab switches
    const [processedData, setProcessedData] = useState({
        expensesArray: [],
        incomesArray: [],
        budgetType: "weekly",
        notes: []
    });

    useEffect(() => {
        // If budget data is provided, process and store it
        if (budgetData && budgetData.response) {
            const { response, categories, title: budgetTitle, budgetId: id } = budgetData.response;

            // Set budget title if available
            if (budgetTitle) {
                setTitle(budgetTitle);
            }

            // Set budget ID if available
            if (id) {
                setBudgetId(id);
            }

            // Set LLM response if available
            if (response) {
                setLlmResponse(response);
                setHasLlmResponse(true);
            }

            // Process categories into income and expenses
            const expensesArray = [];
            const incomesArray = [];

            if (categories && categories.length > 0) {
                categories.forEach(category => {
                    if (category.accounts && category.accounts.length > 0) {
                        // Check if the category looks like an income category
                        const isIncome = category.title.toLowerCase().includes('income') ||
                            category.title.toLowerCase().includes('salary') ||
                            category.title.toLowerCase().includes('revenue') ||
                            category.title.toLowerCase().includes('earning');

                        category.accounts.forEach(account => {
                            const item = {
                                type: `${category.title}: ${account.title}`,
                                amount: account.balance.toString()
                            };

                            if (isIncome) {
                                incomesArray.push(item);
                            } else {
                                expensesArray.push(item);
                            }
                        });
                    }
                });
            }

            // Save the processed data to state
            setProcessedData({
                expensesArray,
                incomesArray,
                budgetType: "monthly",
                notes: response ? [{ text: response }] : []
            });

            // Apply the data to the form components
            applyDataToForms(expensesArray, incomesArray, "monthly", response);
        }
    }, [budgetData]);

    // Function to apply data to form components
    const applyDataToForms = (expenses, incomes, budgetType, response) => {
        // Set budget type
        if (budgetTypeRef.current) {
            budgetTypeRef.current.setBudgetType(budgetType);
        }

        // Set income data
        if (incomeRef.current && incomes.length > 0) {
            incomeRef.current.setIncomes(incomes);
        }

        // Set expenses data
        if (expensesRef.current && expenses.length > 0) {
            expensesRef.current.setExpenses(expenses);
        }

        // Set financial notes
        // if (financialNotesRef.current && response) {
        //     financialNotesRef.current.setNotes([{ text: response }]);
        // }
    };

    // When switching tabs, ensure form data is preserved
    useEffect(() => {
        if (activeTab === 'form') {
            // Re-apply the data to forms when switching to the form tab
            const { expensesArray, incomesArray, budgetType, notes } = processedData;
            const noteText = notes.length > 0 ? notes[0].text : '';
            applyDataToForms(expensesArray, incomesArray, budgetType, noteText);
        }
    }, [activeTab, processedData]);

    const handleGenerateBudget = () => {
        // First save the budget to get a budgetId if it doesn't exist
        const saveRequestData = {
            budget: { selectedType: "monthly" },
            income: [],
            expenses: [],
            financialNotes: [],
            budgetTitle: title
        };

        // Save budget first to ensure we have a budgetId
        fetch('http://localhost:8080/budget/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(saveRequestData)
        })
            .then(response => response.json())
            .then(saveData => {
                console.log("Budget saved:", saveData);

                // Get the budgetId (either existing or newly created)
                const savedBudgetId = saveData.response?.budgetId || budgetId;

                // Update the budgetId state if it's a new budget
                if (savedBudgetId && !budgetId) {
                    setBudgetId(savedBudgetId);
                    // Update the cache for the budgets list
                    queryClient.invalidateQueries({ queryKey: ['budgets'] });
                }

                // Hardcoded test data exactly matching the required format
                const generateRequestData = {
                    "userEmail": "jane.smith@example.com",
                    "budgetDTO": {
                        "budgetType": 1,
                        "budgetTitle": "Monthly Budget",
                        "categories": [
                            {
                                "categoryTitle": "Groceries",
                                "expense": true,
                                "items": [
                                    {
                                        "title": "Fruits & Vegetables",
                                        "balance": 50.00
                                    },
                                    {
                                        "title": "Dairy Products",
                                        "balance": 30.00
                                    }
                                ]
                            },
                            {
                                "categoryTitle": "Entertainment",
                                "expense": true,
                                "items": [
                                    {
                                        "title": "Streaming Services",
                                        "balance": 15.99
                                    },
                                    {
                                        "title": "Concert Tickets",
                                        "balance": 100.00
                                    }
                                ]
                            },
                            {
                                "categoryTitle": "Savings",
                                "expense": false,
                                "items": [
                                    {
                                        "title": "Emergency Fund",
                                        "balance": 500.00
                                    },
                                    {
                                        "title": "Investment Account",
                                        "balance": 300.00
                                    }
                                ]
                            }
                        ]
                    },
                    "toBeEmailed": false
                };

                // Send to generate endpoint
                return fetch('http://localhost:8080/user/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(generateRequestData)
                });
            })
            .then(response => response.json())
            .then(generateData => {
                console.log("Budget generated:", generateData);

                // Update the LLM response
                if (generateData.response) {
                    setLlmResponse(generateData.response);
                    setHasLlmResponse(true);

                    // Switch to the response tab
                    setActiveTab('response');

                    // Also update the processed data to include the response
                    setProcessedData(prevData => ({
                        ...prevData,
                        notes: [{ text: generateData.response }]
                    }));

                    // Update URL to show the budget ID
                    window.history.pushState(
                        {},
                        '',
                        `/budget/${budgetId || generateData.response?.budgetId}`
                    );
                }
            })
            .catch(error => console.error("Error generating budget:", error));
    };

    const handleSaveBudget = () => {
        const budgetData = budgetTypeRef.current.getBudgetData();
        const incomeData = incomeRef.current.getIncomeData();
        const expensesData = expensesRef.current.getExpenseData();
        const financialNotesData = financialNotesRef.current.getFinancialNotesData();

        const requestData = {
            budget: budgetData,
            income: incomeData,
            expenses: expensesData,
            financialNotes: financialNotesData,
            budgetTitle: title
        };

        fetch('http://localhost:8080/budget/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        })
            .then(response => response.json())
            .then(data => {
                console.log("Budget saved:", data);
                // Update the budgetId if this is a new budget
                if (data.response && data.response.budgetId && !budgetId) {
                    setBudgetId(data.response.budgetId);

                    // Update the cache for the budgets list
                    queryClient.invalidateQueries({ queryKey: ['budgets'] });
                }
            })
            .catch(error => console.error("Error saving budget:", error));
    };

    const handleEditStart = () => {
        setIsEditingTitle(true);
        setEditTitle(title);
    };

    const handleEditSave = (e) => {
        e.preventDefault();
        if (editTitle.trim()) {
            setTitle(editTitle);
            setIsEditingTitle(false);

            // If budgetId exists, update the title on the server
            if (budgetId) {
                const payload = {
                    budgetId,
                    budgetTitle: editTitle,
                    creationDate: new Date().toISOString().split('T')[0]
                };

                fetch(`${process.env.REACT_APP_BUDGETS_API || 'http://localhost:8080'}/budget/updateBasics`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Title updated:', data);

                        // Update both caches to ensure consistency
                        // Update the specific budget cache
                        queryClient.setQueryData(['budget', budgetId], (oldData) => {
                            if (!oldData) return oldData;
                            return {
                                ...oldData,
                                response: {
                                    ...oldData.response,
                                    budgetTitle: editTitle
                                }
                            };
                        });

                        // Update the budget in the budgets list cache
                        queryClient.setQueryData(['budgets'], (oldData) => {
                            if (!oldData) return oldData;

                            const updatedResponse = oldData.response.map(budget =>
                                budget.budgetId === budgetId
                                    ? { ...budget, budgetTitle: editTitle }
                                    : budget
                            );

                            return { ...oldData, response: updatedResponse };
                        });

                        // Also invalidate queries to refresh from server
                        queryClient.invalidateQueries({ queryKey: ['budgets'] });
                        queryClient.invalidateQueries({ queryKey: ['budget', budgetId] });
                    })
                    .catch(error => console.error('Error updating title:', error));
            }
        }
    };

    const handleEditCancel = () => {
        setIsEditingTitle(false);
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

                    {isEditingTitle ? (
                        <form
                            className="edit-title-form"
                            onSubmit={handleEditSave}
                        >
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                autoFocus
                                className="title-input"
                            />
                            <button type="submit" className="icon-btn save-btn" title="Save">
                                <CheckIcon fontSize="small" />
                            </button>
                            <button
                                type="button"
                                className="icon-btn cancel-btn"
                                onClick={handleEditCancel}
                                title="Cancel"
                            >
                                <CloseIcon fontSize="small" />
                            </button>
                        </form>
                    ) : (
                        <h1 className="budget-title" onClick={handleEditStart}>
                            {title}
                            <EditIcon fontSize="small" className="edit-icon" />
                        </h1>
                    )}

                    <button
                        className={`tab-button ${activeTab === 'response' ? 'active' : ''}`}
                        onClick={() => setActiveTab('response')}
                        disabled={!hasLlmResponse}
                    >
                        LLM Budget Response
                    </button>
                </div>
            </Paper>

            {activeTab === 'form' ? (
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
                        <button type="button" onClick={handleGenerateBudget}>
                            Generate Budget
                        </button>
                        <button type="button" onClick={handleSaveBudget}>
                            Save Budget
                        </button>
                    </div>
                </>
            ) : (
                <Paper elevation={3} className="llm-response">
                    <h2>Budget Analysis</h2>
                    <div className="response-content markdown-content">
                        <ReactMarkdown>{llmResponse}</ReactMarkdown>
                    </div>
                </Paper>
            )}
        </div>
    );
}

export default Dashboard;