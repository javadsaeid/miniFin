package com.miniFin.minFin.role.service;

import com.miniFin.minFin.exceptions.BadRequestException;
import com.miniFin.minFin.exceptions.NotFoundException;
import com.miniFin.minFin.res.Response;
import com.miniFin.minFin.role.entity.Role;
import com.miniFin.minFin.role.repo.RoleRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RoleServiceImplTest {

    @Mock
    private RoleRepo roleRepo;

    @InjectMocks
    private RoleServiceImpl roleService;

    private Role role;
    private Role roleRequest;

    @BeforeEach
    void setUp() {
        role = new Role();
        role.setId(1L);
        role.setName("ADMIN");

        roleRequest = new Role();
        roleRequest.setId(1L);
        roleRequest.setName("ADMIN");
    }

    @Test
    void createRole_success() {
        when(roleRepo.findByName("ADMIN")).thenReturn(Optional.empty());
        when(roleRepo.save(any(Role.class))).thenReturn(role);

        Response<Role> response = roleService.createRole(roleRequest);

        assertEquals(200, response.getStatusCode());
        assertEquals("Role saved", response.getMessage());
        assertNotNull(response.getData());
        assertEquals("ADMIN", response.getData().getName());
        verify(roleRepo).save(roleRequest);
    }

    @Test
    void createRole_duplicateName_throwsBadRequestException() {
        when(roleRepo.findByName("ADMIN")).thenReturn(Optional.of(role));

        BadRequestException exception = assertThrows(BadRequestException.class,
                () -> roleService.createRole(roleRequest));

        assertEquals("role name already exist", exception.getMessage());
        verify(roleRepo, never()).save(any());
    }

    @Test
    void updateRole_success() {
        Role updatedRequest = new Role();
        updatedRequest.setId(1L);
        updatedRequest.setName("SUPER_ADMIN");

        when(roleRepo.findById(1L)).thenReturn(Optional.of(role));
        when(roleRepo.save(any(Role.class))).thenReturn(role);

        Response<Role> response = roleService.updateRole(updatedRequest);

        assertEquals(200, response.getStatusCode());
        assertEquals("Role updated", response.getMessage());
        assertEquals("SUPER_ADMIN", role.getName());
        verify(roleRepo).save(role);
    }

    @Test
    void updateRole_notFound_throwsNotFoundException() {
        Role request = new Role();
        request.setId(99L);
        request.setName("ADMIN");

        when(roleRepo.findById(99L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class,
                () -> roleService.updateRole(request));
    }

    @Test
    void getAllRoles() {
        Role role2 = new Role();
        role2.setId(2L);
        role2.setName("CUSTOMER");

        when(roleRepo.findAll()).thenReturn(List.of(role, role2));

        Response<List<Role>> response = roleService.getAllRoles();

        assertEquals(200, response.getStatusCode());
        assertEquals("all role", response.getMessage());
        assertEquals(2, response.getData().size());
    }

    @Test
    void deleteRole_success() {
        when(roleRepo.existsById(1L)).thenReturn(true);

        Response<?> response = roleService.deleteRole(1L);

        assertEquals(200, response.getStatusCode());
        assertEquals("role deleted", response.getMessage());
        verify(roleRepo).deleteById(1L);
    }

    @Test
    void deleteRole_notFound_throwsNotFoundException() {
        when(roleRepo.existsById(99L)).thenReturn(false);

        assertThrows(NotFoundException.class,
                () -> roleService.deleteRole(99L));
        verify(roleRepo, never()).deleteById(any());
    }
}
