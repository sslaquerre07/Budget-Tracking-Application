package com.example.budgetGenerator.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.budgetGenerator.entity.budgets.Budget;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long>{
    @Query(value = "SELECT * FROM BUDGET b WHERE b.user_email = :userEmail", nativeQuery = true)
    List<Budget> findByUserEmail(@Param("userEmail") String userEmail);
}
