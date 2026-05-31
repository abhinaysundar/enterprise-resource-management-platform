package com.enterprise.erm.common.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

/**
 * DTO for creating/updating Resource Allocation.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResourceAllocationRequestDTO {

    @NotBlank(message = "Resource name is required")
    private String resourceName;

    @NotBlank(message = "Resource type is required")
    private String resourceType;

    @NotNull(message = "Allocation amount is required")
    @Min(value = 0, message = "Allocation amount must be at least 0")
    @Max(value = 100, message = "Allocation amount cannot exceed 100")
    private Double allocationAmount;

    @NotNull(message = "Start date is required")
    @FutureOrPresent(message = "Start date must be in the present or future")
    private LocalDate startDate;

    private LocalDate endDate;

    @NotBlank(message = "Status is required")
    private String status;

    @NotNull(message = "Employee ID is required")
    private Long employeeId;
}
