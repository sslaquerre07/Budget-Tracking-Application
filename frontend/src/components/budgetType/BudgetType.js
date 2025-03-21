import { useState, forwardRef, useImperativeHandle } from "react";
import "./budgetType.css";

const BudgetType = forwardRef((props, ref) => {
    const [selectedType, setSelectedType] = useState("weekly");
    const [customValue, setCustomValue] = useState(1);
    const [customUnit, setCustomUnit] = useState("weeks");

    const handleTypeChange = (e) => {
        setSelectedType(e.target.value);
    };

    const handleLabelClick = (type) => {
        setSelectedType(type);
    };

    const handleCustomValueChange = (e) => {
        const value = parseInt(e.target.value);
        if (value > 0) {
            setCustomValue(value);
        }
    };

    const handleCustomUnitChange = (e) => {
        setCustomUnit(e.target.value);
    };

    const setBudgetType = (type) => {
        setSelectedType(type);
    };

    useImperativeHandle(ref, () => ({
        getBudgetData: () => {
            const data = { selectedType };
            if (selectedType === "custom") {
                data.customValue = customValue;
                data.customUnit = customUnit;
            }
            return data;
        },
        setBudgetType
    }));

    return (
        <div className="BudgetType">
            <h1>Budget Type</h1>
            <div className="budget-options">
                <div
                    className={`option ${selectedType === "daily" ? "selected" : "unselected"}`}
                    onClick={() => handleLabelClick("yearly")}
                >
                    <input
                        type="radio"
                        id="daily"
                        name="budgetType"
                        value="daily"
                        checked={selectedType === "daily"}
                        onChange={handleTypeChange}
                    />
                    <label htmlFor="daily">Daily</label>
                </div>
                <div
                    className={`option ${selectedType === "weekly" ? "selected" : "unselected"}`}
                    onClick={() => handleLabelClick("weekly")}
                >
                    <input
                        type="radio"
                        id="weekly"
                        name="budgetType"
                        value="weekly"
                        checked={selectedType === "weekly"}
                        onChange={handleTypeChange}
                    />
                    <label htmlFor="weekly">Weekly</label>
                </div>

                <div
                    className={`option ${selectedType === "monthly" ? "selected" : "unselected"}`}
                    onClick={() => handleLabelClick("monthly")}
                >
                    <input
                        type="radio"
                        id="monthly"
                        name="budgetType"
                        value="monthly"
                        checked={selectedType === "monthly"}
                        onChange={handleTypeChange}
                    />
                    <label htmlFor="monthly">Monthly</label>
                </div>
            </div>
        </div>
    );
});

export default BudgetType;