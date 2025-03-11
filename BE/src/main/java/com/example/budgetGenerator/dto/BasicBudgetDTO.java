package com.example.budgetGenerator.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BasicBudgetDTO {
    private Long budgetId;
    private String budgetTitle;
    private Date creationDate;
}
