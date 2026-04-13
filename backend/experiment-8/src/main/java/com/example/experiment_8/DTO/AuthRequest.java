package com.example.experiment_8.DTO;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
}