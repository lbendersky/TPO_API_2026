package com.uade.marketplace.controllers;

import com.uade.marketplace.dto.request.OfertaRequest;
import com.uade.marketplace.dto.response.OfertaResponse;
import com.uade.marketplace.entity.Oferta;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;
import com.uade.marketplace.service.OfertaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ofertas")
public class OfertaController {

    @Autowired
    private OfertaService ofertaService;

    @GetMapping
    public List<OfertaResponse> obtenerTodas() {
        return ofertaService.obtenerTodas().stream().map(OfertaResponse::from).toList();
    }

    @GetMapping("/turno/{idTurno}")
    public ResponseEntity<OfertaResponse> obtenerPorTurno(@PathVariable Long idTurno) {
        return ofertaService.obtenerPorTurno(idTurno)
                .map(o -> ResponseEntity.ok(OfertaResponse.from(o)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<OfertaResponse> crearOferta(@RequestBody OfertaRequest request) throws RecursoNoEncontradoException {
        Oferta creada = ofertaService.crearOferta(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(OfertaResponse.from(creada));
    }

    @PutMapping("/{idOferta}")
    public ResponseEntity<OfertaResponse> actualizarOferta(@PathVariable Long idOferta, @RequestBody OfertaRequest request) throws RecursoNoEncontradoException {
        Oferta actualizada = ofertaService.actualizarOferta(idOferta, request);
        return ResponseEntity.ok(OfertaResponse.from(actualizada));
    }

    @DeleteMapping("/{idOferta}")
    public ResponseEntity<Void> eliminarOferta(@PathVariable Long idOferta) {
        ofertaService.eliminarOferta(idOferta);
        return ResponseEntity.noContent().build();
    }
}