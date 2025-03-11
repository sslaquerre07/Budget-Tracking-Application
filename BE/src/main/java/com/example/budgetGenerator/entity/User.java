package com.example.budgetGenerator.entity;

import java.util.List;

import com.example.budgetGenerator.entity.budgets.Budget;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "user") 
@NoArgsConstructor
@AllArgsConstructor
public class User {
    //Private variables
    @Id
    @Column(name= "email")
    private String email;
    private String password;

    //Setting up the relationship for the DB
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Budget> budgets;

    //Default CTOR
    public User(String email, String password){
        this.email = email;
        this.password = password;
    }
}
