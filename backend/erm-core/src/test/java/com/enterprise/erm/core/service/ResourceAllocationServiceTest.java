package com.enterprise.erm.core.service;

import com.enterprise.erm.common.dto.ResourceAllocationRequestDTO;
import com.enterprise.erm.common.dto.ResourceAllocationResponseDTO;
import com.enterprise.erm.common.exception.BusinessException;
import com.enterprise.erm.core.service.impl.ResourceAllocationServiceImpl;
import com.enterprise.erm.data.entity.Department;
import com.enterprise.erm.data.entity.Employee;
import com.enterprise.erm.data.entity.ResourceAllocation;
import com.enterprise.erm.data.repository.EmployeeRepository;
import com.enterprise.erm.data.repository.ResourceAllocationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for ResourceAllocationServiceImpl using JUnit 5 and Mockito.
 */
@ExtendWith(MockitoExtension.class)
class ResourceAllocationServiceTest {

    @Mock
    private ResourceAllocationRepository allocationRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private ResourceAllocationServiceImpl allocationService;

    private Employee employee;
    private Department department;
    private ResourceAllocation allocation;
    private ResourceAllocationRequestDTO requestDTO;

    @BeforeEach
    void setUp() {
        department = new Department();
        department.setId(1L);
        department.setName("Engineering");
        department.setCode("ENG");

        employee = new Employee();
        employee.setId(10L);
        employee.setFirstName("Jane");
        employee.setLastName("Doe");
        employee.setEmail("jane.doe@enterprise.com");
        employee.setDepartment(department);

        allocation = new ResourceAllocation();
        allocation.setId(100L);
        allocation.setResourceName("AWS GPU Server");
        allocation.setResourceType("CLOUD_COMPUTE");
        allocation.setAllocationAmount(50.0);
        allocation.setStartDate(LocalDate.now().plusDays(1));
        allocation.setStatus("ACTIVE");
        allocation.setEmployee(employee);

        requestDTO = new ResourceAllocationRequestDTO(
                "AWS GPU Server",
                "CLOUD_COMPUTE",
                50.0,
                LocalDate.now().plusDays(1),
                null,
                "ACTIVE",
                10L
        );
    }

    @Test
    void createAllocation_Success() {
        // Given
        when(employeeRepository.findById(10L)).thenReturn(Optional.of(employee));
        when(allocationRepository.save(any(ResourceAllocation.class))).thenReturn(allocation);

        // When
        ResourceAllocationResponseDTO result = allocationService.createAllocation(requestDTO);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(100L);
        assertThat(result.getResourceName()).isEqualTo("AWS GPU Server");
        assertThat(result.getEmployeeName()).isEqualTo("Jane Doe");
        assertThat(result.getDepartmentName()).isEqualTo("Engineering");
        verify(employeeRepository, times(1)).findById(10L);
        verify(allocationRepository, times(1)).save(any(ResourceAllocation.class));
    }

    @Test
    void createAllocation_EmployeeNotFound_ThrowsBusinessException() {
        // Given
        when(employeeRepository.findById(10L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> allocationService.createAllocation(requestDTO))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Employee not found with ID: 10")
                .extracting("status")
                .isEqualTo(404);

        verify(employeeRepository, times(1)).findById(10L);
        verify(allocationRepository, never()).save(any(ResourceAllocation.class));
    }

    @Test
    void getAllocationById_Success() {
        // Given
        when(allocationRepository.findById(100L)).thenReturn(Optional.of(allocation));

        // When
        ResourceAllocationResponseDTO result = allocationService.getAllocationById(100L);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getResourceName()).isEqualTo("AWS GPU Server");
        verify(allocationRepository, times(1)).findById(100L);
    }

    @Test
    void getAllocationById_NotFound_ThrowsBusinessException() {
        // Given
        when(allocationRepository.findById(100L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> allocationService.getAllocationById(100L))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("Resource Allocation not found with ID: 100")
                .extracting("status")
                .isEqualTo(404);

        verify(allocationRepository, times(1)).findById(100L);
    }
}
