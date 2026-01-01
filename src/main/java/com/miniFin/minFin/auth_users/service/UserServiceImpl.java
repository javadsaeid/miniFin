package com.miniFin.minFin.auth_users.service;

import com.miniFin.minFin.auth_users.dtos.UpdatePasswordRequest;
import com.miniFin.minFin.auth_users.dtos.UserDTO;
import com.miniFin.minFin.auth_users.entity.User;
import com.miniFin.minFin.auth_users.repo.UserRepo;
import com.miniFin.minFin.exceptions.BadRequestException;
import com.miniFin.minFin.exceptions.NotFoundException;
import com.miniFin.minFin.notification.dtos.NotificationDTO;
import com.miniFin.minFin.notification.service.NotificationService;
import com.miniFin.minFin.res.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepo userRepo;
    private final NotificationService notificationService;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;

    private final String uploadDir="./upload/profile-pictures/";

    @Override
    public User gerCurrentLoggedInUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new NotFoundException("User is not authenticated");
        }

        String email = authentication.getName();

        return userRepo.findByEmail(email).orElseThrow(
                () -> new NotFoundException("User not found")
        );
    }

    @Override
    public Response<UserDTO> getMyProfile() {
        User user = gerCurrentLoggedInUser();
        UserDTO userDTO = modelMapper.map(user, UserDTO.class);

        return Response.<UserDTO>builder()
                .data(userDTO)
                .statusCode(HttpStatus.OK.value())
                .message("User retrieved")
                .build();
    }

    @Override
    public Response<Page<UserDTO>> getAllUsers(int page, int size) {
        Page<User> users = userRepo.findAll(PageRequest.of(page, size));
        Page<UserDTO> userDTOs = users.map(user -> modelMapper.map(user, UserDTO.class));

        return Response.<Page<UserDTO>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Users retrieved")
                .data(userDTOs)
                .build();
    }

    @Override
    public Response<?> updatePassword(UpdatePasswordRequest updatePasswordRequest) {
        User user = gerCurrentLoggedInUser();

        String newPassword = updatePasswordRequest.getNewPassword();
        String oldPassword = updatePasswordRequest.getOldPassword();

        if (oldPassword == null || newPassword == null) {
            throw new BadRequestException("Old password and new password are required");
        }

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new BadRequestException("Old password does not match");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setUpdatedAt(LocalDateTime.now());
        userRepo.save(user);

        //Send password change confirmation email
        Map<String, Object> vars = new HashMap<>();
        vars.put("name", user.getFirstName());

        NotificationDTO notificationDTO = NotificationDTO.builder()
                .recipient(user.getEmail())
                .subject("Your Password Was Successfully Changed.")
                .templateName("password-changed")
                .templateVariables(vars)
                .build();

        notificationService.sendEmail(notificationDTO, user);

        return Response.builder()
                .statusCode(HttpStatus.OK.value())
                .message("Password Changed Successfully")
                .build();
    }

    @Override
    public Response<?> updateProfilePicture(MultipartFile file) {
        User user = gerCurrentLoggedInUser();

        try {
            Path path = Paths.get(uploadDir);
            if (!Files.exists(path)) {
                Files.createDirectory(path);
            }

            // delete old image profile
            if (user.getProfilePictureUrl() != null) {
                Path oldPath = Paths.get(user.getProfilePictureUrl());
                if (Files.exists(oldPath)) {
                    Files.delete(oldPath);
                }
            }

            // Generate unique file name to avoid conflict
            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";

            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String newFileName = UUID.randomUUID() + "." + fileExtension;
            Path filePath = path.resolve(newFileName);
            Files.copy(file.getInputStream(), filePath);

            String fileUrl = uploadDir + newFileName;
            user.setProfilePictureUrl(fileUrl);
            userRepo.save(user);

        } catch (IOException e) {
            throw new RuntimeException(e.getMessage());
        }
        return Response.builder()
                .statusCode(HttpStatus.OK.value())
                .message("Profile picture updated successfully")
                .build();
    }
}
