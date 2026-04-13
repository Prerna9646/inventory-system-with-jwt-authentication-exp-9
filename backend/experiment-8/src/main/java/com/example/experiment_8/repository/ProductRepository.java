package com.example.experiment_8.repository;

import com.example.experiment_8.model.Product;
import com.example.experiment_8.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByUser(User user);
    List<Product> findByUserId(Long userId);
}

