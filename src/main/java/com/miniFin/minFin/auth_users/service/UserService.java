package com.miniFin.minFin.auth_users.service;

import com.miniFin.minFin.auth_users.dtos.UpdatePasswordRequest;
import com.miniFin.minFin.auth_users.dtos.UserDTO;
import com.miniFin.minFin.auth_users.entity.User;
import com.miniFin.minFin.res.Response;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {
    User gerCurrentLoggedInUser();
    Response<UserDTO> getMyProfile();
    Response<Page<UserDTO>> getAllUsers(int page, int size);
    Response<?> updatePassword(UpdatePasswordRequest updatePasswordRequest);
    Response<?> updateProfilePicture(MultipartFile file);
}
