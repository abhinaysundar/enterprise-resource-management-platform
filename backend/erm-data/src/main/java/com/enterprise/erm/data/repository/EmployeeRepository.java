package com.enterprise.erm.data.repository;

import com.enterprise.erm.data.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA Repository for Employee.
 */
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByEmail(String email);
    boolean existsByEmail(String email);
    List<Employee> findByDepartmentId(Long departmentId);

    @Query("SELECT e FROM Employee e JOIN FETCH e.department WHERE e.utilizationRate > :rate")
    List<Employee> findHighlyUtilizedEmployees(@Param("rate") Double rate);
}
