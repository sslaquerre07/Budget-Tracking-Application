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

    public Optional<User> getUser(String email){
        return userRepository.findById(email);
    }
}
