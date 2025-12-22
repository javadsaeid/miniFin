package com.miniFin.minFin;

import com.miniFin.minFin.auth_users.entity.User;
import com.miniFin.minFin.enums.NotificationType;
import com.miniFin.minFin.notification.dtos.NotificationDTO;
import com.miniFin.minFin.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@SpringBootApplication
@EnableAspectJAutoProxy
@RequiredArgsConstructor
public class MinFinApplication {

	private final NotificationService notificationService;

	public static void main(String[] args) {
		SpringApplication.run(MinFinApplication.class, args);
	}

	// its worked fine.
//	@Bean
//	CommandLineRunner init(NotificationService notificationService) {
//		return args -> {
//			NotificationDTO notificationDTO = NotificationDTO.builder()
//					.recipient("javadsaeid0@gmail.com")
//					.subject("test email")
//					.body("hey javad we are in spring boot")
//					.type(NotificationType.EMAIL)
//					.build();
//			notificationService.sendEmail(notificationDTO, new User());
//		};
//	}

}
