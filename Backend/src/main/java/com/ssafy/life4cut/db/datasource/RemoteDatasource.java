package com.ssafy.life4cut.db.datasource;

import java.util.Map;

import javax.sql.DataSource;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;

import com.zaxxer.hikari.HikariDataSource;

@Configuration
@EnableJpaRepositories(
    basePackages = "com.ssafy.life4cut.db.repository.remote"
    , entityManagerFactoryRef = RemoteDatasource.ENTITY_MANAGER_FACTORY
    , transactionManagerRef = RemoteDatasource.TRANSACTION_MANAGER
)
public class RemoteDatasource {
    public static final String DATA_SOURCE_NAME = "remote";
    public static final String DATA_SOURCE = DATA_SOURCE_NAME + "_DATA_SOURCE"; // memberDataSource
    public static final String TRANSACTION_MANAGER =
        DATA_SOURCE_NAME + "_TRANSACTION_MANAGER"; // memberTransactionManager
    public static final String ENTITY_MANAGER_FACTORY =
        DATA_SOURCE_NAME + "_ENTITY_MANAGER_FACTORY"; // memberEntityManagerFactory

    @Bean(name = ENTITY_MANAGER_FACTORY)
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(datasource());
        em.setPackagesToScan("com.ssafy.life4cut.db.entity.remote");
        HibernateJpaVendorAdapter adapter = new HibernateJpaVendorAdapter();
        adapter.setGenerateDdl(true);
        em.setJpaVendorAdapter(adapter);
        em.setJpaPropertyMap(
            Map.of(
                "hibernate.hbm2ddl", "update"
                // , "hibernate.dialect", "org.hibernate.dialect.MariaDB103Dialect"
                , "hibernate.dialect", "org.hibernate.dialect.MySQL8Dialect"
                , "hibernate.show_sql", "true"
                , "hibernate.format_sql", "true"
                , "hibernate.use_sql_comments", "true"
                // , "hibernate.physical_naming_strategy",
                // "org.springframework.boot.orm.jpa.hibernate.SpringPhysicalNamingStrategy"
                //, "hibernate.implicit_naming_strategy"
                //, "org.springframework.boot.orm.jpa.hibernate.SpringImplicitNamingStrategy"
                , "hibernate.use_query_cache", "false"
                , "maximum-pool-size", "1"
            )
        );
        return em;
    }

    @Bean(name = DATA_SOURCE)
    @ConfigurationProperties(prefix = "spring.remote-source")
    public DataSource datasource() {
        return DataSourceBuilder.create().type(HikariDataSource.class).build();
    }

    @Bean(name = TRANSACTION_MANAGER)
    public PlatformTransactionManager transactionManager() {
        JpaTransactionManager jpaTransactionManager = new JpaTransactionManager();
        jpaTransactionManager.setEntityManagerFactory(entityManagerFactory().getObject());
        return jpaTransactionManager;
    }
}
