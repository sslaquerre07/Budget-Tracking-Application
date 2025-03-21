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

    const initialBudgetId = budgetData?.response?.budgetId;

    const [budgetId, setBudgetId] = useState(initialBudgetId || null);

    const { data: currentBudgetData } = useQuery({
        queryKey: ['budget', budgetId],
        queryFn: () =>
            fetch(`${process.env.REACT_APP_BUDGETS_API || 'http://localhost:8080'}/budget/${budgetId}`)
                .then(res => res.json()),
        enabled: !!budgetId,
    });

    const [title, setTitle] = useState(budgetData?.response?.title || 'New Budget Title');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editTitle, setEditTitle] = useState('');

    // Fetch budgets - Only logged-in users should retrieve their own budgets
    useEffect(() => {
        if (currentBudgetData?.response?.budgetTitle) {
            setTitle(currentBudgetData.response.budgetTitle);
        }
    }, [currentBudgetData]);

    useEffect(() => {
        if (budgetId) {
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
        }
    }, [budgetId, queryClient]);

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

    const [processedData, setProcessedData] = useState({
        expensesArray: [],
        incomesArray: [],
        budgetType: "weekly",
        notes: []
    });

    // Check for LLM response in the initial budgetData
    useEffect(() => {
        if (budgetData && budgetData.response) {
            const { response } = budgetData.response;

            if (response) {
                console.log("Initial LLM response found:", response);
                setLlmResponse(response);
                setHasLlmResponse(true);
            }
        }
    }, [budgetData]);

    useEffect(() => {
        if (budgetData && budgetData.response) {
            const { response, categories, title: budgetTitle, budgetId: id } = budgetData.response;

            if (budgetTitle) {
                setTitle(budgetTitle);
            }

            if (id) {
                setBudgetId(id);
            }

            const expensesArray = [];
            const incomesArray = [];

            if (categories && categories.length > 0) {
                categories.forEach(category => {
                    if (category.accounts && category.accounts.length > 0) {
                        const isIncome = category.title.toLowerCase().includes('income') ||
                            category.title.toLowerCase().includes('salary') ||
                            category.title.toLowerCase().includes('revenue') ||
                            category.title.toLowerCase().includes('earning');

                        category.accounts.forEach(account => {
                            const item = {
                                type: `${account.title}`,
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

            setProcessedData({
                expensesArray,
                incomesArray,
                budgetType: "monthly",
                notes: response ? [{ text: response }] : []
            });

            applyDataToForms(expensesArray, incomesArray, "monthly", response);
        }
    }, [budgetData]);

    const applyDataToForms = (expenses, incomes, budgetType, response) => {
        if (budgetTypeRef.current) {
            budgetTypeRef.current.setBudgetType(budgetType);
        }

        if (incomeRef.current && incomes.length > 0) {
            incomeRef.current.setIncomes(incomes);
        }

        if (expensesRef.current && expenses.length > 0) {
            expensesRef.current.setExpenses(expenses);
        }

        // if (financialNotesRef.current && response) {
        //     financialNotesRef.current.setNotes([{ text: response }]);
        // }
    };

    useEffect(() => {
        if (activeTab === 'form') {
            const { expensesArray, incomesArray, budgetType, notes } = processedData;
            const noteText = notes.length > 0 ? notes[0].text : '';
            applyDataToForms(expensesArray, incomesArray, budgetType, noteText);
        }
    }, [activeTab, processedData]);

    const handleTabChange = (tab) => {
        console.log(`Changing tab from ${activeTab} to ${tab}`);

        // If user is clicking from response to form
        if (activeTab === 'response' && tab === 'form') {
            const { expensesArray, incomesArray, budgetType, notes } = processedData;
            const noteText = notes.length > 0 ? notes[0].text : '';
            setTimeout(() => {
                applyDataToForms(expensesArray, incomesArray, budgetType, noteText);
            }, 100);
        }

        setActiveTab(tab);
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

        // Process expenses
        const expenseCategories = {};
        expensesData.forEach(expense => {
            const parts = expense.type.split(':');
            const categoryTitle = parts.length > 1 ? parts[0].trim() : "Miscellaneous Expenses";
            const itemTitle = parts.length > 1 ? parts[1].trim() : expense.type;

            if (!expenseCategories[categoryTitle]) {
                expenseCategories[categoryTitle] = [];
            }

            expenseCategories[categoryTitle].push({
                title: itemTitle,
                balance: parseFloat(expense.amount) || 0
            });
        });

        Object.keys(expenseCategories).forEach(categoryTitle => {
            budgetDTO.categories.push({
                categoryTitle: categoryTitle,
                expense: true,
                items: expenseCategories[categoryTitle]
            });
        });

        // Process income
        const incomeCategories = {};
        incomeData.forEach(income => {
            const parts = income.type.split(':');
            const categoryTitle = parts.length > 1 ? parts[0].trim() : "General Income";
            const itemTitle = parts.length > 1 ? parts[1].trim() : income.type;

            if (!incomeCategories[categoryTitle]) {
                incomeCategories[categoryTitle] = [];
            }

            incomeCategories[categoryTitle].push({
                title: itemTitle,
                balance: parseFloat(income.amount) || 0
            });
        });

        Object.keys(incomeCategories).forEach(categoryTitle => {
            budgetDTO.categories.push({
                categoryTitle: categoryTitle,
                expense: false,
                items: incomeCategories[categoryTitle]
            });
        });

        // Updated flow: 1. Generate LLM response first for all users
        if (isGuest) {
            // Guest flow: Generate directly with the budgetDTO
            generateBudgetForGuest(budgetDTO);
        } else {
            // Logged-in user flow: Generate first, then save
            const generateRequestData = {
                "userEmail": userEmail,
                "budgetDTO": budgetDTO,
                "toBeEmailed": false
            };

            generateBudgetForUser(generateRequestData);
        }

        // Function to handle budget generation for guest users
        function generateBudgetForGuest(budgetData) {
            const generateUrl = `${process.env.REACT_APP_BUDGETS_API || 'http://localhost:8080'}/budget/generate`;

            fetch(generateUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(budgetData)
            })
                .then(response => response.json())
                .then(generateData => {
                    handleLlmResponse(generateData);
                })
                .catch(error => {
                    console.error("Error generating budget:", error);
                    setIsGenerating(false);
                });
        }

        // Function to handle budget generation for logged-in users
        function generateBudgetForUser(requestData) {
            const generateUrl = `${process.env.REACT_APP_BUDGETS_API || 'http://localhost:8080'}/user/generate`;

            fetch(generateUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            })
                .then(response => response.json())
                .then(generateData => {
                    // 1. Handle the LLM response
                    handleLlmResponse(generateData);

                    // 2. Save the budget with the LLM response
                    const budgetWithResponse = {
                        ...budgetDTO,
                        response: generateData.response || ""
                    };

                    saveBudgetWithResponse(budgetWithResponse);
                })
                .catch(error => {
                    console.error("Error generating budget:", error);
                    setIsGenerating(false);
                });
        }

        // Common function to handle LLM response
        function handleLlmResponse(generateData) {
            if (generateData.response) {
                setLlmResponse(generateData.response);
                setHasLlmResponse(true);
                setActiveTab('response');
                setProcessedData(prevData => ({
                    ...prevData,
                    notes: [{ text: generateData.response }]
                }));
            }

            // Don't set isGenerating to false yet for logged-in users,
            // as we still need to save the budget
            if (isGuest) {
                setIsGenerating(false);
            }
        }

        // Function to save the budget with LLM response for logged-in users
        function saveBudgetWithResponse(budgetWithResponse) {
            const saveBudgetUrl = budgetId
                ? `${process.env.REACT_APP_BUDGETS_API || 'http://localhost:8080'}/budget/update/${budgetId}`
                : `${process.env.REACT_APP_BUDGETS_API || 'http://localhost:8080'}/budget/save`;

            fetch(saveBudgetUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(budgetWithResponse)
            })
                .then(response => response.json())
                .then(saveData => {
                    console.log("Budget saved:", saveData);
                    setIsGenerating(false);

                    // Get the budgetId from the response
                    const currentBudgetId = saveData.response?.budgetId || budgetId;

                    if (currentBudgetId) {
                        if (!budgetId) {
                            // New budget was created
                            setBudgetId(currentBudgetId);

                            // Update budgets list in cache
                            queryClient.invalidateQueries({ queryKey: ['budgets'] });
                            queryClient.setQueryData(['budgets'], (oldData) => {
                                if (!oldData) return { response: [] };

                                const newBudget = {
                                    budgetId: currentBudgetId,
                                    budgetTitle: title,
                                    creationDate: new Date().toISOString().split('T')[0],
                                    response: budgetWithResponse.response
                                };

                                return {
                                    ...oldData,
                                    response: [newBudget, ...(oldData.response || [])]
                                };
                            });

                            // 3. Redirect to the budget page
                            navigate(`/dashboard/budgets/${currentBudgetId}`);
                        }

                        // Update the cache for the specific budget
                        queryClient.setQueryData(['budget', currentBudgetId], (oldData) => {
                            if (!oldData) return { response: {} };

                            return {
                                ...oldData,
                                response: {
                                    ...oldData.response,
                                    budgetId: currentBudgetId,
                                    budgetTitle: title,
                                    categories: budgetDTO.categories,
                                    response: budgetWithResponse.response
                                }
                            };
                        });

                        queryClient.invalidateQueries({ queryKey: ['budget', currentBudgetId] });
                        // Update user's budget list
                        queryClient.invalidateQueries({ queryKey: ['budgets', userEmail] });
                    }
                })
                .catch(error => {
                    console.error("Error saving budget:", error);
                    setIsGenerating(false);
                });
        }
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

                        queryClient.setQueryData(['budgets'], (oldData) => {
                            if (!oldData) return oldData;

                            const updatedResponse = oldData.response.map(budget =>
                                budget.budgetId === budgetId
                                    ? { ...budget, budgetTitle: editTitle }
                                    : budget
                            );

                            return { ...oldData, response: updatedResponse };
                        });

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
            <Paper>
                <div className="dashboard-tabs">
                    <button
                        className={`tab-button ${activeTab === 'form' ? 'active' : ''}`}
                        onClick={() => handleTabChange('form')}
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
                        onClick={() => handleTabChange('response')}
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
                            <Income ref={incomeRef} />
                            <Expenses ref={expensesRef} />
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