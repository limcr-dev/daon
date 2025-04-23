package com.spring.daon.board;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.web.multipart.MultipartFile;

import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.core.ResponseBytes;

@Service
@RequiredArgsConstructor
public class S3Service {

    private S3Client s3Client; // final 제거!

    @Value("${cloud.aws.credentials.access-key}")
    private String accessKey;

    @Value("${cloud.aws.credentials.secret-key}")
    private String secretKey;

    @Value("${cloud.aws.region.static}")
    private String region;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    @PostConstruct
    public void init() {
        AwsBasicCredentials awsCreds = AwsBasicCredentials.create(accessKey, secretKey);

        this.s3Client = S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(awsCreds))
                .build();
    }

    public void uploadFile(String keyName, Path filePath) {
        PutObjectRequest putOb = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(keyName)
                .build();

        s3Client.putObject(putOb, filePath);

        System.out.println(" 파일 업로드 성공: " + keyName);
    }
    
    public String uploadFile(MultipartFile file) throws IOException {
    	
        // 1. 파일 이름 만들기 (UUID + 원래 파일명)
    	  String originalFilename = file.getOriginalFilename();
    	    
	    // 🔥 파일명 URL 인코딩 (UTF-8로 변환)
	    String encodedFilename = URLEncoder.encode(originalFilename, StandardCharsets.UTF_8);

	    // 🔥 UUID를 붙여서 최종 파일명 생성
	    String fileName = UUID.randomUUID() + "_" + encodedFilename;

	    PutObjectRequest putObjectRequest = PutObjectRequest.builder()
	            .bucket(bucketName)
	            .key(fileName)
	            .contentType(file.getContentType())
	            .build();

	    s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));

	    System.out.println(" 파일 업로드 성공: " + fileName);
	    return fileName;
	}

    
    // ⭐ 다운로드
    public byte[] downloadFile(String fileName) throws IOException {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .build();

        ResponseBytes<GetObjectResponse> objectBytes = s3Client.getObjectAsBytes(getObjectRequest);
        return objectBytes.asByteArray();
    }

    // ⭐ 삭제
    public void deleteFile(String fileName) {
        DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(fileName)
                .build();

        s3Client.deleteObject(deleteObjectRequest);
    }    
   
}
