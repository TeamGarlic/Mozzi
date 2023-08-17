package com.ssafy.mozzi.db.datasource;

import java.util.Map;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;

import com.zaxxer.hikari.HikariDataSource;

@Configuration
@EnableJpaRepositories(
    basePackages = "com.ssafy.mozzi.db.repository.local"
    , entityManagerFactoryRef = LocalDatasource.ENTITY_MANAGER_FACTORY
    , transactionManagerRef = LocalDatasource.TRANSACTION_MANAGER
)
@PropertySource("classpath:application.properties")
public class LocalDatasource {
    public static final String DATA_SOURCE_NAME = "local";
    public static final String DATA_SOURCE = DATA_SOURCE_NAME + "_DATA_SOURCE"; // memberDataSource
    public static final String TRANSACTION_MANAGER =
        DATA_SOURCE_NAME + "_TRANSACTION_MANAGER"; // memberTransactionManager
    public static final String ENTITY_MANAGER_FACTORY =
        DATA_SOURCE_NAME + "_ENTITY_MANAGER_FACTORY"; // memberEntityManagerFactory

    private final String showSql;
    private final String formatSql;
    private final String useSQLComments;

    private final String maximumPoolSize;

    @Autowired
    LocalDatasource(Environment environment) {
        showSql = environment.getProperty("spring.local-source.show_sql");
        formatSql = environment.getProperty("spring.local-source.format_sql");
        useSQLComments = environment.getProperty("spring.local-source.use_sql_comments");
        maximumPoolSize = environment.getProperty("spring.local-source.maximum-pool-size");
    }

    @Bean(name = ENTITY_MANAGER_FACTORY)
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(datasource());
        em.setPackagesToScan("com.ssafy.mozzi.db.entity.local");
        HibernateJpaVendorAdapter adapter = new HibernateJpaVendorAdapter();
        adapter.setGenerateDdl(true);
        em.setJpaVendorAdapter(adapter);
        em.setJpaPropertyMap(
            Map.of(
                "hibernate.hbm2ddl", "update"
                , "hibernate.dialect", "org.hibernate.dialect.H2Dialect"
                , "hibernate.show_sql", showSql
                , "hibernate.format_sql", formatSql
                , "hibernate.use_sql_comments", useSQLComments
                , "hibernate.use_query_cache", "false"
                , "maximum-pool-size", maximumPoolSize
            )
        );
        return em;
    }

    @Bean(name = DATA_SOURCE)
    @ConfigurationProperties(prefix = "spring.local-source")
    public DataSource datasource() {
        // DataSource datasource = DataSourceBuilder.create().type(HikariDataSource.class).build();
        // return datasource;
        return DataSourceBuilder.create().type(HikariDataSource.class).build();
    }

    @Bean(name = TRANSACTION_MANAGER)
    public PlatformTransactionManager transactionManager() {
        JpaTransactionManager jpaTransactionManager = new JpaTransactionManager();
        jpaTransactionManager.setEntityManagerFactory(entityManagerFactory().getObject());
        return jpaTransactionManager;
    }
}
