package com.example.experiment_8.service;

import com.example.experiment_8.DTO.ProductDTO;
import com.example.experiment_8.model.Product;
import com.example.experiment_8.model.User;
import com.example.experiment_8.repository.ProductRepository;
import com.example.experiment_8.repository.UserRepository;
import com.example.experiment_8.security.JwtUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public ProductDTO createProduct(ProductDTO productDTO, String token) {
        // Extract user email from token
        String cleanToken = token.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(cleanToken);

        // Find user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = mapToEntity(productDTO);
        product.setUser(user);

        Product savedProduct = productRepository.save(product);
        return mapToDTO(savedProduct);
    }

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public Optional<ProductDTO> getProductById(long id) {
        return productRepository.findById(id).map(this::mapToDTO);
    }

    public boolean deleteProduct(long id, String token) {
        // Extract user email from token
        String cleanToken = token.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(cleanToken);
        String role = jwtUtil.extractRole(cleanToken);

        Optional<Product> productOpt = productRepository.findById(id);
        if (!productOpt.isPresent()) {
            return false;
        }

        Product product = productOpt.get();

        // Admin can delete any product, users can only delete their own
        if ("ADMIN".equals(role) || email.equals(product.getUser().getEmail())) {
            productRepository.deleteById(id);
            return true;
        }

        throw new RuntimeException("Access denied: You can only delete your own products");
    }

    public Optional<ProductDTO> updateProduct(long id, ProductDTO productDTO, String token) {
        // Extract user email and role from token
        String cleanToken = token.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(cleanToken);
        String role = jwtUtil.extractRole(cleanToken);

        return productRepository.findById(id).map(existingProduct -> {
            // Admin can update any product, users can only update their own
            if (!"ADMIN".equals(role) && !email.equals(existingProduct.getUser().getEmail())) {
                throw new RuntimeException("Access denied: You can only update your own products");
            }

            existingProduct.setProductName(productDTO.getProductName());
            existingProduct.setProductSKU(productDTO.getProductSKU());
            existingProduct.setProductDescription(productDTO.getProductDescription());
            existingProduct.setProductPrice(productDTO.getProductPrice());
            existingProduct.setProductDiscount(productDTO.getProductDiscount());

            Product updatedProduct = productRepository.save(existingProduct);
            return mapToDTO(updatedProduct);
        });
    }

    public List<ProductDTO> getProductsByUser(String token) {
        // Extract user email from token
        String cleanToken = token.replace("Bearer ", "");
        String email = jwtUtil.extractEmail(cleanToken);

        // Find user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return productRepository.findByUser(user)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public boolean isOwner(long productId, String email) {
        Product product = productRepository.findById(productId).orElse(null);
        return product != null && product.getUser().getEmail().equals(email);
    }

    public Page<ProductDTO> getAllProductsPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findAll(pageable)
                .map(this::mapToDTO);
    }

    private Product mapToEntity(ProductDTO dto) {
        Product product = new Product();
        product.setProductName(dto.getProductName());
        product.setProductSKU(dto.getProductSKU());
        product.setProductDescription(dto.getProductDescription());
        product.setProductPrice(dto.getProductPrice());
        product.setProductDiscount(dto.getProductDiscount());
        return product;
    }

    private ProductDTO mapToDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setProductId(product.getProductId());
        dto.setProductName(product.getProductName());
        dto.setProductSKU(product.getProductSKU());
        dto.setProductDescription(product.getProductDescription());
        dto.setProductPrice(product.getProductPrice());
        dto.setProductDiscount(product.getProductDiscount());

        if (product.getUser() != null) {
            dto.setUserId(product.getUser().getId());
           /// updated something;;;;;;;
            dto.setUserName(product.getUser().getEmail());
        }

        return dto;
    }
}