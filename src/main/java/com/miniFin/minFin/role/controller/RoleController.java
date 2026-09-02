package com.miniFin.minFin.role.controller;

import com.miniFin.minFin.res.Response;
import com.miniFin.minFin.role.entity.Role;
import com.miniFin.minFin.role.service.RoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/roles")
@PreAuthorize("hasAnyAuthority('ADMIN')")
@Tag(name = "Roles", description = "Role management endpoints (Admin only)")
public class RoleController {

    private final RoleService roleService;

    @PostMapping
    @Operation(summary = "Create a role", description = "Creates a new role. Requires ADMIN authority.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Role created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid role data"),
        @ApiResponse(responseCode = "403", description = "Access denied, ADMIN authority required")
    })
    public ResponseEntity<Response<Role>> createRole(@RequestBody Role roleRequest) {
        return ResponseEntity.ok(roleService.createRole(roleRequest));
    }

    @PutMapping
    @Operation(summary = "Update a role", description = "Updates an existing role. Requires ADMIN authority.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Role updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid role data"),
        @ApiResponse(responseCode = "403", description = "Access denied, ADMIN authority required"),
        @ApiResponse(responseCode = "404", description = "Role not found")
    })
    public ResponseEntity<Response<Role>> updateRole(@RequestBody Role roleRequest) {
        return ResponseEntity.ok(roleService.updateRole(roleRequest));
    }

    @GetMapping
    @Operation(summary = "Get all roles", description = "Returns a list of all roles. Requires ADMIN authority.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "List of roles returned successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied, ADMIN authority required")
    })
    public ResponseEntity<Response<List<Role>>> getAllRoles() {
        return ResponseEntity.ok(roleService.getAllRoles());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a role", description = "Deletes a role by its ID. Requires ADMIN authority.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Role deleted successfully"),
        @ApiResponse(responseCode = "403", description = "Access denied, ADMIN authority required"),
        @ApiResponse(responseCode = "404", description = "Role not found")
    })
    public ResponseEntity<Response<?>> deleteRole(
            @Parameter(description = "The role ID to delete") @PathVariable Long id) {
        roleService.deleteRole(id);
        return ResponseEntity.ok().build();
    }


}
