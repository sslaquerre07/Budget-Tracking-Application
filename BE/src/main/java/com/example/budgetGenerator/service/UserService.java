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

    public User getUser(String email) throws Exception{
        Optional<User> potentialUser = userRepository.findById(email);
        //If user already exists, notify the user
        if(potentialUser.isPresent()){
            throw new Exception("Email does not have an account associated with it");
        }
        return potentialUser.get();
    }

    public void checkPresent(String email) throws Exception{
        if(userRepository.findById(email).isPresent()){
            throw new Exception("Email already has an account registered");
        }
    }

    public User saveUser(User newUser){
        return userRepository.save(newUser);
    }

    public void deleteUser(User toBeDeleted){
        userRepository.delete(toBeDeleted);
    }
}
