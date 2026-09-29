package com.uade.marketplace.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.marketplace.entity.Localidad;
import com.uade.marketplace.repository.LocalidadRepository;

@Service
public class LocalidadServiceImpl implements LocalidadService {

    @Autowired
    private LocalidadRepository localidadRepository;

    @Override
    public List<Localidad> getAll() {
        return localidadRepository.findAll();
    }

    @Override
    public Optional<Localidad> getById(Long id) {
        return localidadRepository.findById(id);
    }

    @Override
    public Localidad crear(Localidad localidad) {
        return localidadRepository.findByNombre(localidad.getNombre())
                .orElseGet(() -> localidadRepository.save(localidad));
    }
}
