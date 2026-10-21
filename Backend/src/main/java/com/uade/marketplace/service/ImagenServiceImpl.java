package com.uade.marketplace.service;

import java.io.IOException;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import javax.sql.rowset.serial.SerialBlob;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.uade.marketplace.dto.response.ImagenResponse;
import com.uade.marketplace.entity.Imagen;
import com.uade.marketplace.entity.Cancha;
import com.uade.marketplace.entity.Usuario;
import com.uade.marketplace.entity.enums.Rol;
import com.uade.marketplace.exceptions.AccesoDenegadoException;
import com.uade.marketplace.exceptions.RecursoNoEncontradoException;
import com.uade.marketplace.exceptions.SolicitudInvalidaException;
import com.uade.marketplace.repository.ImagenRepository;
import com.uade.marketplace.repository.CanchaRepository;

@Service
public class ImagenServiceImpl implements ImagenService {
    private static final String IMAGEN_POR_DEFECTO = "static/imagenes/Pelota.png";

    @Autowired
    private ImagenRepository imagenRepository;

    @Autowired
    private CanchaRepository canchaRepository;

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public List<Imagen> guardar(Long idCancha, List<MultipartFile> archivos, Usuario actor)
            throws RecursoNoEncontradoException, AccesoDenegadoException, IOException, SQLException {
        if (idCancha == null)
            throw new SolicitudInvalidaException("Falta indicar la cancha");
        if (archivos == null || archivos.isEmpty())
            throw new SolicitudInvalidaException("No se envió ninguna imagen");

        // Primero se validan todos los archivos, así no se guarda ninguno si alguno está mal
        for (MultipartFile archivo : archivos) {
            if (archivo.isEmpty())
                throw new SolicitudInvalidaException("Uno de los archivos está vacío");
            if (archivo.getContentType() == null || !archivo.getContentType().startsWith("image/"))
                throw new SolicitudInvalidaException("El archivo " + archivo.getOriginalFilename() + " no es una imagen");
        }

        Cancha cancha = canchaRepository.findById(idCancha)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe la cancha " + idCancha));
        validarDuenio(cancha, actor);

        List<Imagen> guardadas = new ArrayList<>();
        for (MultipartFile archivo : archivos) {
            Blob blob = new SerialBlob(archivo.getBytes());
            Imagen imagen = Imagen.builder().cancha(cancha).imagen(blob).build();
            guardadas.add(imagenRepository.save(imagen));
        }
        return guardadas;
    }

    @Override
    @Transactional(readOnly = true)
    public ImagenResponse buscarPorId(Long idImagen) throws RecursoNoEncontradoException, SQLException {
        Imagen imagen = imagenRepository.findById(idImagen)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe la imagen " + idImagen));
        return aResponse(imagen);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ImagenResponse> buscarPorCancha(Long idCancha) throws SQLException, IOException {
        List<Imagen> imagenes = imagenRepository.findByCancha_IdCancha(idCancha);

        // Si la cancha no tiene fotos, devuelve solo la imagen por defecto
        if (imagenes.isEmpty())
            return List.of(imagenPorDefecto());

        List<ImagenResponse> respuesta = new ArrayList<>();
        for (Imagen imagen : imagenes) {
            respuesta.add(aResponse(imagen));
        }
        return respuesta;
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public void eliminar(Long idImagen, Usuario actor) throws RecursoNoEncontradoException, AccesoDenegadoException {
        Imagen imagen = imagenRepository.findById(idImagen)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe la imagen " + idImagen));
        if (imagen.getCancha() == null)
            throw new AccesoDenegadoException("No se puede borrar una imagen precargada");
        validarDuenio(imagen.getCancha(), actor);
        imagenRepository.delete(imagen);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ImagenResponse> buscarPrecargadas() throws SQLException {
        List<Imagen> imagenes = imagenRepository.findByCanchaIsNull();
        List<ImagenResponse> respuesta = new ArrayList<>();
        for (Imagen imagen : imagenes) {
            respuesta.add(aResponse(imagen));
        }
        return respuesta;
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    public Imagen asignarPrecargada(Long idCancha, Long idImagenPrecargada, Usuario actor)
            throws RecursoNoEncontradoException, AccesoDenegadoException, SQLException {
        Cancha cancha = canchaRepository.findById(idCancha)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe la cancha " + idCancha));
        validarDuenio(cancha, actor);

        Imagen precargada = imagenRepository.findById(idImagenPrecargada)
                .orElseThrow(() -> new RecursoNoEncontradoException("No existe la imagen " + idImagenPrecargada));

        Imagen copia = Imagen.builder()
                .nombre(precargada.getNombre())
                .imagen(precargada.getImagen())
                .cancha(cancha)
                .build();
        return imagenRepository.save(copia);
    }


    private void validarDuenio(Cancha cancha, Usuario actor) throws AccesoDenegadoException {
        boolean esDuenio = cancha.getPublicador() != null
                && cancha.getPublicador().getIdUsuario().equals(actor.getIdUsuario());
        if (!esDuenio && actor.getRol() != Rol.ADMIN)
            throw new AccesoDenegadoException("No podés modificar las imágenes de esta cancha");
    }

    
    private ImagenResponse aResponse(Imagen imagen) throws SQLException {
        return ImagenResponse.builder()
                .id(imagen.getIdImagen())
                .nombre(imagen.getNombre())
                .file(aBase64(imagen.getImagen()))
                .build();
    }

    private ImagenResponse imagenPorDefecto() throws IOException {
        byte[] bytes = new ClassPathResource(IMAGEN_POR_DEFECTO).getInputStream().readAllBytes();
        return ImagenResponse.builder()
                .id(null)
                .file(Base64.getEncoder().encodeToString(bytes))
                .build();
    }

    private String aBase64(Blob blob) throws SQLException {
        byte[] bytes = blob.getBytes(1, (int) blob.length());
        return Base64.getEncoder().encodeToString(bytes);
    }
}