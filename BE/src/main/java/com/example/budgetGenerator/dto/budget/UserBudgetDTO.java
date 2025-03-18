package com.example.budgetGenerator.dto.budget;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserBudgetDTO {
    private String userEmail;
    private BudgetDTO budgetDTO;
    private boolean toBeEmailed;
}
