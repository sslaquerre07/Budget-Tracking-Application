package com.example.budgetGenerator.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.budgetGenerator.service.AccountService;

@CrossOrigin(origins = "*")

@RestController
@RequestMapping("/account")
public class AccountController {
    @Autowired
    private AccountService accountService;
}
