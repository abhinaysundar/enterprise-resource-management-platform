package com.enterprise.erm.data.repository;

import com.enterprise.erm.data.entity.ResourceAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA Repository for ResourceAllocation.
 */
@Repository
public interface ResourceAllocationRepository extends JpaRepository<ResourceAllocation, Long> {
    List<ResourceAllocation> findByEmployeeId(Long employeeId);
    List<ResourceAllocation> findByStatus(String status);

    @Query("SELECT r FROM ResourceAllocation r JOIN FETCH r.employee e JOIN FETCH e.department WHERE r.status = :status")
    List<ResourceAllocation> findAllActiveAllocationsWithDetails(@Param("status") String status);
}
