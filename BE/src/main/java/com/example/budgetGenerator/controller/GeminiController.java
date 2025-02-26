package com.example.budgetGenerator.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.vertexai.gemini.VertexAiGeminiChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.budgetGenerator.dto.AccountDTO;
import com.example.budgetGenerator.dto.BudgetDTO;
import com.example.budgetGenerator.dto.CategoryDTO;

import org.springframework.web.bind.annotation.RequestBody;


@CrossOrigin(origins = "*")

@RestController
@RequestMapping("/chat")
public class GeminiController {
    @Autowired
    private VertexAiGeminiChatModel chatModel;

    @GetMapping("/test")
    public ResponseEntity<?> testChatBot(){
        try{
            Prompt prompt = new Prompt("Hey Gemini, tell me a knock knock joke.");
            String response = this.chatModel.call(prompt).getResult().getOutput().getText();
            //If no issues, return a notice of successful registration
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

    //Generation of the budget
    @PostMapping("/generate")
    public ResponseEntity<?> generateBudget(@RequestBody BudgetDTO budget){
        try{
            //Rough implementation for now, entity classes for budget, revenue and expense classes to be generated later
            String budgetType = "";

            //Eventually will be put into the budget function
            switch (budget.getBudgetType()) {
                case 1:
                    budgetType = "Monthly"; 
                    break;
                case 2:
                    budgetType = "Annual"; 
                    break;
                case 3:
                    budgetType = "5-Year"; 
                    break;
                default:
                    budgetType = "Monthly";
                    break;
            }

            //Eventually will all be called with a budget.toString function
            String revenueString = "Revenue: \n";
            String expenseString = "Expenses: \n";
            for(CategoryDTO category : budget.getCategories()){
                //Eventually a category.toString function
                String categoryString = String.format("%s: \n", category.getCategoryTitle());
                for(AccountDTO account : category.getItems()){
                    //Eventually an account.toString function
                    categoryString = categoryString + String.format("- %s: %f \n", account.getTitle(), account.getAmount());
                }
                if(category.isExpense()){
                    expenseString = expenseString + categoryString;
                }
                else{
                    revenueString = revenueString + categoryString;
                }
            }

            String prompt = String.format(
                "Hello, please generate a %s budget based on the following: \n %s \n %s", 
                budgetType, revenueString, expenseString);
            
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
