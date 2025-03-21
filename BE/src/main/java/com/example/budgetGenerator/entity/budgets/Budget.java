package com.example.budgetGenerator.entity.budgets;

import java.sql.Date;
import java.util.List;

import com.example.budgetGenerator.entity.User;
import com.example.budgetGenerator.entity.categories.Category;
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
@Table(name = "budget")
//Following annotations used for Inheritance purposes
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "budget_type", discriminatorType = DiscriminatorType.STRING)
public abstract class Budget implements CreateString{
    //ID for the class in the DB
    @Id
    @Column(name= "budget_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long budgetId;

    //Other data members
    private String title;
    //Setting up the relationship for the DB
    @OneToMany(mappedBy = "budget", cascade = CascadeType.ALL)
    private List<Category> categories;
    private Date creationDate;
    //Additional data member to map the reference in the DB, not needed for any other purpose
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_email")
    @JsonIgnore
    private User user;

    //CTOR
    public Budget(String title, List<Category> categories){
        this.title = title;
        this.categories = categories;
        this.creationDate = new Date(System.currentTimeMillis());
    }

    //Other public methods
    public String categorySummaryString(){
        String finalStr = "";
        for(Category category: this.categories){
            finalStr = finalStr + category.createPromptString();
        }
        return finalStr;
    }
}
