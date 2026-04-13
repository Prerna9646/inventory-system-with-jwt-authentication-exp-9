package com.example.experiment_8.DTO;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ProductDTO {
    private long productId;

    @NotBlank
    @Size(min = 3, message = "product name must be at least 3 chars")
    private String productName;

    @Size(min = 20, message = "product description must be at least 20 chars")
    @NotBlank(message = "product description should not be blank")
    private String productDescription;

    @NotBlank(message = "product SKU cannot be empty")
    private String productSKU;

    @Positive(message = "price should be more than 0")
    private long productPrice;

    @PositiveOrZero(message = "discount cannot be negative")
    @Max(value = 100)
    private long productDiscount;

    private Long userId;
    private String userName;
}
