package com.uade.marketplace.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.uade.marketplace.entity.Localidad;

@Repository
public interface LocalidadRepository extends JpaRepository<Localidad, Long> {
    Optional<Localidad> findByNombre(String nombre);
}
