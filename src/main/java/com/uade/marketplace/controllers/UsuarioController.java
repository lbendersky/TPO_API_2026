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

import com.uade.marketplace.dto.response.UsuarioResponse;
import com.uade.marketplace.entity.Usuario;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;
import com.uade.marketplace.service.UsuarioService;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {
    @Autowired private UsuarioService UsuarioService;

    @GetMapping("")
    public List<UsuarioResponse> getAll() {
        return UsuarioService.getAll().stream().map(UsuarioResponse::from).toList();
    }

    @GetMapping("/{usuarioId}")
    public ResponseEntity<UsuarioResponse> getById(@PathVariable Long usuarioId) {
        return UsuarioService.getById(usuarioId)
            .map(u -> ResponseEntity.ok(UsuarioResponse.from(u)))
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UsuarioResponse> buscarPorEmail(@PathVariable String email) {
        return UsuarioService.buscarPorEmail(email)
            .map(u -> ResponseEntity.ok(UsuarioResponse.from(u)))
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("")
    public UsuarioResponse crear(@RequestBody Usuario usuario) {
        return UsuarioResponse.from(UsuarioService.crear(usuario));
    }

    @PutMapping("/{usuarioId}")
    public UsuarioResponse actualizar(@PathVariable Long usuarioId, @RequestBody Usuario usuario) throws RecursoNoEncontradoException {
        return UsuarioResponse.from(UsuarioService.actualizar(usuarioId, usuario));
    }

    @DeleteMapping("/{usuarioId}")
    public ResponseEntity<Void> eliminar(@PathVariable Long usuarioId) {
        UsuarioService.eliminar(usuarioId);
        return ResponseEntity.noContent().build();
    }
}
