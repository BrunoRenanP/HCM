package brunorenanpichdev.com.hcm.controller;

import brunorenanpichdev.com.hcm.exception.DuplicateCPFException;
import brunorenanpichdev.com.hcm.model.dto.UserDTO;
import brunorenanpichdev.com.hcm.service.AuditLoggerService;
import brunorenanpichdev.com.hcm.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.UUID;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;
    private final AuditLoggerService auditLogger;

    @PostMapping(value = "/register", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> registerUser(@RequestBody UserDTO userDTO) {
        try {
            var createdUser = userService.registerUser(userDTO.toModel());
            auditLogger.logSuccess("POST /user/register", "Registered user with name: " + createdUser.getName(), userDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (DuplicateCPFException e) {
            auditLogger.logError("POST /user/register", e.getMessage(), userDTO);
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Collections.singletonMap("error",
                    "Já existe um usuário com esse CPF cadastrado no sistema, por favor, tente novamente!"));
        } catch (Exception e) {
            log.error("Error registering user", e);
            auditLogger.logError("POST /user/register", e.getMessage(), userDTO);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PatchMapping(value = "/update", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateUser(@RequestBody UserDTO userDTO) {
        try {
            var updatedList = userService.updateUser(userDTO.toModel());
            auditLogger.logSuccess("PATCH /user/update", "Updated user with name: " + userDTO.getName(), userDTO);
            return ResponseEntity.ok(updatedList);
        } catch (DuplicateCPFException e) {
            auditLogger.logError("PATCH /user/update", e.getMessage(), userDTO);
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Collections.singletonMap("error",
                    "Já existe um usuário com esse CPF cadastrado no sistema, por favor, tente novamente!"));
        } catch (Exception e) {
            log.error("Error updating user", e);
            auditLogger.logError("PATCH /user/update", e.getMessage(), userDTO);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable UUID userId) {
        try {
            var updatedList = userService.deleteUser(userId);
            auditLogger.logSuccess("DELETE /user/delete/" + userId, "Deleted user with ID: " + userId, Collections.singletonMap("userId", userId));
            return ResponseEntity.ok(updatedList);
        } catch (Exception e) {
            log.error("Error deleting user", e);
            auditLogger.logError("DELETE /user/delete/" + userId, e.getMessage(), Collections.singletonMap("userId", userId));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping(value = "/all", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> findAllUsers() {
        try {
            var users = userService.getUsers();
            auditLogger.logSuccess("GET /user/all", "Fetched all users", null);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            log.error("Error fetching users", e);
            auditLogger.logError("GET /user/all", e.getMessage(), null);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping(value = {"/get", "/get/{name}"}, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> findUserByName(@PathVariable(value = "name", required = false) String name) {
        try {
            var users = (name == null || name.trim().isEmpty())
                    ? userService.getUsers()
                    : userService.getUsersByName(name);

            auditLogger.logSuccess("GET /user/get/" + (name != null ? name : ""), "Fetched users by name", Collections.singletonMap("name", name));
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            log.error("Error fetching users by name", e);
            auditLogger.logError("GET /user/get/" + (name != null ? name : ""), e.getMessage(), Collections.singletonMap("name", name));
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}