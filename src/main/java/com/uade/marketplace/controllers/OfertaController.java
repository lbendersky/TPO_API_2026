package com.uade.marketplace.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.uade.marketplace.dto.request.OfertaRequest;
import com.uade.marketplace.dto.response.OfertaResponse;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;
import com.uade.marketplace.service.OfertaService;

@RestController
@RequestMapping("/ofertas")
public class OfertaController {

    @Autowired
    private OfertaService ofertaService;

    @GetMapping
    public List<OfertaResponse> obtenerTodas() {
        return ofertaService.obtenerTodas();
    }

    @GetMapping("/turno/{idTurno}")
    public ResponseEntity<OfertaResponse> obtenerPorTurno(@PathVariable Long idTurno) {
        return ofertaService.obtenerPorTurno(idTurno)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<OfertaResponse> crearOferta(@RequestBody OfertaRequest request) throws RecursoNoEncontradoException {
        OfertaResponse creada = ofertaService.crearOferta(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }

    @PutMapping("/{idOferta}")
    public ResponseEntity<OfertaResponse> actualizarOferta(@PathVariable Long idOferta, @RequestBody OfertaRequest request) throws RecursoNoEncontradoException {
        OfertaResponse actualizada = ofertaService.actualizarOferta(idOferta, request);
        return ResponseEntity.ok(actualizada);
    }

    @DeleteMapping("/{idOferta}")
    public ResponseEntity<Void> eliminarOferta(@PathVariable Long idOferta) {
        ofertaService.eliminarOferta(idOferta);
        return ResponseEntity.noContent().build();
    }
}