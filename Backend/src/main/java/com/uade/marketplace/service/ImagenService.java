package com.uade.marketplace.service;

import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.uade.marketplace.dto.response.ImagenResponse;
import com.uade.marketplace.entity.Imagen;
import com.uade.marketplace.entity.Usuario;
import com.uade.marketplace.exceptions.AccesoDenegadoException;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;

public interface ImagenService {
    List<Imagen> guardar(Long idTurno, List<MultipartFile> archivos, Usuario actor)
            throws RecursoNoEncontradoException, AccesoDenegadoException, IOException, SQLException;

    ImagenResponse buscarPorId(Long idImagen) throws RecursoNoEncontradoException, SQLException;

    List<ImagenResponse> buscarPorTurno(Long idTurno) throws SQLException, IOException;

    void eliminar(Long idImagen, Usuario actor) throws RecursoNoEncontradoException, AccesoDenegadoException;
}