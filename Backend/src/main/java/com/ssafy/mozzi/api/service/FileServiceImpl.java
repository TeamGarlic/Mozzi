package com.ssafy.mozzi.api.service;

import java.util.Optional;

import org.springframework.context.annotation.PropertySource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.oracle.bmc.objectstorage.responses.GetObjectResponse;
import com.oracle.bmc.objectstorage.responses.PutObjectResponse;
import com.ssafy.mozzi.api.response.FileMozzirollPostRes;
import com.ssafy.mozzi.common.auth.ObjectStorageClient;
import com.ssafy.mozzi.common.dto.ObjectFileItem;
import com.ssafy.mozzi.common.exception.handler.CloudStorageSaveFailException;
import com.ssafy.mozzi.common.util.FileUtil;
import com.ssafy.mozzi.common.util.mapper.FileMapper;
import com.ssafy.mozzi.db.datasource.RemoteDatasource;
import com.ssafy.mozzi.db.entity.remote.Mozziroll;
import com.ssafy.mozzi.db.entity.remote.User;
import com.ssafy.mozzi.db.entity.remote.UserMozziroll;
import com.ssafy.mozzi.db.repository.cloud.FileRepository;
import com.ssafy.mozzi.db.repository.remote.MozzirollRepository;
import com.ssafy.mozzi.db.repository.remote.UserMozzirollRepository;

import lombok.RequiredArgsConstructor;

@Service
@PropertySource("classpath:application-keys.properties")
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {
    private final FileRepository fileRepository;
    private final MozzirollRepository mozzirollRepository;
    private final UserMozzirollRepository userMozzirollRepository;
    private final UserService userService;
    private final ObjectStorageClient client;

    /**
     * 모찌롤 파일을 ObjectStorage에 저장하고 해당 유저(방장)의 마이 페이지에 추가합니다.
     * @param file MultipartFile
     * @param accessToken String
     * @return 저장한 파일의 index Id
     * @see MozzirollRepository
     * @see UserMozzirollRepository
     * @see FileRepository
     * @see FileMozzirollPostRes
     * @see CloudStorageSaveFailException
     */
    @Override
    @Transactional(transactionManager = RemoteDatasource.TRANSACTION_MANAGER)
    public FileMozzirollPostRes saveMozziroll(MultipartFile file, String title, String accessToken) {
        final String OBJECT_NAME = String.format("%s_%s", System.currentTimeMillis(), file.getOriginalFilename());
        String contentType = "multipart/form-data";

        // User 찾기
        User user = userService.findUserByToken(accessToken);
        if (user == null)
            throw new CloudStorageSaveFailException("파일 저장 유저 없음");
        // Mozziroll 테이블에 정보 추가.
        // TODO: 모찌 제목 추가
        Mozziroll mozziroll = mozzirollRepository.save(
            Mozziroll.builder()
                .objectName(OBJECT_NAME)
                .creator(user)
                .build());

        // UserMozziroll 테이블에 정보 추가
        UserMozziroll userMozziroll = userMozzirollRepository.save(UserMozziroll.builder()
            .mozziroll(mozziroll)
            .title(title)
            .user(user)
            .build());

        // Object Storage에 파일 추가
        PutObjectResponse response = fileRepository.putObject(client.getClient(), FileUtil.generateStreamFromFile(file),
            OBJECT_NAME, contentType);

        if (response.getLastModified() == null)
            throw new CloudStorageSaveFailException("파일 업로드 실패");

        return FileMapper.toFileMozzirollPostRes(mozziroll);
    }

    /**
     * 모찌롤 파일을 ObjectStorage에 저장하고 해당 유저(방장)의 마이 페이지에 추가합니다.
     * @param mozzirollId String
     * @return MozzirollFileItem
     * @see MozzirollRepository
     * @see FileRepository
     * @see ObjectFileItem
     * @see FileMapper
     */
    @Override
    public ObjectFileItem downloadMozziroll(String mozzirollId) {
        Optional<Mozziroll> mozziroll = mozzirollRepository.findById(Long.parseLong(mozzirollId));
        GetObjectResponse getObjectResponse = fileRepository.getObject(client.getClient(),
            mozziroll.get().getObjectName());

        return FileMapper.toMozzirollItem(getObjectResponse, mozziroll);
    }

    /**
     * ObjectName으로 이미지/영상 반환하는 비즈니스 로직
     * @param ObjectName String
     * @return Resource
     * @see FileRepository
     * @see com.oracle.bmc.objectstorage.ObjectStorageClient
     * @see FileMapper
     */
    @Override
    public Resource getObject(String ObjectName) {
        GetObjectResponse getObjectResponse = fileRepository.getObject(client.getClient(), ObjectName);
        return FileMapper.toResource(getObjectResponse);
    }
}
