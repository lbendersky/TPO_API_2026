package com.uade.marketplace.controllers;

import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uade.marketplace.dto.request.ImagenRequest;
import com.uade.marketplace.dto.response.ImagenResponse;
import com.uade.marketplace.entity.Imagen;
import com.uade.marketplace.entity.Usuario;
import com.uade.marketplace.exceptions.AccesoDenegadoException;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;
import com.uade.marketplace.service.ImagenService;

@RestController
@RequestMapping("/imagenes")
public class ImagenController {
    @Autowired
    private ImagenService imagenService;

    @GetMapping
    public ResponseEntity<ImagenResponse> verImagen(@RequestParam("id") Long id)
            throws RecursoNoEncontradoException, SQLException {
        return ResponseEntity.ok(imagenService.buscarPorId(id));
    }

    @GetMapping("/turno/{idTurno}")
    public ResponseEntity<List<ImagenResponse>> verImagenesDeTurno(@PathVariable Long idTurno)
            throws SQLException, IOException {
        return ResponseEntity.ok(imagenService.buscarPorTurno(idTurno));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> subirImagenes(@AuthenticationPrincipal Usuario actor,
                                                             @ModelAttribute ImagenRequest request)
            throws RecursoNoEncontradoException, AccesoDenegadoException, IOException, SQLException {
        List<Imagen> guardadas = imagenService.guardar(request.getIdTurno(), request.getFiles(), actor);

        List<Long> ids = new ArrayList<>();
        for (Imagen imagen : guardadas) {
            ids.add(imagen.getIdImagen());
        }
        return ResponseEntity.ok(Map.of("mensaje", "Imágenes guardadas correctamente", "idsImagenes", ids));
    }

    @DeleteMapping("/{idImagen}")
    public ResponseEntity<Map<String, String>> eliminarImagen(@AuthenticationPrincipal Usuario actor,
                                                              @PathVariable Long idImagen)
            throws RecursoNoEncontradoException, AccesoDenegadoException {
        imagenService.eliminar(idImagen, actor);
        return ResponseEntity.ok(Map.of("mensaje", "Imagen eliminada correctamente"));
    }
}