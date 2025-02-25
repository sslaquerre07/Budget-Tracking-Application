import React, {useState} from 'react'
import './Financial.css';
export const FinancialGoalWrapper = () => {
    const [goal, setGoal] = useState("");

    const handleSubmit = e => {
        console.log(goal);
    }
    return (
        <div className='FinancialWrapper'>
            <h2>Financial Goals</h2>
            <textarea
            className="financial-textarea"
            value={goal}
            placeholder=""
            onChange={(e) => setGoal(e.target.value)}
            />
            <button
                type='submit' 
                className='financial-btn'>
                Generate Budget
            </button>
        </div>
    )
}