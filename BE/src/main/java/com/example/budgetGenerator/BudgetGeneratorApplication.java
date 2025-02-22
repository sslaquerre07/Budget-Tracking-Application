package com.example.budgetGenerator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BudgetGeneratorApplication {

	public static void main(String[] args) {
		System.out.println("DB URL: " + System.getenv("DB_URL"));
		System.out.println("DB Username: " + System.getenv("DB_USERNAME"));
		SpringApplication.run(BudgetGeneratorApplication.class, args);
	}

}
