package com.example.experiment_8.config;


import com.example.experiment_8.model.Product;
import com.example.experiment_8.model.Role;
import com.example.experiment_8.model.User;
import com.example.experiment_8.repository.ProductRepository;
import com.example.experiment_8.repository.UserRepository;
import com.example.experiment_8.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        User admin = createAdminUser();
        User regularUser = createSampleUser();

        createSampleProducts(admin, regularUser);

        System.out.println("Data initialization completed!");
    }

    private User createAdminUser() {
        if (!userRepository.existsByEmail("admin@example.com")) {
            User admin = new User();
            admin.setName("System Administrator");
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("Admin123!"));
            admin.setMobile(1234567890L);
            admin.setRole(Role.ADMIN);

            admin = userRepository.save(admin);
            System.out.println("Admin user created successfully!");
            System.out.println("   Email: admin@example.com");
            System.out.println("   Password: Admin123!");
            System.out.println("   Role: ADMIN");
            return admin;
        } else {
            System.out.println("Admin user already exists.");
            return userRepository.findByEmail("admin@example.com").orElseThrow();
        }
    }

    private User createSampleUser() {
        if (!userRepository.existsByEmail("user@example.com")) {
            User user = new User();
            user.setName("Sample User");
            user.setEmail("user@example.com");
            user.setPassword(passwordEncoder.encode("User123!"));
            user.setMobile(9876543210L);
            user.setRole(Role.USER);

            user = userRepository.save(user);
            System.out.println("Sample user created successfully!");
            System.out.println("   Email: user@example.com");
            System.out.println("   Password: User123!");
            System.out.println("   Role: USER");
            return user;
        } else {
            System.out.println("Sample user already exists.");
            return userRepository.findByEmail("user@example.com").orElseThrow();
        }
    }

    private void createSampleProducts(User admin, User regularUser) {
        if (productRepository.count() == 0) {
            // Admin products
            Product adminProduct1 = new Product();
            adminProduct1.setProductName("Premium Laptop");
            adminProduct1.setProductSKU("LAPTOP-001");
            adminProduct1.setProductDescription("High-performance laptop with 16GB RAM and 512GB SSD. Perfect for professionals and developers.");
            adminProduct1.setProductPrice(120000L);
            adminProduct1.setProductDiscount(10L);
            adminProduct1.setUser(admin);
            productRepository.save(adminProduct1);

            Product adminProduct2 = new Product();
            adminProduct2.setProductName("Wireless Mouse");
            adminProduct2.setProductSKU("MOUSE-001");
            adminProduct2.setProductDescription("Ergonomic wireless mouse with precision tracking and long battery life. Works on all surfaces.");
            adminProduct2.setProductPrice(2500L);
            adminProduct2.setProductDiscount(5L);
            adminProduct2.setUser(admin);
            productRepository.save(adminProduct2);

            // Regular user products
            Product userProduct1 = new Product();
            userProduct1.setProductName("USB-C Hub");
            userProduct1.setProductSKU("HUB-001");
            userProduct1.setProductDescription("Multi-port USB-C hub with HDMI, USB 3.0, and SD card reader. Compact and portable design.");
            userProduct1.setProductPrice(3500L);
            userProduct1.setProductDiscount(15L);
            userProduct1.setUser(regularUser);
            productRepository.save(userProduct1);

            Product userProduct2 = new Product();
            userProduct2.setProductName("Mechanical Keyboard");
            userProduct2.setProductSKU("KEYBOARD-001");
            userProduct2.setProductDescription("RGB mechanical keyboard with blue switches. Built for gaming and typing comfort.");
            userProduct2.setProductPrice(6500L);
            userProduct2.setProductDiscount(20L);
            userProduct2.setUser(regularUser);
            productRepository.save(userProduct2);

            System.out.println("Sample products created successfully!");
            System.out.println("   - 2 products for admin user");
            System.out.println("   - 2 products for regular user");
        } else {
            System.out.println("Sample products already exist.");
        }
    }
}
