import React, {useState} from 'react'
import {ExpenseForm} from './ExpenseForm'
import {v4 as uuidv4} from 'uuid';
import { EditExpenseForm } from './EditExpenseForm';
import { Expense } from './Expense';
uuidv4();

export const ExpenseWrapper =() => {
    const [expenses, setExpenses] = useState([]);

    const addExpense = (expense, money) => {
        setExpenses([...expenses, {id:uuidv4(), xpense:expense, 
            isEditing:false, mney: money}]);
        console.log(expenses); // should be an array
    }

    const deleteExpense = id => {
        setExpenses(expenses.filter(expense => expense.id !== id))
    }

    const editExpense = id => {
        setExpenses(expenses.map(expense => expense.id === id ? {
            ...expense, isEditing: !expense.isEditing} : expense))
    }



    const editXpense = (xpense, mney, id) => {
        setExpenses(expenses.map(expense => expense.id === id ? {
            ...expense, xpense, mney, isEditing: !expense.isEditing,
        } : expense)) 
    }
    return(
        <div className='ExpenseWrapper'>
            <h2>Expenses</h2>
            <ExpenseForm addExpense={addExpense} />

            {expenses.map((expense, index) => (
                expense.isEditing ? (<EditExpenseForm
                                        editExpense={editXpense}
                                        xpense={expense}
                                    />)
                :
                (<Expense
                    xpense = {expense}
                    key ={index}
                    deleteExpense={deleteExpense}
                    editExpense={editExpense}
                />)
            ))}
        </div>
    )
}