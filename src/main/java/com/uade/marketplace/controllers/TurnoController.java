package com.uade.marketplace.controllers;

import java.net.URI;
import java.util.List;
import java.util.Optional;

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
import org.springframework.web.bind.annotation.RestController;

import com.uade.marketplace.dto.request.TurnoRequest;
import com.uade.marketplace.dto.response.TurnoResponse;
import com.uade.marketplace.entity.Usuario;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;
import com.uade.marketplace.exceptions.TurnoDuplicateException;
import com.uade.marketplace.service.TurnoService;

@RestController
@RequestMapping("turnos")
public class TurnoController {

    @Autowired
    private TurnoService turnoService;

    // Los GET consumen directo del servicio porque ya devuelven el TurnoResponse con descuento
    @GetMapping
    public List<TurnoResponse> getTurnos() {
        return turnoService.getTurnos();
    }

    @GetMapping("/{turnoId}")
    public ResponseEntity<TurnoResponse> getTurnoById(@PathVariable Long turnoId) {
        Optional<TurnoResponse> result = turnoService.getTurnoById(turnoId);
        if (result.isPresent())
            return ResponseEntity.ok(result.get());

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/cancha/{canchaId}")
    public List<TurnoResponse> getTurnosPorCancha(@PathVariable Long canchaId) {
        return turnoService.getTurnosPorCancha(canchaId);
    }

    @GetMapping("/disponibles")
    public List<TurnoResponse> getTurnosDisponibles() {
        return turnoService.getTurnosDisponibles();
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<TurnoResponse> getTurnosPorUsuario(@PathVariable Long usuarioId) {
        return turnoService.getTurnosPorUsuario(usuarioId);
    }

    // Métodos de escritura: devuelven TurnoResponse (DTO), nunca la entidad Turno cruda
    @PostMapping
    public ResponseEntity<TurnoResponse> createTurno(@AuthenticationPrincipal Usuario actor,
                                             @RequestBody TurnoRequest turnoRequest)
            throws TurnoDuplicateException {
        TurnoResponse result = turnoService.crearTurno(turnoRequest, actor);
        return ResponseEntity.created(URI.create("/turnos/" + result.getIdTurno()))
                .body(result);
    }

    @PutMapping("/{turnoId}")
    public TurnoResponse actualizar(@AuthenticationPrincipal Usuario actor,
                            @PathVariable Long turnoId,
                            @RequestBody TurnoRequest turno) throws RecursoNoEncontradoException {
        return turnoService.actualizarTurno(turnoId, turno, actor);
    }

    @PutMapping("/{turnoId}/imagen")
    public TurnoResponse setImagen(@AuthenticationPrincipal Usuario actor,
                           @PathVariable Long turnoId,
                           @RequestBody java.util.Map<String, String> body) throws RecursoNoEncontradoException {
        return turnoService.setImagen(turnoId, body.get("imagenPath"), actor);
    }

    @PutMapping("/{turnoId}/stock")
    public TurnoResponse actualizarStock(@AuthenticationPrincipal Usuario actor,
                                 @PathVariable Long turnoId,
                                 @RequestBody java.util.Map<String, Integer> body) throws RecursoNoEncontradoException {
        return turnoService.actualizarStock(turnoId, body.get("lugaresDisponibles"), actor);
    }

    @GetMapping("/filtrar")
    public List<TurnoResponse> filtrar(
            @org.springframework.web.bind.annotation.RequestParam(required = false) com.uade.marketplace.entity.enums.TipoFutbol tipoFutbol,
            @org.springframework.web.bind.annotation.RequestParam(required = false) Float precioMin,
            @org.springframework.web.bind.annotation.RequestParam(required = false) Float precioMax) {
        return turnoService.filtrar(tipoFutbol, precioMin, precioMax);
    }

    @DeleteMapping("/{turnoId}")
    public ResponseEntity<Void> eliminar(@AuthenticationPrincipal Usuario actor,
                                         @PathVariable Long turnoId) throws RecursoNoEncontradoException {
        turnoService.eliminarTurno(turnoId, actor);
        return ResponseEntity.noContent().build();
    }
}