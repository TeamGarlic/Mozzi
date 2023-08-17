package com.ssafy.mozzi.common.auth;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import com.oracle.bmc.Region;
import com.oracle.bmc.http.ResteasyClientConfigurator;
import com.oracle.bmc.objectstorage.ObjectStorage;

import lombok.Getter;

@Component
@Getter
public class ObjectStorageClient {
    private ObjectStorage client;

    @Autowired
    ObjectStorageClient(Environment env) throws IOException {
        // ObjectStorage의 Client 생성
        this.client = com.oracle.bmc.objectstorage.ObjectStorageClient.builder()
            .additionalClientConfigurator(new ResteasyClientConfigurator())
            .build((new AuthentificationProvider()).getAuthenticationDetailsProvider(
                env.getProperty("ORACLE_CLOUD_PRIVATE_KEY"),
                env.getProperty("OCI_API_CONFIG_PATH")));
        this.client.setRegion(Region.AP_CHUNCHEON_1);
    }
}
