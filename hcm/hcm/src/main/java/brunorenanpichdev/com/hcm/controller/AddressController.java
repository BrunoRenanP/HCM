package brunorenanpichdev.com.hcm.controller;

import brunorenanpichdev.com.hcm.model.dto.AddressDTO;
import brunorenanpichdev.com.hcm.service.AddressService;
import brunorenanpichdev.com.hcm.service.AuditLoggerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/address")
public class AddressController {

    private final AddressService addressService;
    private final AuditLoggerService auditLogger;

    @PostMapping(value = "/register", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> registerAddress(@RequestBody AddressDTO addressDTO) {
        try {
            addressService.registerAddress(addressDTO.toModel());
            auditLogger.logSuccess("POST /address/register", "Created address", addressDTO);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (Exception e) {
            auditLogger.logError("POST /address/register", e.getMessage(), addressDTO);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping(value = "/delete")
    public ResponseEntity<Void> deleteAddress(@RequestBody UUID addressId) {
        try {
            addressService.deleteAddress(addressId);
            auditLogger.logSuccess("DELETE /address/delete", "Deleted address with ID: " + addressId, addressId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            auditLogger.logError("DELETE /address/delete", e.getMessage(), addressId);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PatchMapping(value = "/update", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> updateAddress(@RequestBody AddressDTO addressDTO) {
        try {
            addressService.updateAddress(addressDTO.toModel());
            auditLogger.logSuccess("PATCH /address/update", "Updated address with ID: " + addressDTO.getId(), addressDTO);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            auditLogger.logError("PATCH /address/update", e.getMessage(), addressDTO);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
