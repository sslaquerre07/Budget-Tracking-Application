package com.example.budgetGenerator.dto.budget;

import java.util.List;

import com.example.budgetGenerator.dto.category.CategoryDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BudgetDTO {
    //Data members
    private String budgetTitle;
    private Integer budgetType;
    private List<CategoryDTO> categories;
}
