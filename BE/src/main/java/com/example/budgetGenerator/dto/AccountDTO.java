package com.example.budgetGenerator.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountDTO {
    //Data members
    private String title;
    private Double amount;
}
