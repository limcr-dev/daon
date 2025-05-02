package com.spring.daon.messenger.file;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/messenger/file")
@RequiredArgsConstructor
public class FileController {
	private final FileServiceImpl fileService;
	
	@Value("${file.upload-dir}")
    private String uploadDir;
	
	// 파일 업로드
	@PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file,
                                        @RequestParam("roomCode") String roomCode,
                                        @RequestParam("senderId") int senderId) {
		System.out.println("<<< FileController - uploadFile >>>");
	    System.out.println("파일 업로드 요청 받음: " + file.getOriginalFilename());

	    String originalName = file.getOriginalFilename();
	    String savedName = UUID.randomUUID().toString() + "_" + originalName;

	    try {
	        File targetFolder = new File(uploadDir);
	        if (!targetFolder.exists()) {
	            targetFolder.mkdirs();
	        }

	        File targetFile = new File(targetFolder, savedName);
	        file.transferTo(targetFile);

	        System.out.println(">>> 저장 경로 확인: " + uploadDir);

	        // DB 저장
	        fileService.saveFile(roomCode, senderId, originalName, savedName);

	        // 클라이언트에 저장된 파일 이름 반환 (프론트에서 WebSocket 메시지 보낼 때 사용)
	        return ResponseEntity.ok(Map.of(
	            "message", "파일 업로드 완료",
	            "savedName", savedName,
	            "originalName", originalName
	        ));

	    } catch (IOException e) {
	        e.printStackTrace();
	        return ResponseEntity.internalServerError().body("파일 업로드 실패");
	    }
	}
	
	// 파일 다운로드
	@GetMapping("/uploads/download/{fileName:.+}")
	public ResponseEntity<Resource> downloadTextFile(@PathVariable String fileName) throws IOException {
	    Path filePath = Paths.get(uploadDir, fileName);
	    Resource resource = new UrlResource(filePath.toUri());

	    return ResponseEntity.ok()
	        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
	        .header(HttpHeaders.CONTENT_TYPE, "application/octet-stream")
	        .body(resource);
	}
}