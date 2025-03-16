-- SQL Dump File for Budget Generator

-- -----------------------------------------------------
-- Schema Creation
-- -----------------------------------------------------
DROP DATABASE IF EXISTS budgetgeneratordatabase; --Removes the database if it already exists (to be able to start fresh)
CREATE DATABASE IF NOT EXISTS budgetgeneratordatabase; --Creates a new, empty database named budgetgeneratordatabase
USE budgetgeneratordatabase; --Tells MySQL that all further commands apply to this specific database

--Creation of the 4 tables and their columns 
-- -----------------------------------------------------
-- Table: User
-- -----------------------------------------------------
CREATE TABLE user (
    email VARCHAR(100) PRIMARY KEY,
    password VARCHAR(255) NOT NULL
)ENGINE=InnoDB;
--Stores user with email and password. Email uniquely identifies a user. 

-- -----------------------------------------------------
-- Table: Budget (User reference to be added later)
-- -----------------------------------------------------
CREATE TABLE budget (
	budget_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    creation_date DATE NOT NULL,
    budget_type VARCHAR(100) NOT NULL,
    response VARCHAR(10000),
    user_email VARCHAR(100),
    FOREIGN KEY (user_email) REFERENCES user(email) ON DELETE CASCADE
)ENGINE=InnoDB;
--Stores budget information linked to users. Each budget has a title, creation date, type (monthly, yearly), and a response (like an AI-generated suggestion)

-- -----------------------------------------------------
-- Table: Category
-- -----------------------------------------------------
CREATE TABLE category (
	category_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    budget_id BIGINT NOT NULL,
    category_type VARCHAR(100) NOT NULL,
    FOREIGN KEY (budget_id) REFERENCES budget(budget_id) ON DELETE CASCADE
)ENGINE=InnoDB;
--Each budget can have multiple categories (Groceries, Entertainment)
--Categories reference budget via budget_id

-- -----------------------------------------------------
-- Table: Category
-- -----------------------------------------------------
CREATE TABLE account (
	account_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    balance DOUBLE NOT NULL,
    category_id BIGINT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE
)ENGINE=InnoDB;
-- Tracks spending or income within each category. Each account links to a category with a balance (amount)

--Extra Note: FOREIGN KEY Constraints link tables together, ensuring relationships like: A budget belongs to a user, Categories belong to a specific budget, Accounts belong to a specific category. 
--This file creates the structure of the database