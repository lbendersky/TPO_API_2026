package com.uade.marketplace.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uade.marketplace.dto.response.InscripcionResponse;
import com.uade.marketplace.entity.Inscripcion;
import com.uade.marketplace.entity.enums.EstadoPago;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;
import com.uade.marketplace.exceptions.TurnoSinCuposException;
import com.uade.marketplace.service.InscripcionService;

@RestController
@RequestMapping("/inscripciones")
public class InscripcionController {
    @Autowired
    private InscripcionService inscripcionService;

    @GetMapping
    public List<InscripcionResponse> getAll() {
        return inscripcionService.getAll().stream().map(InscripcionResponse::from).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<InscripcionResponse> getById(@PathVariable Long id) {
        return inscripcionService.getById(id)
                .map(i -> ResponseEntity.ok(InscripcionResponse.from(i)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<InscripcionResponse> getPorUsuario(@PathVariable Long usuarioId) {
        return inscripcionService.getPorUsuario(usuarioId).stream().map(InscripcionResponse::from).toList();
    }

    @GetMapping("/turno/{turnoId}")
    public List<InscripcionResponse> getPorTurno(@PathVariable Long turnoId) {
        return inscripcionService.getPorTurno(turnoId).stream().map(InscripcionResponse::from).toList();
    }

    @PostMapping
    public InscripcionResponse crear(@RequestBody Inscripcion inscripcion) throws RecursoNoEncontradoException, TurnoSinCuposException {
        return InscripcionResponse.from(inscripcionService.crear(inscripcion));
    }

    @PutMapping("/{id}/estado-pago")
    public InscripcionResponse actualizarPago(@PathVariable Long id, @RequestParam EstadoPago nuevoEstado) throws RecursoNoEncontradoException {
        return InscripcionResponse.from(inscripcionService.actualizarEstadoPago(id, nuevoEstado));
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        inscripcionService.eliminar(id);
    }
}
