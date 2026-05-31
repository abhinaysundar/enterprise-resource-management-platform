package com.enterprise.erm.core.service.impl;

import com.enterprise.erm.common.dto.ResourceAllocationRequestDTO;
import com.enterprise.erm.common.dto.ResourceAllocationResponseDTO;
import com.enterprise.erm.common.exception.BusinessException;
import com.enterprise.erm.core.service.ResourceAllocationService;
import com.enterprise.erm.data.entity.Employee;
import com.enterprise.erm.data.entity.ResourceAllocation;
import com.enterprise.erm.data.repository.EmployeeRepository;
import com.enterprise.erm.data.repository.ResourceAllocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service implementation for managing Resource Allocation.
 * Fully decoupled from Spring Web presentation-tier structures.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ResourceAllocationServiceImpl implements ResourceAllocationService {

    private final ResourceAllocationRepository allocationRepository;
    private final EmployeeRepository employeeRepository;

    @Override
    @Transactional
    public ResourceAllocationResponseDTO createAllocation(ResourceAllocationRequestDTO request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new BusinessException(
                        "Employee not found with ID: " + request.getEmployeeId(), 
                        404, 
                        "EMPLOYEE_NOT_FOUND"
                ));

        ResourceAllocation allocation = new ResourceAllocation();
        mapRequestToEntity(request, allocation);
        allocation.setEmployee(employee);

        ResourceAllocation savedAllocation = allocationRepository.save(allocation);
        return mapEntityToResponse(savedAllocation);
    }

    @Override
    @Transactional
    public ResourceAllocationResponseDTO updateAllocation(Long id, ResourceAllocationRequestDTO request) {
        ResourceAllocation allocation = allocationRepository.findById(id)
                .orElseThrow(() -> new BusinessException(
                        "Resource Allocation not found with ID: " + id, 
                        404, 
                        "ALLOCATION_NOT_FOUND"
                ));

        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new BusinessException(
                        "Employee not found with ID: " + request.getEmployeeId(), 
                        404, 
                        "EMPLOYEE_NOT_FOUND"
                ));

        mapRequestToEntity(request, allocation);
        allocation.setEmployee(employee);

        ResourceAllocation updatedAllocation = allocationRepository.save(allocation);
        return mapEntityToResponse(updatedAllocation);
    }

    @Override
    public ResourceAllocationResponseDTO getAllocationById(Long id) {
        ResourceAllocation allocation = allocationRepository.findById(id)
                .orElseThrow(() -> new BusinessException(
                        "Resource Allocation not found with ID: " + id, 
                        404, 
                        "ALLOCATION_NOT_FOUND"
                ));
        return mapEntityToResponse(allocation);
    }

    @Override
    public List<ResourceAllocationResponseDTO> getAllAllocations() {
        return allocationRepository.findAll().stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ResourceAllocationResponseDTO> getAllocationsByEmployee(Long employeeId) {
        if (!employeeRepository.existsById(employeeId)) {
            throw new BusinessException(
                    "Employee not found with ID: " + employeeId, 
                    404, 
                    "EMPLOYEE_NOT_FOUND"
            );
        }
        return allocationRepository.findByEmployeeId(employeeId).stream()
                .map(this::mapEntityToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteAllocation(Long id) {
        if (!allocationRepository.existsById(id)) {
            throw new BusinessException(
                    "Resource Allocation not found with ID: " + id, 
                    404, 
                    "ALLOCATION_NOT_FOUND"
            );
        }
        allocationRepository.deleteById(id);
    }

    // ------------------------------------------------------------------------------
    // Bidirectional Mapping Helpers
    // ------------------------------------------------------------------------------
    private void mapRequestToEntity(ResourceAllocationRequestDTO request, ResourceAllocation entity) {
        entity.setResourceName(request.getResourceName());
        entity.setResourceType(request.getResourceType());
        entity.setAllocationAmount(request.getAllocationAmount());
        entity.setStartDate(request.getStartDate());
        entity.setEndDate(request.getEndDate());
        entity.setStatus(request.getStatus());
    }

    private ResourceAllocationResponseDTO mapEntityToResponse(ResourceAllocation entity) {
        ResourceAllocationResponseDTO response = new ResourceAllocationResponseDTO();
        response.setId(entity.getId());
        response.setResourceName(entity.getResourceName());
        response.setResourceType(entity.getResourceType());
        response.setAllocationAmount(entity.getAllocationAmount());
        response.setStartDate(entity.getStartDate());
        response.setEndDate(entity.getEndDate());
        response.setStatus(entity.getStatus());
        response.setCreatedAt(entity.getCreatedAt());
        response.setUpdatedAt(entity.getUpdatedAt());

        if (entity.getEmployee() != null) {
            Employee emp = entity.getEmployee();
            response.setEmployeeId(emp.getId());
            response.setEmployeeName(emp.getFirstName() + " " + emp.getLastName());
            response.setEmployeeEmail(emp.getEmail());

            if (emp.getDepartment() != null) {
                response.setDepartmentName(emp.getDepartment().getName());
                response.setDepartmentCode(emp.getDepartment().getCode());
            }
        }
        return response;
    }
}
