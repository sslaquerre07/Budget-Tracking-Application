package com.example.budgetGenerator.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.budgetGenerator.entity.categories.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long>{
    
}
