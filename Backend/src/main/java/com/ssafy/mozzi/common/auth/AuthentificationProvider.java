package com.ssafy.mozzi.common.auth;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

import org.apache.commons.io.FileUtils;
import org.springframework.core.io.ClassPathResource;

import com.google.common.base.Supplier;
import com.oracle.bmc.ConfigFileReader;
import com.oracle.bmc.ConfigFileReader.ConfigFile;
import com.oracle.bmc.Region;
import com.oracle.bmc.auth.AbstractAuthenticationDetailsProvider;
import com.oracle.bmc.auth.AuthenticationDetailsProvider;
import com.oracle.bmc.auth.SimpleAuthenticationDetailsProvider;
import com.oracle.bmc.auth.SimplePrivateKeySupplier;

public class AuthentificationProvider implements AbstractAuthenticationDetailsProvider {
    /**
     * Oracle Cloud 연결 시 필요한 Authentication을 설정하는 함수
     * @param ORACLE_CLOUD_PRIVATE_KEY String
     * @return 저장한 파일의 index Id
     * @see AuthentificationProvider
     * @see ConfigFileReader
     * @see Supplier
     * @see SimpleAuthenticationDetailsProvider
     */
    public AuthenticationDetailsProvider getAuthenticationDetailsProvider(final String ORACLE_CLOUD_PRIVATE_KEY,
        final String OCI_API_CONFIG_PATH) throws
        IOException {

        // OCI 구성 파일 읽기

        InputStream configInputStream = new ClassPathResource(OCI_API_CONFIG_PATH).getInputStream();
        File ConfigFileResource = File.createTempFile("oci_api_config", "");

        FileUtils.copyInputStreamToFile(configInputStream, ConfigFileResource);
        ConfigFile config = ConfigFileReader.parse(ConfigFileResource.getPath(), "DEFAULT");

        InputStream keyInputStream = new ClassPathResource(ORACLE_CLOUD_PRIVATE_KEY).getInputStream();
        File privateKeyResource = File.createTempFile(ORACLE_CLOUD_PRIVATE_KEY, ".pem");

        FileUtils.copyInputStreamToFile(keyInputStream, privateKeyResource);
        Supplier<InputStream> privateKeySupplier = new SimplePrivateKeySupplier(privateKeyResource.getPath());

        return SimpleAuthenticationDetailsProvider.builder()
            .tenantId(config.get("tenancy")).userId(config.get("user")).fingerprint(config.get("fingerprint"))
            .privateKeySupplier(privateKeySupplier).region(Region.AP_CHUNCHEON_1).build();
    }

}

