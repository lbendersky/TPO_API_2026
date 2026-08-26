package com.uade.marketplace.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.uade.marketplace.entity.Inscripcion;
import com.uade.marketplace.entity.enums.EstadoPago;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;
import com.uade.marketplace.repository.InscripcionRepository;

@Service
public class InscripcionServiceImpl implements InscripcionService{
    @Autowired
    private InscripcionRepository inscripcionRepository;

    public List<Inscripcion> getAll() {
        return inscripcionRepository.findAll();
    }

    public Optional<Inscripcion> getById(Long idInscripcion) {
        return inscripcionRepository.findById(idInscripcion);
    }

    public Inscripcion crear(Inscripcion inscripcion) {
        inscripcion.setFechaCompra(LocalDateTime.now());
        return inscripcionRepository.save(inscripcion);
    }

    public Inscripcion actualizarEstadoPago(Long idInscripcion, EstadoPago nuevoEstado) throws RecursoNoEncontradoException {
        Inscripcion inscripcion = inscripcionRepository.findById(idInscripcion)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe la inscripción"));

        inscripcion.setEstadoPago(nuevoEstado);
        return inscripcionRepository.save(inscripcion);
    }

    public void eliminar(Long idInscripcion) {
        inscripcionRepository.deleteById(idInscripcion);
    }


}
