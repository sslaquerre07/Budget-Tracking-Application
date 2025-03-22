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
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.budgetGenerator.dto.budget.BasicBudgetDTO;
import com.example.budgetGenerator.dto.budget.UserBudgetDTO;
import com.example.budgetGenerator.dto.user.BasicUserDTO;
import com.example.budgetGenerator.entity.User;
import com.example.budgetGenerator.entity.budgets.Budget;
import com.example.budgetGenerator.service.BudgetService;
import com.example.budgetGenerator.service.LLMService;
import com.example.budgetGenerator.service.MailService;
import com.example.budgetGenerator.service.UserService;

@CrossOrigin(origins = "*")

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private LLMService LLMService;
    //All necesary services
    @Autowired
    private UserService userService;
    @Autowired
    private BudgetService budgetService;
    @Autowired
    private MailService mailService;

    //Verifying a user login and returning the privilege level
    @PostMapping  ("/login")
    public ResponseEntity<?> verifyLogin(@RequestBody BasicUserDTO loginDetails) {
        try{
            User user = userService.getUser(loginDetails.getEmail());
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
            userService.checkPresent(registerDetails.getEmail());

            //Save the new user
            userService.saveUser(new User(registerDetails.getEmail(), registerDetails.getPassword()));

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
            userService.getUser(request.get("email"));
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

    //Generate a budget response, associate it to a user, and potentially email it to them
    @PostMapping("/generate")
    public ResponseEntity<?> generateBudget(@RequestBody UserBudgetDTO userBudgetDTO){
        try {
            //Initialize needed objects
            Budget newBudget = BudgetService.generateBudget(userBudgetDTO.getBudgetDTO());
            User user = userService.getUser(userBudgetDTO.getUserEmail());
            String response = LLMService.generateBudget(newBudget);
            //Save budget to the database
            newBudget.setUser(user);
            budgetService.saveNewBudget(newBudget);
            //Potentially email the response to the user
            if(userBudgetDTO.isToBeEmailed()){
                mailService.sendBudgetReceipt(user.getEmail(), response);
            }
            
            // Create a Map with the response and ID
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("response", response);
            responseData.put("id", newBudget.getBudgetId());
            
            //Return the AI response to the user
            return ResponseEntity.status(HttpStatus.OK).body(Map.ofEntries(
                Map.entry("response", responseData)
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.ofEntries(
                Map.entry("response", e.getMessage())
            ));
        }
    }

    //Send an email receipt of the budget to the user
    @PostMapping("/emailReceipt")
    public ResponseEntity<?> sendEmailReceipt(@RequestBody Map<String, String> request){
        try {
            mailService.sendBudgetReceipt(request.get("userEmail"), request.get("response"));
            return ResponseEntity.status(HttpStatus.OK).body(Map.ofEntries(
                Map.entry("response", "Email receipt sent")
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.ofEntries(
                Map.entry("response", e.getMessage())
            ));
        }
    }

    @PostMapping("/updatePassword")
    public ResponseEntity<?> updateUserPassword(@RequestBody BasicUserDTO newUserInfo){
        try {
            User user = userService.getUser(newUserInfo.getEmail());
            //Set the new password and save the data.
            user.setPassword(newUserInfo.getPassword());
            userService.saveUser(user);
            //Notify user of success
            mailService.sendPasswordUpdate(user.getEmail());
            return ResponseEntity.status(HttpStatus.OK).body(Map.ofEntries(
                Map.entry("response", "Password successfully updated")
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.ofEntries(
                Map.entry("response", e.getMessage())
            ));
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteAccount(@RequestBody BasicUserDTO toBeDeleted){
        try{
            User user = userService.getUser(toBeDeleted.getEmail());
            userService.deleteUser(user);
            //Notify user of successful deletion
            return ResponseEntity.status(HttpStatus.OK).body(Map.ofEntries(
                Map.entry("response", "Account successfully deleted")
            ));
        }
        catch (Exception e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.ofEntries(
            Map.entry("response", e.getMessage())
        ));
    }
    }
}
