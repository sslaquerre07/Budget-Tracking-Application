package com.example.budgetGenerator.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.budgetGenerator.dto.BasicBudgetDTO;
import com.example.budgetGenerator.dto.BasicUserDTO;
import com.example.budgetGenerator.entity.User;
import com.example.budgetGenerator.entity.budgets.Budget;
import com.example.budgetGenerator.service.BudgetService;
import com.example.budgetGenerator.service.UserService;

@CrossOrigin(origins = "*")

@RestController
@RequestMapping("/user")
public class UserController {
    //All necesary services
    @Autowired
    private UserService userService;
    @Autowired
    private BudgetService budgetService;

    //Verifying a user login and returning the privilege level
    @PostMapping  ("/login")
    public ResponseEntity<?> verifyLogin(@RequestBody BasicUserDTO loginDetails) {
        try{
            User user = userService.getUser(loginDetails.getEmail(), true);
            //If password is incorrect, also throw a bad username/password exception
            if(!user.getPassword().equals(loginDetails.getPassword())){
                throw new Exception("Bad Username/Password, please try again");
            } 
            //Finally, if both username and password match, notify user of successful login
            return ResponseEntity.status(HttpStatus.OK).body(new HashMap<String, String>(Map.ofEntries(
                Map.entry("response", "Login Successful!")
            )));
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.ofEntries(
                Map.entry("response", e.getMessage())
            ));
        }
        
    }

    //Registers a user into the system
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody BasicUserDTO registerDetails){
        try{
            //Check that the user does not exist
            userService.getUser(registerDetails.getEmail(), false);

            //Save the new user
            userService.registerUser(new User(registerDetails.getEmail(), registerDetails.getPassword()));

            //If no issues, return a notice of successful registration
            return ResponseEntity.status(HttpStatus.OK).body(new HashMap<String, String>(Map.ofEntries(
                Map.entry("response", "Registration successful")
            )));
        }
        catch(Exception e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.ofEntries(
                Map.entry("response", e.getMessage())
            ));
        }
    }

    //Return the basic info about a user's budgets
    @PostMapping("/budgets")
    public ResponseEntity<?> getUserBudget(@RequestBody Map<String, String> request){
        try {
            //First verify that the user exists
            userService.getUser(request.get("email"), true);
            //Retrieve user budgets
            List<Budget> userBudgets = budgetService.getUserBudgets(request.get("email"));
            List<BasicBudgetDTO> response = new ArrayList<>();
            //Only send critical information to the FE
            for(Budget budget: userBudgets){
                response.add(new BasicBudgetDTO(budget.getBudgetId(), budget.getTitle(), budget.getCreationDate()));
            }
            return ResponseEntity.status(HttpStatus.OK).body(new HashMap<String, List<BasicBudgetDTO>>(Map.ofEntries(
                Map.entry("response", response)
            )));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.ofEntries(
                Map.entry("response", e.getMessage())
            ));
        }
    }
}
