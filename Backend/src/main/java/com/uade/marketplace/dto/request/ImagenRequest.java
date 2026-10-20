package com.uade.marketplace.dto.request;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class ImagenRequest {
    private Long idCancha;
    private List<MultipartFile> files;
}