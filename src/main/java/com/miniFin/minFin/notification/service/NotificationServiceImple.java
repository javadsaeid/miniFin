package com.miniFin.minFin.notification.service;

import com.miniFin.minFin.auth_users.entity.User;
import com.miniFin.minFin.enums.NotificationType;
import com.miniFin.minFin.notification.dtos.NotificationDTO;
import com.miniFin.minFin.notification.entity.Notification;
import com.miniFin.minFin.notification.repo.NotificationRepo;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.nio.charset.StandardCharsets;

@Service
@Slf4j
@AllArgsConstructor
public class NotificationServiceImple implements NotificationService {
    private final NotificationRepo notificationRepo;
    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Async
    @Override
    public void sendEmail(NotificationDTO notificationDTO, User user) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(
                    mimeMessage,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name()
            );

            mimeMessageHelper.setTo(notificationDTO.getRecipient());
            mimeMessageHelper.setSubject(notificationDTO.getSubject());

            if (notificationDTO.getTemplateName() != null) {
                Context context = new Context();
                context.setVariables(notificationDTO.getTemplateVariables());

                String htmlContent = templateEngine.process(notificationDTO.getTemplateName(), context);
                mimeMessageHelper.setText(htmlContent, true);
            } else {
                mimeMessageHelper.setText(notificationDTO.getBody(), true);
            }
            mailSender.send(mimeMessage);
            Notification notification = Notification.builder()
                    .recipient(notificationDTO.getRecipient())
                    .subject(notificationDTO.getSubject())
                    .body(notificationDTO.getBody())
                    .user(user)
                    .type(NotificationType.EMAIL)
                    .build();

            notificationRepo.save(notification);
        }catch (MessagingException exception) {
            log.error(exception.getMessage());
        }
    }
}
