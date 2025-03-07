package com.example.budgetGenerator.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.budgetGenerator.dto.CategoryDTO;
import com.example.budgetGenerator.entity.categories.Category;
import com.example.budgetGenerator.entity.categories.ExpenseCategory;
import com.example.budgetGenerator.entity.categories.IncomeCategory;
import com.example.budgetGenerator.repository.CategoryRepository;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    public static List<Category> generateCategories(List<CategoryDTO> categoryDTOs){
        List<Category> categories = new ArrayList<>();
        //Iterate through category DTOs
        for(CategoryDTO categoryDTO: categoryDTOs){
            if(categoryDTO.isExpense()){
                categories.add(new ExpenseCategory(
                    AccountService.generateAccounts(categoryDTO.getItems()),
                    categoryDTO.getCategoryTitle()
                ));
            }
            else{
                categories.add(new IncomeCategory(
                    AccountService.generateAccounts(categoryDTO.getItems()),
                    categoryDTO.getCategoryTitle()
                ));
            }
        }
        return categories;
    }
}
