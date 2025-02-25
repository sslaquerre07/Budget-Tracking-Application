import React from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPenToSquare} from '@fortawesome/free-solid-svg-icons'
import {faTrash} from '@fortawesome/free-solid-svg-icons'

export const Expense = ({xpense, deleteExpense, editExpense}) => {
    return(
        <div className='Expense'>
            <p>
                {xpense.xpense}
            </p>
            <p >
                ${xpense.mney}
            </p>
            <div>
                <FontAwesomeIcon icon={faPenToSquare} 
                    onClick={() => editExpense(xpense.id)}/>
                <FontAwesomeIcon icon={faTrash} 
                    onClick={() => deleteExpense(xpense.id)}/>
            </div>
        </div>
    )
}