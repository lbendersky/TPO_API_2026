package com.uade.marketplace.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uade.marketplace.dto.request.UsuarioRequest;
import com.uade.marketplace.dto.response.UsuarioResponse;
import com.uade.marketplace.entity.Usuario;
import com.uade.marketplace.entity.enums.Rol;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;
import com.uade.marketplace.service.UsuarioService;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {
    @Autowired
    private UsuarioService usuarioService;

    @GetMapping("")
    public List<UsuarioResponse> getAll() {
        return usuarioService.getAll();
    }

    @GetMapping("/{usuarioId}")
    public ResponseEntity<UsuarioResponse> getById(@PathVariable Long usuarioId) {
        return usuarioService.getById(usuarioId)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping(params = "email")
    public ResponseEntity<UsuarioResponse> buscarPorEmail(@RequestParam String email) {
        return usuarioService.buscarPorEmail(email)
            .map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{usuarioId}")
    public UsuarioResponse actualizar(@PathVariable Long usuarioId,
                                      @RequestBody UsuarioRequest request,
                                      @AuthenticationPrincipal Usuario auth) throws RecursoNoEncontradoException {
        verificarPermiso(auth, usuarioId);
        return usuarioService.actualizar(usuarioId, request);
    }

    @DeleteMapping("/{usuarioId}")
    public ResponseEntity<Void> eliminar(@PathVariable Long usuarioId,
                                         @AuthenticationPrincipal Usuario auth) {
        verificarPermiso(auth, usuarioId);
        usuarioService.eliminar(usuarioId);
        return ResponseEntity.noContent().build();
    }

    private void verificarPermiso(Usuario auth, Long usuarioId) {
        if (auth.getRol() != Rol.ADMIN && !auth.getIdUsuario().equals(usuarioId)) {
            throw new AccessDeniedException("No podés modificar otro usuario");
        }
    }
}
