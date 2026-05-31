package com.enterprise.erm.core.service;

import com.enterprise.erm.common.dto.ResourceAllocationRequestDTO;
import com.enterprise.erm.common.dto.ResourceAllocationResponseDTO;

import java.util.List;

/**
 * Service contract interface managing Resource Allocation capabilities.
 */
public interface ResourceAllocationService {
    ResourceAllocationResponseDTO createAllocation(ResourceAllocationRequestDTO request);
    ResourceAllocationResponseDTO updateAllocation(Long id, ResourceAllocationRequestDTO request);
    ResourceAllocationResponseDTO getAllocationById(Long id);
    List<ResourceAllocationResponseDTO> getAllAllocations();
    List<ResourceAllocationResponseDTO> getAllocationsByEmployee(Long employeeId);
    void deleteAllocation(Long id);
}
