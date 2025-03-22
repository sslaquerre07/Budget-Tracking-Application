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
import { useNavigate, useLocation } from 'react-router-dom';

function Dashboard({ budgetData }) {
    const budgetTypeRef = useRef();
    const incomeRef = useRef();
    const expensesRef = useRef();
    const financialNotesRef = useRef();
    const [activeTab, setActiveTab] = useState('form');
    const [llmResponse, setLlmResponse] = useState('');
    const [hasLlmResponse, setHasLlmResponse] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [shouldSaveAfterGenerate, setShouldSaveAfterGenerate] = useState(false);
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();

    // Get user authentication state
    const userToken = localStorage.getItem("userToken");
    const userEmail = localStorage.getItem("userEmail");
    const isGuest = !userToken;

    const initialBudgetId = budgetData?.response?.budgetId;
    const [budgetId, setBudgetId] = useState(initialBudgetId || null);

    useEffect(() => {
        const dashboardElement = document.querySelector('.Dashboard');
        if (dashboardElement) {
            // Add a small delay for the animation to work properly
            setTimeout(() => {
                dashboardElement.classList.add('visible');
            }, 100);
        }
    }, []);

    // Check if we have an LLM response in the URL state (from navigation)
    useEffect(() => {
        if (location.state?.llmResponse) {
            setLlmResponse(location.state.llmResponse);
            setHasLlmResponse(true);
            setActiveTab('response');
        }
    }, [location.state]);

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

        // Check for LLM response in current budget data
        if (currentBudgetData?.response?.response) {
            setLlmResponse(currentBudgetData.response.response);
            setHasLlmResponse(true);
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

    const handleLogout = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userEmail");
        window.dispatchEvent(new Event('loginStatusChanged'));

        navigate('/');
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
                budgetType: "weekly",
                notes: response ? [{ text: response }] : []
            });

            applyDataToForms(expensesArray, incomesArray, "weekly", response);
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
    };

    useEffect(() => {
        if (activeTab === 'form') {
            const { expensesArray, incomesArray, budgetType, notes } = processedData;
            const noteText = notes.length > 0 ? notes[0].text : '';
            applyDataToForms(expensesArray, incomesArray, budgetType, noteText);
        }
    }, [activeTab, processedData]);

    const handleTabChange = (tab) => {

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

    const handleGenerateBudget = async () => {
        setIsGenerating(true);

        // 1. Collect all required data
        const budgetData = budgetTypeRef.current.getBudgetData();
        const incomeData = incomeRef.current.getIncomeData();
        const expensesData = expensesRef.current.getExpenseData();

        // New Validation: Ensure at least one income and one expense exists
        if (incomeData.length === 0 || expensesData.length === 0) {
            alert("Please add at least one income and one expense before generating the budget.");
            setIsGenerating(false);
            return; // Stop execution if data is missing
        }

        // 2. Create the budget DTO
        const budgetDTO = {
            budgetType:
                budgetData.selectedType === "weekly" ? 0 :
                    budgetData.selectedType === "monthly" ? 1 :
                        budgetData.selectedType === "yearly" ? 2 : 1,
            budgetTitle: title,
            categories: []
        };

        // 3. Process expenses
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

        // 4. Process income
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

        try {
            // Check if current user is a guest or logged-in user
            if (!userEmail || isGuest) {
                // Guest flow: directly generate LLM response without saving/redirecting
                await handleGuestBudgetGeneration(budgetDTO);
            } else if (!budgetId) {
                // New budget flow: FIRST generate LLM response, THEN save and redirect
                await handleNewBudgetCreation(budgetDTO);
            } else {
                // Update existing budget flow: Only generate LLM response, no auto-save
                await handleExistingBudgetAnalysis(budgetDTO);
            }
        } catch (error) {
            console.error("Error in budget generation process:", error);
            setIsGenerating(false);
        }
    };

    // Guest flow - directly generate LLM response without saving/redirecting
    const handleGuestBudgetGeneration = async (budgetDTO) => {
        const generateUrl = `${process.env.REACT_APP_BUDGETS_API || 'http://localhost:8080'}/budget/generate`;

        try {
            const response = await fetch(generateUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(budgetDTO)
            });

            const generateData = await response.json();

            if (generateData.response) {
                // Update UI with LLM response
                setLlmResponse(generateData.response);
                setHasLlmResponse(true);
                setActiveTab('response');
                setProcessedData(prevData => ({
                    ...prevData,
                    notes: [{ text: generateData.response }]
                }));
            }
            setIsGenerating(false);
        } catch (error) {
            console.error("Error generating LLM response for guest:", error);
            setIsGenerating(false);
            throw error;
        }
    };

    // New budget flow - FIRST generate LLM response, THEN save and redirect
    const handleNewBudgetCreation = async (budgetDTO) => {
        try {
            // FIRST: Generate LLM response before saving or redirecting
            const response = await generateLlmResponseFirst(budgetDTO);

            const llmResponse = response.response;

            // Get the new budgetId from the response
            const newBudgetId = response.id;

            if (newBudgetId) {
                // Set the budgetId in the state
                setBudgetId(newBudgetId);

                // Update UI with the LLM response
                setLlmResponse(llmResponse);
                setHasLlmResponse(true);
                setActiveTab('response');
                setProcessedData(prevData => ({
                    ...prevData,
                    notes: [{ text: llmResponse }]
                }));

                // Update budgets list in cache
                queryClient.invalidateQueries({ queryKey: ['budgets'] });
                queryClient.setQueryData(['budgets'], (oldData) => {
                    if (!oldData) return { response: [] };

                    const newBudget = {
                        budgetId: newBudgetId,
                        budgetTitle: title,
                        creationDate: new Date().toISOString().split('T')[0],
                        response: llmResponse // Include response
                    };

                    return {
                        ...oldData,
                        response: [newBudget, ...(oldData.response || [])]
                    };
                });

                // Set specific budget data in cache
                queryClient.setQueryData(['budget', newBudgetId], () => {
                    return {
                        response: {
                            budgetId: newBudgetId,
                            budgetTitle: title,
                            categories: budgetDTO.categories,
                            response: llmResponse // Include response
                        }
                    };
                });

                // FIXED: Navigate with the LLM response in the state
                navigate(`/dashboard/budgets/${newBudgetId}`, {
                    state: { llmResponse: llmResponse }
                });
                setIsGenerating(false);
            } else {
                console.error("Error: No budgetId returned from save operation");
                setIsGenerating(false);
            }
        } catch (error) {
            console.error("Error in new budget creation flow:", error);
            setIsGenerating(false);
            throw error;
        }
    };

    // NEW METHOD: For existing budgets, just generate analysis without auto-saving
    const handleExistingBudgetAnalysis = async (budgetDTO) => {
        try {
            // Generate LLM response
            const llmResponse = await generateLlmResponseFirst(budgetDTO);

            // Update the UI with the LLM response WITHOUT saving to database
            setLlmResponse(llmResponse);
            setHasLlmResponse(true);
            setActiveTab('response');
            setProcessedData(prevData => ({
                ...prevData,
                notes: [{ text: llmResponse }]
            }));

            // Create a save button or option if user wants to save this analysis
            setShouldSaveAfterGenerate(true);

            setIsGenerating(false);
        } catch (error) {
            console.error("Error generating budget analysis:", error);
            setIsGenerating(false);
            throw error;
        }
    };

    // Separate method to save analysis if user chooses to
    const handleSaveAnalysis = async () => {
        if (!budgetId) return;

        try {
            setIsGenerating(true);

            // Collect current data
            const budgetData = budgetTypeRef.current.getBudgetData();
            const incomeData = incomeRef.current.getIncomeData();
            const expensesData = expensesRef.current.getExpenseData();

            // Create budget DTO
            const budgetDTO = {
                budgetType:
                    budgetData.selectedType === "weekly" ? 0 :
                        budgetData.selectedType === "monthly" ? 1 :
                            budgetData.selectedType === "yearly" ? 2 : 1,
                budgetTitle: title,
                categories: [],
                response: llmResponse
            };

            const updateUrl = `${process.env.REACT_APP_BUDGETS_API || 'http://localhost:8080'}/budget/update/${budgetId}`;
            const response = await fetch(updateUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(budgetDTO)
            });

            const updateData = await response.json();

            // Update caches
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
            queryClient.invalidateQueries({ queryKey: ['budget', budgetId] });

            setShouldSaveAfterGenerate(false);
            setIsGenerating(false);
        } catch (error) {
            console.error("Error saving analysis:", error);
            setIsGenerating(false);
        }
    };

    // Generate LLM response first (before saving or updating)
    const generateLlmResponseFirst = async (budgetDTO) => {
        const generateRequestData = {
            "userEmail": userEmail || "guest@example.com",
            "budgetDTO": budgetDTO,
            "toBeEmailed": false
        };

        // For logged-in users vs guests we use different endpoints
        const generateUrl = (!userEmail || isGuest)
            ? `${process.env.REACT_APP_BUDGETS_API || 'http://localhost:8080'}/budget/generate`
            : `${process.env.REACT_APP_BUDGETS_API || 'http://localhost:8080'}/user/generate`;

        try {
            const response = await fetch(generateUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(generateRequestData)
            });

            const generateData = await response.json();

            if (generateData.response) {
                return generateData.response;
            } else {
                throw new Error("No response received from LLM generation");
            }
        } catch (error) {
            console.error("Error generating LLM response:", error);
            throw error;
        }
    };

    const handleSendEmail = async () => {
        if (!userEmail || isGuest || !llmResponse) return;

        try {
            setIsSendingEmail(true);

            const emailData = {
                userEmail: userEmail,
                response: typeof llmResponse === 'object' ? JSON.stringify(llmResponse) : llmResponse
            };

            const emailUrl = `${process.env.REACT_APP_BUDGETS_API || 'http://localhost:8080'}/user/emailReceipt`;

            const response = await fetch(emailUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(emailData)
            });

            if (response.ok) {
                alert("Budget analysis has been sent to your email!");
            } else {
                const errorText = await response.text();
                console.error("Error response:", errorText);
                alert("Failed to send email. Please try again later.");
            }
        } catch (error) {
            console.error("Error sending email:", error);
            alert("An error occurred while sending the email.");
        } finally {
            setIsSendingEmail(false);
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
                    Budget Response
                </button>

                {!isGuest && (
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                )}
            </div>

            <div className="dashboard-content">
                {activeTab === 'form' && (
                    <>
                        <Paper elevation={3}>
                            <BudgetType ref={budgetTypeRef} />
                            <Income ref={incomeRef} />
                            <Expenses ref={expensesRef} />
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
                                <ReactMarkdown>
                                    {typeof llmResponse === 'object' && llmResponse.response
                                        ? llmResponse.response
                                        : (typeof llmResponse === 'string' ? llmResponse : '')}
                                </ReactMarkdown>
                            ) : (
                                <p>No budget analysis available yet. Please generate a budget first.</p>
                            )}
                        </div>

                        {/* Action buttons for the response tab */}
                        <div className="response-actions">
                            {/* Email button for logged-in users */}
                            {!isGuest && llmResponse && (
                                <div className="action-button-container">
                                    <button
                                        onClick={handleSendEmail}
                                        disabled={isSendingEmail}
                                        className="action-button email-button"
                                    >
                                        {isSendingEmail ? 'Sending...' : 'Email Me This'}
                                    </button>
                                </div>
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