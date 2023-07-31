package com.ssafy.mozzi.api.service;

import java.io.IOException;
import java.io.InputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.oracle.bmc.Region;
import com.oracle.bmc.http.ResteasyClientConfigurator;
import com.oracle.bmc.objectstorage.ObjectStorage;
import com.oracle.bmc.objectstorage.ObjectStorageClient;
import com.oracle.bmc.objectstorage.responses.PutObjectResponse;
import com.ssafy.mozzi.api.response.FileMozziRollPostRes;
import com.ssafy.mozzi.common.auth.AuthentificationProvider;
import com.ssafy.mozzi.common.exception.handler.CloudStorageSaveFailException;
import com.ssafy.mozzi.db.repository.cloud.FileRepository;
import com.ssafy.mozzi.db.repository.remote.ClipRepository;

@Service
@PropertySource("classpath:application-keys.properties")
public class FileServiceImpl implements FileService {

    private final FileRepository fileRepository;
    private final ClipRepository clipRepository;
    private final ObjectStorage client;

    @Autowired
    FileServiceImpl(FileRepository fileRepository, ClipRepository clipRepository, Environment env) throws IOException {
        this.fileRepository = fileRepository;
        this.clipRepository = clipRepository;
        this.client = ObjectStorageClient.builder()
            .additionalClientConfigurator(new ResteasyClientConfigurator())
            .build((new AuthentificationProvider()).getAuthenticationDetailsProvider(
                env.getProperty("ORACLE_CLOUD_PUBLIC_KEY")));
        this.client.setRegion(Region.AP_CHUNCHEON_1);
    }

    @Override
    public FileMozziRollPostRes saveMozziRoll(MultipartFile file) {
        final String OBJECT_NAME = String.format("%s_%s", System.currentTimeMillis(), file.getOriginalFilename());
        String contentType = "multipart/form-data";

        PutObjectResponse response = null;
        try {
            response = fileRepository.putObject(client, generateStreamFromFile(file), OBJECT_NAME, contentType);
        } catch (IOException e) {
            throw new CloudStorageSaveFailException("파일 업로드 실패");
        }

        // 저장 실패
        if (response.getLastModified() == null)
            return null;

        // TODO: Clip/Mozziroll 테이블에 정보 추가.
        // Clip.builder().url(OBJECT_NAME).users();
        return null;
    }

    public static InputStream generateStreamFromFile(MultipartFile file) throws IOException {
        return file.getInputStream();
    }
}
