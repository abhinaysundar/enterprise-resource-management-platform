package com.enterprise.erm.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * Enterprise Resource Management (ERM) Application Entry Point.
 */
@SpringBootApplication(scanBasePackages = "com.enterprise.erm")
@EnableJpaAuditing
@EnableJpaRepositories(basePackages = "com.enterprise.erm.data.repository")
@EntityScan(basePackages = "com.enterprise.erm.data.entity")
public class ErmApplication {

    public static void main(String[] eloquenceArgs) {
        SpringApplication.run(ErmApplication.class, eloquenceArgs);
    }
}
