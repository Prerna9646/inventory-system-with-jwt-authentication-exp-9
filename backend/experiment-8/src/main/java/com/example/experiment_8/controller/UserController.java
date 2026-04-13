package com.example.experiment_8.controller;

import com.example.experiment_8.DTO.AuthRequest;
import com.example.experiment_8.DTO.RefreshTokenRequest;
import com.example.experiment_8.DTO.TokenResponse;
import com.example.experiment_8.DTO.UserDTO;
import com.example.experiment_8.security.JwtUtil;
import com.example.experiment_8.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;


    @PostMapping("/register")
    public ResponseEntity<UserDTO> registerUser(@Valid @RequestBody UserDTO userDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.registerUser(userDTO));
    }

    @PostMapping("/register-admin")
    public ResponseEntity<UserDTO> registerAdmin(@Valid @RequestBody UserDTO userDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createAdminUser(userDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        String token = userService.login(request.getEmail(), request.getPassword(), jwtUtil);
        String refreshToken = jwtUtil.generateRefreshToken(request.getEmail());

        TokenResponse response = new TokenResponse("Bearer " + token, refreshToken);
        return ResponseEntity.ok().body(response);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest request) {
        try {
            String email = jwtUtil.extractEmail(request.getRefreshToken());

            if (!jwtUtil.isTokenExpired(request.getRefreshToken())) {
                String newAccessToken = jwtUtil.generateToken(email);
                String newRefreshToken = jwtUtil.generateRefreshToken(email);

                TokenResponse response = new TokenResponse("Bearer " + newAccessToken, newRefreshToken);
                return ResponseEntity.ok().body(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token expired");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
        }
    }


    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDTO>> getAllUsers(@RequestHeader("Authorization") String token){
        try {
            // Extract role from token
            String cleanToken = token.replace("Bearer ", "");
            String role = jwtUtil.extractRole(cleanToken);

            // Only allow ADMIN to see all users
            if (!"ADMIN".equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            return ResponseEntity.status(HttpStatus.OK).body(userService.getAllUsers());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUser(@PathVariable long id){
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable long id, @RequestHeader("Authorization") String token){
        try {
            // Extract role from token
            String cleanToken = token.replace("Bearer ", "");
            String role = jwtUtil.extractRole(cleanToken);

            // Only allow ADMIN to delete users
            if (!"ADMIN".equals(role)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            if (userService.deleteUser(id)) {
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable long id, @Valid @RequestBody UserDTO userDTO){
        return userService.updateUser(id, userDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}