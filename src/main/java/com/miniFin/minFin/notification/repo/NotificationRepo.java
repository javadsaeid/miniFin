package com.miniFin.minFin.notification.repo;

import com.miniFin.minFin.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepo extends JpaRepository<Notification, Long> {
}
