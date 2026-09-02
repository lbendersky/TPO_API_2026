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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uade.marketplace.dto.response.UsuarioResponse;
import com.uade.marketplace.entity.Usuario;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;
import com.uade.marketplace.service.UsuarioService;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {
    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("")
    public List<UsuarioResponse> getAll() {
        return usuarioService.getAll().stream().map(UsuarioResponse::from).toList();
    }

    @GetMapping("/{usuarioId}")
    public ResponseEntity<UsuarioResponse> getById(@PathVariable Long usuarioId) {
        return usuarioService.getById(usuarioId)
            .map(u -> ResponseEntity.ok(UsuarioResponse.from(u)))
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<UsuarioResponse> registrar(@RequestBody Usuario usuario) {
        Usuario nuevoUsuario = usuarioService.crear(usuario);
        return ResponseEntity.ok(UsuarioResponse.from(nuevoUsuario));
    }

    @GetMapping(params = "email")
    public ResponseEntity<UsuarioResponse> buscarPorEmail(@RequestParam String email) {
        return usuarioService.buscarPorEmail(email)
            .map(u -> ResponseEntity.ok(UsuarioResponse.from(u)))
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{usuarioId}")
    public UsuarioResponse actualizar(@PathVariable Long usuarioId, @RequestBody Usuario usuario) throws RecursoNoEncontradoException {
        return UsuarioResponse.from(usuarioService.actualizar(usuarioId, usuario));
    }

    @DeleteMapping("/{usuarioId}")
    public ResponseEntity<Void> eliminar(@PathVariable Long usuarioId) {
        usuarioService.eliminar(usuarioId);
        return ResponseEntity.noContent().build();
    }
}
