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
        //Generate budget from which prompt can be derived
        String prompt = budget.createPromptString();
        
        //Call model for response
        return this.chatModel.call(prompt);  
    }
}
