package brunorenanpichdev.com.hcm.service;

import brunorenanpichdev.com.hcm.model.dto.AuditLogDTO;
import brunorenanpichdev.com.hcm.util.JsonHelper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditLoggerService {

    private final AuditService auditService;
    private final JsonHelper jsonHelper;

    public void logSuccess(String action, String message, Object payload) {
        createAndSendLog(action, message, payload);
    }

    public void log(String action, String message) {
        createAndSendLog(action, message, null);
    }

    public void logError(String action, String errorMessage, Object payload) {
        createAndSendLog(action, "ERROR: " + errorMessage, payload);
    }

    private void createAndSendLog(String action, String details, Object payload) {
        String requestParams = "{}";
        if (payload != null) {
            try {
                requestParams = jsonHelper.convertToJson(payload);
            } catch (Exception e) {
                log.warn("Failed to serialize payload for audit log: {}", e.getMessage());
                requestParams = "{\"error\": \"Failed to serialize payload\"}";
            }
        }

        AuditLogDTO logDTO = AuditLogDTO.builder()
                .action(action)
                .details(details)
                .timestamp(LocalDateTime.now())
                .requestParams(requestParams)
                .build();

        auditService.logAction(logDTO);
    }
}
