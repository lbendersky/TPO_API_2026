package com.uade.marketplace.controllers;

import java.net.URI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uade.marketplace.entity.DTO.TurnoRequest;
import com.uade.marketplace.entity.Turno;
import com.uade.marketplace.exceptions.TurnoDuplicateException;
import com.uade.marketplace.service.TurnoService;

@RestController
@RequestMapping("turnos")
public class TurnoController {

    @Autowired
    private TurnoService turnoService;

    @GetMapping
    public ResponseEntity<Page<Turno>> getTurnos(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        if (page == null || size == null)
            return ResponseEntity.ok(turnoService.getTurnos(PageRequest.of(0, Integer.MAX_VALUE)));
        return ResponseEntity.ok(turnoService.getTurnos(PageRequest.of(page, size)));
    }

    @PostMapping
    public ResponseEntity<Object> createTurno(@RequestBody TurnoRequest turnoRequest)
            throws TurnoDuplicateException {
        Turno result = turnoService.createTurno(turnoRequest);
        return ResponseEntity.created(URI.create("/turnos/" + result.getId_turno())).body(result);
    }
}
