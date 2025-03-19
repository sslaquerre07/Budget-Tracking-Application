import React, { useRef, useEffect, useState } from 'react';
import BudgetType from "../../components/budgetType/BudgetType";
import Expenses from "../../components/expenses/Expenses";
import Income from "../../components/income/Income";
import "./dashboard.css";
import Paper from '@mui/material/Paper';
import FinancialNotes from '../../components/financialGoals/FinancialNotes';

function Dashboard({ budgetData }) {
    const budgetTypeRef = useRef();
    const incomeRef = useRef();
    const expensesRef = useRef();
    const financialNotesRef = useRef();
    const [activeTab, setActiveTab] = useState('form');
    const [llmResponse, setLlmResponse] = useState('');
    const [hasLlmResponse, setHasLlmResponse] = useState(false);

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
            const { response, categories } = budgetData.response;

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
        const budgetData = budgetTypeRef.current.getBudgetData();
        const incomeData = incomeRef.current.getIncomeData();
        const expensesData = expensesRef.current.getExpenseData();
        const financialNotesData = financialNotesRef.current.getFinancialNotesData();

        const requestData = {
            budget: budgetData,
            income: incomeData,
            expenses: expensesData,
            financialNotes: financialNotesData
        };

        console.log(JSON.stringify(requestData));

        // fetch('/api/submit', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(requestData)
        // }).then(response => response.json())
        //   .then(data => console.log("Server response:", data));
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
            financialNotes: financialNotesData
        };

        fetch('http://localhost:8080/budget/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        })
            .then(response => response.json())
            .then(data => console.log("Budget saved:", data))
            .catch(error => console.error("Error saving budget:", error));
    };

    return (
        <div className="Dashboard">
            <div className="dashboard-tabs">
                <button
                    className={`tab-button ${activeTab === 'form' ? 'active' : ''}`}
                    onClick={() => setActiveTab('form')}
                >
                    Enter Info
                </button>
                <button
                    className={`tab-button ${activeTab === 'response' ? 'active' : ''}`}
                    onClick={() => setActiveTab('response')}
                    disabled={!hasLlmResponse}
                >
                    LLM Budget Response
                </button>
            </div>

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
                    <div className="response-content">
                        {llmResponse}
                    </div>
                </Paper>
                
            )}
        </div>
    );
}
export default Dashboard;