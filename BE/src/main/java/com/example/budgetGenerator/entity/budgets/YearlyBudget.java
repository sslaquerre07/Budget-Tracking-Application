package com.example.budgetGenerator.entity.budgets;

import java.util.List;

import com.example.budgetGenerator.entity.categories.Category;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("YEARLY")
@NoArgsConstructor
public class YearlyBudget extends Budget{
    //CTOR
    public YearlyBudget(String title, List<Category> categories){
        super(title, categories);
    }

    //Other public methods
    @Override
    public String createPromptString(){
        return String.format(
                "Hello, please generate a yearly budget based on the following: \n %s", 
                this.categorySummaryString());
    }
}
