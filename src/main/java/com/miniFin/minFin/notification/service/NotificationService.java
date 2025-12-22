package com.miniFin.minFin.notification.service;

import com.miniFin.minFin.auth_users.entity.User;
import com.miniFin.minFin.notification.dtos.NotificationDTO;

public interface NotificationService {

    void sendEmail(NotificationDTO notificationDTO, User user);
}
