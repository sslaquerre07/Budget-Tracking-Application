package com.example.budgetGenerator.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.budgetGenerator.dto.BudgetDTO;
import com.example.budgetGenerator.entity.accounts.Account;
import com.example.budgetGenerator.entity.budgets.Budget;
import com.example.budgetGenerator.entity.categories.Category;
import com.example.budgetGenerator.service.BudgetService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@CrossOrigin(origins = "*")

@RestController
@RequestMapping("/budget")
public class BudgetController {
    @Autowired
    private BudgetService budgetService;

    /*ALL GET REQUESTS */
    @GetMapping("/{budgetId}")
    public ResponseEntity<?> getMethodName(@PathVariable Long budgetId) {
        try{
            return ResponseEntity.status(HttpStatus.OK).body(new HashMap<String, Budget>(Map.ofEntries(
                Map.entry("response", budgetService.getById(budgetId))
            )));
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    /*ALL POST REQUESTS */
    @PostMapping("/save")
    public ResponseEntity<?> saveNewBudget(@RequestBody BudgetDTO newBudgetDTO){
        try {
            //Generating the new budget
            Budget newBudget = BudgetService.generateBudget(newBudgetDTO);
            //Manually assigning back references since Spring cannot
            for(Category category: newBudget.getCategories()){
                for(Account account: category.getAccounts()){
                    account.setCategory(category);
                }
                category.setBudget(newBudget);
            }
            //Saving the entity to the DB
            return ResponseEntity.status(HttpStatus.OK).body(Map.ofEntries(
                Map.entry("response", budgetService.saveNewBudget(newBudget))
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.ofEntries(
                Map.entry("response", e.getMessage())
            ));
        }
    }
}
