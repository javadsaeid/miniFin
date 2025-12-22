package com.miniFin.minFin.role.service;

import com.miniFin.minFin.res.Response;
import com.miniFin.minFin.role.entity.Role;

import java.util.List;

public interface RoleService {
    Response<Role> createRole(Role role);
    Response<Role> updateRole(Role role);
    Response<List<Role>> getAllRoles();
    Response<?> deleteRole(Long roleId);
}
