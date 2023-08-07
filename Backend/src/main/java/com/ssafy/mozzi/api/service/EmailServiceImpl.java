package com.ssafy.mozzi.api.service;

import java.io.InputStream;
import java.util.Properties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import net.markenwerk.utils.mail.dkim.Canonicalization;
import net.markenwerk.utils.mail.dkim.DkimMessage;
import net.markenwerk.utils.mail.dkim.DkimSigner;
import net.markenwerk.utils.mail.dkim.SigningAlgorithm;

import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

@Service
@PropertySource("classpath:application-keys.properties")
public class EmailServiceImpl implements EmailService {

    final String senderEmail;
    final String senderId;
    final String senderPw;
    final String smtpDomain;
    final String smtpHost;
    final String smtpPort;
    final String dkimSelector;
    final DkimSigner dkimSigner;
    // final byte[] dkim;

    @Autowired
    EmailServiceImpl(Environment env) throws Exception {
        senderEmail = env.getProperty("SMTP_SENDER_EMAIL");
        senderId = env.getProperty("SMTP_SENDER_ID");
        senderPw = env.getProperty("SMTP_SENDER_PW");
        smtpDomain = env.getProperty("SMTP_DOMAIN");
        smtpHost = env.getProperty("SMTP_HOST");
        smtpPort = env.getProperty("SMTP_PORT");
        dkimSelector = env.getProperty("SMTP_DKIM_SELECTOR");
        // dkim = new ClassPathResource("config/dkim.der").getContentAsByteArray();
        // KeyFactory rsaKeyFactory = KeyFactory.getInstance("RSA");
        // PKCS8EncodedKeySpec privateKeySpec = new PKCS8EncodedKeySpec(dkim);
        // PrivateKey key = rsaKeyFactory.generatePrivate(privateKeySpec);

        InputStream dkimStream = new ClassPathResource("config/dkim.der").getInputStream();
        dkimSigner = new DkimSigner(smtpDomain, dkimSelector,
            dkimStream
        );
        dkimSigner.setIdentity(senderEmail);
        dkimSigner.setHeaderCanonicalization(Canonicalization.SIMPLE);
        dkimSigner.setBodyCanonicalization(Canonicalization.RELAXED);
        dkimSigner.setSigningAlgorithm(SigningAlgorithm.SHA256_WITH_RSA);
        dkimSigner.setLengthParam(true);
        dkimSigner.setCopyHeaderFields(false);
    }

    @Override
    public void passwordReset(String email, String password) {
        // System.setProperty("jdk.tls.client.protocols", "TLSv1.2");
        final String encoding = "utf-8";

        Properties prop = new Properties();
        // prop.put("mail.debug", true);
        // prop.put("mail.smtp.starttls.enable", "true");
        prop.put("mail.smtp.host", smtpHost);
        prop.put("mail.smtp.port", Integer.parseInt(smtpPort));
        prop.put("mail.smtp.auth", "false");
        // prop.put("mail.smtp.ssl.enable", "true");
        // prop.put("mail.smtp.ssl.trust", "mozzi.lol");
        prop.put("mail.smtp.quitwait", "false");
        prop.put("mail.smtp.socketFactory.port", smtpPort);
        // prop.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        prop.put("mail.smtp.socketFactory.fallback", "false");
        // prop.setProperty("mail.smtp.ssl.protocols", "TLSv1.2");

        Session session = Session.getDefaultInstance(prop, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(senderId, senderPw);
            }
        });

        MimeMessage message = new MimeMessage(session);

        try {
            message.setFrom(new InternetAddress(senderEmail));
            message.addRecipient(Message.RecipientType.TO, new InternetAddress(email));
            message.setSubject("[Mozzi.lol] 패스워드 초기화 안내", encoding);

            String content = "초기화된 비밀번호는 " + password + "입니다.\n해당 비밀번호를 이용하여 로그인 후 패스워드 변경하시기 바랍니다.";
            message.setText(content, "utf-8");

            DkimMessage dkimMessage = new DkimMessage(message, dkimSigner);
            Transport.send(dkimMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return;
    }
}
