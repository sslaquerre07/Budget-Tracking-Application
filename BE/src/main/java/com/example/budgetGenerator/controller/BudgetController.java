package com.example.budgetGenerator.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.budgetGenerator.entity.budgets.Budget;
import com.example.budgetGenerator.service.BudgetService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


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
    
}
