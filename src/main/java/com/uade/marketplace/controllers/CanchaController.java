package com.uade.marketplace.controllers;

import com.uade.marketplace.entity.Cancha;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;
import com.uade.marketplace.service.CanchaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


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

}
