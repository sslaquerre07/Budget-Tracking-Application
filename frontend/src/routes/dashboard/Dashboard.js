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
    const queryClient = useQueryClient();
    const navigate = useNavigate();

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
        queryKey: ['budgets'],
        queryFn: () =>
            fetch(`${process.env.REACT_APP_BUDGETS_API || 'http://localhost:8080'}/user/budgets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: "jane.smith@example.com",
                }),
            }).then(res => res.json()),
    });  // Removed the 'enabled: !!budgetId' to always fetch budgets

    useEffect(() => {
        if (budgetId && budgetsList?.response) {
            const currentBudget = budgetsList.response.find(b => b.budgetId === budgetId);
            if (currentBudget && currentBudget.budgetTitle) {
                setTitle(currentBudget.budgetTitle);
            }
        }
    }, [budgetsList, budgetId]);

    const [processedData, setProcessedData] = useState({
        expensesArray: [],
        incomesArray: [],
        budgetType: "weekly",
        notes: []
    });

    useEffect(() => {
        if (budgetData && budgetData.response) {
            const { response, categories, title: budgetTitle, budgetId: id } = budgetData.response;

            if (budgetTitle) {
                setTitle(budgetTitle);
            }

            if (id) {
                setBudgetId(id);
            }

            if (response) {
                setLlmResponse(response);
                setHasLlmResponse(true);
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
        if (activeTab === 'form' && tab === 'response') {
            // Save form data before switching away from form
            const budgetData = budgetTypeRef.current?.getBudgetData();
            const incomeData = incomeRef.current?.getIncomeData();
            const expensesData = expensesRef.current?.getExpenseData();

            setProcessedData({
                expensesArray: expensesData || [],
                incomesArray: incomeData || [],
                budgetType: budgetData?.selectedType || "monthly",
                notes: processedData.notes
            });
        }

        setActiveTab(tab);
    };

    const handleGenerateBudget = () => {
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

        fetch('http://localhost:8080/budget/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(budgetDTO)
        })
            .then(response => response.json())
            .then(saveData => {
                console.log("Budget saved:", saveData);

                const savedBudgetId = saveData.response?.budgetId || budgetId;

                if (savedBudgetId && !budgetId) {
                    setBudgetId(savedBudgetId);

                    queryClient.invalidateQueries({ queryKey: ['budgets'] });

                    queryClient.setQueryData(['budgets'], (oldData) => {
                        if (!oldData) return { response: [] };

                        const newBudget = {
                            budgetId: savedBudgetId,
                            budgetTitle: title,
                            creationDate: new Date().toISOString().split('T')[0]
                        };

                        return {
                            ...oldData,
                            response: [newBudget, ...(oldData.response || [])]
                        };
                    });
                }

                const generateRequestData = {
                    "userEmail": "jane.smith@example.com",
                    "budgetDTO": budgetDTO,
                    "toBeEmailed": false
                };

                return fetch('http://localhost:8080/user/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(generateRequestData)
                });
            })
            .then(response => response.json())
            .then(generateData => {
                console.log("Budget generated:", generateData);

                if (generateData.response) {
                    setLlmResponse(generateData.response);
                    setHasLlmResponse(true);

                    setActiveTab('response');

                    setProcessedData(prevData => ({
                        ...prevData,
                        notes: [{ text: generateData.response }]
                    }));

                    const finalBudgetId = budgetId || generateData.response?.budgetId;

                    if (finalBudgetId) {
                        queryClient.setQueryData(['budget', finalBudgetId], (oldData) => {
                            if (!oldData) return { response: {} };

                            return {
                                ...oldData,
                                response: {
                                    ...oldData.response,
                                    budgetId: finalBudgetId,
                                    budgetTitle: title,
                                    categories: budgetDTO.categories,
                                    response: generateData.response
                                }
                            };
                        });

                        queryClient.invalidateQueries({ queryKey: ['budget', finalBudgetId] });

                        navigate(`/dashboard/budgets/${finalBudgetId}`);
                    }
                }
            })
            .catch(error => console.error("Error in budget operation:", error));
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
            <Paper elevation={3}>
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