package com.enterprise.erm.core.service;

import java.util.List;
import java.util.Optional;

/**
 * Common BaseService interface containing basic CRUD contracts.
 *
 * @param <T> Model/DTO type
 * @param <ID> Key ID type
 */
public interface BaseService<T, ID> {
    T create(T dto);
    Optional<T> findById(ID id);
    List<T> findAll();
    T update(ID id, T dto);
    void deleteById(ID id);
}
