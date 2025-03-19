import { Link } from 'react-router-dom';
import { useState } from 'react';
import './chatList.css';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

function ChatList() {
    const apiUrl = process.env.REACT_APP_BUDGETS_API;
    const queryClient = useQueryClient();
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');

    const { isPending, error, data } = useQuery({
        queryKey: ['budgets'],
        queryFn: () =>
            fetch(`${apiUrl}/user/budgets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: "jane.smith@example.com", // !TEST
                }),
            }).then((res) => res.json()),
    });

    const deleteMutation = useMutation({
        mutationFn: async (budgetId) => {
            const response = await fetch(`${apiUrl}/budget/${budgetId}`, {
                method: 'DELETE'
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ budgetId, newTitle }) => {
            const payload = {
                budgetId,
                budgetTitle: newTitle,
                creationDate: new Date().toISOString().split('T')[0]
            };

            console.log('UPDATE request', JSON.stringify(payload, null, 2));

            const response = await fetch(`${apiUrl}/budget/updateBasics`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            console.log('Update Response:', data);
            return { budgetId, newTitle, data };  // Return the values we need
        },
        onSuccess: (result) => {
            // Update the cache directly for immediate reflection
            const { budgetId, newTitle } = result;

            queryClient.setQueryData(['budgets'], (oldData) => {
                if (!oldData) return oldData;

                const updatedBudgets = oldData.response.map(budget =>
                    budget.budgetId === budgetId
                        ? { ...budget, budgetTitle: newTitle }
                        : budget
                );

                return { ...oldData, response: updatedBudgets };
            });

            // Also invalidate the query to refresh from server
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
            setEditingId(null);
        }
    });


    const handleDelete = (e, budgetId) => {
        e.preventDefault();
        e.stopPropagation();
        deleteMutation.mutate(budgetId);
    };

    const handleEditStart = (e, budget) => {
        e.preventDefault();
        e.stopPropagation();
        setEditingId(budget.budgetId);
        setEditTitle(budget.budgetTitle);
    };

    const handleEditSave = (e, budgetId) => {
        e.preventDefault();
        e.stopPropagation();
        if (editTitle.trim()) {
            updateMutation.mutate({ budgetId, newTitle: editTitle });
        }
    };


    const budgets = data?.response || [];
    const sortedBudgets = [...budgets].sort((a, b) => {
        return new Date(b.creationDate) - new Date(a.creationDate);
    });

    return (
        <div className="ChatList">
            <span className="title">DASHBOARD</span>
            <Link to="/dashboard">Create a New Budget</Link>
            <hr />
            <span className="title">RECENT BUDGETS</span>
            <div className="list">
                {isPending
                    ? "Loading..."
                    : error
                        ? "Something went wrong!"
                        : sortedBudgets.map((budget) => (
                            <div className="budget-item" key={budget.budgetId}>
                                {editingId === budget.budgetId ? (
                                    <form
                                        className="edit-form"
                                        onSubmit={(e) => handleEditSave(e, budget.budgetId)}
                                    >
                                        <input
                                            type="text"
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            autoFocus
                                        />
                                        <button type="submit" className="icon-btn save-btn" title="Save">
                                            <CheckIcon fontSize="small" />
                                        </button>
                                        <button
                                            type="button"
                                            className="icon-btn cancel-btn"
                                            onClick={() => setEditingId(null)}
                                            title="Cancel"
                                        >
                                            <CloseIcon fontSize="small" />
                                        </button>
                                    </form>
                                ) : (
                                    <Link to={`/dashboard/budgets/${budget.budgetId}`}>
                                        {budget.budgetTitle}
                                        <div className="hover-controls">
                                            <button
                                                className="icon-btn edit-btn"
                                                onClick={(e) => handleEditStart(e, budget)}
                                                title="Edit"
                                            >
                                                <EditIcon fontSize="small" />
                                            </button>
                                            <button
                                                className="icon-btn delete-btn"
                                                onClick={(e) => handleDelete(e, budget.budgetId)}
                                                title="Delete"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </button>
                                        </div>
                                    </Link>
                                )}
                            </div>
                        ))}
            </div>
        </div>
    );
}

export default ChatList;