import React, {useState} from 'react'
import './Income.css';
export const IncomeWrapper = () => {
    const [income, setIncome] = useState("");
    const [timeUnit, setTimeUnit] = useState("hour");

    return (
        <div className='IncomeWrapper'>
            <h2>Income</h2>
            <div className='income-container'>
                <div className='income-item'>
                    <input 
                        type='text'
                        className='income-input'
                        value={income}
                        placeholder='Income'
                        onChange={(e) => setIncome(e.target.value)}
                    />
                </div>
                <div className='income-item'>
                    <label htmlFor='timeFrame'>Select Timeframe: </label>

                    <select
                        id="timeUnit"
                        className='timeUnit-select'
                        value={timeUnit}
                        onChange={(e) => setTimeUnit(e.target.value)} >
                            <option value="hour">Hour</option>
                            <option value="day">Day</option>
                            <option value="year">Year</option>
                    </select>
                </div>
            </div>
        </div>
    )
}