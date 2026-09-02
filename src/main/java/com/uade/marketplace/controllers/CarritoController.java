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
import org.springframework.web.bind.annotation.RestController;

import com.uade.marketplace.dto.request.ItemCarritoRequest;
import com.uade.marketplace.dto.response.CarritoResponse;
import com.uade.marketplace.dto.response.InscripcionResponse;
import com.uade.marketplace.entity.Usuario;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;
import com.uade.marketplace.exceptions.TurnoSinCuposException;
import com.uade.marketplace.service.CarritoService;

@RestController
@RequestMapping("/carrito")
public class CarritoController {

    @Autowired
    private CarritoService carritoService;

    @GetMapping
    public CarritoResponse getCarrito(@AuthenticationPrincipal Usuario usuario) throws RecursoNoEncontradoException {
        return CarritoResponse.from(carritoService.getPorUsuario(usuario.getIdUsuario()));
    }

    @PostMapping("/items")
    public CarritoResponse agregarItem(@AuthenticationPrincipal Usuario usuario,
                                       @RequestBody ItemCarritoRequest request) throws RecursoNoEncontradoException {
        return CarritoResponse.from(carritoService.agregarItem(usuario.getIdUsuario(), request.getIdTurno(), request.getCantidad()));
    }

    @PutMapping("/items/{idItem}")
    public CarritoResponse actualizarCantidad(@AuthenticationPrincipal Usuario usuario,
                                              @PathVariable Long idItem,
                                              @RequestBody ItemCarritoRequest request) throws RecursoNoEncontradoException {
        return CarritoResponse.from(carritoService.actualizarCantidad(usuario.getIdUsuario(), idItem, request.getCantidad()));
    }

    @DeleteMapping("/items/{idItem}")
    public CarritoResponse quitarItem(@AuthenticationPrincipal Usuario usuario,
                                      @PathVariable Long idItem) throws RecursoNoEncontradoException {
        return CarritoResponse.from(carritoService.quitarItem(usuario.getIdUsuario(), idItem));
    }

    @DeleteMapping
    public ResponseEntity<Void> vaciar(@AuthenticationPrincipal Usuario usuario) throws RecursoNoEncontradoException {
        carritoService.vaciar(usuario.getIdUsuario());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/checkout")
    public List<InscripcionResponse> checkout(@AuthenticationPrincipal Usuario usuario)
            throws RecursoNoEncontradoException, TurnoSinCuposException {
        return carritoService.checkout(usuario.getIdUsuario()).stream()
                .map(InscripcionResponse::from)
                .toList();
    }
}
