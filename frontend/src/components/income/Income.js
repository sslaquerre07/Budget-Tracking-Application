import React, { useState, forwardRef, useImperativeHandle } from 'react';
import './income.css';

const Income = forwardRef((props, ref) => {
    const [incomes, setIncomes] = useState([]);
    const [incomeType, setIncomeType] = useState('');
    const [incomeAmount, setIncomeAmount] = useState('');
    const [editingId, setEditingId] = useState(null);

    const handleAddIncome = () => {
        if (incomeType.trim() === '' || incomeAmount.trim() === '') return;

        if (editingId !== null) {
            const updatedIncomes = incomes.map(income =>
                income.id === editingId ?
                    { ...income, type: incomeType, amount: incomeAmount } :
                    income
            );
            setIncomes(updatedIncomes);
            setEditingId(null);
        } else {
            const newIncome = {
                id: Date.now(),
                type: incomeType,
                amount: incomeAmount
            };
            setIncomes([...incomes, newIncome]);
        }

        setIncomeType('');
        setIncomeAmount('');
    };

    const handleEdit = (income) => {
        setIncomeType(income.type);
        setIncomeAmount(income.amount);
        setEditingId(income.id);
    };

    const handleDelete = (id) => {
        const filteredIncomes = incomes.filter(income => income.id !== id);
        setIncomes(filteredIncomes);
    };

    useImperativeHandle(ref, () => ({
        getIncomeData: () => incomes.map(({ id, ...rest }) => rest)
    }));


    return (
        <div className="Income">
            <h1>Income</h1>

            <div className="income-form">
                <input
                    type="text"
                    placeholder="Income Type"
                    value={incomeType}
                    onChange={(e) => setIncomeType(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Amount ($)"
                    value={incomeAmount}
                    onChange={(e) => setIncomeAmount(e.target.value)}
                />
                <button onClick={handleAddIncome}>
                    {editingId !== null ? 'Update Income' : 'Add Income'}
                </button>
                {editingId !== null && (
                    <button onClick={() => {
                        setIncomeType('');
                        setIncomeAmount('');
                        setEditingId(null);
                    }}>
                        Cancel
                    </button>
                )}
            </div>

            <div className="income-list">
                {incomes.map(income => (
                    <div key={income.id} className="income-item">
                        <div className="income-details">
                            <span className="income-type">{income.type}</span>
                            <span className="income-amount">${income.amount}</span>
                        </div>
                        <div className="income-actions">
                            <button onClick={() => handleEdit(income)}>Edit</button>
                            <button onClick={() => handleDelete(income.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default Income;
