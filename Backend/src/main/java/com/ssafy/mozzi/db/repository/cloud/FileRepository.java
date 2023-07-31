package com.ssafy.mozzi.db.repository.cloud;

import java.io.InputStream;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Repository;

import com.oracle.bmc.objectstorage.ObjectStorage;
import com.oracle.bmc.objectstorage.model.StorageTier;
import com.oracle.bmc.objectstorage.requests.PutObjectRequest;
import com.oracle.bmc.objectstorage.responses.PutObjectResponse;

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
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
            .bucketName(ORACLE_BUCKET)
            .namespaceName(ORACLE_NAMESPACE)
            .objectName(objectName)
            .contentType(contentType)
            .contentLength(30L)
            .putObjectBody(file)
            .storageTier(StorageTier.Standard).build();
        return client.putObject(putObjectRequest);
    }
}
