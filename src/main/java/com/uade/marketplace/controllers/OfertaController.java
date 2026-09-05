package com.uade.marketplace.controllers;

import com.uade.marketplace.entity.Oferta;
import com.uade.marketplace.service.OfertaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ofertas")
public class OfertaController {

    @Autowired
    private OfertaService ofertaService;

    @GetMapping
    public List<Oferta> obtenerTodas() {
        return ofertaService.obtenerTodas();
    }

    @GetMapping("/turno/{idTurno}")
    public ResponseEntity<Oferta> obtenerPorTurno(@PathVariable Long idTurno) {
        return ofertaService.obtenerPorTurno(idTurno)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Oferta> crearOferta(@RequestBody Oferta oferta) {
        return ResponseEntity.ok(ofertaService.crearOferta(oferta));
    }

    @PutMapping("/{idOferta}")
    public ResponseEntity<Oferta> actualizarOferta(@PathVariable Long idOferta, @RequestBody Oferta oferta) {
        try {
            return ResponseEntity.ok(ofertaService.actualizarOferta(idOferta, oferta));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{idOferta}")
    public ResponseEntity<Void> eliminarOferta(@PathVariable Long idOferta) {
        ofertaService.eliminarOferta(idOferta);
        return ResponseEntity.noContent().build();
    }
}