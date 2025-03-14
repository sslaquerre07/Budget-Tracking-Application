package com.example.budgetGenerator.repository;

import java.sql.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.budgetGenerator.entity.budgets.Budget;

import jakarta.transaction.Transactional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long>{
    //Retrieves budgets by the user email
    @Query(value = "SELECT * FROM budget b WHERE b.user_email = :userEmail", nativeQuery = true)
    List<Budget> findByUserEmail(@Param("userEmail") String userEmail);

    //Updates the title and creation data of a budget
    @Modifying
    @Transactional
    @Query(value = "UPDATE budget b " + 
                    "SET b.title = :budgetTitle, b.creation_date = :creationDate " +
                    "WHERE b.budget_id = :budgetId", nativeQuery = true)
    void updateBudgets(@Param("budgetId") Long budgetId, @Param("budgetTitle") String budgetTitle
    , @Param("creationDate") Date creationDate);
}
