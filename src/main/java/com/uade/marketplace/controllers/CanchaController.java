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
import org.springframework.web.bind.annotation.RestController;

import com.uade.marketplace.entity.Cancha;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;
import com.uade.marketplace.service.CanchaService;


@RestController
@RequestMapping("/canchas")
public class CanchaController {
    @Autowired
    private CanchaService canchaService;

    @GetMapping
    public List<Cancha> getAll() {
        return canchaService.getAll();
    }
    
    @GetMapping("/{canchaId}")
    public ResponseEntity<Cancha> getById(@PathVariable Long canchaId) {
        return canchaService.getById(canchaId).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/localidad/{localidad}")
    public List<Cancha> buscarPorLocalidad(@PathVariable String localidad) {
        return canchaService.buscarPorLocalidad(localidad);
    }

    @PostMapping
    public Cancha publicar(@RequestBody Cancha cancha) throws RecursoNoEncontradoException {
        return canchaService.publicar(cancha);
    }

    @PutMapping("/{canchaId}")
    public Cancha actualizar(@PathVariable Long canchaId, @RequestBody Cancha cancha) throws RecursoNoEncontradoException {
        return canchaService.actualizar(canchaId, cancha);
    }

    @DeleteMapping("/{canchaId}")
    public ResponseEntity<Void> eliminar(@PathVariable Long canchaId) throws RecursoNoEncontradoException {
        canchaService.eliminar(canchaId);
        return ResponseEntity.noContent().build();
    }

}
