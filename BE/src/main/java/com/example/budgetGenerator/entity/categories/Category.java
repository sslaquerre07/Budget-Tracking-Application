package com.example.budgetGenerator.entity.categories;

import java.util.List;

import com.example.budgetGenerator.entity.accounts.Account;
import com.example.budgetGenerator.entity.budgets.Budget;
import com.example.budgetGenerator.entity.interfaces.CreateString;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
//The following annotations are for inheritance purposes
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "category_type", discriminatorType = DiscriminatorType.STRING)
public abstract class Category implements CreateString{
    //Variable instances
    @Id
    @Column(name= "category_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoryId;

    //Other data members
    //Setting up the relationship for the DB
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Account> accounts;
    private String title;

    //Additional data member to map the reference in the DB, not needed for any other purpose
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "budget_id")
    @JsonIgnore
    private Budget budget;

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
