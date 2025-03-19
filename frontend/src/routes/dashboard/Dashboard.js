import React, { useRef, useEffect } from 'react';
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

    useEffect(() => {
        // If budget data is provided, populate the form fields
        if (budgetData && budgetData.response) {
            const { response, categories } = budgetData.response;

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

            // Set expenses data
            if (expensesRef.current && expensesArray.length > 0) {
                expensesRef.current.setExpenses(expensesArray);
            }

            // Set income data
            if (incomeRef.current && incomesArray.length > 0) {
                incomeRef.current.setIncomes(incomesArray);
            }

            // Set financial notes
            if (financialNotesRef.current && response) {
                financialNotesRef.current.setNotes([{ text: response }]);
            }

            // Set budget type to monthly by default
            if (budgetTypeRef.current) {
                budgetTypeRef.current.setBudgetType("monthly");
            }
        }
    }, [budgetData]);

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

    return (
        <div className="Dashboard">
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
            <button type="submit" onClick={handleGenerateBudget}>
                Generate Budget
            </button>
        </div>
    );
}

export default Dashboard;