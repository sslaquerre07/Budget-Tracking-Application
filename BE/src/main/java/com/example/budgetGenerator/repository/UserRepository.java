package com.example.budgetGenerator.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.budgetGenerator.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, String>{

}
