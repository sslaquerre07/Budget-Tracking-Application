package com.example.budgetGenerator.entity.budgets;

import java.util.List;

import com.example.budgetGenerator.entity.categories.Category;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.NoArgsConstructor;

@Entity 
@DiscriminatorValue("MONTHLY")
@NoArgsConstructor
public class MonthlyBudget extends Budget{
    //CTOR
    public MonthlyBudget(String title, List<Category> categories){
        super(title, categories);
    }

    //Other public methods
    @Override
    public String createPromptString(){
        return String.format(
                "Hello, please generate a monthly budget based on the following: \n %s", 
                this.categorySummaryString());
    }
}
