package com.example.budgetGenerator.entity.categories;

import java.util.List;

import com.example.budgetGenerator.entity.accounts.Account;

public class IncomeCategory extends Category{
    //Ctor
    public IncomeCategory(List<Account> accounts, String title){
        super(accounts, title);
    }

    //Other public methods
    @Override
    public String createPromptString(){
        return String.format("%s: \nType: Income\n%s", this.getTitle(), this.accountSummaryString());
    }
}
