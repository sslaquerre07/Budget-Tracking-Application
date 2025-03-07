package com.example.budgetGenerator.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.ai.vertexai.gemini.VertexAiGeminiChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.budgetGenerator.dto.BudgetDTO;
import com.example.budgetGenerator.entity.budgets.Budget;
import com.example.budgetGenerator.service.BudgetService;

import org.springframework.web.bind.annotation.RequestBody;


@CrossOrigin(origins = "*")

@RestController
@RequestMapping("/chat")
public class GeminiController {
    @Autowired
    private VertexAiGeminiChatModel chatModel;

    //Generation of the budget
    @PostMapping("/generate")
    public ResponseEntity<?> generateBudget(@RequestBody BudgetDTO budgetDTO){
        try{
            //Generate budget from which prompt can be derived
            Budget budget = BudgetService.generateBudget(budgetDTO);
            String prompt = budget.createPromptString();
            
            //Call model for response
            String response = this.chatModel.call(prompt);
            
            return ResponseEntity.status(HttpStatus.OK).body(new HashMap<String, String>(Map.ofEntries(
                Map.entry("response", response)
            )));
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.ofEntries(
                Map.entry("response", e.getMessage())
            ));
        }
    }

    
}
