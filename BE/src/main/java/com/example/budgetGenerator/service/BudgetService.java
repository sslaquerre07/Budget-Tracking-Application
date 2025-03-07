package com.example.budgetGenerator.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.budgetGenerator.dto.BudgetDTO;
import com.example.budgetGenerator.entity.budgets.Budget;
import com.example.budgetGenerator.entity.budgets.DailyBudget;
import com.example.budgetGenerator.entity.budgets.MonthlyBudget;
import com.example.budgetGenerator.entity.budgets.YearlyBudget;
import com.example.budgetGenerator.entity.categories.Category;
import com.example.budgetGenerator.repository.BudgetRepository;

@Service
public class BudgetService {
    @Autowired
    private BudgetRepository budgetRepository;

    // Retrieving a budget by ID:
    public Budget getById(Long budgetId) throws Exception{
        Optional<Budget> potentialBudget = budgetRepository.findById(budgetId);
        if(!potentialBudget.isPresent()){
            throw new Exception("Budget not found");
        }
        return potentialBudget.get();
    }

    //Generating a budget from with data from the post request
    public static Budget generateBudget(BudgetDTO budgetDTO){
        List<Category> categories = CategoryService.generateCategories(budgetDTO.getCategories());
        Budget finalBudget;
        switch (budgetDTO.getBudgetType()) {
            case 0:
                finalBudget = new DailyBudget(budgetDTO.getBudgetTitle(), categories);
                break;
            case 1:
                finalBudget = new MonthlyBudget(budgetDTO.getBudgetTitle(), categories);
                break;
            case 2:
                finalBudget = new YearlyBudget(budgetDTO.getBudgetTitle(), categories);
                break;
            //If something goes wrong, it will default to monthly budget (for now)
            default:
                finalBudget = new MonthlyBudget(budgetDTO.getBudgetTitle(), categories);
                break;
        }
        return finalBudget;
    }
}  
