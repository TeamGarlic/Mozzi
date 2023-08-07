package com.ssafy.mozzi.api.service;

import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.AddressException;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

@Service
@PropertySource("classpath:application-keys.properties")
public class EmailServiceImpl implements EmailService {

    final String senderEmail;
    final String senderId;
    final String senderPw;
    final String smtpHost;
    final String smtpPort;

    @Autowired
    EmailServiceImpl(Environment env) {
        senderEmail = env.getProperty("SMTP_SENDER_EMAIL");
        senderId = env.getProperty("garlic");
        senderPw = env.getProperty("SMTP_SENDER_PW");
        smtpHost = env.getProperty("SMTP_HOST");
        smtpPort = env.getProperty("SMTP_PORT");
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

        Session session = Session.getDefaultInstance(prop, new javax.mail.Authenticator() {
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

            Transport.send(message);    // send message

            return;
        } catch (AddressException e) {
            e.printStackTrace();
        } catch (MessagingException e) {
            e.printStackTrace();
        }
        return;
    }
}
