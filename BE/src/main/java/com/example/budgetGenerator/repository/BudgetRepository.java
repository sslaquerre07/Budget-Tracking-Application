package com.example.budgetGenerator.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.budgetGenerator.entity.budgets.Budget;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long>{
    
}
