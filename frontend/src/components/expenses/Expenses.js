import React, { useState, forwardRef, useImperativeHandle } from 'react';
import './expenses.css';

const Expenses = forwardRef((props, ref) => {
    const [expenses, setExpenses] = useState([]);
    const [expenseType, setExpenseType] = useState('');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [editingId, setEditingId] = useState(null);

    const handleAddExpense = () => {
        if (expenseType.trim() === '' || expenseAmount.trim() === '') return;

        if (editingId !== null) {
            const updatedExpenses = expenses.map(expense =>
                expense.id === editingId ?
                    { ...expense, type: expenseType, amount: expenseAmount } :
                    expense
            );
            setExpenses(updatedExpenses);
            setEditingId(null);
        } else {
            const newExpense = {
                id: Date.now(),
                type: expenseType,
                amount: expenseAmount
            };
            setExpenses([...expenses, newExpense]);
        }

        setExpenseType('');
        setExpenseAmount('');
    };

    const handleEdit = (expense) => {
        setExpenseType(expense.type);
        setExpenseAmount(expense.amount);
        setEditingId(expense.id);
    };

    const handleDelete = (id) => {
        const filteredExpenses = expenses.filter(expense => expense.id !== id);
        setExpenses(filteredExpenses);
    };

    // Method to programmatically set expenses from parent component
    const setExpensesData = (expensesData) => {
        const formattedExpenses = expensesData.map(expense => ({
            id: Date.now() + Math.random(),  // Generate unique IDs
            ...expense
        }));
        setExpenses(formattedExpenses);
    };

    useImperativeHandle(ref, () => ({
        getExpenseData: () => expenses.map(({ id, ...rest }) => rest),
        setExpenses: setExpensesData
    }));

    return (
        <div className="Expenses">
            <h1>Expenses</h1>

            <div className="expense-form">
                <input
                    type="text"
                    placeholder="Expense Type"
                    value={expenseType}
                    onChange={(e) => setExpenseType(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Amount ($)"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                />
                <button onClick={handleAddExpense}>
                    {editingId !== null ? 'Update Expense' : 'Add Expense'}
                </button>
                {editingId !== null && (
                    <button onClick={() => {
                        setExpenseType('');
                        setExpenseAmount('');
                        setEditingId(null);
                    }}>
                        Cancel
                    </button>
                )}
            </div>

            <div className="expense-list">
                {expenses.map(expense => (
                    <div key={expense.id} className="expense-item">
                        <div className="expense-details">
                            <span className="expense-type">{expense.type}</span>
                            <span className="expense-amount">${expense.amount}</span>
                        </div>
                        <div className="expense-actions">
                            <button onClick={() => handleEdit(expense)}>Edit</button>
                            <button onClick={() => handleDelete(expense.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default Expenses;