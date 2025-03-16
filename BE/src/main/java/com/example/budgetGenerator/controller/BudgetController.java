package com.example.budgetGenerator.controller;

import java.util.HashMap;
import java.util.Map;
import com.example.budgetGenerator.service.LLMService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.budgetGenerator.dto.budget.BasicBudgetDTO;
import com.example.budgetGenerator.dto.budget.BudgetDTO;
import com.example.budgetGenerator.entity.budgets.Budget;
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
    private LLMService LLMService;
    @Autowired
    private BudgetService budgetService;

    BudgetController(LLMService LLMService) {
        this.LLMService = LLMService;
    }

    /*ALL GET REQUESTS */
    @GetMapping("/{budgetId}")
    public ResponseEntity<?> getBudget(@PathVariable Long budgetId) {
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

    //Retrieve a response for a budget (for guest users)
    @PostMapping("/save")
    public ResponseEntity<?> generateResponse(@RequestBody BudgetDTO budgetDTO){
        try {
            //Generating the new budget
            Budget budget = BudgetService.generateBudget(budgetDTO);
            //Return the response
            return ResponseEntity.status(HttpStatus.OK).body(Map.ofEntries(
                Map.entry("response", LLMService.generateBudget(budget))
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.ofEntries(
                Map.entry("response", e.getMessage())
            ));
        }
    }

    //Update a budget's title and creation date
    @PostMapping("/updateBasics")
    public ResponseEntity<?> updateEssentialInfo(@RequestBody BasicBudgetDTO updateInfo){
        try {
            //Ensure that the budget exists first
            budgetService.getById(updateInfo.getBudgetId());
            //Now update the database
            budgetService.updateBudget(updateInfo.getBudgetId(), updateInfo.getBudgetTitle(), updateInfo.getCreationDate());
            //Saving the entity to the DB
            return ResponseEntity.status(HttpStatus.OK).body(Map.ofEntries(
                Map.entry("response", "Budget updated successfully")
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.ofEntries(
                Map.entry("response", e.getMessage())
            ));
        }
    }

    //Update a budget's title and creation date
    @PostMapping("/update/{budgetId}")
    public ResponseEntity<?> updateBudgetContent(@RequestBody BudgetDTO updateInfo, @PathVariable Long budgetId){
        try {
            //Ensure that the budget exists first, and create new budget
            budgetService.getById(budgetId);
            Budget updatedBudget = BudgetService.generateBudget(updateInfo);
            updatedBudget.setBudgetId(budgetId);
            //Now update the database
            budgetService.saveNewBudget(updatedBudget);
            //Saving the entity to the DB
            return ResponseEntity.status(HttpStatus.OK).body(Map.ofEntries(
                Map.entry("response", "Budget updated successfully")
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.ofEntries(
                Map.entry("response", e.getMessage())
            ));
        }
    }

    //Delete a budget based on its id
    @DeleteMapping("/{budgetId}")
    public ResponseEntity<?> deleteBudget(@PathVariable Long budgetId) {
        try{
            //Prior to deleting the budget check for its prescence
            budgetService.getById(budgetId);
            //Now that it is present, can be deleted
            budgetService.deleteBudget(budgetId);
            return ResponseEntity.status(HttpStatus.OK).body(new HashMap<String, String>(Map.ofEntries(
                Map.entry("response", "Budget Successfully removed")
            )));
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

}
