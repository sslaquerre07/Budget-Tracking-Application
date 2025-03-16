package com.example.budgetGenerator.dto.category;

import java.util.ArrayList;

import com.example.budgetGenerator.dto.account.AccountDTO;

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
