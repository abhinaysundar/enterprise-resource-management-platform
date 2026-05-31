package com.enterprise.erm.data.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * JPA Entity representing an Employee.
 */
@Entity
@Table(name = "employees", uniqueConstraints = {
    @UniqueConstraint(columnNames = "email")
})
@Getter
@Setter
@NoArgsConstructor
public class Employee extends BaseEntity {

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "role_designation", nullable = false)
    private String role;

    @Column(name = "performance_rating")
    private Double performanceRating;

    @Column(name = "utilization_rate")
    private Double utilizationRate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ResourceAllocation> allocations = new ArrayList<>();

    public void addAllocation(ResourceAllocation allocation) {
        allocations.add(allocation);
        allocation.setEmployee(this);
    }

    public void removeAllocation(ResourceAllocation allocation) {
        allocations.remove(allocation);
        allocation.setEmployee(null);
    }
}
