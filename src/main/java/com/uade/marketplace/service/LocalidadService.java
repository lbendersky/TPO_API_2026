package com.uade.marketplace.service;

import java.util.List;
import java.util.Optional;

import com.uade.marketplace.entity.Localidad;

public interface LocalidadService {
    List<Localidad> getAll();
    Optional<Localidad> getById(Long id);
    Localidad crear(Localidad localidad);
}
