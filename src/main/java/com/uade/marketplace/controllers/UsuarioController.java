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

import com.uade.marketplace.entity.Usuario;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;
import com.uade.marketplace.service.UsuarioService;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {
    @Autowired private UsuarioService UsuarioService;

    @GetMapping("")
    public List<Usuario> getAll() {
        return UsuarioService.getAll();
    }
    
    @GetMapping("/{usuarioId}")
    public ResponseEntity<Usuario> getById(@PathVariable Long usuarioId) {
        return UsuarioService.getById(usuarioId)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @GetMapping("/email/{email}")
    public ResponseEntity<Usuario> buscarPorEmail(@PathVariable String email) {
        return UsuarioService.buscarPorEmail(email)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @PostMapping("")
    public Usuario crear(@RequestBody Usuario usuario) {
        return UsuarioService.crear(usuario);
    }

    @PutMapping("/{usuarioId}")
    public Usuario actualizar(@PathVariable Long usuarioId, @RequestBody Usuario usuario) throws RecursoNoEncontradoException {
        return UsuarioService.actualizar(usuarioId, usuario);
    }

    @DeleteMapping("/{usuarioId}")
    public ResponseEntity<Void> eliminar(@PathVariable Long usuarioId) {
        UsuarioService.eliminar(usuarioId);
        return ResponseEntity.noContent().build();
    }
}
