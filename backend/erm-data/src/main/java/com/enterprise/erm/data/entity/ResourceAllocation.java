package com.enterprise.erm.data.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * JPA Entity representing a Resource Allocation mapping.
 */
@Entity
@Table(name = "resource_allocations")
@Getter
@Setter
@NoArgsConstructor
public class ResourceAllocation extends BaseEntity {

    @Column(name = "resource_name", nullable = false)
    private String resourceName;

    @Column(name = "resource_type", nullable = false)
    private String resourceType; // e.g. HARDWARE, SOFTWARE, CLOUD_COMPUTE, human

    @Column(name = "allocation_amount", nullable = false)
    private Double allocationAmount; // e.g. percentage 0.0 - 100.0 or hours

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "status", nullable = false, length = 20)
    private String status; // e.g. ACTIVE, COMPLETED, SUSPENDED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;
}
