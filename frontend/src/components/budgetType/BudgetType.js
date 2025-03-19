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

    // Method to programmatically set budget type
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

                <div
                    className={`option ${selectedType === "yearly" ? "selected" : "unselected"}`}
                    onClick={() => handleLabelClick("yearly")}
                >
                    <input
                        type="radio"
                        id="yearly"
                        name="budgetType"
                        value="yearly"
                        checked={selectedType === "yearly"}
                        onChange={handleTypeChange}
                    />
                    <label htmlFor="yearly">Yearly</label>
                </div>

                <div
                    className={`option ${selectedType === "custom" ? "selected" : "unselected"}`}
                    onClick={() => handleLabelClick("custom")}
                >
                    <input
                        type="radio"
                        id="custom"
                        name="budgetType"
                        value="custom"
                        checked={selectedType === "custom"}
                        onChange={handleTypeChange}
                    />
                    <label htmlFor="custom">Custom</label>

                    {selectedType === "custom" && (
                        <div className="custom-inputs" onClick={(e) => e.stopPropagation()}>
                            <input
                                type="number"
                                min="1"
                                value={customValue}
                                onChange={handleCustomValueChange}
                            />
                            <select
                                value={customUnit}
                                onChange={handleCustomUnitChange}
                            >
                                <option value="days">Days</option>
                                <option value="weeks">Weeks</option>
                                <option value="months">Months</option>
                                <option value="years">Years</option>
                            </select>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

export default BudgetType;