package com.example.budgetGenerator.service;

import java.sql.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.budgetGenerator.dto.BudgetDTO;
import com.example.budgetGenerator.entity.accounts.Account;
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

        //Set the ids within the embedded objects (for DB management)
        for(Category category: finalBudget.getCategories()){
            for(Account account: category.getAccounts()){
                account.setCategory(category);
            }
            category.setBudget(finalBudget);
        }

        return finalBudget;
    }

    //Save a budget to the DB
    public Budget saveNewBudget(Budget newBudget){
        return budgetRepository.save(newBudget);
    }

    //Deleting a budget from the database
    public void deleteBudget(Long budgetId){
        budgetRepository.deleteById(budgetId);
    }

    //Update the title and creation date of a particular budget
    public void updateBudget(Long budgetId, String newTitle, Date newDate){
        budgetRepository.updateBudgets(budgetId, newTitle, newDate);
    }

    //Retrieve a list of budgets corresponding to a user:
    public List<Budget> getUserBudgets(String userEmail){
        return budgetRepository.findByUserEmail(userEmail);
    }
}  
