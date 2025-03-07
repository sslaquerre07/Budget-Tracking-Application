package com.example.budgetGenerator.entity.budgets;

import java.sql.Date;
import java.util.List;

import com.example.budgetGenerator.entity.categories.Category;
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
@Table(name = "budget")
public abstract class Budget implements CreateString{
    //ID for the class in the DB
    @Id
    @Column(name= "budget_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long budgetId;

    //Other data members
    private String title;
    //Setting up the relationship for the DB
    @OneToMany(mappedBy = "budget")
    private List<Category> categories;
    private Date creationDate;
    //Response String to be put in here later

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
