package com.ssafy.mozzi.db.datasource;

import java.util.Map;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;
import org.springframework.core.env.Environment;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;

import com.zaxxer.hikari.HikariDataSource;

@Configuration
@EnableJpaRepositories(
    basePackages = "com.ssafy.mozzi.db.repository.remote"
    , entityManagerFactoryRef = RemoteDatasource.ENTITY_MANAGER_FACTORY
    , transactionManagerRef = RemoteDatasource.TRANSACTION_MANAGER
)
@PropertySources({
    @PropertySource("classpath:application.properties"),
    @PropertySource("classpath:application-keys.properties")
})
public class RemoteDatasource {
    public static final String DATA_SOURCE_NAME = "remote";
    public static final String DATA_SOURCE = DATA_SOURCE_NAME + "_DATA_SOURCE"; // memberDataSource
    public static final String TRANSACTION_MANAGER =
        DATA_SOURCE_NAME + "_TRANSACTION_MANAGER"; // memberTransactionManager
    public static final String ENTITY_MANAGER_FACTORY =
        DATA_SOURCE_NAME + "_ENTITY_MANAGER_FACTORY"; // memberEntityManagerFactory

    private final String showSql;
    private final String formatSql;
    private final String useSQLComments;
    private final String maximumPoolSize;
    private final String hbm2ddl;
    private final String dialect;

    @Autowired
    RemoteDatasource(Environment environment) {
        showSql = environment.getProperty("spring.remote-source.show_sql");
        formatSql = environment.getProperty("spring.remote-source.format_sql");
        useSQLComments = environment.getProperty("spring.remote-source.use_sql_comments");
        maximumPoolSize = environment.getProperty("spring.remote-source.maximum-pool-size");
        hbm2ddl = environment.getProperty("spring.remote-source.hbm2ddl");
        dialect = environment.getProperty("spring.remote-source.dialect");
    }


    @Bean(name = ENTITY_MANAGER_FACTORY)
    public LocalContainerEntityManagerFactoryBean entityManagerFactory() {
        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(datasource());
        em.setPackagesToScan("com.ssafy.mozzi.db.entity.remote");
        HibernateJpaVendorAdapter adapter = new HibernateJpaVendorAdapter();
        adapter.setGenerateDdl(true);
        em.setJpaVendorAdapter(adapter);
        em.setJpaPropertyMap(
            Map.of(
                "hibernate.hbm2ddl", hbm2ddl
                , "hibernate.dialect", dialect
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
