package com.example.budgetGenerator.entity.accounts;

import com.example.budgetGenerator.entity.categories.Category;
import com.example.budgetGenerator.entity.interfaces.CreateString;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "account")
public class Account implements CreateString{
    //Variable instances
    @Id
    @Column(name= "account_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountId;

    //Other instance variables
    private Double balance;
    private String title;

    //Additional data member to map DB reference, not used for any other purpose
    @ManyToOne
    @JoinColumn(name = "category_id")
    @JsonIgnore
    private Category category;

    //CTOR
    public Account(Double balance, String title){
        this.balance = balance;
        this.title = title;
    }

    @Override
    public String createPromptString(){
        return String.format("- %s: %f \n", this.getTitle(), this.getBalance());
    }
}
