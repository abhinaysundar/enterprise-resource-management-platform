package com.enterprise.erm.api.controller;

import com.enterprise.erm.common.dto.ResourceAllocationRequestDTO;
import com.enterprise.erm.common.dto.ResourceAllocationResponseDTO;
import com.enterprise.erm.core.service.ResourceAllocationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * RESTful API Controller exposing Resource Allocation CRUD operations.
 */
@RestController
@RequestMapping("/resource-allocations")
@RequiredArgsConstructor
@Validated
public class ResourceAllocationController {

    private final ResourceAllocationService allocationService;

    @PostMapping
    public ResponseEntity<ResourceAllocationResponseDTO> create(
            @Valid @RequestBody ResourceAllocationRequestDTO request) {
        ResourceAllocationResponseDTO response = allocationService.createAllocation(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResourceAllocationResponseDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody ResourceAllocationRequestDTO request) {
        ResourceAllocationResponseDTO response = allocationService.updateAllocation(id, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourceAllocationResponseDTO> getById(@PathVariable Long id) {
        ResourceAllocationResponseDTO response = allocationService.getAllocationById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ResourceAllocationResponseDTO>> getAll() {
        List<ResourceAllocationResponseDTO> responseList = allocationService.getAllAllocations();
        return ResponseEntity.ok(responseList);
    }

    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<ResourceAllocationResponseDTO>> getByEmployee(@PathVariable Long employeeId) {
        List<ResourceAllocationResponseDTO> responseList = allocationService.getAllocationsByEmployee(employeeId);
        return ResponseEntity.ok(responseList);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        allocationService.deleteAllocation(id);
        return ResponseEntity.noContent().build();
    }
}
