import React, { useRef } from 'react';
import BudgetType from "../../components/budgetType/BudgetType";
import Expenses from "../../components/expenses/Expenses";
import Income from "../../components/income/Income";
import "./dashboard.css";
import Paper from '@mui/material/Paper';
import FinancialNotes from '../../components/financialGoals/FinancialNotes';
import { Link } from "react-router-dom";


function Dashboard() {
    const budgetTypeRef = useRef();
    const incomeRef = useRef();
    const expensesRef = useRef();
    const financialNotesRef = useRef();

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