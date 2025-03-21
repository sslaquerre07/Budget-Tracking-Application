import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
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
    const location = useLocation();
    const [newItemIds, setNewItemIds] = useState(new Set());
    const [completedAnimations, setCompletedAnimations] = useState(new Set());
    const previousBudgetsRef = useRef([]);

    const userToken = localStorage.getItem("userToken");
    const userEmail = localStorage.getItem("userEmail");
    const isGuest = !userToken;

    // Query for fetching budgets
    const { isPending, error, data } = useQuery({
        queryKey: ['budgets'],
        queryFn: async () => {
            const response = await fetch(`${apiUrl || 'http://localhost:8080'}/user/budgets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userEmail,
                }),
            });
            return response.json();
        },
        // Make sure we're always getting fresh data by disabling caching
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        // This is important to ensure data stays fresh
        staleTime: 0
    });

    // Check for new items by comparing with previous data
    useEffect(() => {
        if (!data || !Array.isArray(data.response)) return; // If no data or data.response is not an array, return early

        const currentBudgets = data.response; // Ensure this is an array
        const previousBudgets = previousBudgetsRef.current;

        // If we have previous budgets to compare against
        if (previousBudgets.length > 0) {
            const previousIds = new Set(previousBudgets.map(b => b.budgetId));
            const newIds = new Set();

            // Find any new budgets
            currentBudgets.forEach(budget => {
                if (!previousIds.has(budget.budgetId)) {
                    newIds.add(budget.budgetId);
                }
            });

            // Set the new items for animation
            if (newIds.size > 0) {
                setNewItemIds(newIds);

                // After the animation completes, mark these as completed
                setTimeout(() => {
                    setCompletedAnimations(prev => {
                        const updated = new Set(prev);
                        newIds.forEach(id => updated.add(id));
                        return updated;
                    });
                }, 1500); // Match animation duration
            }
        }

        // Update our reference of previous budgets
        previousBudgetsRef.current = [...currentBudgets];
    }, [data]);

    // Mutation for deleting a budget
    const deleteMutation = useMutation({
        mutationFn: async (budgetId) => {
            const response = await fetch(`${apiUrl || 'http://localhost:8080'}/budget/${budgetId}`, {
                method: 'DELETE'
            });
            return response.json();
        },
        onSuccess: () => {
            // Invalidate and refetch the budgets query
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
        },
        onError: (error) => {
            console.error("Delete Error:", error);
        }
    });

    // Mutation for updating a budget title
    const updateMutation = useMutation({
        mutationFn: async ({ budgetId, newTitle }) => {
            const payload = {
                budgetId,
                budgetTitle: newTitle,
                creationDate: new Date().toISOString().split('T')[0]
            };

            const response = await fetch(`${apiUrl || 'http://localhost:8080'}/budget/updateBasics`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            return { budgetId, newTitle, data };
        },
        onMutate: async ({ budgetId, newTitle }) => {
            // Cancel any outgoing refetches to avoid overwriting our optimistic update
            await queryClient.cancelQueries({ queryKey: ['budgets'] });

            // Get the current data
            const previousData = queryClient.getQueryData(['budgets']);

            // Optimistically update to the new value
            if (previousData) {
                queryClient.setQueryData(['budgets'], old => {
                    // Make sure we're handling the correct data structure
                    if (!old || !old.response) return old;

                    // Create a new object with updated response array
                    return {
                        ...old,
                        response: old.response.map(budget =>
                            budget.budgetId === budgetId
                                ? { ...budget, budgetTitle: newTitle }
                                : budget
                        )
                    };
                });
            }

            // Return the previous data so we can revert if something goes wrong
            return { previousData };
        },
        onError: (err, variables, context) => {
            // If the mutation fails, use the context returned from onMutate to roll back
            if (context?.previousData) {
                queryClient.setQueryData(['budgets'], context.previousData);
            }
            console.error("Update Error:", err);
        },
        onSuccess: () => {
            // Invalidate and refetch the budgets query to ensure we have the latest data
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
            setEditingId(null); // Reset editing state
        },
    });

    // Handle delete button click
    const handleDelete = (e, budgetId) => {
        e.preventDefault();
        e.stopPropagation();
        deleteMutation.mutate(budgetId);
    };

    // Handle edit button click
    const handleEditStart = (e, budget) => {
        e.preventDefault();
        e.stopPropagation();
        setEditingId(budget.budgetId);
        setEditTitle(budget.budgetTitle);
    };

    // Handle save button click for editing
    const handleEditSave = (e, budgetId) => {
        e.preventDefault();
        e.stopPropagation();
        if (editTitle.trim()) {
            updateMutation.mutate({ budgetId, newTitle: editTitle });
        }
    };

    // Check if a budget is currently active
    const isActiveBudget = (budgetId) => {
        return location.pathname === `/dashboard/budgets/${budgetId}`;
    };

    // Check if a budget is new (should have typing animation)
    const isNewBudget = (budgetId) => {
        return newItemIds.has(budgetId);
    };

    // Check if the animation has completed for a budget
    const isAnimationComplete = (budgetId) => {
        return completedAnimations.has(budgetId);
    };

    // Get CSS classes for a budget item
    const getBudgetItemClasses = (budget) => {
        let classes = "budget-item";

        if (isActiveBudget(budget.budgetId)) {
            classes += " active-budget";
        }

        if (isNewBudget(budget.budgetId)) {
            classes += " new-item";

            if (isAnimationComplete(budget.budgetId)) {
                classes += " animation-complete";
            }
        }

        return classes;
    };

    const budgets = Array.isArray(data?.response) ? data.response : [];
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
                            <div
                                className={getBudgetItemClasses(budget)}
                                key={budget.budgetId}
                            >
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
                                        {isActiveBudget(budget.budgetId) && (
                                            <span className="active-indicator">• Current</span>
                                        )}
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