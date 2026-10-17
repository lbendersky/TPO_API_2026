package com.uade.marketplace.dto.request;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class ImagenRequest {
    private Long idTurno;
    private List<MultipartFile> files;
}