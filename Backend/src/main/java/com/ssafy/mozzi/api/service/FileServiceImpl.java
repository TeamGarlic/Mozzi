package com.ssafy.mozzi.api.service;

import java.io.IOException;
import java.io.InputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.oracle.bmc.Region;
import com.oracle.bmc.http.ResteasyClientConfigurator;
import com.oracle.bmc.objectstorage.ObjectStorage;
import com.oracle.bmc.objectstorage.ObjectStorageClient;
import com.oracle.bmc.objectstorage.responses.PutObjectResponse;
import com.ssafy.mozzi.api.response.FileMozzirollPostRes;
import com.ssafy.mozzi.common.auth.AuthentificationProvider;
import com.ssafy.mozzi.common.exception.handler.CloudStorageSaveFailException;
import com.ssafy.mozzi.common.util.mapper.FileMapper;
import com.ssafy.mozzi.db.datasource.RemoteDatasource;
import com.ssafy.mozzi.db.entity.remote.Mozziroll;
import com.ssafy.mozzi.db.entity.remote.User;
import com.ssafy.mozzi.db.entity.remote.UserMozziroll;
import com.ssafy.mozzi.db.repository.cloud.FileRepository;
import com.ssafy.mozzi.db.repository.remote.MozzirollRepository;
import com.ssafy.mozzi.db.repository.remote.UserMozzirollRepository;

@Service
@PropertySource("classpath:application-keys.properties")
public class FileServiceImpl implements FileService {

    private final FileRepository fileRepository;
    private final MozzirollRepository mozzirollRepository;
    private final UserMozzirollRepository userMozzirollRepository;
    private final UserService userService;
    private final ObjectStorage client;

    @Autowired
    FileServiceImpl(FileRepository fileRepository, MozzirollRepository mozzirollRepository,
        UserMozzirollRepository userMozzirollRepository, UserService userService, Environment env) throws IOException {
        this.fileRepository = fileRepository;
        this.mozzirollRepository = mozzirollRepository;
        this.userMozzirollRepository = userMozzirollRepository;
        this.userService = userService;

        this.client = ObjectStorageClient.builder()
            .additionalClientConfigurator(new ResteasyClientConfigurator())
            .build((new AuthentificationProvider()).getAuthenticationDetailsProvider(
                env.getProperty("ORACLE_CLOUD_PUBLIC_KEY")));
        this.client.setRegion(Region.AP_CHUNCHEON_1);
    }

    @Override
    @Transactional(transactionManager = RemoteDatasource.TRANSACTION_MANAGER)
    public FileMozzirollPostRes saveMozziroll(MultipartFile file, String accessToken) {
        final String OBJECT_NAME = String.format("%s_%s", System.currentTimeMillis(), file.getOriginalFilename());
        String contentType = "multipart/form-data";

        // User 찾기
        User user = userService.findUserByToken(accessToken);
        if (user == null)
            throw new CloudStorageSaveFailException("파일 저장 유저 없음");
        // Mozziroll 테이블에 정보 추가.
        Mozziroll mozziroll = mozzirollRepository.save(
            Mozziroll.builder()
                .objectName(OBJECT_NAME)
                .build());
        if (mozziroll == null)
            throw new CloudStorageSaveFailException("Mozziroll 테이블 저장 실패");
        // UserMozziroll 테이블에 정보 추가
        UserMozziroll userMozziroll = userMozzirollRepository.save(UserMozziroll.builder()
            .mozziroll(mozziroll)
            .user(user)
            .build());
        if (userMozziroll == null)
            throw new CloudStorageSaveFailException("UserMozziroll 테이블 저장 실패");

        // Object Storage에 파일 추가
        PutObjectResponse response = null;
        try {
            response = fileRepository.putObject(client, generateStreamFromFile(file), OBJECT_NAME, contentType);
        } catch (IOException e) {
            throw new CloudStorageSaveFailException("파일 변환 실패");
        }

        if (response.getLastModified() == null)
            throw new CloudStorageSaveFailException("파일 업로드 실패");

        return FileMapper.toFileMozzirollPostRes(mozziroll);
    }

    public static InputStream generateStreamFromFile(MultipartFile file) throws IOException {
        return file.getInputStream();
    }
}
