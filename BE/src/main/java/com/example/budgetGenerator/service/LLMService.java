package com.example.budgetGenerator.service;

import org.springframework.ai.vertexai.gemini.VertexAiGeminiChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.budgetGenerator.entity.budgets.Budget;

@Service
public class LLMService {
    @Autowired
    private VertexAiGeminiChatModel chatModel;

    public String generateBudget(Budget budget){
        String setupPrompt = 
        "For the following budget prompt, please answer in the following format: \n" +
        "- A summary of the incomes and expenses detailed below\n" +
        "- Total income and revenue totals (including how much money is made/lost)\n"+
        "- Three potential areas for improvement or any additional information required to improve the budget\n";
        //Generate budget from which prompt can be derived
        String prompt = budget.createPromptString();
        
        //Call model for response
        return this.chatModel.call(setupPrompt + prompt);  
    }
}
