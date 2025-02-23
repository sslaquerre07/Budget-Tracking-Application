package com.example.budgetGenerator.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.budgetGenerator.dto.BasicUserDTO;
import com.example.budgetGenerator.entity.User;
import com.example.budgetGenerator.service.UserService;

@CrossOrigin(origins = "*")

@RestController
@RequestMapping("/user")
public class UserController {
    //All necesary services
    @Autowired
    private UserService userService;

    //Verifying a user login and returning the privilege level
    @PostMapping  ("/login")
    public ResponseEntity<?> verifyLogin(@RequestBody BasicUserDTO loginDetails) {
        try{
            Optional<User> potentialUser = userService.getUser(loginDetails.getEmail());
            //If the username is incorrect, throw a bad username/password exception
            if(!potentialUser.isPresent()){
                throw new Exception("Bad Username/Password, please try again");
            }
            //If password is incorrect, also throw a bad username/password exception
            else if(!potentialUser.get().getPassword().equals(loginDetails.getPassword())){
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

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody BasicUserDTO registerDetails){
        try{
            Optional<User> potentialUser = userService.getUser(registerDetails.getEmail());
            //If user already exists, notify the user
            if(potentialUser.isPresent()){
                throw new Exception("Email already has an account registered, please pick another email");
            }

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
}
