package com.example.budgetGenerator.dto;

import java.util.ArrayList;

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
    private ArrayList<CategoryDTO> categories;
}
