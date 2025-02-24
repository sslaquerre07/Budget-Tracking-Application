import React, {useState} from 'react'

export const ExpenseForm = ({addExpense}) => {
    const [value, setValue] = useState("");
    const [money, setMoney] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = e => {

        let errors = []

        e.preventDefault();

        if(!value.trim() || !money.trim()){
            errors.push(" Both fields are required.")
        }

        if (isNaN(money) || parseFloat(money) <= 0) {
            errors.push(" Please enter a valid amount.")
        }

        if (errors.length > 0){
            setError(errors);
            return;
        }
        setError("");
        addExpense(value, money);
        setValue("");
        setMoney("");
    }
    return (
        <form 
            className='ExpenseForm'
            onSubmit={handleSubmit}>
            {error && <p className="error-message">{error}</p>} {/* ✅ Display error */}
            <div class="input-container">
                <input 
                    type='text'
                    className='expense-input'
                    value={value}
                    placeholder='What Category would you like to add?'
                    onChange={(e) => setValue(e.target.value)}
                />

                <input 
                    type='text'
                    className='expense-input'
                    value={money}
                    placeholder='How much money would you like to allocate?'
                    onChange={(e) => setMoney(e.target.value)}
                />
            </div>

            <button 
                type='submit' 
                className='expense-btn'>
            Add Expense
            </button>
        </form>
    )
}