package com.example.budgetGenerator.entity.categories;

import java.util.List;

import com.example.budgetGenerator.entity.accounts.Account;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("EXPENSE")
@NoArgsConstructor
public class ExpenseCategory extends Category{
    //Ctor
    public ExpenseCategory(List<Account> accounts, String title){
        super(accounts, title);
    }

    //Other public methods
    @Override
    public String createPromptString(){
        return String.format("%s: \nType: Expense\n%s", this.getTitle(), this.accountSummaryString());
    }
}
