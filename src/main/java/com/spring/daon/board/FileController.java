//package com.spring.daon.board;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import com.amazonaws.services.s3.model.S3Object;
//
//import java.io.IOException;
//
//@RestController
//@RequestMapping("/api/files")
//public class FileController {
//
//    private final S3Service s3Service;
//
//    @Autowired
//    public FileController(S3Service s3Service) {
//        this.s3Service = s3Service;
//    }
//
//    @PostMapping("/upload")
//    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
//        return ResponseEntity.ok(s3Service.uploadFile(file));
//    }
//
//    @GetMapping("/download/{fileName}")
//    public ResponseEntity<byte[]> downloadFile(@PathVariable String fileName) throws IOException {
//        S3Object s3Object = s3Service.downloadFile(fileName);
//        byte[] content = s3Object.getObjectContent().readAllBytes();
//        return ResponseEntity.ok(content);
//    }
//}
//
