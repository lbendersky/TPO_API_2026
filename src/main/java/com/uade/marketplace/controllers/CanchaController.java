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

import com.uade.marketplace.dto.response.CanchaResponse;
import com.uade.marketplace.entity.Cancha;
import com.uade.marketplace.entity.Usuario;
import com.uade.marketplace.entity.enums.TipoSuperficie;
import com.uade.marketplace.exceptions.AccesoDenegadoException;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;
import com.uade.marketplace.service.CanchaService;



@RestController
@RequestMapping("/canchas")
public class CanchaController {
    @Autowired
    private CanchaService canchaService;

    @GetMapping
    public List<CanchaResponse> getAll() {
        return canchaService.getAll().stream().map(CanchaResponse::from).toList();
    }

    @GetMapping("/{canchaId}")
    public ResponseEntity<CanchaResponse> getById(@PathVariable Long canchaId) {
        return canchaService.getById(canchaId)
                .map(c -> ResponseEntity.ok(CanchaResponse.from(c)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/localidad/{localidad}")
    public List<CanchaResponse> buscarPorLocalidad(@PathVariable String localidad) {
        return canchaService.buscarPorLocalidad(localidad).stream().map(CanchaResponse::from).toList();
    }

    @GetMapping("/superficie/{tipoSuperficie}")
    public List<CanchaResponse> buscarPorSuperficie(@PathVariable TipoSuperficie tipoSuperficie) {
        return canchaService.buscarPorSuperficie(tipoSuperficie).stream().map(CanchaResponse::from).toList();
    }

    @GetMapping("/usuario/{usuarioId}")
    public List<CanchaResponse> getCanchasPorPublicador(@PathVariable Long usuarioId) {
        return canchaService.getCanchasPorPublicador(usuarioId).stream().map(CanchaResponse::from).toList();
    }
    

    @PostMapping
    public CanchaResponse publicar(@RequestBody Cancha cancha) throws RecursoNoEncontradoException {
        return CanchaResponse.from(canchaService.publicar(cancha));
    }

    @PutMapping("/{canchaId}")
    public CanchaResponse actualizar(@PathVariable Long canchaId, @RequestBody Cancha cancha) throws RecursoNoEncontradoException {
        return CanchaResponse.from(canchaService.actualizar(canchaId, cancha));
    }

        @DeleteMapping("/{canchaId}")
    public ResponseEntity<Void> eliminar(@PathVariable Long canchaId, @AuthenticationPrincipal Usuario usuarioActual, @RequestParam(required = false) String motivo)
            throws RecursoNoEncontradoException, AccesoDenegadoException {
        canchaService.eliminar(canchaId, usuarioActual, motivo);
        return ResponseEntity.noContent().build();
    }

}