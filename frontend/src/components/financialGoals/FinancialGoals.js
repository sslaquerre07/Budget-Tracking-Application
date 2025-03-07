import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import './financialGoals.css';

const FinancialGoals = forwardRef((props, ref) => {
    const [goals, setGoals] = useState([]);
    const [newGoal, setNewGoal] = useState('');
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [newGoal]);

    const handleAddGoal = () => {
        if (newGoal.trim() === '') return;

        const goal = {
            id: Date.now(),
            text: newGoal
        };

        setGoals([...goals, goal]);
        setNewGoal('');
    };

    const handleDeleteGoal = (id) => {
        const updatedGoals = goals.filter(goal => goal.id !== id);
        setGoals(updatedGoals);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAddGoal();
        }
    };

    useImperativeHandle(ref, () => ({
        getFinancialGoalsData: () => goals.map(({ id, ...rest }) => rest)
    }));

    return (
        <div className="FinancialGoals">
            <h1>Financial Goals</h1>

            <div className="goals-input">
                <textarea
                    ref={textareaRef}
                    placeholder="Enter your financial goal..."
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    onKeyDown={handleKeyPress}
                    rows="1"
                />
                <button onClick={handleAddGoal}>Add Goal</button>
            </div>

            {goals.length > 0 && (
                <div className="goals-list">
                    {goals.map(goal => (
                        <div key={goal.id} className="goal-item">
                            <div className="goal-content">
                                <span className="goal-text">{goal.text}</span>
                            </div>
                            <button
                                className="delete-goal"
                                onClick={() => handleDeleteGoal(goal.id)}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {goals.length === 0 && (
                <p className="no-goals">
                    No financial goals added yet. Add some goals to track your financial journey!
                </p>
            )}
        </div>
    );
});

export default FinancialGoals;
