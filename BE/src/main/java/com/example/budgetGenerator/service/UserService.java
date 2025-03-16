package com.example.budgetGenerator.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.budgetGenerator.entity.User;
import com.example.budgetGenerator.repository.UserRepository;

@Service
public class UserService {
    //Autowired Repo
    @Autowired
    private UserRepository userRepository;

    public User getUser(String email, boolean checkPresent) throws Exception{
        Optional<User> potentialUser = userRepository.findById(email);
        //If user already exists, notify the user
        if(potentialUser.isPresent() != checkPresent){
            if(checkPresent)
                throw new Exception("Email does not have an account associated with it");
            else
                throw new Exception("Email already has an account registered, please pick another email");
        }
        return potentialUser.get();
    }

    public User saveUser(User newUser){
        return userRepository.save(newUser);
    }
}
