package com.example.budgetGenerator.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.budgetGenerator.entity.budgets.Budget;
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
}  
