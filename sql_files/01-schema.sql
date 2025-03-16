-- SQL Dump File for Budget Generator

-- -----------------------------------------------------
-- Schema Creation
-- -----------------------------------------------------
DROP DATABASE IF EXISTS budgetgeneratordatabase; 
CREATE DATABASE IF NOT EXISTS budgetgeneratordatabase; 
USE budgetgeneratordatabase; 

-- -----------------------------------------------------
-- Table: User
-- -----------------------------------------------------
CREATE TABLE user (
    email VARCHAR(100) PRIMARY KEY,
    password VARCHAR(255) NOT NULL
)ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table: Budget (User reference to be added later)
-- -----------------------------------------------------
CREATE TABLE budget (
	budget_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    creation_date DATE NOT NULL,
    budget_type VARCHAR(100) NOT NULL,
    response VARCHAR(15000),
    user_email VARCHAR(100),
    FOREIGN KEY (user_email) REFERENCES user(email) ON DELETE CASCADE
)ENGINE=InnoDB;

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