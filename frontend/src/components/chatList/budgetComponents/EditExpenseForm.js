import React, {useState} from 'react'
import './Expense.css';


export const EditExpenseForm = ({editExpense, xpense}) => {
    const [value, setValue] = useState(xpense.xpense)
    const [money, setMoney] = useState("");

    const handleSubmit = e => {
        e.preventDefault();
        editExpense(value, money, xpense.id);
        setValue("");
    }
    return(
        <form
            className='ExpenseForm'
            onSubmit={handleSubmit}>
            <div class="input-container">
            <input
                type='text'
                className='expense-input'
                value={value}
                placeholder='Update Expense'
                onChange={(e) => setValue(e.target.value)}
                />

            <input
                type='text'
                className='expense-input'
                value={money}
                placeholder='Update Allocated Budget'
                onChange={(e) => setMoney(e.target.value)}
                />
            </div>
                <button type='submit' className='expense-btn'>
                    Update Expense
                </button>

            </form>
    )
}