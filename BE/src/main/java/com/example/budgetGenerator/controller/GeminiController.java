package com.example.budgetGenerator.controller;

import java.util.Map;

import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.vertexai.gemini.VertexAiGeminiChatModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.cloud.vertexai.VertexAI;

@CrossOrigin(origins = "*")

@RestController
@RequestMapping("/chat")
public class GeminiController {
    @Autowired
    private VertexAiGeminiChatModel chatModel;

    @GetMapping("/test")
    public Map testChatBot(){
        Prompt prompt = new Prompt("Hey Gemini, tell me a knock knock joke.");
        return Map.of("Response", this.chatModel.call(prompt).getResult().getOutput().getText());
    }
    
}
