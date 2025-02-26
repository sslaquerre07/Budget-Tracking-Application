package com.example.budgetGenerator.dto;

import java.util.ArrayList;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO {
    private String categoryTitle;
    private ArrayList<AccountDTO> items;
    private boolean expense;
}
