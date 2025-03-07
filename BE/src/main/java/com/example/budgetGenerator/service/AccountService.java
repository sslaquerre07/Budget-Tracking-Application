package com.example.budgetGenerator.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.budgetGenerator.dto.AccountDTO;
import com.example.budgetGenerator.entity.accounts.Account;
import com.example.budgetGenerator.repository.AccountRepository;

@Service
public class AccountService {
    @Autowired
    private AccountRepository accountRepository;

    // Returns a list of accounts based on DTOs provided by post request
    public static List<Account> generateAccounts(List<AccountDTO> accountDTOs){
        List<Account> accounts = new ArrayList<>();
        for(AccountDTO accountDTO : accountDTOs){
            accounts.add(new Account(accountDTO.getAmount(), accountDTO.getTitle()));
        }
        return accounts;
    }
}
