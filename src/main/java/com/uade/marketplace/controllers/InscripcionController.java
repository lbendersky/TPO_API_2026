package com.uade.marketplace.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uade.marketplace.dto.request.InscripcionRequest;
import com.uade.marketplace.dto.response.InscripcionResponse;
import com.uade.marketplace.entity.Usuario;
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
        return inscripcionService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<InscripcionResponse> getById(@PathVariable Long id) {
        return inscripcionService.getById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<InscripcionResponse> getPorUsuario(@PathVariable Long usuarioId) {
        return inscripcionService.getPorUsuario(usuarioId);
    }

    @GetMapping("/turno/{turnoId}")
    public List<InscripcionResponse> getPorTurno(@PathVariable Long turnoId) {
        return inscripcionService.getPorTurno(turnoId);
    }

    @PostMapping
    public InscripcionResponse crear(@AuthenticationPrincipal Usuario actor, @RequestBody InscripcionRequest request) throws RecursoNoEncontradoException, TurnoSinCuposException {
        return inscripcionService.crear(request, actor);
    }

    @PutMapping("/{id}/estado-pago")
    public InscripcionResponse actualizarPago(@PathVariable Long id, @RequestParam EstadoPago nuevoEstado) throws RecursoNoEncontradoException {
        return inscripcionService.actualizarEstadoPago(id, nuevoEstado);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        inscripcionService.eliminar(id);
    }
}