import { Expense } from "../../components/chatList/budgetComponents/Expense";
import { ExpenseWrapper } from "../../components/chatList/budgetComponents/ExpenseWrapper";
import { FinancialGoalWrapper } from "../../components/chatList/budgetComponents/FinancialGoalWrapper";
import { IncomeWrapper } from "../../components/chatList/budgetComponents/IncomeWrapper";
import "./budget.css"

function Budget() {
    return (
        <div className="Budget">
            <div className="wrapper">
                <div className="box">
                    <span>here</span>
                    <IncomeWrapper />
                    <ExpenseWrapper />
                    <FinancialGoalWrapper />
                </div>
            </div>
        </div>
    );
}

export default Budget;