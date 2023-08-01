package com.ssafy.mozzi.db.repository.cloud;

import com.oracle.bmc.objectstorage.ObjectStorage;
import com.oracle.bmc.objectstorage.model.StorageTier;
import com.oracle.bmc.objectstorage.requests.GetObjectRequest;
import com.oracle.bmc.objectstorage.requests.PutObjectRequest;
import com.oracle.bmc.objectstorage.responses.GetObjectResponse;
import com.oracle.bmc.objectstorage.responses.PutObjectResponse;
import com.ssafy.mozzi.common.exception.handler.CloudStorageSaveFailException;
import java.io.InputStream;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Repository;

@Repository
public class FileRepository {
    private final String ORACLE_NAMESPACE;
    private final String ORACLE_BUCKET;

    @Autowired
    FileRepository(Environment env) {
        this.ORACLE_NAMESPACE = Objects.requireNonNull(env.getProperty("ORACLE_NAMESPACE"));
        this.ORACLE_BUCKET = Objects.requireNonNull(env.getProperty("ORACLE_BUCKET"));
    }

    public PutObjectResponse putObject(ObjectStorage client, InputStream file, String objectName, String contentType) {
        PutObjectRequest putObjectRequest = null;
        try {
            putObjectRequest = PutObjectRequest.builder()
                .bucketName(ORACLE_BUCKET)
                .namespaceName(ORACLE_NAMESPACE)
                .objectName(objectName)
                .contentType(contentType)
                .contentLength(30L)
                .putObjectBody(file)
                .storageTier(StorageTier.Standard).build();
        } catch (Exception e) {
            throw new CloudStorageSaveFailException("파일 업로드 실패");
        }

        if (putObjectRequest == null)
            throw new CloudStorageSaveFailException("파일 Object 변환 실패");
        return client.putObject(putObjectRequest);
    }

    public GetObjectResponse getObject(ObjectStorage client, String objectName) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
            .bucketName(ORACLE_BUCKET)
            .namespaceName(ORACLE_NAMESPACE)
            .objectName(objectName).build();

        if (getObjectRequest==null) throw new CloudStorageSaveFailException("파일 Get 실패");

        return client.getObject(getObjectRequest);
    }
}
