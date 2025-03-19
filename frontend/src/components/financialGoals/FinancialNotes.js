import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import './financialNotes.css';

const FinancialNotes = forwardRef((props, ref) => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [newNote]);

    const handleAddNote = () => {
        if (newNote.trim() === '') return;

        const note = {
            id: Date.now(),
            text: newNote
        };

        setNotes([...notes, note]);
        setNewNote('');
    };

    const handleDeleteNote = (id) => {
        const updatedNotes = notes.filter(note => note.id !== id);
        setNotes(updatedNotes);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAddNote();
        }
    };

    // Method to programmatically set notes from parent component
    const setNotesData = (notesData) => {
        const formattedNotes = notesData.map(note => ({
            id: Date.now() + Math.random(),  // Generate unique IDs
            ...note
        }));
        setNotes(formattedNotes);
    };

    useImperativeHandle(ref, () => ({
        getFinancialNotesData: () => notes.map(({ id, ...rest }) => rest),
        setNotes: setNotesData
    }));

    return (
        <div className="FinancialNotes">
            <h1>Budget Notes</h1>

            <div className="notes-input">
                <textarea
                    ref={textareaRef}
                    placeholder="Add a personal note about your budget..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyDown={handleKeyPress}
                    rows="1"
                />
                <button onClick={handleAddNote}>Add Note</button>
            </div>

            {notes.length > 0 && (
                <div className="notes-list">
                    {notes.map(note => (
                        <div key={note.id} className="note-item">
                            <div className="note-content">
                                <span className="note-text">{note.text}</span>
                            </div>
                            <button
                                className="delete-note"
                                onClick={() => handleDeleteNote(note.id)}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {notes.length === 0 && (
                <p className="no-notes">
                    No budget notes added yet. Add notes to personalize your budget!
                </p>
            )}
        </div>
    );
});

export default FinancialNotes;