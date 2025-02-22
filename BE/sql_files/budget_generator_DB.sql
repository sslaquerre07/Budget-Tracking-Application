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