package com.spring.daon.board;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.util.UUID;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ContentDisposition;

import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import java.net.URLDecoder;


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
        String originalFilename = file.getOriginalFilename();
        String encodedFilename = URLEncoder.encode(originalFilename, StandardCharsets.UTF_8);
        String fileName = UUID.randomUUID() + "_" + encodedFilename;

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
            .bucket(bucketName)
            .key(fileName)
            .contentType(file.getContentType())
            .build();

        s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));
        System.out.println(" S3에 저장된 파일명: " + fileName);
        return fileName; //  실제 저장된 파일명 리턴
    }
    

    public ResponseEntity<InputStreamResource> downloadFile(String filename) throws UnsupportedEncodingException {
        // 1. 먼저 filename을 디코딩 (퍼센트 인코딩 풀어주기)
        String decodedFilename = URLDecoder.decode(filename, StandardCharsets.UTF_8.toString());

        // 2. UUID 제거 (UUID_ 이후 파일명만 추출)
        String originalFilename = decodedFilename.contains("_")
                ? decodedFilename.substring(decodedFilename.indexOf("_") + 1)
                : decodedFilename;

        // 3. 퍼센트 인코딩 다시 하기 (공백을 %20으로 유지)
        String utf8Filename = URLEncoder.encode(originalFilename, StandardCharsets.UTF_8.toString())
                .replaceAll("\\+", "%20");

        // 4. 헤더 세팅
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + originalFilename + "\"; filename*=UTF-8''" + utf8Filename);
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);

        // 5. 파일 읽어오기
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucketName)
                .key(filename)
                .build();

        ResponseInputStream<GetObjectResponse> s3Object = s3Client.getObject(getObjectRequest);
        InputStreamResource resource = new InputStreamResource(s3Object);

        return ResponseEntity.ok()
                .headers(headers)
                .body(resource);
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
