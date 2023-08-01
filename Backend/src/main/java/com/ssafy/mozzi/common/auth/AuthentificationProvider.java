package com.ssafy.mozzi.common.auth;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

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
     * @param ORACLE_CLOUD_PUBLIC_KEY String
     * @return 저장한 파일의 index Id
     * @see AuthentificationProvider
     * @see ConfigFileReader
     * @see Supplier
     * @see SimpleAuthenticationDetailsProvider
     */
    public AuthenticationDetailsProvider getAuthenticationDetailsProvider(final String ORACLE_CLOUD_PUBLIC_KEY) throws
        IOException {
        ClassLoader classLoader = AuthentificationProvider.class.getClassLoader();
        File tempConfigFile = new File(classLoader.getResource("config/oci_api_config").getFile());
        File tempOCIAPIKey = new File(
            classLoader.getResource("config/" + ORACLE_CLOUD_PUBLIC_KEY).getFile());

        ConfigFile config = ConfigFileReader.parse(tempConfigFile.getPath(), "DEFAULT");

        Supplier<InputStream> privateKeySupplier = new SimplePrivateKeySupplier(tempOCIAPIKey.getPath());

        return SimpleAuthenticationDetailsProvider.builder()
            .tenantId(config.get("tenancy")).userId(config.get("user")).fingerprint(config.get("fingerprint"))
            .privateKeySupplier(privateKeySupplier).region(Region.AP_CHUNCHEON_1).build();
    }

}
