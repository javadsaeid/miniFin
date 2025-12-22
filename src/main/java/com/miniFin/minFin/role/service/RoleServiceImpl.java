package com.miniFin.minFin.role.service;

import com.miniFin.minFin.exceptions.BadRequestException;
import com.miniFin.minFin.exceptions.NotFoundException;
import com.miniFin.minFin.res.Response;
import com.miniFin.minFin.role.entity.Role;
import com.miniFin.minFin.role.repo.RoleRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private final RoleRepo roleRepo;

    @Override
    public Response<Role> createRole(Role roleRequest) {
        if (roleRepo.findByName(roleRequest.getName()).isPresent()) {
            throw new BadRequestException("role name already exist");
        }

        Role role = roleRepo.save(roleRequest);

        return Response.<Role>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Role saved")
                .data(role).build();
    }

    @Override
    public Response<Role> updateRole(Role roleRequest) {
        Role role = roleRepo.findById(roleRequest.getId())
                .orElseThrow(() -> new NotFoundException("role not found"));

        role.setName(roleRequest.getName());
        roleRepo.save(role);

        return Response.<Role>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Role updated")
                .data(role).build();
    }

    @Override
    public Response<List<Role>> getAllRoles() {
        List<Role> roles = roleRepo.findAll();

        return Response.<List<Role>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("all role")
                .data(roles).build();
    }

    @Override
    public Response<?> deleteRole(Long roleId) {
        if (!roleRepo.existsById(roleId)) {
            throw new NotFoundException("role not found");
        }

        roleRepo.deleteById(roleId);

        return Response.builder()
                .statusCode(HttpStatus.OK.value())
                .message("role deleted")
                .build();
    }
}
