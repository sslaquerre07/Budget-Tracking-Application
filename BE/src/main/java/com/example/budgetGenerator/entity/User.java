package com.example.budgetGenerator.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
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
}
