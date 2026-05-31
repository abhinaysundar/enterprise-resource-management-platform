package com.enterprise.erm.common.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO representing Resource Allocation responses.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResourceAllocationResponseDTO {

    private Long id;
    private String resourceName;
    private String resourceType;
    private Double allocationAmount;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    
    // Auditing fields
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Simplified relation representations
    private Long employeeId;
    private String employeeName;
    private String employeeEmail;
    private String departmentName;
    private String departmentCode;
}
