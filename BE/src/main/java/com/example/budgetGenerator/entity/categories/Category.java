package com.example.budgetGenerator.entity.categories;

import java.util.List;

import com.example.budgetGenerator.entity.accounts.Account;
import com.example.budgetGenerator.entity.interfaces.CreateString;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "category")
public abstract class Category implements CreateString{
    //Variable instances
    @Id
    @Column(name= "category_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoryId;

    //Other data members
    //Setting up the relationship for the DB
    @OneToMany(mappedBy = "category")
    private List<Account> accounts;
    private String title;

    //Ctor
    public Category(List<Account> accounts, String title){
        this.accounts = accounts;
        this.title = title;
    } 

    //Other public methods
    public void addAccount(Account newAccount){
        this.accounts.add(newAccount);
    }
    public void removeAccount(Account toBeRemoved){
        this.accounts.remove(toBeRemoved);
    }

    public String accountSummaryString(){
        String finalStr = "";
        for(Account account: this.accounts){
            finalStr = finalStr + account.createPromptString();
        }
        return finalStr;
    }

    //Just set as empty in this class, will be overriden in the other classes
    public String createPromptString(){return "";};
}
