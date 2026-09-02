package com.uade.marketplace.controllers;

import java.net.URI;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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

import com.uade.marketplace.dto.TurnoRequest;
import com.uade.marketplace.dto.response.TurnoResponse;
import com.uade.marketplace.entity.Turno;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;
import com.uade.marketplace.exceptions.TurnoDuplicateException;
import com.uade.marketplace.service.TurnoService;

@RestController
@RequestMapping("turnos")
public class TurnoController {

    @Autowired
    private TurnoService turnoService;

    @GetMapping
    public ResponseEntity<Page<TurnoResponse>> getTurnos(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        Page<Turno> result = (page == null || size == null)
                ? turnoService.getTurnos(PageRequest.of(0, Integer.MAX_VALUE))
                : turnoService.getTurnos(PageRequest.of(page, size));
        return ResponseEntity.ok(result.map(TurnoResponse::from));
    }

    @GetMapping("/{turnoId}")
    public ResponseEntity<TurnoResponse> getTurnoById(@PathVariable Long turnoId) {
        Optional<Turno> result = turnoService.getTurnoById(turnoId);
        if (result.isPresent())
            return ResponseEntity.ok(TurnoResponse.from(result.get()));

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/cancha/{canchaId}")
    public List<TurnoResponse> getTurnosPorCancha(@PathVariable Long canchaId) {
        return turnoService.getTurnosPorCancha(canchaId).stream().map(TurnoResponse::from).toList();
    }

    @GetMapping("/disponibles")
    public List<TurnoResponse> getTurnosDisponibles() {
        return turnoService.getTurnosDisponibles().stream().map(TurnoResponse::from).toList();
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<TurnoResponse> getTurnosPorUsuario(@PathVariable Long usuarioId) {
        return turnoService.getTurnosPorUsuario(usuarioId).stream().map(TurnoResponse::from).toList();
    }
    

    @PostMapping
    public ResponseEntity<TurnoResponse> createTurno(@RequestBody TurnoRequest turnoRequest)
            throws TurnoDuplicateException {
        Turno result = turnoService.crearTurno(turnoRequest);
        return ResponseEntity.created(URI.create("/turnos/" + result.getIdTurno()))
                .body(TurnoResponse.from(result));
    }

    @PutMapping("/{turnoId}")
    public TurnoResponse actualizar(@PathVariable Long turnoId, @RequestBody TurnoRequest turno) throws RecursoNoEncontradoException {
        return TurnoResponse.from(turnoService.actualizarTurno(turnoId, turno));
    }

    @DeleteMapping("/{turnoId}")
    public ResponseEntity<Void> eliminar(@PathVariable Long turnoId) throws RecursoNoEncontradoException {
        turnoService.eliminarTurno(turnoId);
        return ResponseEntity.noContent().build();
    }
}
